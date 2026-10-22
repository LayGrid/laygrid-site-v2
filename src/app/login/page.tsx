import { Suspense } from "react";
import LoginContent from "./LoginTemp";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Anmeldung wird geladen...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}