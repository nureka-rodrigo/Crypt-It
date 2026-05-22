import React, { useState } from "react";
import { ThemeButton } from "@/components/other/ThemeButton";
import { HiOutlineMenuAlt3 } from "@react-icons/all-files/hi/HiOutlineMenuAlt3";
import { IoMdClose } from "@react-icons/all-files/io/IoMdClose";
import Logo from "/logo.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Substitution",
    href: "/substitution",
    subItems: [
      {
        title: "Caesar Cipher",
        href: "/substitution/caesar",
        description: "Shifts every letter by a fixed number of positions.",
      },
      {
        title: "Monoalphabetic",
        href: "/substitution/monoalphabetic",
        description: "Maps each letter to exactly one other letter.",
      },
      {
        title: "Playfair Cipher",
        href: "/substitution/playfair",
        description: "Encrypts digraphs using a 5×5 keyword matrix.",
      },
      {
        title: "Vigenère Cipher",
        href: "/substitution/vigenere",
        description: "Polyalphabetic substitution keyed by a repeating word.",
      },
      {
        title: "Vernam Cipher",
        href: "/substitution/vernam",
        description: "XOR-based one-time pad — theoretically unbreakable.",
      },
    ],
  },
  {
    label: "Transposition",
    href: "/transposition",
    subItems: [
      {
        title: "Rail Fence",
        href: "/transposition/rail-fence",
        description: "Writes text in a zigzag across multiple rails.",
      },
      {
        title: "Columnar",
        href: "/transposition/columnar",
        description: "Reorders columns according to a numeric key.",
      },
    ],
  },
  {
    label: "Symmetric",
    href: "/symmetric",
    subItems: [
      {
        title: "AES-CTR",
        href: "/symmetric/aes-ctr",
        description: "Turns AES into a stream cipher via a counter.",
      },
      {
        title: "AES-CBC",
        href: "/symmetric/aes-cbc",
        description: "Each block is XORed with the previous ciphertext block.",
      },
      {
        title: "AES-GCM",
        href: "/symmetric/aes-gcm",
        description: "Authenticated encryption — confidentiality + integrity.",
      },
    ],
  },
  {
    label: "Asymmetric",
    href: "/asymmetric",
    subItems: [
      {
        title: "RSA-OAEP",
        href: "/asymmetric/rsa-oaep",
        description: "Public-key encryption with optimal asymmetric padding.",
      },
    ],
  },
  {
    label: "Hash",
    href: "/hash-functions",
    subItems: [
      {
        title: "SHA-1",
        href: "/hash/sha-1",
        description: "160-bit hash — deprecated, included for education.",
      },
      {
        title: "SHA-256",
        href: "/hash/sha-256",
        description: "256-bit hash from the SHA-2 family.",
      },
      {
        title: "SHA-384",
        href: "/hash/sha-384",
        description: "384-bit truncation of SHA-512.",
      },
      {
        title: "SHA-512",
        href: "/hash/sha-512",
        description: "512-bit hash — maximum SHA-2 output length.",
      },
    ],
  },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={Logo}
            alt="Logo"
            className="h-5 w-5 opacity-80 transition-opacity group-hover:opacity-100 dark:invert"
          />
          <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-50">
            Crypt-It
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.subItems ? (
                  <>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-1 p-3 md:w-[380px] md:grid-cols-2 lg:w-[460px]">
                        {item.subItems.map((sub) => (
                          <ListItem
                            key={sub.title}
                            title={sub.title}
                            href={sub.href}
                          >
                            {sub.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link to={item.href}>
                    <div className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </div>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <ThemeButton />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-1 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="h-5 w-5 text-stone-700 dark:text-stone-300" />
            ) : (
              <HiOutlineMenuAlt3 className="h-5 w-5 text-stone-700 dark:text-stone-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950 lg:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-4">
            {navItems.map((item) => (
              <div key={item.href} className="py-2.5">
                <Link
                  to={item.href}
                  className="text-sm font-semibold text-stone-900 dark:text-stone-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.subItems && (
                  <ul className="ml-4 mt-1.5 space-y-1.5">
                    {item.subItems.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          to={sub.href}
                          className="text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href ?? "#"}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-stone-100 focus:bg-stone-100 dark:hover:bg-stone-800 dark:focus:bg-stone-800",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-stone-900 dark:text-stone-50">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-stone-500 dark:text-stone-400">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
