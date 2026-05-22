import React from "react";
import { Navbar } from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
import { Link } from "react-router-dom";

const categories = [
  {
    number: "01",
    title: "Substitution Ciphers",
    description:
      "Replace each plaintext character with another according to a fixed substitution rule.",
    algorithms: ["Caesar", "Monoalphabetic", "Playfair", "Vigenère", "Vernam"],
    href: "/substitution/caesar",
  },
  {
    number: "02",
    title: "Transposition Ciphers",
    description:
      "Rearrange the positions of characters without altering the characters themselves.",
    algorithms: ["Rail Fence", "Columnar"],
    href: "/transposition/rail-fence",
  },
  {
    number: "03",
    title: "Symmetric Encryption",
    description:
      "Use a single shared secret key for both encryption and decryption.",
    algorithms: ["AES-CTR", "AES-CBC", "AES-GCM"],
    href: "/symmetric/aes-ctr",
  },
  {
    number: "04",
    title: "Asymmetric Encryption",
    description:
      "Encrypt with a public key; only the corresponding private key can decrypt.",
    algorithms: ["RSA-OAEP"],
    href: "/asymmetric/rsa-oaep",
  },
  {
    number: "05",
    title: "Hash Functions",
    description:
      "Produce a fixed-length fingerprint of arbitrary data — one-way and deterministic.",
    algorithms: ["SHA-1", "SHA-256", "SHA-384", "SHA-512"],
    href: "/hash/sha-256",
  },
];

export const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Hero */}
          <div className="border-b border-stone-200 pb-16 pt-20 dark:border-stone-800">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-amber-500">
              Educational Cryptography Tool
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 dark:text-stone-50 lg:text-6xl">
              Cryptography,
              <br />
              demystified.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-500 dark:text-stone-400">
              Interactive implementations of 19 classical and modern algorithms
              — from Caesar to RSA. Understand how each cipher works, hands-on.
            </p>
          </div>

          {/* Algorithm index */}
          <div className="py-12">
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-stone-400 dark:text-stone-600">
              19 Algorithms — 5 Categories
            </p>

            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {categories.map((cat) => (
                <div
                  key={cat.number}
                  className="group flex items-start gap-8 py-8 lg:gap-12"
                >
                  <span className="w-6 shrink-0 pt-0.5 font-mono text-sm text-stone-300 dark:text-stone-700">
                    {cat.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 text-xl font-semibold text-stone-900 dark:text-stone-50">
                      {cat.title}
                    </h2>
                    <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
                      {cat.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.algorithms.map((algo) => (
                        <span
                          key={algo}
                          className="inline-block rounded-sm bg-stone-100 px-2.5 py-1 font-mono text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                        >
                          {algo}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={cat.href}
                    className="shrink-0 pt-0.5 text-sm font-medium text-amber-500 transition-colors hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    Explore →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
