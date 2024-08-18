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
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

const encodeSchema = z.object({
  plainText: z.string().min(1, "Plain text is required"),
  encodeKey: z.string().min(1, "Key is required"),
});

const decodeSchema = z.object({
  cipherText: z.string().min(1, "Cipher text is required"),
  decodeKey: z.string().min(1, "Key is required"),
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

export const Vigenere = () => {
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
    const encoded = vigenereEncode(data.plainText, data.encodeKey);
    setEncodedText(encoded);
    setIsDialogOpen(true);
  };

  const onDecode = (data: DecodeFormData) => {
    const decoded = vigenereDecode(data.cipherText, data.decodeKey);
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
            Vigenère Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Vigenère Cipher, named after the French diplomat Blaise de
            Vigenère, is a method of encrypting text by using a series of
            different Caesar ciphers based on the letters of a keyword. Unlike
            the Caesar cipher, which uses a single shift value, the Vigenère
            cipher employs a polyalphabetic approach, where the shift for each
            letter in the plaintext is determined by the corresponding letter of
            the keyword.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            To understand how the Vigenère cipher works, imagine the alphabet
            written out in a 26x26 grid, where each row is a Caesar cipher with
            a different shift value, starting from 0 for 'A' up to 25 for 'Z'.
            The first letter of the plaintext is encrypted using the Caesar
            cipher row corresponding to the first letter of the keyword, the
            second letter of the plaintext is encrypted using the Caesar cipher
            row corresponding to the second letter of the keyword, and so on. If
            the keyword is shorter than the plaintext, it is repeated as many
            times as necessary to match the length of the plaintext.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            For example, if the plaintext is "ATTACKATDAWN" and the keyword is
            "LEMON", the first letter 'A' would be shifted by the position of
            'L' (which is 11 positions down the alphabet), 'T' would be shifted
            by the position of 'E' (which is 4 positions down), and so forth.
            The resulting ciphertext would be a seemingly random string of
            letters that is much more resistant to frequency analysis compared
            to the Caesar cipher.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Decrypting the Vigenère cipher involves reversing the process. If
            the recipient knows the keyword, they can apply the reverse shifts
            to the ciphertext, using the corresponding Caesar cipher for each
            letter of the keyword, to recover the original plaintext. Without
            the keyword, however, breaking the Vigenère cipher is much more
            challenging than breaking a Caesar cipher, particularly when longer
            and more complex keywords are used.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Vigenère cipher was once considered virtually unbreakable,
            earning it the nickname "le chiffre indéchiffrable" (French for "the
            indecipherable cipher"). It was not until the 19th century that the
            German cryptanalyst Friedrich Kasiski developed a method for
            breaking it by identifying the length of the keyword and using
            frequency analysis on the individual Caesar ciphers within it. This
            breakthrough marked the beginning of the decline in the cipher's
            practical use for secure communications.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Despite its historical significance, the Vigenère cipher is no
            longer considered secure for modern applications. However, it
            remains an important educational tool in the study of cryptography,
            illustrating the principles of polyalphabetic substitution and the
            evolution of encryption techniques. Understanding the Vigenère
            cipher provides a foundation for grasping more advanced encryption
            methods that build on its concepts to achieve greater security in
            the digital age.
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
                      <Label htmlFor="encodeKey">Key</Label>
                      <Input
                        id="encodeKey"
                        type="text"
                        placeholder="Enter key..."
                        className="uppercase"
                        defaultValue={"LEMON"}
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
                      <Label htmlFor="decodeKey">Key</Label>
                      <Input
                        id="decodeKey"
                        type="text"
                        placeholder="Enter key..."
                        className="uppercase"
                        defaultValue={"LEMON"}
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
