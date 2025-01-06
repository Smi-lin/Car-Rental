import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CarHubModule = buildModule("CarHubModule", (c) => {
  const rentee = c.contract("Rentee");

  const carOwner = c.contract("CarOwner");

  const carHub = c.contract("CarHub", [
    c.getParameter("0x6Db691950c09b2025855B3166D14EbAF1F6E8ba9"), 
    rentee,                       
    carOwner                      
  ]);

  return {
    rentee,
    carOwner,
    carHub
  };
});

export default CarHubModule;