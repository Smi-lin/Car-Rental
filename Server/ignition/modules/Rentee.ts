import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RenteeModule = buildModule("RenteeModule", (r) => {
  const rentee = r.contract("Rentee");

  return { rentee };
});

export default RenteeModule;
