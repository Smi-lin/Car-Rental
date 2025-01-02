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
    struct VehicleListing {
        uint256 vehicleId;
        string imageHash;
        string make;
        string model;
        string location;
        string rentalTerms;
        uint256 pricePerHour;
        uint256 securityDeposit;
    }

    struct RentalRecord {
        uint256 vehicleId;
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

    mapping(address => OwnerHistory) public ownerHistories;

    mapping(address => CarOwnerProfile) public carOwnerProfiles;

    event CarOwnerRegistered(
        address indexed ownerAddress,
        string name,
        uint256 registrationTime
    );

    event carOwnerProfileUpdated(
        
        string name,
        string profileImageHash
       
    );


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

    function getCarOwnerProfile(address _ownerAddress)
        external
        view
        returns (CarOwnerProfile memory)
    {
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

   CarOwnerProfile storage carownerProfile =  carOwnerProfiles[msg.sender];
    carownerProfile.name = _name;
    carownerProfile.profileImageHash =_profileImageHash ;

      emit carOwnerProfileUpdated( _name, _profileImageHash);

}

    function getVehicleListings(address _ownerAddress)
        external
        view
        returns (VehicleListing[] memory)
    {
        return ownerHistories[_ownerAddress].vehicleListings;
    }

    function getActiveRentals(address _ownerAddress)
        external
        view
        returns (RentalRecord[] memory)
    {
        return ownerHistories[_ownerAddress].activeRentals;
    }

    function getCarOwnerPastRentals(address _ownerAddress)
        external
        view
        returns (RentalRecord[] memory)
    {
        return ownerHistories[_ownerAddress].carOwnerPastRentals;
    }

    function getTotalListings(address _ownerAddress)
        external
        view
        returns (uint256)
    {
        return ownerHistories[_ownerAddress].totalListings;
    }

    function getTotalRentals(address _ownerAddress)
        external
        view
        returns (uint256)
    {
        return ownerHistories[_ownerAddress].totalRentals;
    }
}
