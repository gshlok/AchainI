import CryptoJS from 'crypto-js';

export function computeHashProof(prompt: string, output: string): string {
  return "0x" + CryptoJS.SHA256(prompt + output).toString();
}

export function computeHashText(output: string): string {
  return CryptoJS.SHA256(output).toString();
}