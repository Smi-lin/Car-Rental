import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CarOwnerModule = buildModule("CarOwnerModule", (c) => {
  const carowner = c.contract("CarOwner");

  return { carowner };
});

export default CarOwnerModule;
