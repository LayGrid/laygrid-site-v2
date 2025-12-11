import Link from "next/link";

export default function Footer() {

  return (
<footer className="mt-16 border-t border-[var(--color-secondary)] bg-[var(--color-bg)]">
<div className="container-max grid gap-8 px-4 py-10 md:grid-cols-4">

        {/* Kontaktblock */}
<div>
<div className="mb-2 text-lg font-semibold">LayGrid</div>
<div className="text-sm leading-relaxed text-[var(--color-text)]/80">
<div>Feldlistrasse 31</div>
<div>9000 St. Gallen</div>
<div className="mt-3">
<a

                href="mailto:laygrid@outlook.com"

                className="hover:text-[var(--color-accent)]"
>

                laygrid@outlook.com
</a>
</div>
<div>
<a

                href="tel:+41789401663"

                className="hover:text-[var(--color-accent)]"
>

                +41 78 940 16 63
</a>
</div>
</div>
</div>

        {/* Navigation */}
<div className="text-sm">
<div className="mb-2 font-semibold">Navigation</div>
<ul className="space-y-1 text-[var(--color-text)]/80">
<li>
<Link href="/" className="hover:text-[var(--color-accent)]">

                Start
</Link>
</li>
<li>
<Link href="/ueber-uns" className="hover:text-[var(--color-accent)]">

                Ueber uns
</Link>
</li>
<li>
<Link href="/produkt" className="hover:text-[var(--color-accent)]">

                Produkt
</Link>
</li>
<li>
<Link href="/kontakt" className="hover:text-[var(--color-accent)]">

                Kontakt
</Link>
</li>
<li>
<Link href="/planer" className="hover:text-[var(--color-accent)]">

                Planer
</Link>
</li>
</ul>
</div>

        {/* Social */}
<div className="text-sm">
<div className="mb-2 font-semibold">Folgen Sie uns:</div>
<div className="flex gap-3 text-[var(--color-text)]/80">
<a

              href="#"

              aria-label="LinkedIn"

              className="hover:text-[var(--color-accent)]"
>

              in
</a>
<a

              href="#"

              aria-label="Twitter"

              className="hover:text-[var(--color-accent)]"
>

              X
</a>
<a

              href="#"

              aria-label="Facebook"

              className="hover:text-[var(--color-accent)]"
>

              f
</a>
</div>
</div>

        {/* Rechtliches */}
<div className="text-sm">
<div className="mb-2 font-semibold">Rechtliches</div>
<ul className="space-y-1 text-[var(--color-text)]/80">
<li>
<Link href="/cookies" className="hover:text-[var(--color-accent)]">

                Cookies
</Link>
</li>
<li>
<Link

                href="/impressum"

                className="hover:text-[var(--color-accent)]"
>

                Impressum
</Link>
</li>
<li>
<Link

                href="/datenschutz"

                className="hover:text-[var(--color-accent)]"
>

                Datenschutz
</Link>
</li>
</ul>
</div>
</div>
<div className="border-t border-[var(--color-secondary)] py-3 text-center text-xs text-[var(--color-text)]/60">

        © {new Date().getFullYear()} LayGrid. Alle Rechte vorbehalten.
</div>
</footer>

  );

}
 