import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Rentee Test", function () {
  async function deployRenteeFixture() {
    const [owner, otherAccount, Addr1] = await hre.ethers.getSigners();

    const Rentee = await hre.ethers.getContractFactory("Rentee");
    const rentee = await Rentee.deploy();

    return { rentee, owner, otherAccount, Addr1 };
  }

  describe("Deployment", () => {
    it("Should check if it deployed", async function () {
      const { rentee, owner } = await loadFixture(deployRenteeFixture);

      expect(await rentee.getAllRentee());
    });
  });


  describe("Rentee Registration", () => {
    it("Should be able to register as a rentee", async function () {
      const { rentee, otherAccount } = await loadFixture(deployRenteeFixture);

      const name = "Matthew";
      const imageHash = "ImHash12345";

      await rentee.connect(otherAccount).registerAsRentee(name, imageHash);
      const profile = await rentee.renteeProfiles(otherAccount.address);

      expect(profile.name).to.equal(name);
      expect(profile.profileImageHash).to.equal(imageHash);
      expect(profile.renteeAddress).to.equal(otherAccount.address);
      expect(profile.isRegistered).to.equal(true);
      expect(profile.totalRentals).to.equal(0);
      expect(profile.activeRentals).to.equal(0);
      expect(profile.totalSpending).to.equal(0);
    });

    it("should not allow double registration", async function () {
      const { rentee, otherAccount } = await loadFixture(deployRenteeFixture);
      const name = "Matthew";
      const imageHash = "QmHash123";

      await rentee.connect(otherAccount).registerAsRentee(name, imageHash);

      await expect(
        rentee.connect(otherAccount).registerAsRentee(name, imageHash)
      ).to.be.revertedWith("Already registered as a rentee");
    });

    it("Should update rentee profile successfully", async function () {
      const { rentee, otherAccount } = await loadFixture(deployRenteeFixture);

      const initialName = "Matthew";
      const initialImageHash = "ImageHash123";
      await rentee
        .connect(otherAccount)
        .registerAsRentee(initialName, initialImageHash);

      const newName = "Rokeebat";
      const newImageHash = "NewImageHash456";
      await rentee
        .connect(otherAccount)
        .updateRenteeProfile(newName, newImageHash);

      const updatedProfile = await rentee.renteeProfiles(otherAccount.address);
      expect(updatedProfile.name).to.equal(newName);
      expect(updatedProfile.profileImageHash).to.equal(newImageHash);
    });

    it("Should not allow unregistered rentee to update profile", async function () {
      const { rentee, otherAccount } = await loadFixture(deployRenteeFixture);

      const newName = "Rokeebat";
      const newImageHash = "NewImageHash456";

      await expect(
        rentee.connect(otherAccount).updateRenteeProfile(newName, newImageHash)
      ).to.be.revertedWith("Not registered as a rentee");
    });

    it("Should keep other profile data unchanged after update", async function () {
      const { rentee, otherAccount } = await loadFixture(deployRenteeFixture);

      await rentee
        .connect(otherAccount)
        .registerAsRentee("Matthew", "ImageHash123");

      const initialProfile = await rentee.renteeProfiles(otherAccount.address);

      const newName = "Rokeebat";
      const newImageHash = "NewImageHash456";
      await rentee
        .connect(otherAccount)
        .updateRenteeProfile(newName, newImageHash);

      const updatedProfile = await rentee.renteeProfiles(otherAccount.address);

      expect(updatedProfile.renteeAddress).to.equal(
        initialProfile.renteeAddress
      );
      expect(updatedProfile.isRegistered).to.equal(initialProfile.isRegistered);
      expect(updatedProfile.registrationTimestamp).to.equal(
        initialProfile.registrationTimestamp
      );
      expect(updatedProfile.totalRentals).to.equal(initialProfile.totalRentals);
      expect(updatedProfile.activeRentals).to.equal(
        initialProfile.activeRentals
      );
      expect(updatedProfile.totalSpending).to.equal(
        initialProfile.totalSpending
      );
    });
  });

  describe("Current Rental Information", function () {
    it("should be able to add current rental successfully", async function () {
      const { rentee, otherAccount, Addr1 } = await loadFixture(
        deployRenteeFixture
      );

      const rentalData = {
        vehicleId: 1,
        start: Math.floor(Date.now() / 1000),
        end: Math.floor(Date.now() / 1000) + 3600,
        vehicleData: ["Tesla Model 3", "Red", "ABC123"],
        pricePerHour: hre.ethers.parseEther("0.1"),
        securityDeposit: hre.ethers.parseEther("1"),
        vehicleOwner: Addr1.address,
        currentRenter: otherAccount.address,
        isAvailable: false,
        ratings: 0,
      };

      await rentee
        .connect(otherAccount)
        .addCurrentRental(otherAccount.address, rentalData);

      // Get the current rentals
      const currentRentals = await rentee.getCurrentRentals(
        otherAccount.address
      );

      expect(currentRentals.length).to.equal(1);
      expect(currentRentals[0].vehicleId).to.equal(rentalData.vehicleId);
      expect(currentRentals[0].start).to.equal(rentalData.start);
      expect(currentRentals[0].end).to.equal(rentalData.end);
      expect(currentRentals[0].vehicleData).to.deep.equal(
        rentalData.vehicleData
      );
      expect(currentRentals[0].pricePerHour).to.equal(rentalData.pricePerHour);
      expect(currentRentals[0].securityDeposit).to.equal(
        rentalData.securityDeposit
      );
      expect(currentRentals[0].vehicleOwner).to.equal(rentalData.vehicleOwner);
      expect(currentRentals[0].currentRenter).to.equal(otherAccount.address);
      expect(currentRentals[0].isAvailable).to.equal(rentalData.isAvailable);
      expect(currentRentals[0].ratings).to.equal(rentalData.ratings);
    });
  });

  
});
