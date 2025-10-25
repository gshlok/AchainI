import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ExternalLink, Image as ImageIcon, FileText, Upload } from "lucide-react";
import { computeHashText, computeImageFileHash } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";

export default function VerifySection() {
  const [inputText, setInputText] = useState("");
  const [imageCID, setImageCID] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verification, setVerification] = useState<{
    prompt: string;
    creator: string;
    cid: string;
    type?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleVerifyText = () => {
    if (!inputText.trim()) {
      toast({ title: "Please enter text to verify", variant: "destructive" });
      return;
    }

    const hashText = computeHashText(inputText);
    const lookupData = JSON.parse(localStorage.getItem("aiProofs") || "{}");
    
    if (lookupData[hashText]) {
      setVerification({...lookupData[hashText], type: "text"});
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

  const handleVerifyImage = () => {
    if (!imageCID.trim()) {
      toast({ title: "Please enter an IPFS CID to verify", variant: "destructive" });
      return;
    }

    // For image verification, we'll search through all stored proofs to find a match
    const lookupData = JSON.parse(localStorage.getItem("aiProofs") || "{}");
    let found = false;
    
    // Check if the CID exists in our lookup data
    for (const key in lookupData) {
      if (lookupData[key].cid === imageCID) {
        setVerification({...lookupData[key], type: "image"});
        toast({ title: "Match found!" });
        found = true;
        break;
      }
    }
    
    if (!found) {
      setVerification(null);
      toast({ 
        title: "No match found", 
        description: "This image was not generated through this system",
        variant: "destructive" 
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyUploadedImage = async () => {
    if (!uploadedImage) {
      toast({ title: "Please upload an image to verify", variant: "destructive" });
      return;
    }

    try {
      // Hash the uploaded image
      const imageHash = await computeImageFileHash(uploadedImage);
      
      // Check if this hash exists in our lookup data
      const lookupData = JSON.parse(localStorage.getItem("aiProofs") || "{}");
      let found = false;
      
      // Look for a matching image hash
      for (const key in lookupData) {
        if (lookupData[key].imageHash === imageHash) {
          setVerification({
            prompt: lookupData[key].prompt,
            creator: lookupData[key].creator,
            cid: lookupData[key].cid,
            type: "image"
          });
          toast({ title: "Match found!", description: "This image was generated through our system" });
          found = true;
          break;
        }
      }
      
      if (!found) {
        setVerification(null);
        toast({ 
          title: "No match found", 
          description: "This image was not generated through this system",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Tabs defaultValue="text" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Verify Text
        </TabsTrigger>
        <TabsTrigger value="image-cid" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Verify by CID
        </TabsTrigger>
        <TabsTrigger value="image-upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Verify by Upload
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="text">
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
            onClick={handleVerifyText}
            variant="secondary"
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            Verify Text
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="image-cid">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter IPFS CID of generated image</label>
            <Input
              value={imageCID}
              onChange={(e) => setImageCID(e.target.value)}
              placeholder="Enter the IPFS CID of the image..."
            />
          </div>

          <Button 
            onClick={handleVerifyImage}
            variant="secondary"
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            Verify Image by CID
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="image-upload">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload AI-generated image to verify</label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-40 rounded-lg mb-2"
                    />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, GIF</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Button 
            onClick={handleVerifyUploadedImage}
            variant="secondary"
            className="w-full"
            disabled={!uploadedImage}
          >
            <Search className="mr-2 h-4 w-4" />
            Verify Uploaded Image
          </Button>
        </div>
      </TabsContent>

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
              {verification.cid.startsWith("Qm") && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.open(`https://ipfs.io/ipfs/${verification.cid}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {verification.type === "image" && (
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Content Type</div>
                <p className="text-sm">AI Generated Image</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </Tabs>
  );
}