import { Suspense } from "react";
import { createClient } from "@supabase-lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";
import { getOrdersForUser } from "@/lib/actions/orders";

function AccountFormSkeleton() {
  return (
    <div className="min-h-screen bg-surface pt-28 pb-20 px-6 lg:px-20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-on-surface-variant font-body italic">Loading your archive...</p>
      </div>
    </div>
  );
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersForUser(user.id).catch(() => []);

  return (
    <Suspense fallback={<AccountFormSkeleton />}>
      <AccountForm user={user} orders={orders} />
    </Suspense>
  );
}
