import React from "react";
import {IoHeart} from "@react-icons/all-files/io5/IoHeart";

const Footer: React.FC = () => {

  return (
    <footer className="mt-auto">
      <div className="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-center">
        <span className="inline-flex items-center text-sm text-gray-900 dark:text-gray-100">
          Made with&nbsp;
          <IoHeart
            className="text-lg dark:text-gray-100 text-neutral-950"
            aria-label="Heart Icon"
          />
          &nbsp;by
        </span>
        <span className="text-sm text-neutral-950 dark:text-neutral-50 font-extrabold text-center">
          &nbsp;Nureka Rodrigo
        </span>
      </div>
    </footer>
  );
};

export default Footer;
