import { ethers } from 'ethers';

// TODO: Replace with your deployed contract address
// Follow the deployment guide in DEPLOYMENT_GUIDE.md to deploy your contract
// and update this address with the deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 
const CONTRACT_ABI = [
  "function createProof(bytes32 hashProof, string calldata cid) public",
  "function proofs(bytes32) public view returns (address creator, string cid, uint256 timestamp)"
];

export async function connectWallet() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error("This function can only be called in a browser environment");
  }
  
  if (!(window as any).ethereum) {
    throw new Error("MetaMask or another Ethereum provider not installed");
  }
  
  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return { provider, signer };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createProof(hashProof: string, cid: string) {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.createProof(hashProof, cid);
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error('Error creating proof:', error);
    throw new Error(`Failed to create proof: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getProof(hashProof: string) {
  try {
    const provider = new ethers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    const proof = await contract.proofs(hashProof);
    return {
      creator: proof.creator,
      cid: proof.cid,
      timestamp: Number(proof.timestamp)
    };
  } catch (error) {
    console.error('Error getting proof:', error);
    throw new Error(`Failed to get proof: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}