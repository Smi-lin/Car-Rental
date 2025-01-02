
import {siweConfig} from "./siwe"
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { baseSepolia, sepolia } from '@reown/appkit/networks'


const projectId = process.env.PROJECT_ID;


const networks = [baseSepolia, sepolia]


const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  themeVariables: {
    "--w3m-accent": "#d97706",
    "--w3m-border-radius-master" : "1px",
  },
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  siweConfig: siweConfig 
})






