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
    <CipherPageLayout
      category="Substitution"
      categoryHref="/substitution/caesar"
      title="Caesar Cipher"
      description={
        <>
          <p>
            The Caesar Cipher shifts every letter in the plaintext by a fixed
            number of positions in the alphabet. With a shift of 3, 'A' becomes
            'D', 'B' becomes 'E', and so on — wrapping around at 'Z'. The shift
            value is both the key and the sole parameter.
          </p>
          <p>
            Decryption simply reverses the shift. Despite its historical
            significance — Julius Caesar reportedly used a shift of three for
            military dispatches — the cipher is trivially broken today. With only
            25 possible keys, an attacker can try all of them by hand.
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
                    <p className="text-red-500">{encodeErrors.shift.message}</p>
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
                    <p className="text-red-500">{decodeErrors.shift.message}</p>
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
