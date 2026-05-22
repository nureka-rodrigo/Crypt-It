import React from "react";
import { IoHeart } from "@react-icons/all-files/io5/IoHeart";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-center p-4">
        <span className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100">
          Made with&nbsp;
          <IoHeart
            className="text-lg text-neutral-950 dark:text-gray-100"
            aria-label="Heart Icon"
          />
          &nbsp;by&nbsp;
        </span>
        <Link to={"https://github.com/nureka-rodrigo"} target="_blank">
          <span className="text-center text-sm font-extrabold text-neutral-950 hover:underline dark:text-neutral-50">
            Nureka Rodrigo
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
