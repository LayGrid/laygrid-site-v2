import "./globals.css";

import type { Metadata } from "next";

import HeaderServer from "../components/HeaderServer";

import Footer from "../components/Footer";

export const metadata: Metadata = {

  title: "LayGrid",

  description:

    "LayGrid kombiniert physische 3D-Bausteine mit einem Web-Planer. So planen KMU Betriebsflaechen verständlich, schnell und im Team.",

  icons: {

    icon: "/favicon.png",

    shortcut: "/favicon.png",

    apple: "/favicon.png",

  },

  openGraph: {

    title: "LayGrid",

    description:

      "Physische 3D-Bausteine und Web-Planer fuer klare Layouts, schnelle Entscheidungen und bessere Zusammenarbeit.",

    url: "https://laygrid.ch",

    siteName: "LayGrid",

    images: [{ url: "/og-cover.png", width: 1200, height: 630 }],

    locale: "de_CH",

    type: "website",

  },

  twitter: {

    card: "summary_large_image",

    title: "LayGrid – Betriebsplanung selbst in die Hand nehmen",

    description:

      "Physische 3D-Bausteine und Web-Planer fuer verstaendliche Betriebsplanung im KMU.",

    images: ["/og-cover.png"],

  },

};

export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (
<html lang="de">
<body className="bg-[var(--color-bg)] text-[var(--color-text)]">
<HeaderServer />
<main className="min-h-[calc(100vh-200px)]">{children}</main>
<Footer />
</body>
</html>

  );

}

 