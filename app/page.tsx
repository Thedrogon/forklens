// app/page.tsx (NEW FILE)
import { auth } from "@/auth"; // Your auth helper
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage"; // Import your client component

export default async function Page() {
  // 1. Check Session on the Server (Fast & Secure)
  const session = await auth();

  // 2. If logged in, redirect IMMEDIATELY (No loading spinners, no loops)
  if (session?.user) {
    redirect("/dashboard");
  }

  // 3. If not logged in, render the Client Component
  return <LandingPage />;
}

