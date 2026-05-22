import { z } from "zod";
import { CipherPageLayout } from "@/components/layout/CipherPageLayout.tsx";
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
    try {
      const matrix = prepareMatrix(data.encodeKey);
      setPlayfairMatrix(matrix);
      const encoded = playfairEncode(data.plainText, data.encodeKey);
      setEncodedText(encoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = (data: DecodeFormData) => {
    try {
      const matrix = prepareMatrix(data.decodeKey);
      setPlayfairMatrix(matrix);
      const decoded = playfairDecode(data.cipherText, data.decodeKey);
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

  const renderMatrix = () => {
    if (playfairMatrix.length === 0) return null;
    return (
      <div className="pb-4">
        <h2 className="mb-4 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
          Playfair Matrix
        </h2>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {playfairMatrix.map((char, index) => (
            <div
              key={index}
              className="flex items-center justify-center border border-neutral-300 p-4 font-mono text-lg text-neutral-950 dark:border-neutral-700 dark:text-neutral-50"
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <CipherPageLayout
      category="Substitution"
      categoryHref="/substitution/playfair"
      title="Playfair Cipher"
      description={
        <>
          <p>
            The Playfair cipher encrypts pairs of letters (digraphs) rather than
            single characters, making simple frequency analysis significantly
            harder. A 5×5 matrix is built from a keyword — unused letters fill the
            remaining cells in order, with I and J sharing one cell.
          </p>
          <p>
            Each digraph is encrypted by one of three rules: same row, same
            column, or opposite corners of a rectangle. Invented by Charles
            Wheatstone in 1854 and used by British forces in World War I, Playfair
            was the first practical digraphic substitution cipher.
          </p>
        </>
      }
    >
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
                    defaultValue={"DQQDDIDQFBZE"}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle className="mb-2">Result</DialogTitle>
          <DialogDescription className="space-y-4">
            {renderMatrix()}
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
    </CipherPageLayout>
  );
};
