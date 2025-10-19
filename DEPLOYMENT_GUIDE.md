# AIProof Smart Contract Deployment Guide

This guide will help you deploy the AIProof smart contract to the Polygon Mumbai testnet using Remix, which is the easiest method for beginners.

## Prerequisites

1. **MetaMask Wallet**: Install the MetaMask browser extension
2. **Test MATIC**: Get some test MATIC for the Mumbai network
3. **Filebase Account**: For IPFS storage (you should already have this)

## Step 1: Get Test MATIC

1. Open MetaMask and switch to the Mumbai test network
2. Go to the [Mumbai Polygon Faucet](https://faucet.polygon.technology/)
3. Connect your wallet and request test MATIC
4. Wait for the transaction to complete (usually instant)

## Step 2: Deploy Using Remix

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file named `AIProof.sol`
3. Copy the content from [contracts/AIProof.sol](file:///C:/Users/shlok/repos/ai-proof-chain/contracts/AIProof.sol) in this repository and paste it into Remix
4. Compile the contract:
   - Click on the "Solidity Compiler" icon (left sidebar)
   - Select version 0.8.0 or higher
   - Click "Compile AIProof.sol"
5. Deploy the contract:
   - Click on the "Deploy & Run Transactions" icon (left sidebar)
   - Make sure "Injected Provider - MetaMask" is selected as the environment
   - Click "Deploy"
   - Confirm the transaction in MetaMask
6. After deployment, you'll see the contract address in the "Deployed Contracts" section

## Step 3: Update Your Application

1. Copy the deployed contract address
2. Open [src/lib/blockchain.ts](file:///C:/Users/shlok/repos/ai-proof-chain/src/lib/blockchain.ts) in this repository
3. Replace the zero address with your deployed contract address:
   ```typescript
   const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
   ```
4. Save the file and restart your development server

## Step 4: Test the Functionality

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Connect your MetaMask wallet
4. Generate AI text
5. Click "Record Proof on Blockchain"
6. Confirm the transaction in MetaMask
7. The transaction should now successfully record your proof on the blockchain

## Troubleshooting

### Common Issues

1. **Insufficient funds**: Make sure you have enough test MATIC in your wallet
2. **Wrong network**: Ensure MetaMask is connected to the Mumbai testnet
3. **Compilation errors**: Make sure you're using Solidity version 0.8.0 or higher

### Verifying Deployment

You can verify that your contract was deployed correctly by:

1. Going to [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
2. Searching for your contract address
3. You should see the contract details and transaction history

## Advanced Deployment (Optional)

For more advanced deployment options, you can use Hardhat:

1. Compile the contract: `npm run compile-contract`
2. Deploy the contract: `npm run deploy-contract`

Note: This requires additional setup including environment variables for your private key.