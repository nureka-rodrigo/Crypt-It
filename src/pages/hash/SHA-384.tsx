import { useState } from "react";
import { CipherPageLayout } from "@/components/layout/CipherPageLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { toast } from "sonner";

const hashText = async (text: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-384", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
    toast.error("Hashing failed.");
    throw error;
  }
};

type HashFormData = {
  inputText: string;
};

export const SHA384 = () => {
  const [hashedText, setHashedText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HashFormData>();

  const onHash = async (data: HashFormData) => {
    try {
      const hashed = await hashText(data.inputText);
      setHashedText(hashed);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Hashing failed.");
      throw error;
    }
  };

  return (
    <CipherPageLayout
      category="Hash"
      categoryHref="/hash/sha-384"
      title="SHA-384 Hashing"
      description={
        <>
          <p>
            SHA-384 is a variant of SHA-512 that initializes with different
            constants and truncates its output to 384 bits (96 hex characters). It
            processes data in 1024-bit blocks using 64-bit word operations and 80
            compression rounds — the same structure as SHA-512, just with a
            shorter output.
          </p>
          <p>
            On 64-bit systems, SHA-384 and SHA-512 are often faster than SHA-256
            for long messages because they process twice as many bytes per block.
            SHA-384 is commonly used in TLS cipher suites and HMAC constructions
            where a larger digest than SHA-256 is needed.
          </p>
        </>
      }
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generate Hash</CardTitle>
          <CardDescription>
            Enter the text to generate its SHA-384 hash.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onHash)}>
            <div className="space-y-2">
              <Label htmlFor="inputText">Input Text</Label>
              <Textarea
                id="inputText"
                rows={6}
                placeholder="Enter text to hash..."
                defaultValue="ATTACK AT DAWN"
                {...register("inputText", {
                  required: "Input text is required",
                })}
              />
              {errors.inputText && (
                <p className="text-red-500">{errors.inputText.message}</p>
              )}
            </div>
            <Button type="submit">Generate Hash</Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle className="mb-2">Hash Result</DialogTitle>
          <DialogDescription className="space-y-4">
            {hashedText && (
              <>
                <Label>Hashed Text</Label>
                <Textarea readOnly rows={8} value={hashedText} />
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </CipherPageLayout>
  );
};
