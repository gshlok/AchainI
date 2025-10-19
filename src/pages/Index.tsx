import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search } from "lucide-react";
import GenerateSection from "@/components/GenerateSection";
import VerifySection from "@/components/VerifySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AchainI
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-Powered Text Generation with Blockchain Proof & IPFS Storage
          </p>
        </header>

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

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p className="mb-2">⚠️ Configuration Required:</p>
          <ul className="space-y-1">
            <li>• Add your Gemini API key in <code className="bg-secondary px-2 py-1 rounded">src/lib/ai.ts</code></li>
            <li>• Add your NFT.Storage API key in <code className="bg-secondary px-2 py-1 rounded">src/lib/ipfs.ts</code></li>
            <li>• Deploy smart contract and update address in <code className="bg-secondary px-2 py-1 rounded">src/lib/blockchain.ts</code></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default Index;
