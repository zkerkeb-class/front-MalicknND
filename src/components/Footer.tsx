// import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* <Image
              src="/logo.png"
              alt="Imagify"
              width={24}
              height={24}
              className="mr-2"
            /> */}
            <span className="text-sm text-gray-600">
              © All right reserved. Copyright imagify.
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              {/* <Image
                src="/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
              /> */}
              <FaFacebook />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              {/* <Image src="/twitter.svg" alt="Twitter" width={24} height={24} /> */}
              <FaTwitter />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              {/* <Image
                src="/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              /> */}
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
