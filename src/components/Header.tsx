"use client";

import Link from "next/link";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useUserCredits } from "@/context/UserCreditsContext";

const Header = () => {
  const { user } = useUser();
  const { credits } = useUserCredits();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Imagink
            </span>
          </Link>
          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-5 ">
            {user && (
              <>
                <Link
                  href="/gallery"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Galerie
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Tarifs
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/features"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Tarifs
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Indicateur de crédits */}
              <div className="hidden sm:flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    credits > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span>{credits} crédits</span>
              </div>

              {/* UserButton avec configuration mobile */}
              <div className="relative">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-7 sm:h-7",
                      userButtonPopoverCard: "z-[100]",
                      userButtonPopoverActionButton: "text-sm",
                      userButtonPopoverFooter: "text-xs text-gray-500",
                    },
                  }}
                  userProfileMode="modal"
                  afterSignOutUrl="/"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Connexion
              </Link>

              {/* Bouton mobile plus visible */}
              <Link
                href="/sign-in"
                className="sm:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Connexion
              </Link>

              {/* Bouton d'inscription (desktop) */}
              <Link
                href="/sign-up"
                className="hidden sm:block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md text-sm"
              >
                Commencer
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Style global pour améliorer le UserButton en mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .cl-userButtonPopoverCard {
            position: fixed !important;
            top: 70px !important;
            right: 10px !important;
            left: auto !important;
            width: calc(100vw - 20px) !important;
            max-width: 320px !important;
            z-index: 100 !important;
          }

          .cl-userButtonPopoverActionButton {
            padding: 12px 16px !important;
            font-size: 16px !important;
          }

          /* Améliorer la zone de clic */
          .cl-userButtonTrigger {
            padding: 4px !important;
            border-radius: 50% !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
