import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
        <p className="text-sm text-stone-400 dark:text-stone-500">
          Made with <span className="text-amber-500">♥</span> by{" "}
          <Link
            to="https://github.com/nureka-rodrigo"
            target="_blank"
            className="font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
          >
            Nureka Rodrigo
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
