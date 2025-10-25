# AchainI - AI-Powered Text & Image Generation with Blockchain Proof & IPFS Storage

AchainI is a cutting-edge web application that combines artificial intelligence with blockchain technology to generate text and image content while providing immutable proof of creation and decentralized storage.

## 🌐 Live Demo

**APP IS DEPLOYED AT:** [https://achain-i.vercel.app/](https://achain-i.vercel.app/)

**DEMONSTRATION VIDEO:** [View Demo Video](https://www.youtube.com/watch?v=5zMrzDIO_xc)

## 🚀 Features

- **AI-Powered Content Generation**: Leverages Google's Gemini AI for text generation and Puter.js for image generation
- **Blockchain Verification**: Uses blockchain to create immutable proof of AI-generated content
- **Decentralized Storage**: Stores content on IPFS via Filebase for censorship-resistant access
- **Web3 Wallet Integration**: Connect your MetaMask or other Ethereum-compatible wallet
- **Content Verification**: Verify both AI-generated text and images with original prompts and blockchain proof
- **Image Download**: Download AI-generated images in PNG or JPG format
- **User-Friendly Interface**: Built with React, TypeScript, and shadcn-ui for a modern experience

## 🛠️ Technology Stack

- **Frontend**: Vite, React, TypeScript
- **UI Library**: shadcn-ui with Radix UI components
- **Styling**: Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat for compilation and deployment
- **Blockchain Interaction**: ethers.js
- **AI Services**: Google Gemini API, Puter.js
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

## 🎨 Using Image Generation & Verification

### Generate Images
1. Navigate to the "Generate" tab
2. Select "Generate Image" mode
3. Enter your image prompt (e.g., "A futuristic city with flying cars")
4. Click "Generate AI Image"
5. Download the image in PNG or JPG format using the download buttons

### Verify Images
1. Navigate to the "Verify" tab
2. Choose one of three verification methods:
   - **Verify Text**: Paste AI-generated text to verify
   - **Verify by CID**: Enter the IPFS CID of a generated image
   - **Verify by Upload**: Upload an image file to verify
3. If verification succeeds, you'll see the original prompt and creator details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
