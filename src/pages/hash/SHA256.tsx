import { useState } from "react";
import Navbar from "@/components/layout/Navbar.tsx";
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

const hashText = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

type HashFormData = {
  inputText: string;
};

export const Sha256Cipher = () => {
  const [hashedText, setHashedText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HashFormData>();

  const onHash = async (data: HashFormData) => {
    const hashed = await hashText(data.inputText);
    setHashedText(hashed);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Navbar />
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            SHA-256 Hashing
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-256, short for Secure Hash Algorithm 256-bit, is a widely used
            cryptographic hash function that generates a fixed-size 256-bit hash
            value from an input of any size. As a member of the SHA-2 family of
            hash functions, SHA-256 provides a higher level of security compared
            to its predecessor, SHA-1. The primary purpose of SHA-256 is to
            ensure data integrity and secure information transmission by
            producing a unique hash value that represents the original data.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Unlike encryption algorithms, which can be reversed to retrieve the
            original data, hash functions like SHA-256 are designed to be
            one-way functions. This means that once data is hashed using
            SHA-256, it cannot be feasibly reversed or decrypted to obtain the
            original data. This property makes SHA-256 particularly useful for
            verifying data integrity and authenticity, as even a small change in
            the input data results in a significantly different hash value.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-256 operates by processing input data in blocks and applying a
            series of complex mathematical transformations to produce the final
            hash value. It is commonly used in various security applications,
            including digital signatures, certificate generation, and secure
            password storage. Due to its robustness and resistance to collision
            attacks, SHA-256 is a preferred choice in modern cryptographic
            systems.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            This component allows you to hash input text using the SHA-256
            algorithm. By entering the desired text into the provided input
            field, you can generate and view its SHA-256 hash value. This
            functionality is useful for tasks such as checking data integrity,
            ensuring secure data transmission, or simply understanding how
            SHA-256 hashes data. Explore the power of cryptographic hashing and
            see how small changes in the input data can result in completely
            different hash values.
          </p>
        </div>

        <div className="flex items-center justify-center px-8 max-w-7xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Generate Hash</CardTitle>
              <CardDescription>
                Enter the text to generate its SHA-256 hash.
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
              <div className="space-y-4">
                <Label>SHA-256 Hash</Label>
                <Textarea readOnly rows={8} value={hashedText} />
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
