import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;
    
    try {
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_accounts' 
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      toast({ title: 'Wallet disconnected' });
    } else {
      setAccount(accounts[0]);
      toast({ title: 'Wallet connected!', description: `Connected account: ${accounts[0]}` });
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      toast({
        title: 'Unsupported environment',
        description: 'Wallet connection is only available in browser environments',
        variant: 'destructive'
      });
      return;
    }

    // Check if MetaMask or another Ethereum provider is installed
    if (!(window as any).ethereum) {
      toast({
        title: 'Ethereum provider not found',
        description: 'Please install MetaMask or another Ethereum wallet to connect',
        variant: 'destructive'
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        toast({ 
          title: 'Wallet connected successfully!',
          description: `Connected account: ${accounts[0]}`
        });
      } else {
        throw new Error('No accounts returned from wallet');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Connection request rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request is already pending. Please check your wallet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Connection failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      // Some wallets may need explicit disconnection
      if ((window as any).ethereum.removeAllListeners) {
        (window as any).ethereum.removeAllListeners();
      }
    }
    toast({ title: 'Wallet disconnected' });
  };

  return {
    account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isConnected: !!account
  };
}