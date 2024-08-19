import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
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
    <>
      <Navbar />
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            SHA-384 Hashing
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-384, or Secure Hash Algorithm 384-bit, is a member of the SHA-2
            family of cryptographic hash functions. It is designed to generate a
            384-bit (or 48-byte) hash value from input data of any size. As an
            upgrade from SHA-1, SHA-384 offers enhanced security and is less
            susceptible to collision and pre-image attacks. It is commonly used
            in applications requiring higher levels of data integrity and
            security.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Hash functions like SHA-384 are designed to be one-way functions,
            meaning that once data is hashed, it cannot be feasibly reversed or
            decrypted to recover the original input. This one-way property
            ensures that the hash value uniquely represents the input data,
            making it ideal for tasks such as data verification, digital
            signatures, and secure information storage.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-384 processes input data in blocks and applies a series of
            mathematical transformations to produce the hash value. Unlike
            SHA-256, which generates a 256-bit hash, SHA-384 produces a longer
            hash value, providing a higher level of security against certain
            types of attacks. This makes SHA-384 particularly useful in
            environments where enhanced security measures are required.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            This component allows you to hash input text using the SHA-384
            algorithm. By entering your text into the provided input field, you
            can generate and view its SHA-384 hash value. This functionality is
            beneficial for tasks such as ensuring data integrity, verifying the
            authenticity of information, or exploring the characteristics of
            SHA-384 hashing. Discover how SHA-384 enhances data security and
            observe the impact of different inputs on the resulting hash value.
          </p>
        </div>

        <div className="flex items-center justify-center px-8 max-w-7xl">
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
        </div>
      </section>
      <Footer />

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
    </>
  );
};
