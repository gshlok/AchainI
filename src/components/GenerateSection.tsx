import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Copy, ExternalLink, Wallet, Download } from "lucide-react";
import { generateAIText, generateAIImage } from "@/lib/ai";
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
    image?: HTMLImageElement;
  } | null>(null);
  const [generationMode, setGenerationMode] = useState<"text" | "image">("text");
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
    let imageElement: HTMLImageElement | undefined;

    try {
      if (generationMode === "text") {
        // Generate AI text
        output = await generateAIText(prompt);

        // Compute hashes
        hashProof = computeHashProof(prompt, output);
        hashText = computeHashText(output);

        toast({ title: "AI text generated successfully!" });
      } else {
        // Generate AI image
        imageElement = await generateAIImage(prompt);
        
        // For image generation, we'll use a placeholder for the "output" text
        output = "[Image Generated]";
        
        // Compute hashes (using prompt and a placeholder for output)
        hashProof = computeHashProof(prompt, "[Image Generated]");
        hashText = computeHashText("[Image Generated]");
        
        toast({ title: "AI image generated successfully!" });
      }

      // Try to upload to IPFS (optional)
      try {
        const metadata = {
          prompt,
          model: generationMode === "text" ? "google/gemini-2.5-flash-lite" : "puter-ai-image",
          output,
          hashProof,
          hashText,
          timestamp: new Date().toISOString(),
          creator: account || "0x0000000000000000000000000000000000000000",
          type: generationMode,
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
      setResult({ 
        output, 
        hashProof, 
        hashText, 
        cid: cid || "Not uploaded",
        image: imageElement
      });

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

  const downloadImage = (format: "png" | "jpg") => {
    if (!result?.image) return;

    try {
      const image = result.image;
      const link = document.createElement("a");
      link.href = image.src;
      link.download = `ai-generated-image.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: `Image downloaded as ${format.toUpperCase()}` });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Button
            variant={generationMode === "text" ? "default" : "outline"}
            onClick={() => setGenerationMode("text")}
            className="flex-1"
          >
            Generate Text
          </Button>
          <Button
            variant={generationMode === "image" ? "default" : "outline"}
            onClick={() => setGenerationMode("image")}
            className="flex-1"
          >
            Generate Image
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter your AI prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={generationMode === "text" 
              ? "e.g., Write a haiku about blockchain technology" 
              : "e.g., A futuristic city with flying cars"}
            className="min-h-[120px] resize-none"
            disabled={loading}
          />
        </div>
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
          generationMode === "text" ? "Generate AI Text" : "Generate AI Image"
        )}
      </Button>

      {result && (
        <Card className="p-6 space-y-4 bg-card border-border">
          {generationMode === "text" ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Generated Text</h3>
              <div className="bg-secondary/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                {result.output}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Generated Image</h3>
                {result.image && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage("png")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PNG
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage("jpg")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      JPG
                    </Button>
                  </div>
                )}
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg flex justify-center">
                {result.image && (
                  <img 
                    src={result.image.src} 
                    alt="AI Generated" 
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '400px' }}
                  />
                )}
              </div>
            </div>
          )}

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