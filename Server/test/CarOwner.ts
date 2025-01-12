import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("CarOwner Test", function () {
  async function deployCarOwnerFixture() {
    const [owner, otherAccount, addr1] = await hre.ethers.getSigners();

    const CarOwner = await hre.ethers.getContractFactory("CarOwner");
    const carowner = await CarOwner.deploy();

    return { carowner, owner, otherAccount, addr1 };
  }

  describe("Deployment", () => {
    it("Should check if it deployed", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      expect(await carowner.getAllCarOwner());
    });
  });
  describe("Registration", () => {
    it("Should register a new car owner", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      const allOwners = await carowner.getAllCarOwner();
      expect(allOwners.length).to.equal(1);
      expect(allOwners[0].name).to.equal("Matex");
      expect(allOwners[0].profileImageHash).to.equal("ImHash123");
      expect(allOwners[0].carOwnerAddress).to.equal(owner.address);
      expect(allOwners[0].isRegistered).to.be.true;
    });

    it("Should not allow double registration", async function () {
      const { carowner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      await expect(
        carowner.registerAsCarOwner("Adesola", "ImHash456")
      ).to.be.revertedWith("Already registered as a car owner");
    });
  });

  describe("Add Vehicle Listing", () => {
    it("Should add a vehicle listing", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      await carowner.addVehicleListing(
        owner.address,
        1,
        "ImCarHash123",
        "Toyota",
        "Camry",
        "Daily rental only",
        5,
        10
      );

      const listings = await carowner.getVehicleListings(owner.address);
      expect(listings.length).to.equal(1);
      expect(listings[0].vehicleId).to.equal(1);
      expect(listings[0].make).to.equal("Toyota");
      expect(listings[0].model).to.equal("Camry");
      expect(listings[0].pricePerHour).to.equal(5);
      expect(listings[0].securityDeposit).to.equal(10);
    });

    it("Should allow multiple vehicle listings for same owner", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      await carowner.addVehicleListing(
        owner.address,
        1,
        "ImCarHash123",
        "Toyota",
        "Camry",
        "Daily rental only",
        5,
        10
      );

      await carowner.addVehicleListing(
        owner.address,
        2,
        "ImCarHash456",
        "Honda",
        "Civic",
        "Weekly rental available",
        4,
        80
      );

      const listings = await carowner.getVehicleListings(owner.address);
      expect(listings.length).to.equal(2);
      expect(listings[1].vehicleId).to.equal(2);
      expect(listings[1].make).to.equal("Honda");
    });

    it("Should track total listings correctly", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("John Doe", "QmHash123");

      await carowner.addVehicleListing(
        owner.address,
        1,
        "ImCarHash123",
        "Toyota",
        "Camry",
        "Daily rental only",
        5,
        10
      );

      await carowner.addVehicleListing(
        owner.address,
        2,
        "ImCarHash456",
        "Honda",
        "Civic",
        "Weekly rental available",
        4,
        80
      );

      const totalListings = await carowner.getTotalListings(owner.address);
      expect(totalListings).to.equal(2);
    });
  });

  describe("Profile Information", () => {
    it("Should be able to get car owner profile Info", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      const profile = await carowner.getCarOwnerProfile(owner.address);
      expect(profile.name).to.equal("Matex");
      expect(profile.profileImageHash).to.equal("ImHash123");
      expect(profile.isRegistered).to.be.true;
      expect(profile.carOwnerAddress).to.equal(owner.address);
    });

    it("Should fail to get profile Info of unregistered owner", async function () {
      const { carowner, otherAccount } = await loadFixture(
        deployCarOwnerFixture
      );

      await expect(
        carowner.getCarOwnerProfile(otherAccount.address)
      ).to.be.revertedWith("Car owner not registered");
    });

    it("Should update car owner profile", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      await carowner.updateCarOwnerProfile("Adesola", "NewImHash456");

      const updatedProfile = await carowner.getCarOwnerProfile(owner.address);
      expect(updatedProfile.name).to.equal("Adesola");
      expect(updatedProfile.profileImageHash).to.equal("NewImHash456");
      expect(updatedProfile.isRegistered).to.be.true;
    });

    it("Should fail to update profile if not registered", async function () {
      const { carowner, otherAccount } = await loadFixture(
        deployCarOwnerFixture
      );

      await expect(
        carowner
          .connect(otherAccount)
          .updateCarOwnerProfile("Adesola", "NewImHash456")
      ).to.be.revertedWith("Not registered as a car owner");
    });
  });

  describe("Rental Information Management", () => {
    it("Should be able to add  an active rental", async function () {
      const { carowner, owner, otherAccount } = await loadFixture(
        deployCarOwnerFixture
      );

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      const vehicleData = ["Toyota", "Camry", "2022", "Black"];
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;

      await carowner.addActiveRental(
        owner.address,
        1,
        vehicleData,
        otherAccount.address,
        startTime,
        endTime,
        100
      );

      const activeRentals = await carowner.getActiveRentals(owner.address);
      expect(activeRentals.length).to.equal(1);
      expect(activeRentals[0].vehicleId).to.equal(1);
      expect(activeRentals[0].rentee).to.equal(otherAccount.address);
      expect(activeRentals[0].startTime).to.equal(startTime);
      expect(activeRentals[0].endTime).to.equal(endTime);
      expect(activeRentals[0].earnedAmount).to.equal(100);
      expect(activeRentals[0].isActive).to.be.true;
      expect(activeRentals[0].isPaid).to.be.false;
    });

    it("Should be able to increase total vehicles", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");
      await carowner.incrementTotalVehicles(owner.address);

      const profile = await carowner.getCarOwnerProfile(owner.address);
      expect(profile.totalVehicles).to.equal(1);
    });

    it("Should be able to increase active rentals", async function () {
      const { carowner, owner } = await loadFixture(deployCarOwnerFixture);

      await carowner.registerAsCarOwner("Matex", "ImHash123");
      await carowner.incrementActiveRentals(owner.address);

      const profile = await carowner.getCarOwnerProfile(owner.address);
      expect(profile.activeRentals).to.equal(1);
    });

    it("Should be able to add completed rental ", async function () {
      const { carowner, owner, otherAccount } = await loadFixture(
        deployCarOwnerFixture
      );

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      const vehicleData = ["Toyota", "Camry", "2022", "Black"];
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;

      await carowner.addActiveRental(
        owner.address,
        1,
        vehicleData,
        otherAccount.address,
        startTime,
        endTime,
        100
      );

      await carowner.addCompletedRental(
        owner.address,
        1,
        vehicleData,
        otherAccount.address,
        startTime,
        endTime,
        150
      );

      const activeRentals = await carowner.getActiveRentals(owner.address);
      expect(activeRentals.length).to.equal(0);
    });

    it("Should handle multiple active rentals", async function () {
      const { carowner, owner, otherAccount, addr1 } = await loadFixture(
        deployCarOwnerFixture
      );

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      const vehicleData1 = ["Toyota", "Camry", "2022", "Black"];
      const vehicleData2 = ["Honda", "Civic", "2023", "White"];
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;

      await carowner.addActiveRental(
        owner.address,
        1,
        vehicleData1,
        otherAccount.address,
        startTime,
        endTime,
        100
      );

      await carowner.addActiveRental(
        owner.address,
        2,
        vehicleData2,
        addr1.address,
        startTime,
        endTime,
        120
      );

      const activeRentals = await carowner.getActiveRentals(owner.address);
      expect(activeRentals.length).to.equal(2);
      expect(activeRentals[0].vehicleId).to.equal(1);
      expect(activeRentals[1].vehicleId).to.equal(2);
    });

    it("Should maintain correct rental counts", async function () {
      const { carowner, owner, otherAccount } = await loadFixture(
        deployCarOwnerFixture
      );

      await carowner.registerAsCarOwner("Matex", "ImHash123");

      const vehicleData = ["Toyota", "Camry", "2022", "Black"];
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400;

      await carowner.addActiveRental(
        owner.address,
        1,
        vehicleData,
        otherAccount.address,
        startTime,
        endTime,
        100
      );

      await carowner.addCompletedRental(
        owner.address,
        1,
        vehicleData,
        otherAccount.address,
        startTime,
        endTime,
        150
      );

      const history = await carowner.ownerHistories(owner.address);
      expect(history.totalRentals).to.equal(1);
    });
  });
});
