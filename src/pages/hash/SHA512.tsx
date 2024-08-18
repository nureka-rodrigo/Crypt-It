import { useState } from "react";
import {Navbar} from "@/components/layout/Navbar.tsx";
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
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
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
            SHA-512 Hashing
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-512, short for Secure Hash Algorithm 512-bit, is a cryptographic
            hash function that produces a 512-bit (or 64-byte) hash value from
            input data of any size. As a member of the SHA-2 family, SHA-512
            offers a higher level of security compared to its predecessors, such
            as SHA-1 and SHA-256. It is designed to provide a robust mechanism
            for ensuring data integrity and authenticity in various security
            applications.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Hash functions like SHA-512 are one-way functions, meaning that once
            data is hashed using SHA-512, it cannot be feasibly reversed or
            decrypted to retrieve the original input. This characteristic is
            fundamental to hash functions, making them essential for tasks such
            as data verification, secure password storage, and digital
            signatures. SHA-512’s extensive bit length provides an increased
            resistance to collision attacks compared to shorter hash functions.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-512 processes input data in blocks, applying a series of complex
            mathematical operations to generate the final hash value. Its larger
            hash size results in a longer, more secure hash, making it
            particularly useful in scenarios where a higher level of security is
            required. SHA-512 is widely utilized in various cryptographic
            systems and applications due to its strong security properties and
            robustness.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            This component enables you to hash input text using the SHA-512
            algorithm. By entering the text into the provided input field, you
            can generate and view its SHA-512 hash value. This functionality is
            ideal for ensuring data integrity, verifying authenticity, and
            exploring the characteristics of SHA-512 hashing. Experience the
            security benefits of SHA-512 and see how even minor changes in input
            data lead to significantly different hash values.
          </p>
        </div>

        <div className="flex items-center justify-center px-8 max-w-7xl">
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
