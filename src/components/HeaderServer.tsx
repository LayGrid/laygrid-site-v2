import { cookies } from "next/headers";
import Header from "./Header";

export default async function HeaderServer() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("laygrid_session")?.value);

  return <Header isLoggedIn={isLoggedIn} />;
}