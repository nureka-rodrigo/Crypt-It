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
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
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

export const SHA512 = () => {
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
      categoryHref="/hash/sha-512"
      title="SHA-512 Hashing"
      description={
        <>
          <p>
            SHA-512 produces a 512-bit (128-hex-character) digest — the largest
            output in the SHA-2 family. It uses 64-bit word arithmetic, 1024-bit
            message blocks, and 80 rounds of compression. Each round applies
            bitwise functions, sigma rotations, and modular addition to thoroughly
            diffuse each input bit across the output.
          </p>
          <p>
            Despite the larger output, SHA-512 is often faster than SHA-256 on
            modern 64-bit hardware because wider words reduce the number of blocks
            needed per byte. It provides the highest security margin in the SHA-2
            family, making it suitable for long-term security requirements.
          </p>
        </>
      }
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generate Hash</CardTitle>
          <CardDescription>
            Enter the text to generate its SHA-512 hash.
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
