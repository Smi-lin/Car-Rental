import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { baseSepolia, sepolia } from '@reown/appkit/networks'
import {siweConfig} from "./siwe"

// 1. Get projectId

const projectId ="c2993e17e517b95baac47667cdda11d3";


// 2. Set the networks
const networks = [baseSepolia, sepolia]

// 3. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  themeVariables: {
    "--w3m-accent": "#d97706",
    "--w3m-border-radius-master":"1px"
  },
  features: {
    analytics: true
  },

  // siweConfig: siweConfig ,

});