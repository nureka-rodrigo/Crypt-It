import { z } from "zod";
import Navbar from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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

const prepareMatrix = (key: string) => {
  const keyString = formatText(key);
  const matrix: string[] = [];
  const used = new Set<string>();

  for (const char of keyString) {
    if (!used.has(char) && char !== "J") {
      matrix.push(char);
      used.add(char);
    }
  }

  for (let charCode = 65; charCode <= 90; charCode++) {
    const char = String.fromCharCode(charCode);
    if (!used.has(char) && char !== "J") {
      matrix.push(char);
    }
  }

  return matrix;
};

const createBigrams = (text: string) => {
  const formattedText = formatText(text);
  const bigrams: string[] = [];
  for (let i = 0; i < formattedText.length; i += 2) {
    let pair = formattedText[i];
    if (i + 1 < formattedText.length) {
      pair += formattedText[i + 1];
    } else {
      pair += "X";
    }
    bigrams.push(pair);
  }
  return bigrams;
};

const findPosition = (char: string, matrix: string[]) => {
  const index = matrix.indexOf(char);
  return { row: Math.floor(index / 5), col: index % 5 };
};

const playfairEncode = (text: string, key: string) => {
  const matrix = prepareMatrix(key);
  const bigrams = createBigrams(text);
  const encoded: string[] = [];

  for (const [a, b] of bigrams.map((pair) => [pair[0], pair[1]])) {
    const { row: rowA, col: colA } = findPosition(a, matrix);
    const { row: rowB, col: colB } = findPosition(b, matrix);

    if (rowA === rowB) {
      encoded.push(matrix[rowA * 5 + ((colA + 1) % 5)]);
      encoded.push(matrix[rowB * 5 + ((colB + 1) % 5)]);
    } else if (colA === colB) {
      encoded.push(matrix[((rowA + 1) % 5) * 5 + colA]);
      encoded.push(matrix[((rowB + 1) % 5) * 5 + colB]);
    } else {
      encoded.push(matrix[rowA * 5 + colB]);
      encoded.push(matrix[rowB * 5 + colA]);
    }
  }

  return encoded.join("");
};

const playfairDecode = (text: string, key: string) => {
  const matrix = prepareMatrix(key);
  const bigrams = createBigrams(text);
  const decoded: string[] = [];

  for (const [a, b] of bigrams.map((pair) => [pair[0], pair[1]])) {
    const { row: rowA, col: colA } = findPosition(a, matrix);
    const { row: rowB, col: colB } = findPosition(b, matrix);

    if (rowA === rowB) {
      decoded.push(matrix[rowA * 5 + ((colA + 4) % 5)]);
      decoded.push(matrix[rowB * 5 + ((colB + 4) % 5)]);
    } else if (colA === colB) {
      decoded.push(matrix[((rowA + 4) % 5) * 5 + colA]);
      decoded.push(matrix[((rowB + 4) % 5) * 5 + colB]);
    } else {
      decoded.push(matrix[rowA * 5 + colB]);
      decoded.push(matrix[rowB * 5 + colA]);
    }
  }

  return decoded.join("").replace(/X+$/, "");
};

export const Playfair = () => {
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [playfairMatrix, setPlayfairMatrix] = useState<string[]>([]);
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
    const matrix = prepareMatrix(data.encodeKey);
    setPlayfairMatrix(matrix);
    const encoded = playfairEncode(data.plainText, data.encodeKey);
    setEncodedText(encoded);
    setIsDialogOpen(true);
  };

  const onDecode = (data: DecodeFormData) => {
    const matrix = prepareMatrix(data.decodeKey);
    setPlayfairMatrix(matrix);
    const decoded = playfairDecode(data.cipherText, data.decodeKey);
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

  const renderMatrix = () => {
    if (playfairMatrix.length === 0) return null;
    return (
      <div>
        <h2 className="font-semibold text-sm text-neutral-950 dark:text-neutral-50 mb-4">
          Playfair Square
        </h2>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {playfairMatrix.map((char, index) => (
            <div
              key={index}
              className="p-4 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-neutral-50 flex items-center justify-center font-mono text-lg"
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Playfair Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Playfair Cipher is a digraph substitution cipher, which means
            that it encrypts pairs of letters (bigrams) rather than individual
            letters. Developed by Charles Wheatstone in 1854 and named after
            Lord Playfair, the cipher is designed to improve upon simple
            substitution ciphers by reducing the frequency of letter repetition,
            which makes it more resistant to frequency analysis.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            To use the Playfair Cipher, you first need to prepare a 5x5 matrix
            of letters based on a keyword. This matrix excludes duplicate
            letters and often combines 'I' and 'J' into a single letter to fit
            the 25-letter constraint.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Once the matrix is prepared, the encryption process begins by
            splitting the plaintext into digraphs (pairs of letters). If there
            are duplicate letters within a pair, they are separated by adding an
            extra letter (commonly 'X'). If the plaintext length is odd, it is
            padded with an extra letter. For example, "HELLO WORLD" becomes "HE
            LX LO WO RL DX" for encoding.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Each pair of letters is then encrypted according to the following
            rules:
            <ul className="list-disc pl-6">
              <li>
                <strong>Same Row:</strong> If both letters are in the same row,
                each letter is replaced by the letter immediately to its right.
                If a letter is the last one in the row, it wraps around to the
                beginning of the row.
              </li>
              <li>
                <strong>Same Column:</strong> If both letters are in the same
                column, each letter is replaced by the letter immediately below
                it. If a letter is at the bottom of the column, it wraps around
                to the top.
              </li>
              <li>
                <strong>Rectangle:</strong> If the letters form a rectangle,
                each letter is replaced by the letter in its own row but in the
                column of the other letter of the pair.
              </li>
            </ul>
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Decryption with the Playfair Cipher is a straightforward reversal of
            the encryption process. The digraphs are decrypted using the same
            rules but in reverse.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            While the Playfair Cipher improves upon simple substitution ciphers
            by encrypting pairs of letters and reducing the frequency of letter
            repetition, it is still vulnerable to more advanced cryptanalytic
            techniques. Modern cryptographic methods have largely replaced the
            Playfair Cipher with more secure algorithms, but it remains an
            important historical cipher and a valuable educational tool for
            understanding the evolution of encryption methods.
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
                        defaultValue={
                          "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG."
                        }
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
                        defaultValue={"KEYWORD"}
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
                        defaultValue={"PDGLXEDEDANVOGAVEXOLPAUFDZCFSMWDHRIW"}
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
                        defaultValue={"KEYWORD"}
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
            {renderMatrix()}

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
