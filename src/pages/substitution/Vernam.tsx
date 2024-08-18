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
  key: z.string().min(1, "Key is required"),
}).refine((data) => data.key.length >= data.plainText.length, {
  message: "Key must be at least as long as the plain text",
  path: ["key"],
});

const decodeSchema = z.object({
  cipherText: z.string().min(1, "Cipher text is required"),
  key: z.string().min(1, "Key is required"),
}).refine((data) => data.key.length >= data.cipherText.length, {
  message: "Key must be at least as long as the cipher text",
  path: ["key"],
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

const formatText = (text: string) => text.toUpperCase().replace(/[^A-Z]/g, "");

const formatKey = (key: string, length: number) => {
  key = formatText(key);
  let repeatedKey = key;
  while (repeatedKey.length < length) {
    repeatedKey += key;
  }
  return repeatedKey.slice(0, length);
};

const vigenereEncode = (text: string, key: string) => {
  const formattedText = formatText(text);
  const formattedKey = formatKey(key, formattedText.length);
  let encodedText = "";

  for (let i = 0; i < formattedText.length; i++) {
    const textChar = formattedText.charCodeAt(i) - 65; // 'A' = 65
    const keyChar = formattedKey.charCodeAt(i) - 65;
    const encodedChar = String.fromCharCode(((textChar + keyChar) % 26) + 65);
    encodedText += encodedChar;
  }

  return encodedText;
};

const vigenereDecode = (text: string, key: string) => {
  const formattedText = formatText(text);
  const formattedKey = formatKey(key, formattedText.length);
  let decodedText = "";

  for (let i = 0; i < formattedText.length; i++) {
    const textChar = formattedText.charCodeAt(i) - 65; // 'A' = 65
    const keyChar = formattedKey.charCodeAt(i) - 65;
    const decodedChar = String.fromCharCode(
      ((textChar - keyChar + 26) % 26) + 65
    );
    decodedText += decodedChar;
  }

  return decodedText;
};

export const Vernam = () => {
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

  const onEncode = (data: EncodeFormData) => {
    const encoded = vigenereEncode(data.plainText, data.key);
    setEncodedText(encoded);
    setIsDialogOpen(true);
  };

  const onDecode = (data: DecodeFormData) => {
    const decoded = vigenereDecode(data.cipherText, data.key);
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
            Vernam Cipher (One-Time Pad)
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Vernam Cipher, also known as the one-time pad, is a form of
            symmetric-key encryption that is renowned for its theoretical
            security. This cipher operates by combining each character of the
            plaintext with a corresponding character from a key of the same
            length using the XOR (exclusive OR) operation. This process
            transforms the plaintext into ciphertext, which appears as random
            data to anyone who intercepts it. For the Vernam Cipher to achieve
            perfect secrecy, the key must be as long as the plaintext and must
            be truly random, ensuring that each key is used only once.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Encoding with the Vernam Cipher involves the XOR operation between
            each character of the plaintext and the key. The result of this XOR
            operation is a ciphertext character. Since XOR is a reversible
            operation, the same procedure is used to decode the ciphertext back
            into the plaintext. This means that the decryption process is
            identical to encryption: XORing the ciphertext with the same key
            yields the original plaintext. This property makes the Vernam Cipher
            an example of a cipher where encryption and decryption are
            essentially the same process.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The primary challenge with the Vernam Cipher is the generation and
            distribution of the key. Since the key must be as long as the
            message and completely random, managing and securely distributing
            such keys can be impractical for many real-world applications.
            However, when used correctly, the Vernam Cipher provides an
            unbreakable encryption method, as long as the key is kept secret and
            used only once. This cipher’s security is mathematically proven,
            making it a cornerstone in the study of cryptographic systems.
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
                        defaultValue={"ATTACKATDAWN"}
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
                        type="text"
                        placeholder="Enter key..."
                        className="uppercase"
                        defaultValue={"LEMONLEMONLE"}
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
                      <Label htmlFor="cipherText">Cipher Text</Label>
                      <Textarea
                        id="cipherText"
                        placeholder="Enter text to decode..."
                        className="uppercase"
                        defaultValue={"LXFOPVEFRNHR"}
                        rows={6}
                        {...registerDecode("cipherText")}
                      />
                      {decodeErrors.cipherText && (
                        <p className="text-red-500">
                          {decodeErrors.cipherText.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 pb-2">
                      <Label htmlFor="key">Key</Label>
                      <Input
                        id="key"
                        type="text"
                        placeholder="Enter key..."
                        className="uppercase"
                        defaultValue={"LEMONLEMONLE"}
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
              <>
                <Label>Encoded Text</Label>
                <Textarea readOnly rows={8} value={encodedText} />
              </>
            )}
            {decodedText && (
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
