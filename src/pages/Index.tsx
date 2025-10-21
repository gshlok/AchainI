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