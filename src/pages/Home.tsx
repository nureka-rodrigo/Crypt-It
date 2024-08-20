import React from "react";
import { Navbar } from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import Logo from "/vite.svg";

const cardData = [
  {
    title: "Substitution Ciphers",
    description: "Substitution ciphers replace plaintext characters with other characters.",
    link: "/substitution/caesar",
  },
  {
    title: "Transposition Ciphers",
    description: "Transposition ciphers rearrange the order of plaintext characters.",
    link: "/transposition/rail-fence",
  },
  {
    title: "Symmetric Encryption",
    description: "Symmetric encryption uses the same key for both encryption and decryption.",
    link: "/symmetric/aes-ctr",
  },
  {
    title: "Asymmetric Encryption",
    description: "Asymmetric encryption uses a pair of public and private keys.",
    link: "/asymmetric/rsa-oaep",
  },
  {
    title: "Hash Functions",
    description: "Hash functions map data of arbitrary size to fixed-size values.",
    link: "/hash/sha-1",
  },
];

export const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <section>
        <div className="max-w-7xl mx-auto py-8">
          <div className="text-center px-4">
            <h1 className="text-5xl font-extrabold text-neutral-900 dark:text-neutral-50">
              Welcome to Crypt-It!
            </h1>
          </div>

          <div className="container py-12 m-auto">
            <div className="grid grid-cols-4 gap-8 md:grid-cols-8 lg:grid-cols-12">
              <div className="flex justify-center items-center lg:justify-start col-span-4 lg:col-span-7">
                <p className="text-lg text-neutral-700 dark:text-neutral-200 leading-relaxed">
                  This is a simple web application that allows you to encrypt and
                  decrypt messages using various cryptographic algorithms. You can explore different types of ciphers, including substitution and transposition ciphers, as well as modern encryption techniques like symmetric and asymmetric encryption. Additionally, the application provides tools to generate and verify cryptographic hashes.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end col-span-4 lg:col-span-5">
                <img
                  src={Logo}
                  alt="Vite Logo"
                  className="w-72 h-auto transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          <div className="px-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cardData.map((card, index) => (
              <Card
                key={index}
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Link to={card.link}>
                    <Button
                      size="sm"
                      variant="default"
                    >
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
