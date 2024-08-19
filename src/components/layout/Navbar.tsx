import React, { useState } from "react";
import { ThemeButton } from "@/components/other/ThemeButton";
import { HiOutlineMenuAlt3 } from "@react-icons/all-files/hi/HiOutlineMenuAlt3";
import { IoMdClose } from "@react-icons/all-files/io/IoMdClose";
import Logo from "/vite.svg";
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
        description: "A simple cipher that shifts letters by a fixed amount.",
        label: "Caesar Cipher",
      },
      {
        title: "Monoalphabetic Cipher",
        href: "/substitution/monoalphabetic",
        description: "A cipher using a single substitution alphabet.",
        label: "Monoalphabetic Cipher",
      },
      {
        title: "Playfair Cipher",
        href: "/substitution/playfair",
        description: "A cipher that encrypts pairs of letters in a 5x5 grid.",
        label: "Playfair Cipher",
      },
      {
        title: "Vigenère Cipher",
        href: "/substitution/vigenere",
        description: "A polyalphabetic cipher using a keyword to shift letters.",
        label: "Vigenère Cipher",
      },
      {
        title: "Vernam Cipher (One-Time Pad)",
        href: "/substitution/vernam",
        description: "A polyalphabetic cipher that XORs plaintext with a random key.",
        label: "Vernam Cipher",
      },
    ],
  },
  {
    label: "Transposition",
    href: "/transposition",
    subItems: [
      {
        title: "Rail Fence Cipher",
        href: "/transposition/rail-fence",
        description: "A transposition cipher that writes text in a zigzag pattern.",
        label: "Rail Fence Cipher",
      },
      {
        title: "Columnar Transposition",
        href: "/transposition/columnar",
        description: "A cipher that arranges text into columns and reads them in a different order.",
        label: "Columnar Transposition",
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
        description: "A symmetric encryption algorithm that encrypts data in blocks.",
        label: "AES",
      },
      {
        title: "AES-CBC",
        href: "/symmetric/aes-cbc",
        description: "A symmetric encryption algorithm that encrypts data in blocks.",
        label: "AES-CBC",
      },
      {
        title: "AES-GCM",
        href: "/symmetric/aes-gcm",
        description: "A symmetric encryption algorithm that encrypts data in blocks.",
        label: "AES-GCM",
      },
    ],
  },
  {
    label: "Hash",
    href: "/hash-functions",
    subItems: [
      {
        title: "SHA1",
        href: "/hash/sha-1",
        description: "A cryptographic hash function that produces a 160-bit hash value.",
        label: "SHA1",
      },
      {
        title: "SHA256",
        href: "/hash/sha-256",
        description: "A cryptographic hash function that produces a 256-bit hash value.",
        label: "SHA256",
      },
      {
        title: "SHA384",
        href: "/hash/sha-384",
        description: "A cryptographic hash function that produces a 384-bit hash value.",
        label: "SHA384",
      },
      {
        title: "SHA512",
        href: "/hash/sha-512",
        description: "A cryptographic hash function that produces a 512-bit hash value.",
        label: "SHA512",
      },
    ],
  },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="py-4 max-w-7xl mx-auto">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-neutral-950 dark:text-neutral-50 text-lg font-bold">
          <img src={Logo} alt="Logo" className="w-8 h-8" />
        </div>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.subItems ? (
                  <>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.subItems.map((subItem) => (
                          <ListItem
                            key={subItem.title}
                            title={subItem.title}
                            href={subItem.href}
                          >
                            {subItem.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link to={item.href}>
                    <div
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </div>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <ThemeButton />
          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="md:hidden text-white">
            {isMobileMenuOpen ? (
              <IoMdClose className="w-6 h-6 text-neutral-950 dark:text-neutral-50" />
            ) : (
              <HiOutlineMenuAlt3 className="w-6 h-6 text-neutral-950 dark:text-neutral-50" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <ul className="flex flex-col space-y-4 p-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="font-semibold text-neutral-950 dark:text-neutral-50 hover:text-white"
                >
                  {item.label}
                </Link>
                {item.subItems && (
                  <ul className="flex flex-col space-y-2 pl-4 pt-2">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          className="text-neutral-950 dark:text-neutral-50 hover:text-neutral-50"
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
