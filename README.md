# AchainI - AI-Powered Text Generation with Blockchain Proof & IPFS Storage

AchainI is a cutting-edge web application that combines artificial intelligence with blockchain technology to generate text content while providing immutable proof of creation and decentralized storage.

## 🌐 Live Demo

**APP IS DEPLOYED AT:** [https://achain-i.vercel.app/](https://achain-i.vercel.app/)

## 🚀 Features

- **AI-Powered Content Generation**: Leverages Google's Gemini AI to create high-quality content (image gen disabled for now)
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

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
