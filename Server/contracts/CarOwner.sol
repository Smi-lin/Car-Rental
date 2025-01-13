// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarOwner {
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

    CarOwnerProfile[] public carOwnerprof;

    struct VehicleListing {
        uint256 vehicleId;
        string imageHash;
        string make;
        string model;
        string rentalTerms;
        uint256 pricePerHour;
        uint256 securityDeposit;
    }
    struct RentalRecord {
        uint256 vehicleId;
        string[] vehicleData;
        address rentee;
        uint256 startTime;
        uint256 endTime;
        uint256 earnedAmount;
        bool isActive;
        bool isPaid;
        uint256 rating;
        string review;
    }
    struct OwnerHistory {
        VehicleListing[] vehicleListings;
        RentalRecord[] activeRentals;
        RentalRecord[] carOwnerPastRentals;
        uint256 totalListings;
        uint256 totalRentals;
        uint256[] activeVehicleIds;
    }

    // struct VehicleDetails {
    //     uint256 id;
    //     string[] vehicleData;
    //     uint256 pricePerHour;
    //     address vehicleOwner;
    //     address currentRenter;
    //     address[] renters;
    //     bool isAvailable;
    //     uint256 securityDeposit;
    //     uint256 ratings;
    //     address[] ratingsByRenters;
    //     string[] reviews;
    // }

    mapping(address => OwnerHistory) public ownerHistories;
    mapping(address => CarOwnerProfile) public carOwnerProfiles;

    modifier validAddress() {
        require(msg.sender != address(0), "Zero Address not allowed");
        _;
    }
    event CarOwnerRegistered(
        address indexed ownerAddress,
        string name,
        uint256 registrationTime
    );

    event carOwnerProfileUpdated(string name, string profileImageHash);

    modifier notRegisteredAsCarOwner() {
        require(
            !carOwnerProfiles[msg.sender].isRegistered,
            "Already registered as a car owner"
        );
        _;
    }
    modifier onlyRegisteredAsCarOwner() {
        require(
            carOwnerProfiles[msg.sender].isRegistered,
            "Not registered as a car owner"
        );
        _;
    }

    function registerAsCarOwner(
        string memory _name,
        string memory _profileImageHash
    ) external notRegisteredAsCarOwner {
        require(msg.sender != address(0), "Address zero not allowed");
        require(bytes(_name).length > 0, "Name cannot be empty");

        CarOwnerProfile memory newProfile = CarOwnerProfile({
            name: _name,
            profileImageHash: _profileImageHash,
            carOwnerAddress: msg.sender,
            isRegistered: true,
            registrationTimestamp: block.timestamp,
            totalVehicles: 0,
            activeRentals: 0,
            totalEarnings: 0
        });

        carOwnerProfiles[msg.sender] = newProfile;
        carOwnerprof.push(newProfile); // Add to the array

        emit CarOwnerRegistered(msg.sender, _name, block.timestamp);
    }

    function addVehicleListing(
        address owner,
        uint256 vehicleId,
        string memory imageHash,
        string memory make,
        string memory model,
        string memory rentalTerms,
        uint256 pricePerHour,
        uint256 securityDeposit
    ) external {
        ownerHistories[owner].vehicleListings.push(
            VehicleListing(
                vehicleId,
                imageHash,
                make,
                model,
                rentalTerms,
                pricePerHour,
                securityDeposit
            )
        );
        ownerHistories[owner].totalListings++;
    }

    function incrementTotalListings(address owner) external {
        ownerHistories[owner].totalListings++;
    }

    function getCarOwnerProfile(
        address _ownerAddress
    ) external view returns (CarOwnerProfile memory) {
        require(
            carOwnerProfiles[_ownerAddress].isRegistered,
            "Car owner not registered"
        );
        return carOwnerProfiles[_ownerAddress];
    }

    function updateCarOwnerProfile(
        string memory _name,
        string memory _profileImageHash
    ) external onlyRegisteredAsCarOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        CarOwnerProfile storage carownerProfile = carOwnerProfiles[msg.sender];
        carownerProfile.name = _name;
        carownerProfile.profileImageHash = _profileImageHash;

        emit carOwnerProfileUpdated(_name, _profileImageHash);
    }

    function addActiveRental(
        address owner,
        uint256 vehicleId,
        string[] memory vehicleData,
        address rentee,
        uint256 startTime,
        uint256 endTime,
        uint256 earnedAmount
    ) external {
        OwnerHistory storage history = ownerHistories[owner];

        history.activeRentals.push(
            RentalRecord({
                vehicleId: vehicleId,
                vehicleData: vehicleData,
                rentee: rentee,
                startTime: startTime,
                endTime: endTime,
                earnedAmount: earnedAmount,
                isActive: true,
                isPaid: false,
                rating: 0,
                review: ""
            })
        );
        history.totalRentals++;

        carOwnerProfiles[owner].activeRentals++;
    }

    function incrementTotalVehicles(address owner) external {
        carOwnerProfiles[owner].totalVehicles++;
    }

    function incrementActiveRentals(address owner) external {
        carOwnerProfiles[owner].activeRentals++;
    }

    function addEarnings(address owner, uint256 amount) external {
        carOwnerProfiles[owner].totalEarnings += amount;
    }

    function getVehicleListings(
        address _ownerAddress
    ) external view returns (VehicleListing[] memory) {
        return ownerHistories[_ownerAddress].vehicleListings;
    }

    function getActiveRentals(
        address _ownerAddress
    ) external view returns (RentalRecord[] memory) {
        return ownerHistories[_ownerAddress].activeRentals;
    }

    function getCarOwnerPastRentals(
        address _ownerAddress
    ) external view returns (RentalRecord[] memory) {
        return ownerHistories[_ownerAddress].carOwnerPastRentals;
    }

    function getTotalListings(
        address _ownerAddress
    ) external view returns (uint256) {
        return ownerHistories[_ownerAddress].totalListings;
    }

    function getTotalRentals(
        address _ownerAddress
    ) external view returns (uint256) {
        return ownerHistories[_ownerAddress].totalRentals;
    }

    function decrementActiveRentals(address owner) external {
        carOwnerProfiles[owner].activeRentals--;
    }

    function addCompletedRental(
        address owner,
        uint256 vehicleId,
        string[] memory vehicleData,
        address rentee,
        uint256 startTime,
        uint256 endTime,
        uint256 totalCost
    ) external {
        OwnerHistory storage history = ownerHistories[owner];

        // Remove from active rentals
        for (uint256 i = 0; i < history.activeRentals.length; i++) {
            if (history.activeRentals[i].vehicleId == vehicleId) {
                history.activeRentals[i] = history.activeRentals[
                    history.activeRentals.length - 1
                ];

                history.activeRentals.pop();
                break;
            }
        }

        history.carOwnerPastRentals.push(
            RentalRecord({
                vehicleId: vehicleId,
                vehicleData: vehicleData,
                rentee: rentee,
                startTime: startTime,
                endTime: endTime,
                earnedAmount: totalCost,
                isActive: false,
                isPaid: true,
                rating: 0,
                review: ""
            })
        );
    }

    function getAllCarOwner()
        external
        view
        validAddress
        returns (CarOwnerProfile[] memory)
    {
        return carOwnerprof;
    }
}
