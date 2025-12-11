// KEIN "use client" – das ist eine Server Component
import Header from "./Header";
import { cookies } from "next/headers";

export default async function HeaderServer() {
  // In Next.js 15 ist cookies() async
  const cookieStore = await cookies();
  const loggedIn = !!cookieStore.get("lg_session")?.value;

  return <Header isLoggedIn={loggedIn} />;
}
