import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with deployed contract
const CONTRACT_ABI = [
  "function createProof(bytes32 hashProof, string calldata cid) public",
  "function proofs(bytes32) public view returns (address creator, string cid, uint256 timestamp)"
];

export async function connectWallet() {
  if (!(window as any).ethereum) {
    throw new Error("MetaMask not installed");
  }
  
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function createProof(hashProof: string, cid: string) {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  const tx = await contract.createProof(hashProof, cid);
  await tx.wait();
  
  return tx.hash;
}

export async function getProof(hashProof: string) {
  const provider = new ethers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  
  const proof = await contract.proofs(hashProof);
  return {
    creator: proof.creator,
    cid: proof.cid,
    timestamp: Number(proof.timestamp)
  };
}
