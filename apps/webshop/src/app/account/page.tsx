import type { Metadata } from "next";
import { createClient } from "@supabase-lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";
import { getOrdersForUser } from "@/lib/actions/orders";

export const metadata: Metadata = {
	title: "My Account | The Digital Archivist",
	description: "Manage your archive account, view past orders and update your preferences.",
};

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
