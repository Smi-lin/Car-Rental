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

    RenteeProfile[] public renteeProf;

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

    struct CurrentRentalData {
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

    struct RentalData {
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
        address pastRenter;
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
    event renteeProfileUpdated(string name, string profileImageHas);

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

    modifier validAddress() {
        require(msg.sender != address(0), "Zero Address not allowed");
        _;
    }

    function registerAsRentee(
        string memory _name,
        string memory _profileImageHash
    ) external notRegisteredAsRentee {
        require(bytes(_name).length > 0, "Name cannot be empty");

        RenteeProfile memory newProfile = RenteeProfile({
            name: _name,
            profileImageHash: _profileImageHash,
            renteeAddress: msg.sender,
            isRegistered: true,
            registrationTimestamp: block.timestamp,
            totalRentals: 0,
            activeRentals: 0,
            totalSpending: 0
        });

        // Store in mapping
        renteeProfiles[msg.sender] = newProfile;

        // Add to array
        renteeProf.push(newProfile);

        emit RenteeRegistered(msg.sender, _name, block.timestamp);
    }

    function addCurrentRental(
        address currentRenter,
        CurrentRentalData memory rentalData
    ) external {
        require(msg.sender != address(0), "Invalid rentee address");

        currentRentals[currentRenter].push(
            CurrentRental({
                vehicleId: rentalData.vehicleId,
                start: rentalData.start,
                end: rentalData.end,
                vehicleData: rentalData.vehicleData,
                pricePerHour: rentalData.pricePerHour,
                securityDeposit: rentalData.securityDeposit,
                vehicleOwner: rentalData.vehicleOwner,
                currentRenter: currentRenter,
                isAvailable: rentalData.isAvailable,
                ratings: rentalData.ratings
            })
        );

        // Update rentee stats
        renteeProfiles[msg.sender].activeRentals++;
    }

    function updateRenteeProfile(
        string memory _name,
        string memory _profileImageHash
    ) external onlyRegisteredAsRentee {
        require(bytes(_name).length > 0, "Name cannot be empty");

        // Update in mapping
        RenteeProfile storage renteeProfile = renteeProfiles[msg.sender];
        renteeProfile.name = _name;
        renteeProfile.profileImageHash = _profileImageHash;

        // Update in array
        for (uint i = 0; i < renteeProf.length; i++) {
            if (renteeProf[i].renteeAddress == msg.sender) {
                renteeProf[i].name = _name;
                renteeProf[i].profileImageHash = _profileImageHash;
                break;
            }
        }

        emit renteeProfileUpdated(_name, _profileImageHash);
    }

    function updateRenteeStats(address rentee, uint256 rentalCost) external {
        RenteeProfile storage user = renteeProfiles[rentee];
        user.totalRentals++;
        user.activeRentals++;
        user.totalSpending += rentalCost;
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

    function getCurrentRentals(
        address renterAddress
    ) external view returns (CurrentRental[] memory) {
        return currentRentals[renterAddress];
    }

    function getPastRentals(
        address renterAddress
    ) external view returns (PastRental[] memory) {
        return pastRentals[renterAddress];
    }

    function addPastRental(
        address rentee,
        RentalData memory rentalData
    ) external {
        PastRental memory pastRental = PastRental({
            vehicleId: rentalData.vehicleId,
            start: rentalData.start,
            end: rentalData.end,
            totalCost: rentalData.totalCost,
            lateFee: rentalData.lateFee,
            refundAmount: rentalData.refundAmount,
            vehicleData: rentalData.vehicleData,
            pricePerHour: rentalData.pricePerHour,
            securityDeposit: rentalData.securityDeposit,
            vehicleOwner: rentalData.vehicleOwner,
            pastRenter: rentee,
            ratings: rentalData.ratings
        });

        pastRentals[rentee].push(pastRental);
        renteeProfiles[rentee].activeRentals--;
    }

    function getAllRentee()
        external
        view
        validAddress
        returns (RenteeProfile[] memory)
    {
        return renteeProf;
    }
}
