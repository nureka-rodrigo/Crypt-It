import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <>
      <Navbar />
      <section className="max-w-7xl py-8 space-y-8 mx-auto">
        <div className="container mx-auto">
          <h1 className="flex justify-center text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Rail Fence Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Rail Fence Cipher is a classic transposition cipher that
            encrypts messages by rearranging characters in a zigzag pattern. Its
            name derives from its resemblance to a fence with horizontal rails
            when the plaintext is written out. The encryption process involves
            writing the message diagonally down across a specified number of
            "rails" or lines, then reading the text off each rail line by line
            to produce the ciphertext.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            To encode a message using the Rail Fence Cipher, begin by writing
            the plaintext diagonally downwards across the number of rails
            specified. When the bottom rail is reached, the direction reverses,
            and you move diagonally upwards until you reach the top rail. This
            zigzag pattern is continued until the entire plaintext is written.
            After completing the pattern, the ciphertext is obtained by reading
            the characters from each rail sequentially and concatenating them to
            form the final encrypted message.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Decoding a message encrypted with the Rail Fence Cipher involves
            reconstructing the zigzag pattern. Start by filling in the
            characters from the ciphertext into their respective rail lines
            according to the original pattern used during encoding. Once the
            rails are completely filled, read the message in the same zigzag
            manner to retrieve the original plaintext.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            While the Rail Fence Cipher provides a basic level of encryption and
            serves as an excellent educational tool for understanding
            transposition ciphers, it is relatively simple and vulnerable to
            frequency analysis and other cryptographic attacks. As such, it is
            more suitable for introductory learning and simple use cases rather
            than for serious or high-security applications.
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
                        <p className="text-red-500">
                          {encodeErrors.rails.message}
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
                        <p className="text-red-500">
                          {decodeErrors.rails.message}
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
