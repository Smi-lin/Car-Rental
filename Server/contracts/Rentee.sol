// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Rentee {
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

    mapping(address => RenteeProfile) public renteeProfiles;

    event RenteeRegistered(
        address indexed renteeAddress,
        string name,
        uint256 registrationTime
    );

    modifier notRegisteredAsRentee() {
        require(
            !renteeProfiles[msg.sender].isRegistered,
            "Already registered as a rentee"
        );
        _;
    }

    modifier onlyRegisteredAsRentee() {
        require(
            renteeProfiles[msg.sender].isRegistered,
            "Not registered as a rentee"
        );
        _;
    }

    function registerAsRentee(
        string memory _name, 
        string memory _profileImageHash
    ) external notRegisteredAsRentee {
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

    function getRenteeProfile(
        address _renteeAddress
    ) external view returns (RenteeProfile memory) {
        require(
            renteeProfiles[_renteeAddress].isRegistered,
            "Rentee not registered"
        );
        return renteeProfiles[_renteeAddress];
    }
}
