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
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { toast } from "sonner";

const encodeSchema = z.object({
  plainText: z.string().min(1, "Plain text is required"),
  rails: z
    .string()
    .regex(/^\d+$/, "Number of rails must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 2, "Number of rails must be at least 2"),
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  rails: z
    .string()
    .regex(/^\d+$/, "Number of rails must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 2, "Number of rails must be at least 2"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

export const RailFence: React.FC = () => {
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

  const railFenceEncode = (text: string, rails: number): string => {
    if (rails <= 1) return text;

    // Initialize the rail array
    const rail: string[][] = Array.from({ length: rails }, () => []);
    let dir = -1,
      row = 0;

    for (const char of text) {
      // Add character to the current row
      rail[row].push(char);

      // Change direction at the top or bottom rail
      if (row === 0 || row === rails - 1) {
        dir *= -1;
      }

      // Move to the next row
      row += dir;

      // Ensure row stays within bounds
      if (row < 0) row = 0;
      if (row >= rails) row = rails - 1;
    }

    // Flatten the rail array and join the characters into a single string
    return rail.flat().join("");
  };

  const railFenceDecode = (text: string, rails: number): string => {
    if (rails <= 1) return text;

    // Initialize rail as a 2D array with empty strings
    const rail: string[][] = Array.from({ length: rails }, () =>
      Array(text.length).fill("")
    );
    let dir = 1,
      row = 0;

    // Mark positions in rail matrix
    for (let i = 0; i < text.length; i++) {
      rail[row][i] = "*";
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }

    // Fill the rail with actual characters
    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (rail[r][c] === "*") {
          rail[r][c] = text[index++];
        }
      }
    }

    // Read characters in zigzag pattern
    let result = "";
    dir = 1;
    row = 0;
    for (let i = 0; i < text.length; i++) {
      result += rail[row][i];
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }

    return result;
  };

  const onEncode = (data: EncodeFormData) => {
    try {
      const rails = data.rails;
      const encoded = railFenceEncode(data.plainText, rails);
      setEncodedText(encoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = (data: DecodeFormData) => {
    try {
      const rails = data.rails;
      const decoded = railFenceDecode(data.encodedText, rails);
      setDecodedText(decoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error decoding text.");
      throw error;
    }
  };

  useEffect(() => {
    setEncodedText("");
    setDecodedText("");
  }, [activeTab]);

  return (
    <CipherPageLayout
      category="Transposition"
      categoryHref="/transposition/rail-fence"
      title="Rail Fence Cipher"
      description={
        <>
          <p>
            The Rail Fence cipher writes plaintext diagonally across a set of
            "rails" in a zigzag pattern, then reads each rail left-to-right to
            produce the ciphertext. With 3 rails, the first, middle, and last
            characters follow separate wave-like paths down the grid.
          </p>
          <p>
            It is a pure transposition — no character is substituted, only
            repositioned. The number of rails is the key. Decryption reconstructs
            the zigzag structure, determines how many characters fall on each
            rail, and reads them back in the original diagonal order.
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
                Enter the plain text and the number of rails to encode it.
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
                    defaultValue="ATTACK AT DAWN"
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
                  <Label htmlFor="rails">Number of Rails</Label>
                  <Input
                    id="rails"
                    type="number"
                    placeholder="Enter number of rails..."
                    defaultValue={3}
                    {...registerEncode("rails")}
                  />
                  {encodeErrors.rails && (
                    <p className="text-red-500">{encodeErrors.rails.message}</p>
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
                Enter the cipher text and the number of rails to decode it.
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
                    defaultValue="ACTWTAKA ANT D"
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
                  <Label htmlFor="rails">Number of Rails</Label>
                  <Input
                    id="rails"
                    type="number"
                    placeholder="Enter number of rails to..."
                    defaultValue={3}
                    {...registerDecode("rails")}
                  />
                  {decodeErrors.rails && (
                    <p className="text-red-500">{decodeErrors.rails.message}</p>
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
