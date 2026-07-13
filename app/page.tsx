import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";

// Everyone lands on the log screen. Admins get extra nav tabs from there.
export default async function Home() {
  await requireProfile();
  redirect("/dashboard");
}
