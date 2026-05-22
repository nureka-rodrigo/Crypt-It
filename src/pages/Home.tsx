import React from "react";
import { Navbar } from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import Logo from "/lock.svg";

const cardData = [
  {
    title: "Substitution Ciphers",
    description:
      "Substitution ciphers replace plaintext characters with other characters.",
    link: "/substitution/caesar",
  },
  {
    title: "Transposition Ciphers",
    description:
      "Transposition ciphers rearrange the order of plaintext characters.",
    link: "/transposition/rail-fence",
  },
  {
    title: "Symmetric Encryption",
    description:
      "Symmetric encryption uses the same key for both encryption and decryption.",
    link: "/symmetric/aes-ctr",
  },
  {
    title: "Asymmetric Encryption",
    description:
      "Asymmetric encryption uses a pair of public and private keys.",
    link: "/asymmetric/rsa-oaep",
  },
  {
    title: "Hash Functions",
    description:
      "Hash functions map data of arbitrary size to fixed-size values.",
    link: "/hash/sha-1",
  },
];

export const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <section className="flex min-h-screen flex-col justify-between">
        <div className="mx-auto max-w-7xl py-8">
          <div className="px-4 text-center">
            <h1 className="text-5xl font-extrabold text-neutral-900 dark:text-neutral-50">
              Welcome to Crypt-It!
            </h1>
          </div>

          <div className="container m-auto py-12">
            <div className="grid grid-cols-4 gap-8 md:grid-cols-8 lg:grid-cols-12">
              <div className="col-span-4 flex items-center justify-center lg:col-span-7 lg:justify-start">
                <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-200">
                  This is a simple web application that allows you to encrypt
                  and decrypt messages using various cryptographic algorithms.
                  You can explore different types of ciphers, including
                  substitution and transposition ciphers, as well as modern
                  encryption techniques like symmetric and asymmetric
                  encryption. Additionally, the application provides tools to
                  generate and verify cryptographic hashes.
                </p>
              </div>
              <div className="col-span-4 flex justify-center lg:col-span-5 lg:justify-end">
                <img
                  src={Logo}
                  alt="Lock"
                  className="h-auto w-full transform transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 px-8 sm:grid-cols-2 lg:grid-cols-3">
            {cardData.map((card, index) => (
              <Card
                key={index}
                className="transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold">
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Link to={card.link}>
                    <Button size="sm" variant="default">
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
};
