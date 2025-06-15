"use client";

import Link from "next/link";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  return (
    <header className="flex justify-between items-center p-4 max-w-7xl mx-auto cursor-pointer">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-blue-500">
          <span className="text-2xl font-bold text-blue-500  ">Imagify</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
          Pricing
        </Link>
        {user ? (
          <UserButton />
        ) : (
          <Link
            href="/sign-in"
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
