const NFT_STORAGE_API_KEY = ""; // Add your NFT.Storage API key here

export async function uploadToIPFS(metadata: any): Promise<string> {
  if (!NFT_STORAGE_API_KEY) {
    throw new Error("NFT.Storage API key not configured");
  }

  const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
  
  const response = await fetch('https://api.nft.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NFT_STORAGE_API_KEY}`,
    },
    body: blob,
  });

  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.value.cid;
}
