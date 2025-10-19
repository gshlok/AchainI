import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Search, ExternalLink } from "lucide-react";
import { computeHashText } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

export default function VerifySection() {
  const [inputText, setInputText] = useState("");
  const [verification, setVerification] = useState<{
    prompt: string;
    creator: string;
    cid: string;
  } | null>(null);
  const { toast } = useToast();

  const handleVerify = () => {
    if (!inputText.trim()) {
      toast({ title: "Please enter text to verify", variant: "destructive" });
      return;
    }

    const hashText = computeHashText(inputText);
    const lookupData = JSON.parse(localStorage.getItem("aiProofs") || "{}");
    
    if (lookupData[hashText]) {
      setVerification(lookupData[hashText]);
      toast({ title: "Match found!" });
    } else {
      setVerification(null);
      toast({ 
        title: "No match found", 
        description: "This text was not generated through this system",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Paste AI-generated text to verify</label>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the AI-generated text here..."
          className="min-h-[120px] resize-none"
        />
      </div>

      <Button 
        onClick={handleVerify}
        variant="secondary"
        className="w-full"
      >
        <Search className="mr-2 h-4 w-4" />
        Verify Text
      </Button>

      {verification && (
        <Card className="p-6 space-y-4 bg-card border-border">
          <h3 className="font-semibold text-lg">Verification Result</h3>
          
          <div className="space-y-3">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Original Prompt</div>
              <p className="text-sm">{verification.prompt}</p>
            </div>

            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Creator Wallet</div>
              <code className="text-xs break-all">{verification.creator}</code>
            </div>

            <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-2">IPFS CID</div>
                <code className="text-xs break-all">{verification.cid}</code>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.open(`https://ipfs.io/ipfs/${verification.cid}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
