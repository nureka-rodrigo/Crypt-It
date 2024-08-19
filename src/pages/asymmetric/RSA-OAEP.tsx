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
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  privateKey: z.string().min(1, "Private key is required"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

export const RSAOAEP = () => {
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("encode");
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);
  const [publicKeyString, setPublicKeyString] = useState("");
  const [privateKeyString, setPrivateKeyString] = useState("");

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

  useEffect(() => {
    const generateKeyPair = async () => {
      try {
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
          },
          true,
          ["encrypt", "decrypt"]
        );
        setPublicKey(keyPair.publicKey);

        const publicKeyString = await window.crypto.subtle.exportKey(
          "spki",
          keyPair.publicKey
        );
        const privateKeyString = await window.crypto.subtle.exportKey(
          "pkcs8",
          keyPair.privateKey
        );

        setPublicKeyString(
          btoa(String.fromCharCode(...new Uint8Array(publicKeyString)))
        );
        setPrivateKeyString(
          btoa(String.fromCharCode(...new Uint8Array(privateKeyString)))
        );
      } catch (error) {
        toast.error("Failed to generate key pair.");
        throw error;
      }
    };

    generateKeyPair().then((r) => r);
  }, []);

  const RSAEncrypt = async (plainText: string, publicKey: CryptoKey) => {
    try {
      const encodedMessage = new TextEncoder().encode(plainText);

      const encryptedContent = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        encodedMessage
      );

      return btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));
    } catch (error) {
      toast.error("Encryption failed.");
      throw error;
    }
  };

  const RSADecrypt = async (cipherText: string, privateKeyString: string) => {
    try {
      const privateKeyBuffer = Uint8Array.from(atob(privateKeyString), (c) =>
        c.charCodeAt(0)
      );
      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      );

      const encryptedContent = Uint8Array.from(atob(cipherText), (c) =>
        c.charCodeAt(0)
      );

      const decryptedContent = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        encryptedContent.buffer
      );

      return new TextDecoder().decode(decryptedContent);
    } catch (error) {
      toast.error("Decryption failed.");
      throw error;
    }
  };

  const onEncode = async (data: EncodeFormData) => {
    try {
      if (publicKey) {
        const cipherText = await RSAEncrypt(data.plainText, publicKey);
        setEncodedText(cipherText);
        setIsDialogOpen(true);
      }
    } catch (error) {
      toast.error("Encoding failed.");
      throw error;
    }
  };

  const onDecode = async (data: DecodeFormData) => {
    try {
      const decoded = await RSADecrypt(data.encodedText, data.privateKey);
      setDecodedText(decoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Decoding failed.");
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
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            RSA-OAEP Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            RSA-OAEP (Optimal Asymmetric Encryption Padding) is a widely used
            public-key encryption scheme that combines the RSA algorithm with
            OAEP padding to enhance security. RSA-OAEP allows for secure
            encryption and decryption of data using a pair of keys: a public key
            for encryption and a private key for decryption.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            In RSA-OAEP, the plaintext message is padded with random data before
            encryption, making it more resistant to certain types of attacks.
            The encrypted message can only be decrypted by the corresponding
            private key, ensuring the confidentiality of the data.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            RSA-OAEP's padding mechanism is crucial for enhancing security. By
            padding the message with random data, it becomes more difficult for
            attackers to perform cryptographic analysis and gain insights into
            the original plaintext. This padding method is what makes RSA-OAEP
            more secure compared to basic RSA encryption, which is vulnerable to
            certain types of attacks, such as chosen ciphertext attacks.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            One of the key strengths of RSA-OAEP is its ability to secure
            sensitive information, making it a popular choice in various
            applications, including secure communications, digital signatures,
            and data encryption for storage. RSA-OAEP is commonly used in
            scenarios where data must be securely transmitted over untrusted
            networks or when stored data needs to be protected against
            unauthorized access.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Despite its strengths, RSA-OAEP is not without limitations. Due to
            the nature of the RSA algorithm, the size of the data that can be
            encrypted is limited by the key size. Therefore, RSA-OAEP is often
            used to encrypt smaller pieces of data, such as keys for symmetric
            encryption algorithms like AES, rather than large data files
            directly.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Another consideration is performance. RSA-OAEP, being an asymmetric
            encryption method, is computationally intensive compared to
            symmetric encryption algorithms. As a result, it is usually employed
            in hybrid encryption schemes, where RSA-OAEP is used to securely
            exchange a symmetric key, which is then used to encrypt and decrypt
            the actual data.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            In practice, RSA-OAEP is implemented in many modern cryptographic
            protocols, including TLS (Transport Layer Security), which secures
            internet communications. Its robust security features make it an
            essential tool in protecting sensitive information in today's
            digital world.
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
                    Enter the plain text to encode it using RSA-OAEP.
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
                    Enter the cipher text and private key to decode it using
                    RSA-OAEP.
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
                        defaultValue="aJgrpBbCoyGMho3PVI3Z3SH5bBDJJYy7WpRzSqwggNBGrBdbD+WwON7xi/sqlYjHL28JCtZLkstuz+UvXOc3Js5xavwaTcK/Ml9vtFBsZyTj2S/1A4knTQayFOTJOWRbEdvcXuy7TcQN8RxLZvtgW1ZQetyPK2Evq8CDCK2PxEgEJalY6AEq52fm//Fkr+sSLI/cW0Dhe8KjUuVz7XDJ6OumrOQ0gOlr1JEsX88mE5Zi8VurST4YSsmoPyA+aJj0FLjjrwI4n2cFCh1ERJ5iAkUrYricXZZekX9l4sxP15jNkyFa0VhgxOlVGgGKLlaxDlc5uDcN4hKkoAgx6RD7BQ=="
                        {...registerDecode("encodedText")}
                      />
                      {decodeErrors.encodedText && (
                        <p className="text-red-500">
                          {decodeErrors.encodedText.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privateKey">Private Key</Label>
                      <Textarea
                        id="privateKey"
                        rows={6}
                        placeholder="Enter private key..."
                        defaultValue="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDObNMbVTiFCl719EoypWTrazvCWtG+ZfSbJAOntuzIDGZ3iVuOkIKBsbt7vs1koEYltV3oE1kC9dZmfRIw7aWmRJEKsnxIk1aHj4TVcSPmHNgnwrOxqhGLK3O4Jfkj6usgkTfnCqfOXY8Ys6dWFSax0Lm1r6HtB0qkhIjbhYcG2pgB6cs3/FWq3MHlgGvOkUO/gLLiWrmwOm0aKtbhoGyLHNhAP/QIvFswPPGaEq88W1syQ3iQD9D8DYAVu3r1aegCL0bB9wSwtNx0h1sDWeFeCE2g1Lvvg6amEzayo8SK06MDA6XImwbSG7GMTmy9v4aD4A+Rp1pfKJucSnNY9k5NAgMBAAECggEADoYDmGG3l0yyf7WPXt7aKeIikzsWlMHRovS2uR8aq7yLnQ9x/KbYN83MdhlnlBPeu5p2H/T0h0vKqO1V0VF3HSqn1cvXCLgtF16WpvnN38vZvXpqcC6aC2OkQamSTN+jaWguObg7ND7K6Z8CQAE+9rXLyyevSeEAdHDKvD85z9aC+AnOk2O5dFnRz6Y6lhQUyBxA8V1uTBThu2Lm6OTdmkPfRly1mySh4boOX2E8Jm/xvalArYI4yJGDVNhZiJtz38ebJQQsr5d9jDGnObEOOlUq2DzEYQJvp2uEXRQDEi5CPS4/6bcBGXv3SF4gtUWaPm1GskJJnjU8tZO2WruDgQKBgQD4LVkcRYm5Y40l2U/JsuOC3o2Gt6MR/XcjvNgEmKMagsYeuchSNP/V3b87hnCaMQQ46fqt4c+W/jNLKM+PrEs/HRYsFRdDbq3qdMxWt5XTmEB3gI5Ttn7h4KDaD8YNmRZYxpYeM4hJNDTNkwprWzb+SV2nLdIfe8N0rVqKGS6m4QKBgQDU7o+J9dFV0fu18vtghct2ziB5MYaKBcEhtXQBbrMecqHP/2Oz0tW5qDdrC7c0py2YcxcVQakWI0GIrzOhDv3gZsPGavRstv8qM722xY9QmK1JzlmVJnxD3Po62OvO6wDVdE8LVPPwDowS3nuFRt4PFWTA6enHb5b1JIulmg/Q7QKBgE/F8+DckVqgH1zNL5J8CBmnBAMLwEUmHkfEigNgNP1uj9SMj1Gta5cJQlEV89f8bYkF3OhLr3ivmTlNkvpxvXY6GUhuNx4b05eLl6tAM87iH8bJ8fYCsWJV3B5794Ojc8VxgAuRMPum5lo2K6E6nsC6QHpehi5MkBVPK808LvzBAoGAY8tG1JazvHAEc1rku3EZUZ37lDFE580Yne7H5p/2LM/2zF/aX33xkuimyHGeNHwhn3BZIio6z9hIL4JFRTecfp5LJOQdmBIP9rx3LoDa0SAtHwkp7QAzfy7Cy++8XKbBJkkzfpEbHqgCuBkzdNwo2JLjPJKkcUb4Tf4JwNw6i2UCgYEAi48l5M+/QJpz8JKZWfND+3Aue8HaJ9sbuUQ7LZGH9Ibb04er7jHEapIj3wg345P0pbgTdpfn/V7grGQPwy3Qy43b/GW019rGSYzfZrJbvIIMT2KWUBowgMR06Z5pKkFaQ+U9nWd9Wi5xZkrQyMmIKZZDSvU5fgr0vhfsR7pc8LE="
                        {...registerDecode("privateKey")}
                      />
                      {decodeErrors.privateKey && (
                        <p className="text-red-500">
                          {decodeErrors.privateKey.message}
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
                <Label>Public Key</Label>
                <Textarea readOnly rows={8} value={publicKeyString} />
                <Label>Private Key</Label>
                <Textarea readOnly rows={8} value={privateKeyString} />
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
