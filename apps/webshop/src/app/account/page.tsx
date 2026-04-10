import { createClient } from "@supabase-lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";
import { getOrdersForUser } from "@/lib/actions/orders";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch orders — falls back to empty array if anything goes wrong
  const orders = await getOrdersForUser(user.id).catch(() => []);

  return <AccountForm user={user} orders={orders} />;
}
