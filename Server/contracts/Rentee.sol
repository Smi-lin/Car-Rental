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

     struct VehicleDetails {
    uint256 id;
    string[] vehicleData;
    uint256 pricePerHour;
    address vehicleOwner;
    address currentRenter;
    address[] renters;
    bool isAvailable;
    uint256 securityDeposit;
    uint256 ratings;
    address[] ratingsByRenters;
    string[] reviews;
}

   struct CurrentRental {
        uint256 vehicleId;
        uint256 start;
        uint256 end;
        string[] vehicleData;
        uint256 pricePerHour;
        uint256 securityDeposit;
        address vehicleOwner;
        address currentRenter;
        bool isAvailable;
        uint256 ratings;
    }

    struct PastRental {
        uint256 vehicleId;
        uint256 start;
        uint256 end;
        uint256 totalCost;
        uint256 lateFee;
        uint256 refundAmount;
        string[] vehicleData;
        uint256 pricePerHour;
        uint256 securityDeposit;
        address vehicleOwner;
        address currentRenter;
        uint256 ratings;
    }

    

    mapping(address => RenteeProfile) public renteeProfiles;
    mapping(address => CurrentRental[]) public currentRentals;
    mapping(address => PastRental[]) public pastRentals;


    event RenteeRegistered(
        address indexed renteeAddress,
        string name,
        uint256 registrationTime
    );

    event renteeProfileUpdated(
        
        string name,
        string profileImageHash
       
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

    
function updateRenteeProfile(
    string memory _name,
    string memory _profileImageHash
) external onlyRegisteredAsRentee {
    require(bytes(_name).length > 0, "Name cannot be empty");

    RenteeProfile storage renteeProfile =  renteeProfiles[msg.sender];
     renteeProfile.name = _name;
    renteeProfile.profileImageHash =_profileImageHash ;

      emit renteeProfileUpdated( _name, _profileImageHash);

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

function getCurrentRentals(address renterAddress) external view returns (CurrentRental[] memory) {
    return currentRentals[renterAddress];
}

function getPastRentals(address renterAddress) external view returns (PastRental[] memory) {
    return pastRentals[renterAddress];
}

    




}
