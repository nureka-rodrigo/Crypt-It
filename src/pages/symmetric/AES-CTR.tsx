import { z } from "zod";
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
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { toast } from "sonner";

const encodeSchema = z.object({
  plainText: z.string().min(1, "Plain text is required"),
  encodeKey: z
    .string()
    .min(1, "Key is required")
    .refine((key) => key.length === 16, {
      message: "Key must be 16 characters long",
    }),
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  decodeKey: z
    .string()
    .min(1, "Key is required")
    .refine((key) => key.length === 16, {
      message: "Key must be 16 characters long",
    }),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

export const AESCTR = () => {
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

  const importKey = async (keyStr: string) => {
    const keyData = new TextEncoder().encode(keyStr);
    return await window.crypto.subtle.importKey(
      "raw",
      keyData,
      "AES-CTR",
      false,
      ["encrypt", "decrypt"]
    );
  };

  const AESEncode = async (plainText: string, keyStr: string) => {
    const key = await importKey(keyStr);
    const counter = window.crypto.getRandomValues(new Uint8Array(16));
    const encodedMessage = new TextEncoder().encode(plainText);

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-CTR",
        counter,
        length: 64,
      },
      key,
      encodedMessage
    );

    return {
      cipherText: btoa(
        String.fromCharCode(...new Uint8Array(encryptedContent))
      ),
      counter: btoa(String.fromCharCode(...counter)),
    };
  };

  const AESDecode = async (
    cipherText: string,
    keyStr: string,
    counterStr: string
  ) => {
    const key = await importKey(keyStr);
    const counter = Uint8Array.from(atob(counterStr), (c) => c.charCodeAt(0));
    const encryptedContent = Uint8Array.from(atob(cipherText), (c) =>
      c.charCodeAt(0)
    );

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-CTR",
        counter,
        length: 64,
      },
      key,
      encryptedContent
    );

    return new TextDecoder().decode(decryptedContent);
  };

  const onEncode = async (data: EncodeFormData) => {
    try {
      const { cipherText, counter } = await AESEncode(
        data.plainText,
        data.encodeKey
      );
      setEncodedText(`${cipherText}::${counter}`);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = async (data: DecodeFormData) => {
    try {
      const [cipherText, counter] = data.encodedText.split("::");
      if (!cipherText || !counter) {
        toast.error("Invalid cipher text format.");
        return;
      }
      const decoded = await AESDecode(cipherText, data.decodeKey, counter);
      setDecodedText(decoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error decoding text.");
      throw error;
    }
  };

  useEffect(() => {
    if (activeTab === "encode") {
      setDecodedText("");
    } else {
      setEncodedText("");
    }
  }, [activeTab]);

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col justify-between">
        <div className="max-w-7xl py-8 space-y-8 mx-auto">
          <div className="container mx-auto">
            <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              AES-CTR Cipher
            </h1>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
              The Advanced Encryption Standard in Counter mode (AES-CTR) is a
              powerful and flexible encryption method used to secure data.
              Unlike traditional block ciphers that operate on fixed-size blocks
              of data, AES-CTR transforms AES into a stream cipher, allowing for
              more efficient and flexible encryption of data of arbitrary
              length.
            </p>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
              In AES-CTR, a unique counter value is combined with a secret key
              to produce a stream of pseudo-random data, which is then XORed
              with the plaintext to produce the ciphertext. The same process,
              using the same counter and key, can be reversed to decrypt the
              ciphertext back into the original plaintext. The counter ensures
              that even identical blocks of plaintext produce different
              ciphertexts, enhancing security.
            </p>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
              AES-CTR is widely used in various applications due to its speed
              and simplicity. It does not require padding, and its parallelize
              nature makes it suitable for high-performance scenarios. However,
              it's crucial to manage the counter correctly, ensuring it is
              unique for each encryption operation to maintain security.
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
                      Enter the plain text and the key to encode it.
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
                          rows={6}
                          placeholder="Enter text to encode..."
                          defaultValue="ATTACK AT DAWN"
                          {...registerEncode("plainText")}
                        />
                        {encodeErrors.plainText && (
                          <p className="text-red-500">
                            {encodeErrors.plainText.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 pb-2">
                        <Label htmlFor="encodeKey">Key</Label>
                        <Input
                          id="encodeKey"
                          type="text"
                          placeholder="Enter 32-character key..."
                          defaultValue="LEMONLEMONLEMONL"
                          {...registerEncode("encodeKey")}
                        />
                        {encodeErrors.encodeKey && (
                          <p className="text-red-500">
                            {encodeErrors.encodeKey.message}
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
                      Enter the cipher text and the key to decode it.
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
                          rows={6}
                          placeholder="Enter text to decode..."
                          defaultValue="o8JT/jwDxFb1q8fUwC0=::+qoUwTZdf7f9Oo++Un0Dxg=="
                          {...registerDecode("encodedText")}
                        />
                        {decodeErrors.encodedText && (
                          <p className="text-red-500">
                            {decodeErrors.encodedText.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 pb-2">
                        <Label htmlFor="decodeKey">Key</Label>
                        <Input
                          id="decodeKey"
                          type="text"
                          placeholder="Enter 32-character key..."
                          defaultValue="LEMONLEMONLEMONL"
                          {...registerDecode("decodeKey")}
                        />
                        {decodeErrors.decodeKey && (
                          <p className="text-red-500">
                            {decodeErrors.decodeKey.message}
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
        </div>

        <Footer />
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle className="mb-2">Result</DialogTitle>
          <DialogDescription className="space-y-4">
            {activeTab === "encode" ? (
              <>
                <Label>Encoded Text</Label>
                <Textarea readOnly rows={8} value={encodedText} />
              </>
            ) : (
              <>
                <Label>Decoded Text</Label>
                <Textarea readOnly rows={8} value={decodedText} />
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
