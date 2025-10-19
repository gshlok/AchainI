import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

export default function WalletConnect() {
  const { account, isConnecting, connectWallet, disconnectWallet, isConnected } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-secondary/50 px-4 py-2 rounded-lg text-sm font-mono">
          {formatAddress(account)}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={disconnectWallet}
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      variant="outline"
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
