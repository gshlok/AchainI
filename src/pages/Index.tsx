import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search } from "lucide-react";
import GenerateSection from "@/components/GenerateSection";
import VerifySection from "@/components/VerifySection";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AchainI
              </h1>
              <p className="text-muted-foreground text-lg">
                AI-Powered Text Generation with Blockchain Proof & IPFS Storage
              </p>
            </div>
            <WalletConnect />
          </div>
        </header>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> To connect your wallet and make transactions, you need to install the MetaMask plugin or a similar Web3 wallet extension in your browser.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="generate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Verify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <GenerateSection />
          </TabsContent>

          <TabsContent value="verify">
            <VerifySection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;