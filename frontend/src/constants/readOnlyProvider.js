import { JsonRpcProvider } from "ethers";

export const readOnlyProvider = new JsonRpcProvider(
    process.env.BASE_RPC_URL
)