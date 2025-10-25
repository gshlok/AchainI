import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Copy, ExternalLink, Wallet } from "lucide-react";
import { generateAIText } from "@/lib/ai";
import { computeHashProof, computeHashText } from "@/lib/crypto";
import { uploadToIPFS } from "@/lib/ipfs";
import { createProof } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";

export default function GenerateSection() {
  const { account, isConnected } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    output: string;
    hashProof: string;
    hashText: string;
    cid: string;
    txHash?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }

    setLoading(true);
    let output = "";
    let hashProof = "";
    let hashText = "";
    let cid = "";

    try {
      // Generate AI text
      output = await generateAIText(prompt);

      // Compute hashes
      hashProof = computeHashProof(prompt, output);
      hashText = computeHashText(output);

      toast({ title: "AI text generated successfully!" });

      // Try to upload to IPFS (optional)
      try {
        const metadata = {
          prompt,
          model: "google/gemini-2.5-flash-lite",
          output,
          hashProof,
          hashText,
          timestamp: new Date().toISOString(),
          creator: account || "0x0000000000000000000000000000000000000000",
        };

        cid = await uploadToIPFS(metadata);

        // Store locally for reverse lookup
        const lookupData = JSON.parse(localStorage.getItem("aiProofs") || "{}");
        lookupData[hashText] = { prompt, cid, creator: metadata.creator };
        localStorage.setItem("aiProofs", JSON.stringify(lookupData));

        toast({ title: "Metadata uploaded to IPFS via Filebase!" });
      } catch (ipfsError) {
        console.error("IPFS upload failed:", ipfsError);
        const errorMessage = ipfsError instanceof Error ? ipfsError.message : "Unknown error occurred";

        // Provide more specific guidance in the toast
        if (errorMessage.includes("API key")) {
          toast({
            title: "IPFS upload failed - API Key Issue",
            description: "Please check your Filebase API key in the .env file. Make sure you're using the Secret (not the Key) from your Filebase dashboard at https://filebase.com/",
            variant: "destructive"
          });
        } else {
          toast({
            title: "IPFS upload failed",
            description: errorMessage,
            variant: "destructive"
          });
        }
      }

      // Display result regardless of IPFS success
      setResult({ output, hashProof, hashText, cid: cid || "Not uploaded" });

    } catch (error) {
      console.error(error);
      toast({
        title: "AI generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordProof = async () => {
    if (!result) return;

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to record proof on blockchain",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const txHash = await createProof(result.hashProof, result.cid);
      setResult({ ...result, txHash });
      toast({ title: "Proof recorded on blockchain!" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Blockchain recording failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter your AI prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Write a haiku about blockchain technology"
          className="min-h-[120px] resize-none"
          disabled={loading}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate AI Text"
        )}
      </Button>

      {result && (
        <Card className="p-6 space-y-4 bg-card border-border">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Generated Text</h3>
            <div className="bg-secondary/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {result.output}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-1">Hash Proof</div>
                <code className="text-xs break-all">{result.hashProof}</code>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.hashProof)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-1">Hash Text</div>
                <code className="text-xs break-all">{result.hashText}</code>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.hashText)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-1">IPFS CID</div>
                <code className="text-xs break-all">{result.cid}</code>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.cid)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {result.txHash && (
              <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
                  <code className="text-xs break-all">{result.txHash}</code>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${result.txHash}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {!result.txHash && (
            <Button
              onClick={handleRecordProof}
              disabled={loading || !isConnected}
              variant="secondary"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : !isConnected ? (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet to Record Proof
                </>
              ) : (
                "Record Proof on Blockchain"
              )}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
