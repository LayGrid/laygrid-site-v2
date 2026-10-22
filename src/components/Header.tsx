
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiLogIn, FiLogOut, FiMenu, FiX } from "react-icons/fi";

type HeaderProps = {
  isLoggedIn: boolean;
};

const navLinks = [
  { href: "/produkt", label: "Software" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header({ isLoggedIn }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const links = isLoggedIn
    ? [...navLinks, { href: "/planer", label: "Planer" }]
    : navLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-[#FF6037] bg-[var(--color-bg)]/5 backdrop-blur">

      <div className="container-max flex items-center justify-between px-4 py-3">

        {/* LOGO UND STARTSEITE */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 text-lg font-semibold shrink-0"
        >
          <img
            src="/laygrid-mark.svg"
            alt="LayGrid Logo"
            width={20}
            height={20}
            className="inline-block"
          />

          <span className="ml-1 tracking-tight">
            LayGrid
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-8">

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "transition-colors " +
                  (isActive(link.href)
                    ? "text-[#FF6037]"
                    : "text-[var(--color-text)] hover:text-[#FF6037]")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ANMELDEN ODER ABMELDEN */}
          {isLoggedIn ? (
            <Link
              href="/api/logout"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6037] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#733635] hover:text-white"
            >
              <FiLogOut className="text-sm" />
              <span>Abmelden</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6037] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#733635] hover:text-white"
            >
              <FiLogIn className="text-sm" />
              <span>Anmelden</span>
            </Link>
          )}

          {/* MOBILE MENÜ BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="md:hidden flex items-center justify-center rounded-lg border border-white/20 p-2 text-white transition-colors hover:bg-white/10"
          >
            {menuOpen ? (
              <FiX size={20} />
            ) : (
              <FiMenu size={20} />
            )}
          </button>

        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="md:hidden border-t border-white/10 bg-black/95 px-4 py-4"
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={
                  "text-sm font-medium transition-colors " +
                  (isActive(link.href)
                    ? "text-[#FF6037]"
                    : "text-white hover:text-[#FF6037]")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

    </header>
  );
}
