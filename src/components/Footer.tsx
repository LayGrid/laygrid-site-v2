
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[var(--color-bg)] text-[var(--color-text)]">

      <div className="container-max grid gap-10 px-4 py-12 md:grid-cols-3">

        {/* LAYGRID UND KONTAKT */}
        <div>
          <Link
            href="/"
            className="inline-block text-xl font-semibold tracking-tight hover:text-[#FF6037] transition-colors"
          >
            LayGrid
          </Link>

          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-text)]/70">
            Digitale Produktionsplanung und Optimierung.
          </p>

          <div className="mt-5 space-y-2 text-sm text-[var(--color-text)]/80">

            <div>
              <a
                href="mailto:laygrid@outlook.com"
                className="hover:text-[#FF6037] transition-colors"
              >
                laygrid@outlook.com
              </a>
            </div>

            <div>
              <a
                href="tel:+41789401663"
                className="hover:text-[#FF6037] transition-colors"
              >
                +41 78 940 16 63
              </a>
            </div>

          </div>
        </div>

        {/* NAVIGATION */}
        <div className="text-sm">
          <h3 className="mb-4 font-semibold text-base">
            Navigation
          </h3>

          <ul className="space-y-3 text-[var(--color-text)]/70">

            <li>
              <Link
                href="/produkt"
                className="hover:text-[#FF6037] transition-colors"
              >
                Software
              </Link>
            </li>

            <li>
              <Link
                href="/ueber-uns"
                className="hover:text-[#FF6037] transition-colors"
              >
                Über uns
              </Link>
            </li>

            <li>
              <Link
                href="/kontakt"
                className="hover:text-[#FF6037] transition-colors"
              >
                Kontakt
              </Link>
            </li>

          </ul>
        </div>

        {/* RECHTLICHES */}
        <div className="text-sm">
          <h3 className="mb-4 font-semibold text-base">
            Rechtliches
          </h3>

          <ul className="space-y-3 text-[var(--color-text)]/70">

            <li>
              <Link
                href="/impressum"
                className="hover:text-[#FF6037] transition-colors"
              >
                Impressum
              </Link>
            </li>

            <li>
              <Link
                href="/datenschutz"
                className="hover:text-[#FF6037] transition-colors"
              >
                Datenschutz
              </Link>
            </li>

            <li>
              <Link
                href="/cookies"
                className="hover:text-[#FF6037] transition-colors"
              >
                Cookies
              </Link>
            </li>

          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 py-5 text-center">

        <p className="text-xs text-[var(--color-text)]/50">
          © {new Date().getFullYear()} LayGrid.
          Alle Rechte vorbehalten.
        </p>

      </div>

    </footer>
  );
}
