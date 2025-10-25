import CryptoJS from 'crypto-js';

export function computeHashProof(prompt: string, output: string): string {
  return "0x" + CryptoJS.SHA256(prompt + output).toString();
}

export function computeHashText(output: string): string {
  return CryptoJS.SHA256(output).toString();
}

// Add this function to compute hash for image data
export async function computeImageHash(imageData: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', imageData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Add this function to compute hash for image file
export async function computeImageFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return computeImageHash(arrayBuffer);
}
