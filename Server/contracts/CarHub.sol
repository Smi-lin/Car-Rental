// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface USDC {
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract CarHub {
    USDC public USDc;

    struct CarOwnerProfile {
        string name;
        string profileImageHash;
        address carOwnerAddress;
        bool isRegistered;
        uint256 registrationTimestamp;
        uint256 totalVehicles;
        uint256 activeRentals;
        uint256 totalEarnings;
    }

    struct RenteeProfile {
        string name;
        string profileImageHash;
        address renteeAddress;
        bool isRegistered;
        uint256 registrationTimestamp;
        uint256 totalRentals;
        uint256 activeRentals;
        uint256 totalSpending;
    }

    struct Vehicle {
        uint256 id;
        string[] vehicleData;
        uint256 year;
        uint256 pricePerHour;
          address vehicleOwner;
        address currentRenter;
       
        address[] renters;
        bool isAvailable;
        uint256 securityDeposit;
        uint256 temp_bal;
        uint256 start;
        uint256 end;
        uint256 ratings;
        address[] ratingsByRenters;
        string[] reviews;
    }

    mapping(address => CarOwnerProfile) public carOwnerProfiles;
    mapping(address => RenteeProfile) public renteeProfiles;
    mapping(uint256 => Vehicle) public vehicles;
    uint256 public vehicleCounter;

    event CarOwnerRegistered(address indexed ownerAddress, string name, uint256 registrationTime);
    event RenteeRegistered(address indexed renteeAddress, string name, uint256 registrationTime);
    event VehicleListed(uint256 vehicleId, address indexed owner, string make, string model, string imageHash, uint256 year, uint256 pricePerHour, uint256 securityDeposit);
    event VehicleRented(uint256 indexed vehicleId, address indexed renter, uint256 rentalStartTime, uint256 rentalEndTime, uint256 totalCost, uint256 securityDeposit);
    event VehicleReturned(uint256 indexed vehicleId, address indexed renter, uint256 rentalCost, uint256 penalty, uint256 refundAmount, uint256 securityDeposit);
    event Payment(uint256 payment);

    constructor(address usdcContractAddress) {
        USDc = USDC(usdcContractAddress);
    }

    modifier notRegisteredAsCarOwner() {
        require(!carOwnerProfiles[msg.sender].isRegistered, "Already registered as a car owner");
        _;
    }

    modifier onlyRegisteredAsCarOwner() {
        require(carOwnerProfiles[msg.sender].isRegistered, "Not registered as a car owner");
        _;
    }

    modifier notRegisteredAsRentee() {
        require(!renteeProfiles[msg.sender].isRegistered, "Already registered as a rentee");
        _;
    }

    modifier onlyRegisteredAsRentee() {
        require(renteeProfiles[msg.sender].isRegistered, "Not registered as a rentee");
        _;
    }

    function registerAsCarOwner(string memory _name, string memory _profileImageHash) external notRegisteredAsCarOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");

        carOwnerProfiles[msg.sender] = CarOwnerProfile({
            name: _name,
            profileImageHash: _profileImageHash,
            carOwnerAddress: msg.sender,
            isRegistered: true,
            registrationTimestamp: block.timestamp,
            totalVehicles: 0,
            activeRentals: 0,
            totalEarnings: 0
        });

        emit CarOwnerRegistered(msg.sender, _name, block.timestamp);
    }

    function registerAsRentee(string memory _name, string memory _profileImageHash) external notRegisteredAsRentee {
        require(bytes(_name).length > 0, "Name cannot be empty");

        renteeProfiles[msg.sender] = RenteeProfile({
            name: _name,
            profileImageHash: _profileImageHash,
            renteeAddress: msg.sender,
            isRegistered: true,
            registrationTimestamp: block.timestamp,
            totalRentals: 0,
            activeRentals: 0,
            totalSpending: 0
        });

        emit RenteeRegistered(msg.sender, _name, block.timestamp);
    }

    function getCarOwnerProfile(address _ownerAddress) external view returns (CarOwnerProfile memory) {
        require(carOwnerProfiles[_ownerAddress].isRegistered, "Car owner not registered");
        return carOwnerProfiles[_ownerAddress];
    }

    function getRenteeProfile(address _renteeAddress) external view returns (RenteeProfile memory) {
        require(renteeProfiles[_renteeAddress].isRegistered, "Rentee not registered");
        return renteeProfiles[_renteeAddress];
    }

    function listVehicle(
        string memory make,
        string memory model,
        string memory imageHash,
        uint256 year,
        uint256 pricePerHour,
        uint256 securityDeposit
    ) external onlyRegisteredAsCarOwner {
        vehicleCounter++;

        Vehicle storage newVehicle = vehicles[vehicleCounter];
        newVehicle.id = vehicleCounter;
        newVehicle.vehicleData.push(make);
        newVehicle.vehicleData.push(model);
        newVehicle.vehicleData.push(imageHash);
        newVehicle.year = year;
        newVehicle.pricePerHour = pricePerHour * 1e6;
        newVehicle.securityDeposit = securityDeposit * 1e6;
        newVehicle.vehicleOwner = msg.sender;
        newVehicle.currentRenter = address(0);
        newVehicle.isAvailable = true;
        newVehicle.ratings = 0;

        emit VehicleListed(
            vehicleCounter,
            msg.sender,
            make,
            model,
            imageHash,
            year,
            pricePerHour * 1e6,
            securityDeposit * 1e6
        );

        carOwnerProfiles[msg.sender].totalVehicles++;
    }

    function calculateRentCost(uint256 vehicleId, uint256 start, uint256 end) external view returns (uint256, uint256, address) {
        require(start < end, "Invalid rental period");

        Vehicle storage vehicle = vehicles[vehicleId];

        uint256 durationInSeconds = end - start;
        uint256 durationInHours = durationInSeconds / 3600;
        uint256 rent_cost = vehicle.securityDeposit + ((vehicle.pricePerHour * durationInHours));

        return (rent_cost, durationInHours, address(this));
    }

    function rentVehicle(uint256 vehicleId, uint256 start, uint256 end) external onlyRegisteredAsRentee {
        require(start < end, "Invalid rental period");

        Vehicle storage vehicle = vehicles[vehicleId];
        require(vehicle.currentRenter == address(0), "Vehicle is already rented");
        require(vehicle.isAvailable, "Vehicle is not available");

        RenteeProfile storage user = renteeProfiles[msg.sender];
        uint256 rentCost = vehicle.securityDeposit + ((vehicle.pricePerHour * (end - start)) / 3600000);
        require(rentCost > 0, "Invalid rental cost");

        require(USDc.balanceOf(msg.sender) >= rentCost, "Insufficient USDC balance");
        require(USDc.allowance(msg.sender, address(this)) >= rentCost, "Insufficient USDC allowance");

        require(USDc.transferFrom(msg.sender, vehicle.vehicleOwner, rentCost), "USDC transfer failed");

        vehicle.temp_bal = rentCost;
        vehicle.currentRenter = msg.sender;
        vehicle.renters.push(msg.sender);
        vehicle.isAvailable = false;
        vehicle.start = start;
        vehicle.end = end;

        emit VehicleRented(vehicleId, msg.sender, start, end, rentCost, vehicle.securityDeposit);

        user.totalRentals++;
        user.activeRentals++;
        user.totalSpending += rentCost;

        CarOwnerProfile storage owner = carOwnerProfiles[vehicle.vehicleOwner];
        owner.activeRentals++;
        owner.totalEarnings += rentCost;
    }

    // function completeRental(uint256 vehicleId) external {
    //     Vehicle storage vehicle = vehicles[vehicleId];
    //     require(vehicle.currentRenter == msg.sender, "You are not the renter of this vehicle");

    //     uint256 rentalDuration = (block.timestamp * 1000) - vehicle.start;
    //     uint256 rentalCost = (vehicle.pricePerHour * rentalDuration) / 3600000;

    //     uint256 penalty = 0;
    //     if (block.timestamp > vehicle.end / 1000) {
    //         uint256 lateDuration = block.timestamp - (vehicle.end / 1000);
    //         penalty = (vehicle.pricePerHour * lateDuration) / 3600;
    //     }

    //     uint256 totalCost = rentalCost + penalty;

    //     emit Payment(totalCost);

    //     require(vehicle.temp_bal >= totalCost, "Deposit insufficient to cover rental cost and penalties");

    //     uint256 refundAmount = vehicle.temp_bal - totalCost;

    //     require(USDc.transfer(vehicle.vehicleOwner, totalCost), "USDC payment to owner failed");

    //     if (refundAmount > 0) {
    //         require(USDc.transfer(msg.sender, refundAmount), "Refund to renter failed");
    //     }

    //     vehicle.currentRenter = address(0);
    //     vehicle.isAvailable = true;

    //     emit VehicleReturned(
    //         vehicleId,
    //         msg.sender,
    //         rentalCost,
    //         penalty,
    //         refundAmount,
    //         vehicle.securityDeposit
    //     );

    //     RenteeProfile storage renter = renteeProfiles[msg.sender];
    //     renter.activeRentals--;

    //     CarOwnerProfile storage owner = carOwnerProfiles[vehicle.vehicleOwner];
    //     owner.activeRentals--;
    // }

function completeRental(uint256 vehicleId) external onlyRegisteredAsRentee {
    Vehicle storage vehicle = vehicles[vehicleId];
    require(vehicle.currentRenter == msg.sender, "You are not the renter of this vehicle");

    
    require(block.timestamp >= vehicle.end / 1000, "Cannot complete rental before end time");

    uint256 rentalDuration = (block.timestamp * 1000) - vehicle.start;
    uint256 rentalCost = (vehicle.pricePerHour * rentalDuration) / 3600000;

    uint256 penalty = 0;

    if (block.timestamp > vehicle.end / 1000) {
        uint256 lateDuration = block.timestamp - (vehicle.end / 1000);
        penalty = (vehicle.pricePerHour * lateDuration) / 3600; 
    }

 
    if (penalty > vehicle.securityDeposit) {
        penalty = vehicle.securityDeposit;
    }

    uint256 totalCost = rentalCost + penalty;

   
    if (totalCost > vehicle.temp_bal) {
        
        uint256 outstanding = totalCost - vehicle.temp_bal;
        require(USDc.allowance(msg.sender, address(this)) >= outstanding, "Insufficient USDC allowance for outstanding balance");
        require(USDc.transferFrom(msg.sender, address(this), outstanding), "Insufficient funds to cover outstanding balance");

        vehicle.temp_bal = 0;
    } else {
       
        vehicle.temp_bal -= totalCost;
    }

    uint256 refundAmount = vehicle.temp_bal;

    
    require(USDc.transfer(vehicle.vehicleOwner, totalCost), "USDC transfer to owner failed");

   
    if (refundAmount > 0) {
        require(USDc.transfer(msg.sender, refundAmount), "Refund to renter failed");
    }

    vehicle.currentRenter = address(0);
    vehicle.isAvailable = true;

    emit VehicleReturned(
        vehicleId,
        msg.sender,
        rentalCost,
        penalty,
        refundAmount,
        vehicle.securityDeposit
    );

    
    RenteeProfile storage renter = renteeProfiles[msg.sender];
    renter.activeRentals--;

  
    CarOwnerProfile storage owner = carOwnerProfiles[vehicle.vehicleOwner];
    owner.activeRentals--;
}




    function getVehicleDetails(uint256 vehicleId) external view returns (
        uint256,
        string memory,
        string memory,
        string memory,
        uint256,
        uint256,
        address,
        address,
        address[] memory,
        bool,
        uint256,
        string[] memory
    ) {
        Vehicle storage vehicle = vehicles[vehicleId];
        return (
            vehicle.id,
            vehicle.vehicleData[0],
            vehicle.vehicleData[1],
            vehicle.vehicleData[2],
            vehicle.pricePerHour,
            vehicle.securityDeposit,
            vehicle.vehicleOwner,
            vehicle.currentRenter,
            vehicle.renters,
            vehicle.isAvailable,
            vehicle.ratings,
            vehicle.reviews
        );
    }
}

