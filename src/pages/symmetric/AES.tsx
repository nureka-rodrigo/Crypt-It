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
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { AES, enc } from "crypto-ts";

const encodeSchema = z.object({
  plainText: z.string().min(1, "Plain text is required"),
  encodeKey: z.string().min(1, "Key is required"),
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  decodeKey: z.string().min(1, "Key is required"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

export const AesCipher = () => {
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

  const AESEncode = (hexText: string, hexKey: string) => {
    const encrypted = AES.encrypt(hexText, hexKey);
    return encrypted.toString();
  };

  const AESDecode = (hexText: string, hexKey: string) => {
    const decrypted = AES.decrypt(hexText, hexKey);
    return decrypted.toString(enc.Utf8);
  };

  const onEncode = (data: EncodeFormData) => {
    const encoded = AESEncode(data.plainText, data.encodeKey);
    setEncodedText(encoded);
    setIsDialogOpen(true);
  };

  const onDecode = (data: DecodeFormData) => {
    const decoded = AESDecode(data.encodedText, data.decodeKey);
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
            AES Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Advanced Encryption Standard (AES) is a widely adopted symmetric
            encryption algorithm used to secure data. AES was established by the
            National Institute of Standards and Technology (NIST) in 2001,
            following a comprehensive evaluation process to select a robust
            encryption method for government and civilian use. The algorithm is
            designed to replace the aging Data Encryption Standard (DES) and
            offers stronger security and efficiency.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            AES operates on blocks of data, where each block is 128 bits in
            size. It employs a series of transformations and substitutions to
            encrypt plaintext into ciphertext. The algorithm supports three key
            sizes: 128, 192, and 256 bits. These key sizes determine the
            strength of the encryption, with longer keys providing higher levels
            of security. AES uses a series of rounds—10 rounds for 128-bit keys,
            12 rounds for 192-bit keys, and 14 rounds for 256-bit keys—to
            perform the encryption and decryption processes.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            During encryption, AES transforms the input data using a combination
            of substitution (replacing bytes with different values), permutation
            (shuffling bits around), and mixing operations. This process ensures
            that the relationship between the plaintext and ciphertext is
            obscured, making it extremely difficult for unauthorized parties to
            decipher the encrypted data without the correct key. AES is designed
            to be highly secure against various forms of cryptographic attacks,
            including brute-force and differential cryptanalysis.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            AES is used globally in numerous applications and systems to protect
            sensitive information. It is employed in secure communications, data
            storage, and financial transactions. Its efficiency and strength
            make it a preferred choice for encryption in modern security
            protocols, including SSL/TLS for secure web traffic and various VPN
            implementations. AES's versatility and robustness ensure that it
            continues to be a cornerstone of data security across a wide range
            of industries.
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
                        defaultValue="LEMON"
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
                        defaultValue="U2FsdGVkX19mq14NXZGk7LD8XZIoUMFT4xIoFhGMf0k="
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
                        defaultValue="LEMON"
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
            {encodedText && (
              <>
                <Label>Encoded Text</Label>
                <Textarea readOnly rows={8} value={encodedText}/>
              </>
            )}
            {decodedText && (
              <>
                <Label>Decoded Text</Label>
                <Textarea readOnly rows={8} value={decodedText}/>
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
