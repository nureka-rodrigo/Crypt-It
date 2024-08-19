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

export const AESCBC = () => {
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
      "AES-CBC",
      false,
      ["encrypt", "decrypt"]
    );
  };

  const AESEncode = async (plainText: string, keyStr: string) => {
    const key = await importKey(keyStr);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const encodedMessage = new TextEncoder().encode(plainText);

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv,
      },
      key,
      encodedMessage
    );

    return {
      cipherText: btoa(
        String.fromCharCode(...new Uint8Array(encryptedContent))
      ),
      iv: btoa(String.fromCharCode(...iv)),
    };
  };

  const AESDecode = async (
    cipherText: string,
    keyStr: string,
    ivStr: string
  ) => {
    const key = await importKey(keyStr);
    const iv = Uint8Array.from(atob(ivStr), (c) => c.charCodeAt(0));
    const encryptedContent = Uint8Array.from(atob(cipherText), (c) =>
      c.charCodeAt(0)
    );

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv,
      },
      key,
      encryptedContent
    );

    return new TextDecoder().decode(decryptedContent);
  };

  const onEncode = async (data: EncodeFormData) => {
    const { cipherText, iv } = await AESEncode(data.plainText, data.encodeKey);
    setEncodedText(`${cipherText}::${iv}`);
    setIsDialogOpen(true);
  };

  const onDecode = async (data: DecodeFormData) => {
    const [cipherText, iv] = data.encodedText.split("::");
    if (!cipherText || !iv) {
      alert("Invalid cipher text format.");
      return;
    }
    const decoded = await AESDecode(cipherText, data.decodeKey, iv);
    setDecodedText(decoded);
    setIsDialogOpen(true);
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
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            AES-CBC Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Advanced Encryption Standard in Cipher Block Chaining mode
            (AES-CBC) is a widely used encryption method that provides a high
            level of security. Unlike AES-CTR, which transforms AES into a
            stream cipher, AES-CBC operates on fixed-size blocks of data. Each
            block of plaintext is XORed with the previous ciphertext block
            before being encrypted, creating a strong dependency between blocks.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            In AES-CBC, an initialization vector (IV) is used in the first block
            to ensure that even identical plaintexts result in different
            ciphertexts, enhancing security. The IV must be unique for each
            encryption operation but does not need to be secret.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            AES-CBC is highly secure and is used in various applications, from
            securing communication channels to encrypting files. However, it is
            crucial to manage the IV correctly, as reusing an IV with the same
            key can compromise security.
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
                        defaultValue="XQ9YRUF3xH7DvX5sSs2X+Q==::00CvrFxWdalotuAjg8ceig=="
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
      </section>
      <Footer />

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
