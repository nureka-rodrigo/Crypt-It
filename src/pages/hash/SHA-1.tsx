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
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
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

export const SHA1 = () => {
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
            SHA-1 Hashing
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-1, short for Secure Hash Algorithm 1, is a cryptographic hash
            function designed to produce a 160-bit hash value from an input of
            any size. Though it was widely used in the past, SHA-1 is now
            considered deprecated and less secure compared to more modern hash
            functions such as SHA-256. SHA-1 was originally designed to ensure
            data integrity and provide a unique hash value that represents the
            original data, making it suitable for various security applications.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Unlike encryption algorithms, which can be reversed to retrieve the
            original data, hash functions like SHA-1 are designed to be one-way
            functions. This means that once data is hashed using SHA-1, it
            cannot be feasibly reversed or decrypted to obtain the original
            data. While SHA-1 was effective in its time, its security
            vulnerabilities have led to its gradual phase-out in favor of more
            secure alternatives.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            SHA-1 works by processing input data in blocks and applying a series
            of complex mathematical transformations to produce the final hash
            value. It was commonly used in digital signatures, certificate
            generation, and secure data storage. However, due to its
            vulnerability to collision attacks, where two different inputs
            produce the same hash value, SHA-1 is no longer recommended for
            security-critical applications.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            This component allows you to hash input text using the SHA-1
            algorithm. By entering the desired text into the provided input
            field, you can generate and view its SHA-1 hash value. While it's
            important to be aware of its limitations, SHA-1 can still be used
            for educational purposes or legacy systems where its use is
            necessary. Explore the functionality of SHA-1 hashing and observe
            how changes in input data affect the resulting hash value.
          </p>
        </div>

        <div className="flex items-center justify-center px-8 max-w-7xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Generate Hash</CardTitle>
              <CardDescription>
                Enter the text to generate its SHA-1 hash.
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
