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
import { AesCipher } from "@/pages/symmetric/AES.tsx";
import { Sha256Cipher } from "@/pages/hash/SHA256.tsx";
import { Sha1Cipher } from "@/pages/hash/SHA1.tsx";
import { Sha384Cipher } from "@/pages/hash/SHA384.tsx";
import { Sha512Cipher } from "@/pages/hash/SHA512.tsx";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/substitution/caesar" element={<Caesar />} />
        <Route
          path="/substitution/monoalphabetic"
          element={<Monoalphabetic />}
        />
        <Route path="/substitution/playfair" element={<Playfair />} />
        <Route path="/substitution/vigenere" element={<Vigenere />} />
        <Route path="/substitution/vernam" element={<Vernam />} />

        <Route path="/transposition/rail-fence" element={<RailFence />} />
        <Route path="/transposition/columnar" element={<Columnar />} />

        <Route path="/symmetric/aes" element={<AesCipher />} />

        <Route path="/hash/sha1" element={<Sha1Cipher />} />
        <Route path="/hash/sha256" element={<Sha256Cipher />} />
        <Route path="/hash/sha384" element={<Sha384Cipher />} />
        <Route path="/hash/sha512" element={<Sha512Cipher />} />
      </Routes>
    </div>
  );
}

export default App;
