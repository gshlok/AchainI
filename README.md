# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/08452373-54bf-400e-a1d5-f78ca2fd98ae

## Setup Instructions

Before running the project, you need to configure your environment variables:

1. Copy the [.env.example](file:///C:/Users/shlok/repos/ai-proof-chain/.env.example) file to create a new file named [.env](file:///C:/Users/shlok/repos/ai-proof-chain/.env):
   ```bash
   cp .env.example .env
   ```

2. Open the [.env](file:///C:/Users/shlok/repos/ai-proof-chain/.env) file and fill in your API keys:
   - Get your Gemini API key from: https://makersuite.google.com/app/apikey
   - Get your Filebase API key from: https://filebase.com/

## Smart Contract Deployment

This project includes a Solidity smart contract that needs to be deployed to work with the blockchain features:

1. The contract is located in [contracts/AIProof.sol](file:///C:/Users/shlok/repos/ai-proof-chain/contracts/AIProof.sol)
2. To deploy the contract, you'll need:
   - A Polygon wallet with some MATIC tokens (for Mumbai testnet)
   - Your wallet's private key (keep this secure!)
   - An RPC endpoint for the network you want to deploy to

3. Deployment steps:
   ```bash
   # Install Hardhat for contract deployment
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   
   # Compile the contract
   npx hardhat compile
   
   # Deploy to Mumbai testnet
   npx hardhat run scripts/deploy.ts --network mumbai
   ```

4. After deployment, update the [CONTRACT_ADDRESS](file:///C:/Users/shlok/repos/ai-proof-chain/src/lib/blockchain.ts#L3-L3) in [src/lib/blockchain.ts](file:///C:/Users/shlok/repos/ai-proof-chain/src/lib/blockchain.ts) with your deployed contract address.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/08452373-54bf-400e-a1d5-f78ca2fd98ae) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespaces and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/08452373-54bf-400e-a1d5-f78ca2fd98ae) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)