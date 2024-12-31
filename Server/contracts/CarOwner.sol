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

    mapping(address => CarOwnerProfile) public carOwnerProfiles;

    event CarOwnerRegistered(
        address indexed ownerAddress,
        string name,
        uint256 registrationTime
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

    function getCarOwnerProfile(
        address _ownerAddress
    ) external view returns (CarOwnerProfile memory) {
        require(
            carOwnerProfiles[_ownerAddress].isRegistered,
            "Car owner not registered"
        );
        return carOwnerProfiles[_ownerAddress];
    }
}
