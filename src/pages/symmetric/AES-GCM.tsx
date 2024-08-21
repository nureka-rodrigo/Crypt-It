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

export const AESGCM = () => {
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
      "AES-GCM",
      false,
      ["encrypt", "decrypt"]
    );
  };

  const AESEncode = async (plainText: string, keyStr: string) => {
    const key = await importKey(keyStr);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedMessage = new TextEncoder().encode(plainText);

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
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
        name: "AES-GCM",
        iv,
      },
      key,
      encryptedContent
    );

    return new TextDecoder().decode(decryptedContent);
  };

  const onEncode = async (data: EncodeFormData) => {
    try {
      const { cipherText, iv } = await AESEncode(
        data.plainText,
        data.encodeKey
      );
      setEncodedText(`${cipherText}::${iv}`);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = async (data: DecodeFormData) => {
    try {
      const [cipherText, iv] = data.encodedText.split("::");
      if (!cipherText || !iv) {
        toast.error("Invalid cipher text format.");
        return;
      }
      const decoded = await AESDecode(cipherText, data.decodeKey, iv);
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
              AES-GCM Cipher
            </h1>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
              The Advanced Encryption Standard in Galois/Counter Mode (AES-GCM)
              is a highly secure and efficient encryption method that combines
              the AES block cipher with Galois field multiplication for message
              authentication. AES-GCM is widely used in modern cryptographic
              applications due to its strong security guarantees and
              performance.
            </p>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
              In AES-GCM, the encryption and authentication processes are
              combined into a single operation, which ensures data
              confidentiality and integrity. The mode generates a unique
              authentication tag for each message, providing additional security
              against tampering.
            </p>
            <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
              AES-GCM is highly efficient and can be parallelized, making it
              suitable for high-performance applications such as secure
              communications and data storage. The initialization vector (IV)
              used in AES-GCM must be unique for each encryption operation to
              ensure security.
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
                          defaultValue="fPLz0EjgWb2UxhBh1haZUp5+inGPgyaScUIdk+9u::eTqPEWXv+uiYK7Tt"
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
