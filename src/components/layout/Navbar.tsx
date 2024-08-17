import React, {useState} from 'react';
import {ThemeButton} from '@/components/other/ThemeButton';
import {HiOutlineMenuAlt3} from "@react-icons/all-files/hi/HiOutlineMenuAlt3";
import {IoMdClose} from "@react-icons/all-files/io/IoMdClose";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {label: 'Home', href: '/'},
  {label: 'About', href: '/about'},
  {label: 'Services', href: '/services'},
  {label: 'Contact', href: '/contact'},
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
          Cypher-It
        </div>
        <ul className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-neutral-950 dark:text-neutral-50"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <ThemeButton/>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="size-6"/>
            ) : (
              <HiOutlineMenuAlt3 className="size-6"/>
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
                  className="text-neutral-50 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
