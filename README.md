# AchainI - AI-Powered Text Generation with Blockchain Proof & IPFS Storage

AchainI is a cutting-edge web application that combines artificial intelligence with blockchain technology to generate text content while providing immutable proof of creation and decentralized storage.

## 🌐 Live Demo

**APP IS DEPLOYED AT:** [Will be deployed soon]

**DEMONSTRATION VIDEO:** [Will be uploaded soon]

## 🚀 Features

- **AI-Powered Text Generation**: Leverages Google's Gemini AI to create high-quality text content (model selection and image/vid generation coming soon)
- **Blockchain Verification**: Uses blockchain to create immutable proof of AI-generated content
- **Decentralized Storage**: Stores content on IPFS via Filebase for censorship-resistant access
- **Web3 Wallet Integration**: Connect your MetaMask or other Ethereum-compatible wallet
- **User-Friendly Interface**: Built with React, TypeScript, and shadcn-ui for a modern experience

## 🛠️ Technology Stack

- **Frontend**: Vite, React, TypeScript
- **UI Library**: shadcn-ui with Radix UI components
- **Styling**: Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat for compilation and deployment
- **Blockchain Interaction**: ethers.js
- **AI Services**: Google Gemini API
- **Storage**: IPFS via Filebase
- **State Management**: @tanstack/react-query
- **Form Handling**: react-hook-form with Zod validation

## 📋 Prerequisites

Before you begin, ensure you have the following:
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or another Ethereum wallet
- API keys for Gemini and Filebase

## 📖 Installation Guide

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/achaini.git
   cd achaini
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Open the [.env](file:///c:/Users/shlok/repos/AchainI/.env) file and add your API keys:
   - Get your Gemini API key from: https://makersuite.google.com/app/apikey
   - Get your Filebase API key from: https://filebase.com/

4. **Compile smart contracts**:
   ```bash
   npm run compile-contract
   ```

5. **Deploy smart contract** (to Mumbai testnet):
   ```bash
   npm run deploy-contract
   ```
   After deployment, update the `CONTRACT_ADDRESS` in [src/lib/blockchain.ts](file:///c:/Users/shlok/repos/AchainI/src/lib/blockchain.ts) with your deployed contract address.

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Build for production**:
   ```bash
   npm run build
   ```

## 🧠 How It Works

1. **Generate Content**: Users input prompts to generate AI-powered text content
2. **Create Proof**: The system hashes the content and stores it on IPFS
3. **Blockchain Record**: A transaction is sent to the Polygon blockchain to create an immutable record
4. **Verification**: Anyone can verify the authenticity of content using the verification feature

## 📁 Project Structure

```
├── contracts/           # Solidity smart contracts
├── src/
│   ├── components/      # React UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility modules (AI, blockchain, IPFS)
│   ├── pages/           # Page components
│   └── App.tsx          # Main application component
├── scripts/             # Deployment scripts
└── public/              # Static assets
```

## 📜 Smart Contract Deployment

To deploy the AIProof.sol contract:

1. Install Hardhat dependencies:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. Compile the contract:
   ```bash
   npx hardhat compile
   ```

3. Deploy to Mumbai testnet:
   ```bash
   npx hardhat run scripts/deploy.ts --network mumbai
   ```

4. Update `CONTRACT_ADDRESS` in [src/lib/blockchain.ts](file:///c:/Users/shlok/repos/AchainI/src/lib/blockchain.ts) with the deployed address.

Prerequisites:
- Wallet with MATIC on Mumbai testnet
- Private key (keep this secure!)
- RPC endpoint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Google Gemini for AI capabilities
- Polygon for blockchain infrastructure
- Filebase for IPFS storage
- All the open-source libraries and tools that made this project possible