import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!(window as any).ethereum) return;
    
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
    }
  };

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask to connect your wallet',
        variant: 'destructive'
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      toast({ title: 'Wallet connected!' });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
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
