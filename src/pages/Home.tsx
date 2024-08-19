import React from "react";
import {Navbar} from "@/components/layout/Navbar.tsx";
import Footer from "@/components/layout/Footer.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

export const Home: React.FC = () => {
  return (
    <>
      <Navbar/>
      <section className="px-4">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              Welcome to Crypt-It!
            </h1>
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-200">
              This is a simple web application that allows you to encrypt and
              decrypt messages using various cryptographic algorithms.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Substitution Ciphers</CardTitle>
                <CardDescription>
                  Substitution ciphers replace plaintext characters with other
                  characters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="default">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transposition Ciphers</CardTitle>
                <CardDescription>
                  Transposition ciphers rearrange the order of plaintext
                  characters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="default">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symmetric Encryption</CardTitle>
                <CardDescription>
                  Symmetric encryption uses the same key for both encryption and
                  decryption.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="default">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asymmetric Encryption</CardTitle>
                <CardDescription>
                  Asymmetric encryption uses a pair of public and private keys.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="default">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hash Functions</CardTitle>
                <CardDescription>
                  Hash functions map data of arbitrary size to fixed-size values.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="default">
                  Explore
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};
