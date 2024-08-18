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

const encodeSchema = z.object({
  plainText: z.string().min(1, "Plain text is required"),
  encodeKey: z.string().length(26, "Key must be exactly 26 characters"),
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  decodeKey: z.string().length(26, "Key must be exactly 26 characters"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const Monoalphabetic = () => {
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
    const encoded = monoalphabeticEncode(
      data.plainText.toUpperCase(),
      data.encodeKey.toUpperCase()
    );
    setEncodedText(encoded);
    setIsDialogOpen(true);
  };

  const onDecode = (data: DecodeFormData) => {
    const decoded = monoalphabeticDecode(
      data.encodedText.toUpperCase(),
      data.decodeKey.toUpperCase()
    );
    setDecodedText(decoded);
    setIsDialogOpen(true);
  };

  const monoalphabeticEncode = (text: string, key: string) => {
    return text
      .split("")
      .map((char) => {
        const index = ALPHABET.indexOf(char);
        return index !== -1 ? key[index] : char;
      })
      .join("");
  };

  const monoalphabeticDecode = (text: string, key: string) => {
    return text
      .split("")
      .map((char) => {
        const index = key.indexOf(char);
        return index !== -1 ? ALPHABET[index] : char;
      })
      .join("");
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
            Monoalphabetic Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Monoalphabetic Cipher is a type of substitution cipher in which
            each letter of the plaintext is replaced with a corresponding letter
            from a fixed, scrambled version of the alphabet. Unlike the Caesar
            Cipher, which shifts the alphabet uniformly by a fixed number of
            positions, the Monoalphabetic Cipher allows any permutation of the
            alphabet, leading to a significantly larger number of possible keys.
            This makes it more resistant to brute-force attacks, but it remains
            vulnerable to frequency analysis.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            To understand the Monoalphabetic Cipher, imagine the standard
            alphabet as a key and a scrambled version of the alphabet as the
            cipher key. For example, if the standard alphabet is
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" and the cipher key is
            "QWERTYUIOPASDFGHJKLZXCVBNM", then the letter "A" in the plaintext
            would be replaced by "Q", "B" by "W", "C" by "E", and so on. Each
            letter in the plaintext is substituted with its corresponding letter
            from the cipher key, resulting in the encrypted text.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Decryption with a Monoalphabetic Cipher is straightforward if the
            cipher key is known. The process is simply reversed: the encrypted
            text is substituted with the original letters from the standard
            alphabet using the cipher key. Without the cipher key, however,
            decrypting the message becomes much more challenging. Since there
            are 26! (26 factorial) possible permutations of the alphabet, which
            equals approximately 4x10<sup>26</sup> possible keys, the
            brute-force approach is impractical.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            However, the Monoalphabetic Cipher's simplicity is also its
            weakness. Because each letter in the plaintext is consistently
            replaced by the same letter in the ciphertext, patterns in the text,
            such as letter frequency, are preserved. This makes the cipher
            vulnerable to frequency analysis, a method where the frequency of
            letters in the ciphertext is compared to known frequency
            distributions in the language of the plaintext. By analyzing the
            most common letters, digraphs, and trigraphs in the ciphertext, an
            attacker can often deduce the cipher key and decrypt the message
            without knowing it directly.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Historically, the Monoalphabetic Cipher was widely used before the
            advent of more complex encryption techniques. It represents a
            significant step in the evolution of cryptography, as it
            demonstrates the power of substitution ciphers while also
            highlighting their limitations. Despite its vulnerabilities, the
            Monoalphabetic Cipher remains a valuable educational tool for
            introducing concepts such as key permutation, encryption, and
            decryption.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            In modern cryptography, the Monoalphabetic Cipher is largely
            obsolete, having been replaced by more secure algorithms that avoid
            the pitfalls of simple substitution. Nevertheless, it provides an
            essential foundation for understanding the development of
            cryptographic methods and the ongoing quest to secure communication
            in an increasingly interconnected world.
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
                        placeholder="Enter text to encode..."
                        className="uppercase"
                        defaultValue={"ATTACK AT DAWN"}
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
                      <Label htmlFor="encodeKey">Key (26 unique letters)</Label>
                      <Input
                        id="encodeKey"
                        type="text"
                        placeholder="Enter 26-letter key..."
                        className="uppercase"
                        defaultValue={"BMORDIKQJGNSVPYWCTAHZUXFEL"}
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
                        placeholder="Enter text to decode..."
                        className="uppercase"
                        defaultValue={"BHHBON BH RBXP"}
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
                      <Label htmlFor="decodeKey">Key (26 unique letters)</Label>
                      <Input
                        id="decodeKey"
                        type="text"
                        placeholder="Enter 26-letter key..."
                        className="uppercase"
                        defaultValue={"BMORDIKQJGNSVPYWCTAHZUXFEL"}
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
