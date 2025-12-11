"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { FiLogIn } from "react-icons/fi";

type HeaderProps = {

  isLoggedIn: boolean;

};

const navLinks = [

  { href: "/ueber-uns", label: "Über uns" },

  { href: "/produkt", label: "Produkt" },

  { href: "/kontakt", label: "Kontakt" },

];

export default function Header({ isLoggedIn }: HeaderProps) {

  const pathname = usePathname();

  const isActive = (href: string) =>

    href === "/"

      ? pathname === "/"

      : pathname === href || pathname.startsWith(href + "/");

  return (
<header className="sticky top-0 z-40 border-b border-[#FF6037] bg-[var(--color-bg)]/5 backdrop-blur">
<div className="container-max flex items-center justify-between px-4 py-3">

        {/* Logo */}
<Link href="/" className="flex items-center gap-2 text-lg font-semibold shrink-0">
<img

            src="/laygrid-mark.svg"

            alt="LayGrid"

            width={20}

            height={20}

            className="inline-block"

          />
<span className="ml-1 tracking-tight">LayGrid</span>
</Link>

        {/* Navigation */}
<div className="flex items-center gap-8">
<nav className="hidden gap-6 text-sm font-medium md:flex">

            {navLinks.map((link) => (
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

            {isLoggedIn && (
<Link

                href="/planer"

                className={

                  "transition-colors " +

                  (isActive("/planer")

                    ? "text-[#FF6037]"

                    : "text-[var(--color-text)] hover:text-[#FF6037]")

                }
>

                Planer
</Link>

            )}
</nav>

          {/* Login Button */}
<form method="POST" action={isLoggedIn ? "/api/logout" : "/api/login"}>
<button

              type="submit"

              className="flex items-center gap-2 rounded-full border border-[#FF6037] px-4 py-1.5 text-sm font-medium text-[#FF6037] transition-colors hover:bg-[#FF6037] hover:text-black"
>
<FiLogIn className="text-xs" />
<span>{isLoggedIn ? "Abmelden" : "Anmelden"}</span>
</button>
</form>
</div>
</div>
</header>

  );

}
 