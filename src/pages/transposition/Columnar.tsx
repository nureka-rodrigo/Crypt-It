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
  encodeKey: z
    .string()
    .regex(/^\d+$/, "Key must be an integer")
    .min(1, "Key is required")
    .refine((key) => key.includes("1"), "Key must contain the digit 1")
    .refine((key) => {
      const digits = key.split("").map(Number);
      const minDigit = Math.min(...digits);
      const maxDigit = Math.max(...digits);
      const digitSet = new Set(digits);

      for (let i = minDigit; i <= maxDigit; i++) {
        if (!digitSet.has(i)) {
          return false;
        }
      }

      return true;
    }, "Key must contain all numbers between the minimum and maximum digits")
    .refine((key) => {
      const digitSet = new Set(key.split(""));
      return digitSet.size === key.length;
    }, "Key must have unique digits"),
});

const decodeSchema = z.object({
  cipherText: z.string().min(1, "Cipher text is required"),
  decodeKey: z
    .string()
    .regex(/^\d+$/, "Key must be an integer")
    .min(1, "Key is required")
    .refine((key) => key.includes("1"), "Key must contain the digit 1")
    .refine((key) => {
      const digits = key.split("").map(Number);
      const minDigit = Math.min(...digits);
      const maxDigit = Math.max(...digits);
      const digitSet = new Set(digits);

      for (let i = minDigit; i <= maxDigit; i++) {
        if (!digitSet.has(i)) {
          return false;
        }
      }

      return true;
    }, "Key must contain all numbers between the minimum and maximum digits")
    .refine((key) => {
      const digitSet = new Set(key.split(""));
      return digitSet.size === key.length;
    }, "Key must have unique digits"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

const formatText = (text: string) => text.toUpperCase(); // Keep spaces

const createEncodeMatrix = (text: string, key: number) => {
  const numCols = key.toString().length;
  const numRows = Math.ceil(text.length / numCols);
  const matrix: string[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(" ")
  );

  let index = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (index < text.length) {
        matrix[row][col] = text[index++];
      }
    }
  }
  return matrix;
};

const createDecodeMatrix = (text: string, key: number) => {
  const numCols = key.toString().length;
  const numRows = Math.ceil(text.length / numCols);
  const matrix: string[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(" ")
  );

  const keyStr = key.toString();
  const keyOrder = keyStr.split("").map((char, index) => ({ char, index }));
  keyOrder.sort((a, b) => a.char.localeCompare(b.char));

  let index = 0;
  for (const { index: colIndex } of keyOrder) {
    for (let row = 0; row < numRows; row++) {
      if (index < text.length) {
        matrix[row][colIndex] = text[index++];
      }
    }
  }
  return matrix;
};

const encodeColumnar = (text: string, key: number) => {
  const matrix = createEncodeMatrix(text, key);
  const keyStr = key.toString();
  const keyOrder = keyStr.split("").map((char, index) => ({ char, index }));
  keyOrder.sort((a, b) => a.char.localeCompare(b.char));

  let encoded = "";

  for (const { index } of keyOrder) {
    for (let row = 0; row < matrix.length; row++) {
      encoded += matrix[row][index];
    }
  }
  return encoded;
};

const decodeColumnar = (text: string, key: number) => {
  const numCols = key.toString().length;
  const numRows = Math.ceil(text.length / numCols);
  const matrix: string[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(" ")
  );

  const keyStr = key.toString();
  const keyOrder = keyStr.split("").map((char, index) => ({ char, index }));
  keyOrder.sort((a, b) => a.char.localeCompare(b.char));

  let index = 0;

  // Fill the matrix columns based on the key order
  for (const { index: colIndex } of keyOrder) {
    for (let row = 0; row < numRows; row++) {
      if (index < text.length) {
        matrix[row][colIndex] = text[index++];
      }
    }
  }

  // Read rows to form the decoded message
  let decoded = "";
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      decoded += matrix[row][col];
    }
  }

  return decoded;
};

export const Columnar = () => {
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [columnarMatrix, setColumnarMatrix] = useState<string[][]>([]);
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
      const matrix = createEncodeMatrix(
        formatText(data.plainText),
        parseInt(data.encodeKey)
      );
      const encoded = encodeColumnar(
        formatText(data.plainText),
        parseInt(data.encodeKey)
      );
      setColumnarMatrix(matrix);
      setEncodedText(encoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = (data: DecodeFormData) => {
    try {
      const matrix = createDecodeMatrix(
        formatText(data.cipherText),
        parseInt(data.decodeKey)
      );
      const decoded = decodeColumnar(data.cipherText, parseInt(data.decodeKey));
      setColumnarMatrix(matrix);
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
    if (columnarMatrix.length === 0) return null;
    return (
      <div className="pb-4">
        <h2 className="mb-4 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
          Columnar Matrix
        </h2>
        <div className="mt-2 grid">
          {columnarMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((char, colIndex) => (
                <div
                  key={colIndex}
                  className="flex min-h-12 min-w-12 items-center justify-center border border-neutral-300 p-3 font-mono text-lg text-neutral-950 dark:border-neutral-700 dark:text-neutral-50 md:min-h-16 md:min-w-16 md:p-4"
                >
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <CipherPageLayout
      category="Transposition"
      categoryHref="/transposition/columnar"
      title="Columnar Cipher"
      description={
        <>
          <p>
            Columnar transposition writes the plaintext row by row into a grid,
            then reads the columns in an order defined by a numeric key. For key
            "3 1 2", column 1 is read first, then 2, then 3 — rearranging the
            characters without changing them.
          </p>
          <p>
            The number of columns equals the number of digits in the key. Applying
            the cipher twice (double transposition) significantly increases
            security and was used operationally by several nations during both
            World Wars. The plaintext length and column widths must be accounted
            for during decryption.
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
                    placeholder="Enter integer key..."
                    className="uppercase"
                    defaultValue={"25431"}
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
                    defaultValue={"C  AKDATNTAWT A"}
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
                    placeholder="Enter integer key..."
                    className="uppercase"
                    defaultValue={"25431"}
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
