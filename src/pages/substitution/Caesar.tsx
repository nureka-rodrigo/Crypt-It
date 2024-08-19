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
  shift: z.string().regex(/^\d+$/, "Shift value must be a positive integer"),
});

const decodeSchema = z.object({
  encodedText: z.string().min(1, "Cipher text is required"),
  shift: z.string().regex(/^\d+$/, "Shift value must be a positive integer"),
});

type EncodeFormData = z.infer<typeof encodeSchema>;
type DecodeFormData = z.infer<typeof decodeSchema>;

export const Caesar: React.FC = () => {
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
    try {
      const shift = parseInt(data.shift, 10);
      const encoded = caesarCipherEncode(data.plainText, shift);
      setEncodedText(encoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = (data: DecodeFormData) => {
    try {
      const shift = parseInt(data.shift, 10);
      const decoded = caesarCipherDecode(data.encodedText, shift);
      setDecodedText(decoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error decoding text.");
      throw error;
    }
  };

  const caesarCipherEncode = (text: string, shift: number) => {
    return text
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }

        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }

        return char;
      })
      .join("");
  };

  const caesarCipherDecode = (text: string, shift: number) => {
    return caesarCipherEncode(text, 26 - shift);
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
            Caesar Cipher
          </h1>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Caesar Cipher, named after the renowned Roman general Julius
            Caesar, is one of the earliest and most straightforward methods of
            encryption. It is a type of substitution cipher, where each letter
            in the plaintext is shifted a fixed number of places down or up the
            alphabet. This method, though simple, laid the foundation for modern
            cryptography and is still a popular teaching tool in understanding
            the basics of encryption.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The concept is easy to grasp: imagine the alphabet as a circle where
            after 'Z', it loops back to 'A'. The Caesar Cipher operates by
            shifting the position of each letter in the plaintext by a fixed
            number, known as the 'shift' or 'key'. For example, with a shift of
            3, the letter 'A' would be replaced by 'D', 'B' by 'E', and so
            forth. This shift applies uniformly across the entire message.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            To decrypt the message, the process is simply reversed. If the
            recipient knows the key (which is the number of positions each
            letter was shifted), they can shift the letters back to their
            original positions. Without the key, decrypting the message becomes
            a trial-and-error process, though due to the limited number of
            possible shifts (25 possible shifts for the English alphabet), the
            Caesar Cipher is easily broken with modern computational power.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            Historically, Julius Caesar used this cipher with a shift of three
            to protect his military communications. Although the Caesar Cipher
            is no longer considered secure for serious purposes, it remains a
            fundamental example of encryption techniques and is often the first
            cipher taught to students studying cryptography.
          </p>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-justify">
            The Caesar Cipher’s simplicity is both its strength and its
            weakness. It is an excellent example to introduce the concepts of
            encryption and decryption, demonstrating how information can be
            obfuscated from unintended recipients. However, its predictability
            and vulnerability to frequency analysis make it unsuitable for
            modern-day encryption needs, which require much more complex
            algorithms to secure data effectively.
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
                    Enter the plain text and the shift value to encode it.
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
                      <Label htmlFor="encodeShift">Shift Value</Label>
                      <Input
                        id="encodeShift"
                        type="number"
                        placeholder="Enter shift value..."
                        defaultValue={1}
                        {...registerEncode("shift")}
                      />
                      {encodeErrors.shift && (
                        <p className="text-red-500">
                          {encodeErrors.shift.message}
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
                    Enter the cipher text and the shift value to decode it.
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
                        defaultValue={"BUUBDL BU EBXO"}
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
                      <Label htmlFor="decodeShift">Shift Value</Label>
                      <Input
                        id="decodeShift"
                        type="number"
                        placeholder="Enter shift value..."
                        defaultValue={1}
                        {...registerDecode("shift")}
                      />
                      {decodeErrors.shift && (
                        <p className="text-red-500">
                          {decodeErrors.shift.message}
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
