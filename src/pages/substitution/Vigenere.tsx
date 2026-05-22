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
    try {
      const encoded = vigenereEncode(data.plainText, data.encodeKey);
      setEncodedText(encoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = (data: DecodeFormData) => {
    try {
      const decoded = vigenereDecode(data.cipherText, data.decodeKey);
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

  return (
    <CipherPageLayout
      category="Substitution"
      categoryHref="/substitution/vigenere"
      title="Vigenère Cipher"
      description={
        <>
          <p>
            The Vigenère cipher applies a different Caesar shift to each letter
            based on a repeating keyword. If the keyword is "KEY", successive
            letters are shifted by K (10), E (4), Y (24), then the pattern
            repeats. This polyalphabetic approach hides single-letter frequencies.
          </p>
          <p>
            Known as "le chiffre indéchiffrable" for centuries, it was finally
            broken in 1863 when Kasiski showed that repeated keyword cycles leave
            detectable patterns. Finding repeated ciphertext segments reveals the
            key length, after which each Caesar sub-cipher can be solved
            independently.
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
