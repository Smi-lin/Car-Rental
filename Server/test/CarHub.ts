import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("CarHub Test", function () {
  async function deployCarHubFixture() {
    const [owner, otherAccount, Addr1] = await hre.ethers.getSigners();

    const USDCMock = await hre.ethers.getContractFactory("USDCMock");
    const usdcMock = await USDCMock.deploy();
    await usdcMock.waitForDeployment();
    const usdcAddress = await usdcMock.getAddress();

    const Rentee = await hre.ethers.getContractFactory("Rentee");
    const rentee = await Rentee.deploy();
    await rentee.waitForDeployment();
    const renteeAddress = await rentee.getAddress();

    const CarOwner = await hre.ethers.getContractFactory("CarOwner");
    const carOwner = await CarOwner.deploy();
    await carOwner.waitForDeployment();
    const carOwnerAddress = await carOwner.getAddress();

    const CarHub = await hre.ethers.getContractFactory("CarHub");
    const carHub = await CarHub.deploy(
      usdcAddress,
      renteeAddress,
      carOwnerAddress
    );
    await carHub.waitForDeployment();

    return {
      carHub,
      rentee,
      carOwner,
      usdcMock,
      owner,
      otherAccount,
      Addr1,
    };
  }

  describe("Deployment", () => {
    it("Should deploy successfully", async function () {
      const { carHub } = await loadFixture(deployCarHubFixture);
      expect(await carHub.getAllVehicles()).to.be.an("array");
    });

    it("Should have correct USDC address", async function () {
      const { carHub, usdcMock } = await loadFixture(deployCarHubFixture);
      expect(await carHub.USDc()).to.equal(await usdcMock.getAddress());
    });

    it("Should have correct Rentee contract address", async function () {
      const { carHub, rentee } = await loadFixture(deployCarHubFixture);
      expect(await carHub.renteeContract()).to.equal(await rentee.getAddress());
    });

    it("Should have correct CarOwner contract address", async function () {
      const { carHub, carOwner } = await loadFixture(deployCarHubFixture);
      expect(await carHub.carOwnerContract()).to.equal(
        await carOwner.getAddress()
      );
    });
  });

  describe("Vehicle Listing", () => {
    it("Should list a vehicle successfully", async function () {
      const { carHub, carOwner, owner } = await loadFixture(
        deployCarHubFixture
      );

      await carOwner.registerAsCarOwner("Matex", "ImHash123");

      const listingTx = await carHub.listVehicle(
        "ipfs_hash",
        "Toyota",
        "Camry",
        "No smoking in my car",
        hre.ethers.parseEther("0.1"),
        hre.ethers.parseEther("1")
      );

      await expect(listingTx)
        .to.emit(carHub, "VehicleListed")
        .withArgs(
          1,
          owner.address,
          "ipfs_hash",
          "Toyota",
          "Camry",
          "No smoking in my car",
          hre.ethers.parseEther("0.1"),
          hre.ethers.parseEther("1")
        );
    });

    it("Should update rental price successfully", async function () {
      const { carHub, carOwner } = await loadFixture(deployCarHubFixture);

      await carOwner.registerAsCarOwner("Matex", "ImHash123");
      await carHub.listVehicle(
        "ipfs_hash",
        "Toyota",
        "Camry",
        "No smoking in my car",
        hre.ethers.parseEther("0.1"),
        hre.ethers.parseEther("1")
      );

      const updateTx = await carHub.updateRentalPrice(
        1,
        hre.ethers.parseEther("0.2"),
        hre.ethers.parseEther("2")
      );

      await expect(updateTx)
        .to.emit(carHub, "PriceUpdated")
        .withArgs(1, hre.ethers.parseEther("0.2"), hre.ethers.parseEther("2"));
    });
  });

  describe("Vehicle Rental", () => {
    it("Should rent a vehicle successfully", async function () {
      const { carHub, carOwner, rentee, usdcMock, owner, otherAccount } =
        await loadFixture(deployCarHubFixture);

      await carOwner.registerAsCarOwner("Matex", "ImHash123");
      await carHub.listVehicle(
        "ipfs_hash",
        "Toyota",
        "Camry",
        "No smoking in my car",
        hre.ethers.parseEther("0.1"),
        hre.ethers.parseEther("1")
      );

      await rentee
        .connect(otherAccount)
        .registerAsRentee("Adesola", "ImHash456");

      const rentalCost = hre.ethers.parseEther("1.1");
      await usdcMock
        .connect(otherAccount)
        .approve(await carHub.getAddress(), rentalCost);
      await usdcMock.mint(otherAccount.address, rentalCost);

      const rentalTx = await carHub.connect(otherAccount).rentVehicle(1, 3600);

      const latestBlock = await hre.ethers.provider.getBlock("latest");
      if (!latestBlock) throw new Error("Failed to get latest block");
      const timestamp = latestBlock.timestamp;

      await expect(rentalTx)
        .to.emit(carHub, "VehicleRented")
        .withArgs(
          1,
          otherAccount.address,
          timestamp,
          timestamp + 3600,
          rentalCost,
          hre.ethers.parseEther("1")
        );
    });

    // it("Should complete rental successfully", async function () {
    //   const { carHub, carOwner, rentee, usdcMock, owner, otherAccount } =
    //     await loadFixture(deployCarHubFixture);

    //   await carOwner.registerAsCarOwner("Matex", "ImHash123");
    //   await carHub.listVehicle(
    //     "ipfs_hash",
    //     "Toyota",
    //     "Camry",
    //     "No smoking in my car",
    //     hre.ethers.parseEther("0.1"),
    //     hre.ethers.parseEther("1")
    //   );
    //   await rentee
    //     .connect(otherAccount)
    //     .registerAsRentee("Adesola", "ImHash456");
    //   const rentalCost = hre.ethers.parseEther("1.1");
    //   await usdcMock
    //     .connect(otherAccount)
    //     .approve(await carHub.getAddress(), rentalCost);
    //   await usdcMock.mint(otherAccount.address, rentalCost);
    //   await usdcMock.mint(
    //     await carHub.getAddress(),
    //     hre.ethers.parseEther("0.22")
    //   );
    //   await carHub.connect(otherAccount).rentVehicle(1, 3600);

    //   await hre.network.provider.send("evm_increaseTime", [3600]);
    //   await hre.network.provider.send("evm_mine");

    //   const completeTx = await carHub.connect(otherAccount).completeRental(1);

    //   await expect(completeTx)
    //     .to.emit(carHub, "VehicleReturned")
    //     .withArgs(
    //       1,
    //       otherAccount.address,
    //       hre.ethers.parseEther("0.1"),
    //       0,
    //       hre.ethers.parseEther("0.9"),
    //       hre.ethers.parseEther("1")
    //     );
    // });
  });

  describe("Vehicle Rating", () => {
    // it("Should rate a vehicle successfully after rental", async function () {
    //   const { carHub, carOwner, rentee, usdcMock, owner, otherAccount } =
    //     await loadFixture(deployCarHubFixture);

    //   await carOwner.registerAsCarOwner("Matex", "ImHash123");
    //   await carHub.listVehicle(
    //     "ipfs_hash",
    //     "Toyota",
    //     "Camry",
    //     "No smoking in my car",
    //     hre.ethers.parseEther("0.1"),
    //     hre.ethers.parseEther("1")
    //   );
    //   await rentee
    //     .connect(otherAccount)
    //     .registerAsRentee("Adesola", "ImHash456");
    //   const rentalCost = hre.ethers.parseEther("1.1");
    //   await usdcMock
    //     .connect(otherAccount)
    //     .approve(await carHub.getAddress(), rentalCost);
    //   await usdcMock.mint(otherAccount.address, rentalCost);
    //   await usdcMock.mint(
    //     await carHub.getAddress(),
    //     hre.ethers.parseEther("0.22")
    //   );
    //   await carHub.connect(otherAccount).rentVehicle(1, 3600);
    //   await hre.network.provider.send("evm_increaseTime", [3600]);
    //   await hre.network.provider.send("evm_mine");
    //   await carHub.connect(otherAccount).completeRental(1);

    //   const ratingTx = await carHub
    //     .connect(otherAccount)
    //     .rateVehicle(1, 5, "Great car!");

    //   await expect(ratingTx)
    //     .to.emit(carHub, "VehicleRated")
    //     .withArgs(1, otherAccount.address, 5, "Great car!");
    // });

    it("Should not allow rating without rental", async function () {
      const { carHub, carOwner, otherAccount } = await loadFixture(
        deployCarHubFixture
      );

      await carOwner.registerAsCarOwner("Matex", "ImHash123");
      await carHub.listVehicle(
        "ipfs_hash",
        "Toyota",
        "Camry",
        "No smoking in my car",
        hre.ethers.parseEther("0.1"),
        hre.ethers.parseEther("1")
      );

      await expect(
        carHub.connect(otherAccount).rateVehicle(1, 5, "Great car!")
      ).to.be.revertedWith("You have never rented this vehicle");
    });

    // it("Should not allow rating twice", async function () {
    //   const { carHub, carOwner, rentee, usdcMock, owner, otherAccount } =
    //     await loadFixture(deployCarHubFixture);

    //   await carOwner.registerAsCarOwner("Matex", "ImHash123");
    //   await carHub.listVehicle(
    //     "ipfs_hash",
    //     "Toyota",
    //     "Camry",
    //     "No smoking in my car",
    //     hre.ethers.parseEther("0.1"),
    //     hre.ethers.parseEther("1")
    //   );
    //   await rentee
    //     .connect(otherAccount)
    //     .registerAsRentee("Adesola", "ImHash456");
    //   const rentalCost = hre.ethers.parseEther("1.1");
    //   await usdcMock
    //     .connect(otherAccount)
    //     .approve(await carHub.getAddress(), rentalCost);
    //   await usdcMock.mint(otherAccount.address, rentalCost);
    //   await usdcMock.mint(
    //     await carHub.getAddress(),
    //     hre.ethers.parseEther("0.22")
    //   );
    //   await carHub.connect(otherAccount).rentVehicle(1, 3600);
    //   await hre.network.provider.send("evm_increaseTime", [3600]);
    //   await hre.network.provider.send("evm_mine");
    //   await carHub.connect(otherAccount).completeRental(1);
    //   await carHub.connect(otherAccount).rateVehicle(1, 5, "Great car!");

    //   await expect(
    //     carHub.connect(otherAccount).rateVehicle(1, 4, "Still great!")
    //   ).to.be.revertedWith("You have already rated this vehicle");
    // });
  });
});
