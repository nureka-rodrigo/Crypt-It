import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "@/pages/Home.tsx";
import { Caesar } from "@/pages/substitution/Caesar.tsx";
import { Monoalphabetic } from "@/pages/substitution/Monoalphabetic.tsx";
import { Playfair } from "@/pages/substitution/Playfair.tsx";
import { Vigenere } from "@/pages/substitution/Vigenere.tsx";
import { Vernam } from "@/pages/substitution/Vernam.tsx";
import { RailFence } from "@/pages/transposition/RailFence.tsx";
import { Columnar } from "@/pages/transposition/Columnar.tsx";
import { SHA256 } from "@/pages/hash/SHA-256.tsx";
import { SHA1 } from "@/pages/hash/SHA-1.tsx";
import { SHA384 } from "@/pages/hash/SHA-384.tsx";
import { SHA512 } from "@/pages/hash/SHA-512.tsx";
import { AESCTR } from "@/pages/symmetric/AES-CTR.tsx";
import { AESCBC } from "@/pages/symmetric/AES-CBC.tsx";
import { AESGCM } from "@/pages/symmetric/AES-GCM.tsx";
import { RSAOAEP } from "@/pages/asymmetric/RSA-OAEP.tsx";
import {NotFound} from "@/pages/error/NotFound.tsx";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pattern">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/substitution/caesar" element={<Caesar />} />
        <Route path="/substitution/monoalphabetic" element={<Monoalphabetic />} />
        <Route path="/substitution/playfair" element={<Playfair />} />
        <Route path="/substitution/vigenere" element={<Vigenere />} />
        <Route path="/substitution/vernam" element={<Vernam />} />

        <Route path="/transposition/rail-fence" element={<RailFence />} />
        <Route path="/transposition/columnar" element={<Columnar />} />

        <Route path="/symmetric/aes-ctr" element={<AESCTR />} />
        <Route path="/symmetric/aes-cbc" element={<AESCBC />} />
        <Route path="/symmetric/aes-gcm" element={<AESGCM />} />

        <Route path="/asymmetric/rsa-oaep" element={<RSAOAEP />} />

        <Route path="/hash/sha-1" element={<SHA1 />} />
        <Route path="/hash/sha-256" element={<SHA256 />} />
        <Route path="/hash/sha-384" element={<SHA384 />} />
        <Route path="/hash/sha-512" element={<SHA512 />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
