const rawKey = import.meta.env.VITE_FILEBASE_API_KEY as string | undefined;
const FILEBASE_API_KEY = rawKey?.trim();

export async function uploadToIPFS(metadata: any): Promise<string> {
  if (!FILEBASE_API_KEY) {
    throw new Error("Filebase API key not configured. Please copy .env.example to .env and add your Filebase API key.");
  }

  // Validate API key format (should be a valid string, not too short)
  if (FILEBASE_API_KEY.length < 10) {
    throw new Error("Filebase API key appears to be invalid. Please check your .env file and ensure you have a valid API key from https://filebase.com/");
  }

  // Debug: log masked key length to help diagnose malformed keys (won't print actual key)
  try {
    const masked = FILEBASE_API_KEY.replace(/.(?=.{4})/g, '*');
    console.debug(`Using Filebase key of length ${FILEBASE_API_KEY.length}: ${masked}`);
  } catch { }

  // Convert metadata to a Blob for Filebase upload
  const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
  const formData = new FormData();
  formData.append('file', blob, 'metadata.json');

  // Using Filebase IPFS RPC endpoint with the correct add method
  const response = await fetch('https://rpc.filebase.io/api/v0/add?cid-version=1', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FILEBASE_API_KEY}`,
    },
    body: formData,
  });

  // Read raw text for better diagnostics (some error bodies are not strict JSON)
  const raw = await response.text().catch(() => '');

  if (!response.ok) {
    // Try to extract a message from the body, fall back to statusText
    let msg = response.statusText;
    try {
      const parsed = JSON.parse(raw);
      msg = parsed?.error?.message || parsed?.message || JSON.stringify(parsed);
    } catch {
      if (raw) msg = raw;
    }

    // Provide more specific guidance based on the error
    if (response.status === 401) {
      throw new Error(`Filebase API key authentication failed (401): ${msg}. Please verify your API key at https://filebase.com/ is correct and active. Make sure you're using the Secret (not the Key) from your Filebase dashboard.`);
    } else if (response.status === 403) {
      throw new Error(`Filebase API key forbidden (403): ${msg}. Your API key may not have the required permissions.`);
    }

    throw new Error(`IPFS upload failed (${response.status}): ${msg}`);
  }

  try {
    const data = JSON.parse(raw || '{}');
    // Filebase returns the CID in the Hash field for the add endpoint
    const cid = data?.Hash ?? data?.cid ?? '';
    if (!cid) {
      throw new Error("IPFS upload succeeded but no CID was returned");
    }
    return cid;
  } catch (err) {
    throw new Error("IPFS upload succeeded but response could not be parsed: " + (err instanceof Error ? err.message : String(err)));
  }
}

const PRESERVE_BASE = 'https://preserve.nft.storage/api/v1';

async function preserveRequest(path: string, opts: RequestInit = {}) {
  if (!FILEBASE_API_KEY) {
    throw new Error("NFT.Storage API key not configured. Set VITE_NFT_STORAGE_API_KEY in your .env file or environment.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${FILEBASE_API_KEY}`,
    ...(opts.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${PRESERVE_BASE}${path}`, { ...opts, headers });
  const raw = await res.text().catch(() => '');

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const parsed = JSON.parse(raw);
      msg = parsed?.error?.message || parsed?.message || JSON.stringify(parsed);
    } catch { }
    throw new Error(`Preserve API error (${res.status}): ${msg}`);
  }

  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return raw;
  }
}

export type CreateCollectionParams = {
  contractAddress: string;
  collectionName: string;
  chainID?: string;
  network?: string;
};

export async function createCollection(params: CreateCollectionParams) {
  const body = JSON.stringify(params);
  return await preserveRequest('/collection/create_collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

// tokensFile should be a File or Blob containing CSV as specified by the docs
export async function addTokensToCollection(collectionID: string, tokensFile: File | Blob, filename = 'tokens.csv') {
  const form = new FormData();
  form.append('collectionID', collectionID);
  // If tokensFile is a Blob without a name, provide one
  if (tokensFile instanceof File) {
    form.append('file', tokensFile, tokensFile.name);
  } else {
    form.append('file', tokensFile, filename);
  }

  // For FormData we must NOT set Content-Type header so the browser can set the multipart boundary
  const res = await fetch(`${PRESERVE_BASE}/collection/add_tokens`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FILEBASE_API_KEY}` },
    body: form,
  });

  const raw = await res.text().catch(() => '');
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const parsed = JSON.parse(raw);
      msg = parsed?.error?.message || parsed?.message || JSON.stringify(parsed);
    } catch {
      if (raw) msg = raw;
    }
    throw new Error(`Add tokens failed (${res.status}): ${msg}`);
  }

  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return raw;
  }
}

export async function listCollections() {
  return await preserveRequest('/collection/list_collections', { method: 'GET' });
}

export async function listTokens(collectionID: string, lastKey?: string) {
  const params = new URLSearchParams({ collectionID });
  if (lastKey) params.set('lastKey', lastKey);
  return await preserveRequest(`/collection/list_tokens?${params.toString()}`, { method: 'GET' });
}

export async function listApiKeys() {
  return await preserveRequest('/auth/list_api_keys', { method: 'GET' });
}

export async function removeApiKey(keyID: string) {
  return await preserveRequest(`/auth/remove_api_key?keyID=${encodeURIComponent(keyID)}`, { method: 'DELETE' });
}

export async function getUserBalance() {
  return await preserveRequest('/user/get_balance', { method: 'GET' });
}

export async function getDealStatus(cid: string) {
  return await preserveRequest(`/collection/deal_status?cid=${encodeURIComponent(cid)}`, { method: 'GET' });
}

export async function retryToken(tokenID: string) {
  return await preserveRequest(`/collection/retry_tokens?tokenID=${encodeURIComponent(tokenID)}`, { method: 'GET' });
}

export async function deleteToken(tokenID: string) {
  return await preserveRequest(`/collection/delete_tokens?tokenID=${encodeURIComponent(tokenID)}`, { method: 'DELETE' });
}
