import { z } from "zod";
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
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

const encodeSchema = z.object({
  plainText: z.string().min(1, "Plain text is required"),
  key: z
    .string()
    .min(1, "Key is required and must match the length of the plain text"),
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  key: z
    .string()
    .min(1, "Key is required and must match the length of the cipher text"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

export const Vernam: React.FC = () => {
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("encode");

  const {
    register: registerEncode,
    handleSubmit: handleSubmitEncode,
    formState: { errors: encodeErrors },
  } = useForm<EncodeFormData>({
    resolver: zodResolver(encodeSchema),
  });

  const {
    register: registerDecode,
    handleSubmit: handleSubmitDecode,
    formState: { errors: decodeErrors },
  } = useForm<DecodeFormData>({
    resolver: zodResolver(decodeSchema),
  });

  const vernamCipher = (text: string, key: string): string => {
    if (text.length !== key.length) {
      throw new Error("Text and key must be of the same length");
    }

    return text
      .split("")
      .map((char, index) => {
        const textChar = char.charCodeAt(0);
        const keyChar = key.charCodeAt(index);
        const cipherChar = textChar ^ keyChar;
        return String.fromCharCode(cipherChar);
      })
      .join("");
  };

  const onEncode = (data: EncodeFormData) => {
    const encoded = vernamCipher(data.plainText, data.key);
    setEncodedText(encoded);
    setIsDialogOpen(true);
  };

  const onDecode = (data: DecodeFormData) => {
    const decoded = vernamCipher(data.encodedText, data.key);
    setDecodedText(decoded);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    setEncodedText("");
    setDecodedText("");
  }, [activeTab]);

  return (
    <>
      <Navbar />
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Vernam Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Vernam Cipher, also known as the One-Time Pad, is a
            groundbreaking encryption technique introduced by Gilbert Vernam in
            1917. This cipher is recognized as one of the only theoretically
            unbreakable encryption methods, provided certain strict conditions
            are met. It operates on the principle of combining a plaintext
            message with a random secret key, or "pad," that is as long as the
            message itself. The strength of the Vernam Cipher lies in its
            randomness and the uniqueness of its key, making it a cornerstone in
            the history of cryptography.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            At its core, the Vernam Cipher is a type of substitution cipher that
            uses the XOR (exclusive or) operation to combine the binary
            representation of each character in the plaintext with the
            corresponding character in the key. Each bit of the plaintext is
            transformed based on the key, resulting in ciphertext that is
            completely unintelligible without the exact key. If the key is truly
            random, kept secret, and used only once, the ciphertext cannot be
            decrypted by any means other than using the original key, making the
            Vernam Cipher theoretically secure.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The encryption process is straightforward but powerful. Imagine the
            plaintext and key as two sequences of binary digits. By applying the
            XOR operation to each corresponding pair of bits, the plaintext is
            transformed into ciphertext. For example, if a bit in the plaintext
            is 1 and the corresponding bit in the key is 0, the resulting bit in
            the ciphertext is 1. If both bits are the same, the resulting bit is
            0. This binary operation ensures that the ciphertext bears no
            resemblance to the original message, thus securing the information.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Decrypting the message is as simple as the encryption process: the
            same key is applied to the ciphertext using the XOR operation, which
            reverses the process and reveals the original plaintext. The
            security of the Vernam Cipher is absolute under the condition that
            the key is as long as the message, is completely random, and is used
            only once. If these conditions are met, even with the advent of
            modern computational power, the Vernam Cipher remains unbreakable.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Historically, the Vernam Cipher has been used in highly sensitive
            communications, particularly during wartime, where the utmost
            security was required. However, the practical challenges of
            generating and securely distributing truly random keys that match
            the length of the message have limited its widespread adoption. In
            modern cryptography, the principles of the Vernam Cipher inspire
            more complex encryption systems, but the original concept remains a
            gold standard for unbreakable encryption.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Vernam Cipher’s simplicity, when paired with its requirement for
            a perfect key, exemplifies the balance between theoretical security
            and practical implementation. It serves as a fundamental lesson in
            the study of cryptography, illustrating how the strength of
            encryption is tied directly to the quality and secrecy of the key.
            While the Vernam Cipher may not be practical for everyday use, its
            role in the evolution of secure communication continues to influence
            modern cryptographic techniques.
          </p>
        </div>

        <div className="flex items-center justify-center px-8 max-w-7xl">
          <Tabs
            defaultValue="encode"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>

            {/* Encode Tab Content */}
            <TabsContent value="encode">
              <Card>
                <CardHeader>
                  <CardTitle>Encode Text</CardTitle>
                  <CardDescription>
                    Enter the plain text and the key to encode it. The key must
                    be the same length as the plain text.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-4"
                    onSubmit={handleSubmitEncode(onEncode)}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="plainText">Plain Text</Label>
                      <Textarea
                        id="plainText"
                        placeholder="Enter text to encode..."
                        className="uppercase"
                        defaultValue="ATTACK AT DAWN"
                        rows={6}
                        {...registerEncode("plainText")}
                      />
                      {encodeErrors.plainText && (
                        <p className="text-red-500">
                          {encodeErrors.plainText.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 pb-2">
                      <Label htmlFor="key">Key</Label>
                      <Input
                        id="key"
                        placeholder="Enter key..."
                        defaultValue="LEMON LEMON LE"
                        {...registerEncode("key")}
                      />
                      {encodeErrors.key && (
                        <p className="text-red-500">
                          {encodeErrors.key.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit">Encode</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Decode Tab Content */}
            <TabsContent value="decode">
              <Card>
                <CardHeader>
                  <CardTitle>Decode Text</CardTitle>
                  <CardDescription>
                    Enter the cipher text and the key to decode it. The key must
                    be the same length as the cipher text.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-4"
                    onSubmit={handleSubmitDecode(onDecode)}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="encodedText">Cipher Text</Label>
                      <Textarea
                        id="encodedText"
                        placeholder="Enter text to decode..."
                        className="uppercase"
                        defaultValue="LXFOPVEFRNHR"
                        rows={6}
                        {...registerDecode("encodedText")}
                      />
                      {decodeErrors.encodedText && (
                        <p className="text-red-500">
                          {decodeErrors.encodedText.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 pb-2">
                      <Label htmlFor="key">Key</Label>
                      <Input
                        id="key"
                        placeholder="Enter key..."
                        defaultValue="LEMON LEMON LE"
                        {...registerDecode("key")}
                      />
                      {decodeErrors.key && (
                        <p className="text-red-500">
                          {decodeErrors.key.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit">Decode</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle className="mb-2">Result</DialogTitle>
          <DialogDescription className="space-y-4">
            {encodedText && (
              <div className="space-y-4">
                <Label>Encoded Text</Label>
                <Textarea readOnly rows={8} value={encodedText} />
              </div>
            )}
            {decodedText && (
              <div className="space-y-4">
                <Label>Decoded Text</Label>
                <Textarea readOnly rows={8} value={decodedText} />
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
