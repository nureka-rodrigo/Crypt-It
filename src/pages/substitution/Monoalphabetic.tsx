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
    try {
      const encoded = monoalphabeticEncode(
        data.plainText.toUpperCase(),
        data.encodeKey.toUpperCase()
      );
      setEncodedText(encoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error encoding text.");
      throw error;
    }
  };

  const onDecode = (data: DecodeFormData) => {
    try {
      const decoded = monoalphabeticDecode(
        data.encodedText.toUpperCase(),
        data.decodeKey.toUpperCase()
      );
      setDecodedText(decoded);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Error decoding text.");
      throw error;
    }
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
    <CipherPageLayout
      category="Substitution"
      categoryHref="/substitution/monoalphabetic"
      title="Monoalphabetic Cipher"
      description={
        <>
          <p>
            A monoalphabetic cipher replaces each letter with exactly one other
            letter using a fixed 26-character key alphabet. Unlike Caesar, the
            mapping is arbitrary — 'A' might map to 'Q', 'B' to 'F', and so on —
            producing a scrambled substitution alphabet.
          </p>
          <p>
            Although the key space is enormous (26! ≈ 4 × 10²⁶ combinations),
            frequency analysis easily defeats it. Because letter frequencies are
            preserved in the ciphertext, matching them against known English
            distributions exposes the mapping in minutes.
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
