import { createClient } from "@supabase-lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect the route — send unauthenticated users to login
  if (!user) {
    redirect("/login");
  }

  return <AccountForm user={user} />;
}
