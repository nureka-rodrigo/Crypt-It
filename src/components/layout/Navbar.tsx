import React, {useState} from 'react';
import {ThemeButton} from '@/components/other/ThemeButton';
import {HiOutlineMenuAlt3} from "@react-icons/all-files/hi/HiOutlineMenuAlt3";
import {IoMdClose} from "@react-icons/all-files/io/IoMdClose";
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
import {cn} from "@/lib/utils";

const navItems = [
  {label: 'Home', href: '/'},
  {
    label: 'Substitution', href: '/substitution', subItems: [
      {
        title: 'Caesar Cipher',
        href: '/substitution/caesar',
        description: 'A simple cipher that shifts letters by a fixed amount.',
        label: 'Caesar Cipher'
      },
      {
        title: 'Monoalphabetic Cipher',
        href: '/substitution/monoalphabetic',
        description: 'A cipher using a single substitution alphabet.',
        label: 'Monoalphabetic Cipher'
      },
      {
        title: 'Playfair Cipher',
        href: '/substitution/playfair',
        description: 'A cipher that encrypts pairs of letters in a 5x5 grid.',
        label: 'Playfair Cipher'
      },
      {
        title: 'Hill Cipher',
        href: '/substitution/hill',
        description: 'A cipher that encrypts blocks of text using matrix multiplication.',
        label: 'Hill Cipher'
      },
      {
        title: 'Vigenère Cipher',
        href: '/substitution/vigenere',
        description: 'A polyalphabetic cipher using a keyword to shift letters.',
        label: 'Vigenère Cipher'
      },
      {
        title: 'Vernam Cipher',
        href: '/substitution/vernam',
        description: 'A polyalphabetic cipher that XORs plaintext with a random key.',
        label: 'Vernam Cipher',
      },
      {
        title: 'One-Time Pad',
        href: '/substitution/one-time-pad',
        description: 'A cipher that uses a random key that is as long as the message.',
        label: 'One-Time Pad',
      }
    ]
  },
  {
    label: 'Transposition', href: '/transposition', subItems: [
      {
        title: 'Rail Fence Cipher',
        href: '/transposition/rail-fence',
        description: 'A transposition cipher that writes text in a zigzag pattern.',
        label: 'Rail Fence Cipher'
      },
      {
        title: 'Columnar Transposition',
        href: '/transposition/columnar',
        description: 'A cipher that arranges text into columns and reads them in a different order.',
        label: 'Columnar Transposition'
      },
    ]
  },
  {
    label: 'Symmetric', href: '/symmetric', subItems: [
      {title: 'DES', href: '/symmetric/des', description: 'A widely used block cipher for encryption.', label: 'DES'},
      {
        title: 'AES',
        href: '/symmetric/aes',
        description: 'A modern block cipher used for secure encryption.',
        label: 'AES'
      },
    ]
  },
  {
    label: 'Asymmetric', href: '/asymmetric', subItems: [
      {
        title: 'RSA',
        href: '/asymmetric/rsa',
        description: 'A cipher using different keys for encryption and decryption.',
        label: 'RSA'
      },
      {
        title: 'ElGamal',
        href: '/asymmetric/elgamal',
        description: 'A public key encryption algorithm based on the Diffie-Hellman key exchange.',
        label: 'ElGamal'
      },
    ]
  },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-neutral-950 dark:text-neutral-50 text-lg font-bold">
          <img src={Logo} alt="Logo" className="w-8 h-8"/>
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
                  <a href={item.href}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </a>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <ThemeButton/>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="w-6 h-6 text-neutral-950 dark:text-neutral-50"/>
            ) : (
              <HiOutlineMenuAlt3 className="w-6 h-6 text-neutral-950 dark:text-neutral-50"/>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <ul className="flex flex-col space-y-4 py-4 px-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-semibold text-neutral-950 dark:text-neutral-50 hover:text-white"
                >
                  {item.label}
                </a>
                {item.subItems && (
                  <ul className="flex flex-col space-y-2 pl-4 pt-2">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <a
                          href={subItem.href}
                          className="text-neutral-950 dark:text-neutral-50 hover:text-neutral-50"
                        >
                          {subItem.label}
                        </a>
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
>(({className, title, children, ...props}, ref) => {
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
  )
})
ListItem.displayName = "ListItem"

export default Navbar;
