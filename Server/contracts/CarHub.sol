// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Rentee.sol";
import "./CarOwner.sol";

interface USDC {
    function balanceOf(address account) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract CarHub is Rentee, CarOwner {
    USDC public USDc;
    struct Vehicle {
        uint256 id;
        string[] vehicleData;
        uint256 pricePerHour;
        address vehicleOwner;
        address currentRenter;
        address[] renters;
        bool isAvailable;
        uint256 securityDeposit;
        uint256 start;
        uint256 end;
        uint256 agreedDurationInHours;
        uint256 ratings;
        address[] ratingsByRenters;
        string[] reviews;
        Dispute currentDispute;
    }

    enum DisputeStatus {
        None,
        Raised,
        Resolved
    }

    struct Dispute {
        uint256 vehicleId;
        address renter;
        string description;
        uint256 requestedRefund;
        DisputeStatus status;
        string resolution;
        uint256 refundAmount;
        uint256 timestamp;
    }

    mapping(uint256 => Vehicle) public vehicles;
    mapping(uint256 => Dispute[]) public vehicleDisputes;
    mapping(address => uint256[]) private ownerDisputeVehicles; 
    mapping(address => Dispute[]) private renterDisputes; 

    uint256 public vehicleCounter;

    event VehicleListed(
        uint256 vehicleId,
        address owner,
        string imageHash,
        string make,
        string model,
        string location,
        string rentalTerms,
        uint256 pricePerHour,
        uint256 securityDeposit
    );

    event PriceUpdated(
        uint256 vehicleId,
        uint256 pricePerHour,
        uint256 securityDeposit
    );
    event VehicleRented(
        uint256  vehicleId,
        address  renter,
        uint256 rentalStartTime,
        uint256 rentalEndTime,
        uint256 totalCost,
        uint256 securityDeposit
    );
    event VehicleReturned(
        uint256  vehicleId,
        address  renter,
        uint256 rentalCost,
        uint256 penalty,
        uint256 refundAmount,
        uint256 securityDeposit
    );
    event VehicleRated(
        uint256  vehicleId,
        address  renter,
        uint256 rating,
        string review
    );

    event Payment(uint256 payment);

    event DisputeRaised(
        uint256  vehicleId,
        address  renter,
        string description,
        uint256 requestedRefund,
        uint256 timestamp
    );

    event DisputeResolved(
        uint256  vehicleId,
        address renter,
        string resolution,
        uint256 refundAmount,
        uint256 timestamp
    );

    constructor(address usdcContractAddress) {
        USDc = USDC(usdcContractAddress);
    }

    function listVehicle(
        string memory imageHash,
        string memory make,
        string memory model,
        string memory location,
        string memory rentalTerms,
        uint256 pricePerHour,
        uint256 securityDeposit
    ) external onlyRegisteredAsCarOwner {
        vehicleCounter++;

        Vehicle storage newVehicle = vehicles[vehicleCounter];
        newVehicle.id = vehicleCounter;
        newVehicle.vehicleData.push(imageHash);
        newVehicle.vehicleData.push(make);
        newVehicle.vehicleData.push(model);
        newVehicle.vehicleData.push(location);
        newVehicle.vehicleData.push(rentalTerms);
        newVehicle.pricePerHour = pricePerHour;
        newVehicle.securityDeposit = securityDeposit;
        newVehicle.vehicleOwner = msg.sender;
        newVehicle.currentRenter = address(0);
        newVehicle.isAvailable = true;
        newVehicle.ratings = 0;

        emit VehicleListed(
            vehicleCounter,
            msg.sender,
            imageHash,
            make,
            model,
            location,
            rentalTerms,
            pricePerHour,
            securityDeposit
        );

        carOwnerProfiles[msg.sender].totalVehicles++;

        OwnerHistory storage ownerHistory = ownerHistories[msg.sender];
        ownerHistory.vehicleListings.push(
            VehicleListing(
                vehicleCounter,
                imageHash,
                make,
                model,
                location,
                rentalTerms,
                pricePerHour,
                securityDeposit
            )
        );
        ownerHistory.totalListings++;
    }

    function updateRentalPrice(
        uint256 vehicleId,
        uint256 _pricePerHour,
        uint256 _securityDeposit
    ) external onlyRegisteredAsCarOwner {
        Vehicle storage priceUpdate = vehicles[vehicleId];
        priceUpdate.pricePerHour = _pricePerHour;
        priceUpdate.securityDeposit = _securityDeposit;

        emit PriceUpdated(vehicleId, _pricePerHour, _securityDeposit);
    }

    function calculateRentCost(
        uint256 vehicleId,
        uint256 start,
        uint256 end
    )
        external
        view
        returns (
            uint256,
            uint256,
            address
        )
    {
        require(start < end, "Invalid rental period");

        Vehicle storage vehicle = vehicles[vehicleId];

        uint256 durationInSeconds = end - start;
        uint256 durationInHours = durationInSeconds / 3600;
        uint256 rent_cost = vehicle.securityDeposit +
            ((vehicle.pricePerHour * durationInHours));

        return (rent_cost, durationInHours, address(this));
    }

    function rentVehicle(uint256 vehicleId, uint256 rentalDuration) external {
        require(rentalDuration > 0, "Invalid rental duration");

        Vehicle storage vehicle = vehicles[vehicleId];
        require(
            vehicle.currentRenter == address(0),
            "Vehicle is already rented"
        );
        require(vehicle.isAvailable, "Vehicle is not available");

        RenteeProfile storage user = renteeProfiles[msg.sender];
        CurrentRental memory newRental = CurrentRental(
            vehicleId,
            block.timestamp,
            block.timestamp + rentalDuration,
            vehicle.vehicleData,
            vehicle.pricePerHour,
            vehicle.securityDeposit,
            vehicle.vehicleOwner,
            msg.sender,
            false,
            vehicle.ratings
        );
        currentRentals[msg.sender].push(newRental);

        uint256 start = block.timestamp;
        uint256 end = start + rentalDuration;

        uint256 rentalDurationInHours = (rentalDuration + 3599) / 3600;
        uint256 rentalCost = vehicle.securityDeposit +
            (vehicle.pricePerHour * rentalDurationInHours);

        require(rentalCost > 0, "Invalid rental cost");
        require(
            USDc.balanceOf(msg.sender) >= rentalCost,
            "Insufficient USDC balance"
        );
        require(
            USDc.allowance(msg.sender, address(this)) >= rentalCost,
            "Insufficient USDC allowance"
        );
        require(
            USDc.transferFrom(msg.sender, vehicle.vehicleOwner, rentalCost),
            "USDC transfer failed"
        );

        vehicle.currentRenter = msg.sender;
        vehicle.renters.push(msg.sender);
        vehicle.isAvailable = false;
        vehicle.start = start;
        vehicle.end = end;
        vehicle.agreedDurationInHours = rentalDurationInHours;

        emit VehicleRented(
            vehicleId,
            msg.sender,
            start,
            end,
            rentalCost,
            vehicle.securityDeposit
        );

        user.totalRentals++;
        user.activeRentals++;
        user.totalSpending += rentalCost;

        CarOwnerProfile storage owner = carOwnerProfiles[vehicle.vehicleOwner];
        owner.activeRentals++;
        owner.totalEarnings += rentalCost;

        OwnerHistory storage ownerHistory = ownerHistories[
            vehicles[vehicleId].vehicleOwner
        ];
        ownerHistory.activeRentals.push(
            RentalRecord(
                vehicleId,
                msg.sender,
                block.timestamp,
                block.timestamp + rentalDuration,
                rentalCost,
                true,
                false,
                0,
                ""
            )
        );
        ownerHistory.totalRentals++;
    }

    function completeRental(uint256 vehicleId) external {
        Vehicle storage vehicle = vehicles[vehicleId];
        OwnerHistory storage ownerHistory = ownerHistories[
            vehicle.vehicleOwner
        ];

        require(
            vehicle.currentRenter == msg.sender,
            "You are not the renter of this vehicle"
        );
        require(
            block.timestamp >= vehicle.end,
            "Rental period has not ended yet"
        );

        

        uint256 actualDurationInHours = (block.timestamp -
            vehicle.start +
            3599) / 3600;

        uint256 rentalCost = vehicle.pricePerHour *
            vehicle.agreedDurationInHours;
        uint256 totalCost = rentalCost;

        uint256 lateFee = 0;

        if (actualDurationInHours > vehicle.agreedDurationInHours) {
            uint256 extraHours = actualDurationInHours -
                vehicle.agreedDurationInHours;
            lateFee = (extraHours * vehicle.pricePerHour * 12) / 10;
            totalCost += lateFee;
        }

        emit Payment(totalCost);

        uint256 refundAmount = 0;
        if (totalCost < vehicle.securityDeposit) {
            refundAmount = vehicle.securityDeposit - totalCost;
        }

        require(
            USDc.transfer(vehicle.vehicleOwner, totalCost),
            "USDC payment to owner failed"
        );

        if (refundAmount > 0) {
            require(
                USDc.transfer(msg.sender, refundAmount),
                "Refund to renter failed"
            );
        }

        vehicle.currentRenter = address(0);
        vehicle.isAvailable = true;

        emit VehicleReturned(
            vehicleId,
            msg.sender,
            rentalCost,
            totalCost > rentalCost ? totalCost - rentalCost : 0,
            refundAmount,
            vehicle.securityDeposit
        );

        RenteeProfile storage renter = renteeProfiles[msg.sender];
        renter.activeRentals--;

        PastRental memory pastRental = PastRental(
            vehicleId,
            vehicle.start,
            block.timestamp,
            totalCost,
            lateFee,
            refundAmount,
            vehicle.vehicleData,
            vehicle.pricePerHour,
            vehicle.securityDeposit,
            vehicle.vehicleOwner,
            msg.sender,
            vehicle.ratings
        );

        pastRentals[msg.sender].push(pastRental);

        CurrentRental[] storage renterCurrentRentals = currentRentals[
            msg.sender
        ];
        for (uint256 i = 0; i < renterCurrentRentals.length; i++) {
            if (renterCurrentRentals[i].vehicleId == vehicleId) {
                renterCurrentRentals[i] = renterCurrentRentals[
                    renterCurrentRentals.length - 1
                ];
                renterCurrentRentals.pop();
                break;
            }
        }

        CarOwnerProfile storage owner = carOwnerProfiles[vehicle.vehicleOwner];
        owner.activeRentals--;

        ownerHistory.carOwnerPastRentals.push(
            RentalRecord(
                vehicleId,
                vehicle.currentRenter,
                vehicle.start,
                block.timestamp,
                totalCost,
                false,
                true,
                0,
                ""
            )
        );
        ownerHistory.activeRentals.pop();
    }

    function rateVehicle(
        uint256 vehicleId,
        uint256 rating,
        string memory review
    ) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Vehicle storage vehicle = vehicles[vehicleId];

        bool hasRented = false;
        for (uint256 i = 0; i < vehicle.renters.length; i++) {
            if (vehicle.renters[i] == msg.sender) {
                hasRented = true;
                break;
            }
        }
        require(hasRented, "You have never rented this vehicle");

        bool hasRated = false;
        for (uint256 i = 0; i < vehicle.ratingsByRenters.length; i++) {
            if (vehicle.ratingsByRenters[i] == msg.sender) {
                hasRated = true;
                break;
            }
        }
        require(!hasRated, "You have already rated this vehicle");

        vehicle.ratingsByRenters.push(msg.sender);
        vehicle.reviews.push(review);

        uint256 totalRating = vehicle.ratings + (rating * 10000);
        vehicle.ratings = totalRating / (vehicle.ratingsByRenters.length);

        emit VehicleRated(vehicleId, msg.sender, rating, review);
    }

function raiseDispute(
    uint256 vehicleId,
    string memory description,
    uint256 requestedRefund
) external {
    Vehicle storage vehicle = vehicles[vehicleId];
    require(msg.sender == vehicle.currentRenter, "Only current renter can raise disputes");
    require(vehicle.currentDispute.status == DisputeStatus.None, "Active dispute exists");
    require(requestedRefund <= vehicle.securityDeposit, "Requested refund exceeds security deposit");

    Dispute memory newDispute = Dispute({
        vehicleId: vehicleId,
        renter: msg.sender,
        description: description,
        requestedRefund: requestedRefund,
        status: DisputeStatus.Raised,
        resolution: "",
        refundAmount: 0,
        timestamp: block.timestamp
    });
    vehicle.currentDispute = newDispute;
    vehicleDisputes[vehicleId].push(newDispute);
    
   
    if (vehicleDisputes[vehicleId].length == 1) {
        ownerDisputeVehicles[vehicle.vehicleOwner].push(vehicleId);
    }
    
    
    renterDisputes[msg.sender].push(newDispute);

    emit DisputeRaised(
        vehicleId,
        msg.sender,
        description,
        requestedRefund,
        block.timestamp
    );
}


    function resolveDispute(
        uint256 vehicleId,
        string memory resolution,
        uint256 refundAmount
    ) external {
        Vehicle storage vehicle = vehicles[vehicleId];
        require(
            msg.sender == vehicle.vehicleOwner,
            "Only vehicle owner can resolve disputes"
        );
        require(
            vehicle.currentDispute.status == DisputeStatus.Raised,
            "No active dispute"
        );
        require(
            refundAmount <= vehicle.currentDispute.requestedRefund,
            "Refund exceeds requested amount"
        );

        vehicle.currentDispute.status = DisputeStatus.Resolved;
        vehicle.currentDispute.resolution = resolution;
        vehicle.currentDispute.refundAmount = refundAmount;

        if (refundAmount > 0) {
            require(
                USDc.transfer(vehicle.currentDispute.renter, refundAmount),
                "Refund transfer failed"
            );
        }
        uint256 lastIndex = vehicleDisputes[vehicleId].length - 1;
        vehicleDisputes[vehicleId][lastIndex].status = DisputeStatus.Resolved;
        vehicleDisputes[vehicleId][lastIndex].resolution = resolution;
        vehicleDisputes[vehicleId][lastIndex].refundAmount = refundAmount;

        emit DisputeResolved(
            vehicleId,
            vehicle.currentDispute.renter,
            resolution,
            refundAmount,
            block.timestamp
        );
    }

    function getCarOwnerAllDisputes(address owner) external view returns (Dispute[] memory) {
    uint256[] memory vehicleIds = ownerDisputeVehicles[owner];
    uint256 totalDisputes = 0;
    
  
    for (uint256 i = 0; i < vehicleIds.length; i++) {
        totalDisputes += vehicleDisputes[vehicleIds[i]].length;
    }
    
    Dispute[] memory allDisputes = new Dispute[](totalDisputes);
    uint256 currentIndex = 0;
    
   
    for (uint256 i = 0; i < vehicleIds.length; i++) {
        Dispute[] memory vehicleDispute = vehicleDisputes[vehicleIds[i]];
        for (uint256 j = 0; j < vehicleDispute.length; j++) {
            allDisputes[currentIndex] = vehicleDispute[j];
            currentIndex++;
        }
    }
    
    return allDisputes;
}

function getOwnerActiveDisputes(address owner) external view returns (Dispute[] memory) {
    uint256[] memory vehicleIds = ownerDisputeVehicles[owner];
    uint256 activeDisputes = 0;
    
    
    for (uint256 i = 0; i < vehicleIds.length; i++) {
        Vehicle storage vehicle = vehicles[vehicleIds[i]];
        if (vehicle.currentDispute.status == DisputeStatus.Raised) {
            activeDisputes++;
        }
    }
    
    Dispute[] memory activeDisputeList = new Dispute[](activeDisputes);
    uint256 currentIndex = 0;
    
  
    for (uint256 i = 0; i < vehicleIds.length; i++) {
        Vehicle storage vehicle = vehicles[vehicleIds[i]];
        if (vehicle.currentDispute.status == DisputeStatus.Raised) {
            activeDisputeList[currentIndex] = vehicle.currentDispute;
            currentIndex++;
        }
    }
    return activeDisputeList;
}

function getRenterDisputes(address renter) external view returns (Dispute[] memory) {
    return renterDisputes[renter];
}


    
    function getAllVehicles() external view returns (VehicleDetails[] memory) {
        uint256 totalVehicles = vehicleCounter;
        VehicleDetails[] memory allVehicles = new VehicleDetails[](
            totalVehicles
        );

        for (uint256 i = 1; i <= totalVehicles; i++) {
            allVehicles[i - 1] = VehicleDetails({
                id: vehicles[i].id,
                vehicleData: vehicles[i].vehicleData,
                pricePerHour: vehicles[i].pricePerHour,
                vehicleOwner: vehicles[i].vehicleOwner,
                currentRenter: vehicles[i].currentRenter,
                renters: vehicles[i].renters,
                isAvailable: vehicles[i].isAvailable,
                securityDeposit: vehicles[i].securityDeposit,
                ratings: vehicles[i].ratings,
                ratingsByRenters: vehicles[i].ratingsByRenters,
                reviews: vehicles[i].reviews
            });
        }

        return allVehicles;
    }
}
