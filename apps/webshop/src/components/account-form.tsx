"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@supabase-lib/supabase/client";
import type { OrderWithRelations } from "@/app/types/prisma";
import { useCart } from "@/lib/contexts/cart-context";
import Link from "next/link";
import Image from "next/image";
import {
  Eye, EyeOff, Loader2, CheckCircle,
  User as UserIcon, Mail, Lock, Settings,
  BookOpen, ShoppingBag, Package, ArrowRight, X
} from "lucide-react";

interface AccountFormProps {
  user: User;
  orders: OrderWithRelations[];
}

type ActiveTab = "profile" | "orders" | "security" | "preferences";

const QUOTES = [
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "It is a truth universally acknowledged that a reader in possession of a good book must be in want of more time.", author: "Jane Austen (adapted)" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "A book is a dream that you hold in your hands.", author: "Neil Gaiman" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-surface-container text-on-surface-variant",
  PAID:      "bg-primary-fixed text-on-primary-fixed-variant",
  SHIPPED:   "bg-secondary-container text-on-secondary-container",
  DELIVERED: "bg-primary-fixed text-on-primary-fixed-variant",
  CANCELLED: "bg-error-container text-on-error-container",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending", PAID: "Paid", SHIPPED: "Shipped",
  DELIVERED: "Delivered", CANCELLED: "Cancelled",
};

const BookSpinner = () => (
  <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
    <div className="relative w-16 h-16" style={{ perspective: "200px" }}>
      <style>{`
        @keyframes pageTurn {
          0%   { transform: rotateY(0deg);   opacity: 1; }
          50%  { transform: rotateY(-90deg); opacity: 0.4; }
          100% { transform: rotateY(0deg);   opacity: 1; }
        }
        .page { animation: pageTurn 1.2s ease-in-out infinite; transform-origin: left center; }
        .page:nth-child(2) { animation-delay: 0.2s; }
        .page:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="28" y="8" width="4" height="48" fill="#4f1819" rx="1"/>
        <rect x="8" y="8" width="22" height="48" rx="1" fill="#6b2d2d" opacity="0.8"/>
        <rect x="32" y="8" width="22" height="48" rx="1" fill="#6b2d2d" opacity="0.6"/>
        <rect className="page" x="29" y="10" width="20" height="44" rx="0" fill="#fff9eb" opacity="0.9"/>
        <rect className="page" x="29" y="10" width="18" height="44" rx="0" fill="#fff3d6" opacity="0.7"/>
        <rect className="page" x="29" y="10" width="16" height="44" rx="0" fill="#ffe8b0" opacity="0.5"/>
        <rect x="11" y="18" width="16" height="1.5" rx="1" fill="#4f1819" opacity="0.3"/>
        <rect x="11" y="22" width="14" height="1.5" rx="1" fill="#4f1819" opacity="0.3"/>
        <rect x="11" y="26" width="16" height="1.5" rx="1" fill="#4f1819" opacity="0.3"/>
        <rect x="11" y="30" width="12" height="1.5" rx="1" fill="#4f1819" opacity="0.3"/>
      </svg>
    </div>
    <p className="font-body italic text-secondary text-sm">Opening your archive…</p>
  </div>
);

const inputClasses =
  "w-full px-4 py-3 bg-surface-container-low border border-outline/40 text-on-surface font-label text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-300 placeholder:text-outline/50 disabled:opacity-50 disabled:cursor-not-allowed";

const labelClasses =
  "block text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2";

export default function AccountForm({ user, orders }: AccountFormProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [loading, setLoading] = useState(true);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]); {/* Picks a random quote once on mount — stays the same during the session */}
  
  {/* Cart lives in localStorage via CartContext —  and therefdore no DBase needed; persists between page refreshes */ }
  const { cartItems, removeFromCart, setIsCartOpen } = useCart();

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [preferences, setPreferences] = useState({ newsletter: false, orderUpdates: true });
  const [prefSaved, setPrefSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400); {/* Book spinner delay, otherwise it flashes too fast to be seen */}
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <BookSpinner />;

  const username = user.user_metadata?.username || user.email?.split("@")[0] || "Reader";
  const displayEmail = user.email ?? "";
  const memberSince = new Date(user.created_at).toLocaleDateString("en-SE", {
    year: "numeric", month: "long", day: "numeric",
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (!passwords.new || !passwords.confirm) { setPasswordError("Please fill in all/required fields."); return; }
    if (passwords.new.length < 8) { setPasswordError("New password must be at least 8 characters."); return; }
    if (passwords.new !== passwords.confirm) { setPasswordError("Sorry, Passwords do not match."); return; }
    setPasswordLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) { setPasswordError(error.message); }
      else { setPasswordSuccess(true); setPasswords({ current: "", new: "", confirm: "" }); }
    } catch { setPasswordError("Sorry, Something went wrong. Please try again."); }
    finally { setPasswordLoading(false); }
  };

  const handleSavePreferences = () => {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",     label: "Profile",     icon: <UserIcon className="w-4 h-4" /> },
    { id: "orders",      label: "Orders",      icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "security",    label: "Security",    icon: <Lock className="w-4 h-4" /> },
    { id: "preferences", label: "Preferences", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-surface pt-28 pb-20 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto">

        {/* Random quote */}
        <div className="mb-10 border-l-2 border-primary/30 pl-5">
          <p className="font-body italic text-on-surface-variant leading-relaxed text-sm md:text-base">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary mt-2">
            — {quote.author}
          </p>
        </div>

        {/* Page header */}
        <div className="mb-12 border-b border-outline-variant/30 pb-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary-container flex items-center justify-center shrink-0 border border-outline-variant/20">
                <span className="text-on-primary-container font-headline text-2xl italic">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-label uppercase tracking-widest text-secondary mb-1">Your Archive</p>
                <h1 className="text-3xl font-serif italic text-primary leading-tight">
                  Welcome, {username}.
                </h1>
                <p className="text-on-surface-variant font-body text-sm mt-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* Quick stats — fills the empty space on the right */}
            <div className="flex gap-4 flex-wrap">
              <div className="bg-surface-container-low border border-outline-variant/20 px-5 py-3 text-center min-w-[80px]">
                <p className="text-2xl font-serif text-primary">{orders.length}</p>
                <p className="text-[10px] font-label uppercase tracking-widest text-outline mt-0.5">Orders</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/20 px-5 py-3 text-center min-w-[80px]">
                <p className="text-2xl font-serif text-primary">{cartItems.length}</p>
                <p className="text-[10px] font-label uppercase tracking-widest text-outline mt-0.5">In Cart</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/20 px-5 py-3 text-center min-w-[80px]">
                <p className="text-2xl font-serif text-primary">
                  {orders.filter(o => o.status === "DELIVERED").length}
                </p>
                <p className="text-[10px] font-label uppercase tracking-widest text-outline mt-0.5">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout — wider max width, sidebar + panel */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <nav className="lg:w-48 shrink-0">
            <ul className="flex lg:flex-col gap-1">
              {tabs.map((tab) => (
                <li key={tab.id} className="flex-1 lg:flex-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-label uppercase tracking-wider transition-colors duration-200 text-left
                      ${activeTab === tab.id
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.id === "orders" && orders.length > 0 && (
                      <span className="ml-auto text-[10px] bg-primary-fixed text-on-primary-fixed-variant px-1.5 py-0.5 font-label">
                        {orders.length}
                      </span>
                    )}
                    {tab.id === "orders" && cartItems.length > 0 && orders.length === 0 && (
                      <span className="ml-auto text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 font-label">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Cart quick-open below sidebar */}
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="mt-4 w-full flex items-center justify-between gap-2 px-4 py-3 border border-outline-variant/30 text-xs font-label uppercase tracking-wider text-on-surface-variant hover:bg-surface-container transition-colors duration-200"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  View Cart
                </span>
                <span className="bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              </button>
            )}
          </nav>

          {/* Panel */}
          <div className="flex-1 min-w-0">

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                  Profile Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>Username</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-outline/20 text-on-surface font-label text-sm text-outline">
                      <UserIcon className="w-4 h-4 shrink-0 text-outline" />{username}
                    </div>
                    <p className="mt-1.5 text-xs font-label text-outline">Username is set at registration and cannot be changed.</p>
                  </div>
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-outline/20 text-on-surface font-label text-sm text-outline">
                      <Mail className="w-4 h-4 shrink-0 text-outline" />{displayEmail}
                    </div>
                    <p className="mt-1.5 text-xs font-label text-outline">To change your email, please contact support.</p>
                  </div>
                  <div>
                    <label className={labelClasses}>Account Status</label>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      <span className="text-sm font-label text-on-surface">
                        {user.email_confirmed_at ? "Verified" : "Awaiting email verification"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-4">

                {/* Cart preview — shown at top of orders if cart has items */}
                {cartItems.length > 0 && (
                  <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-serif text-primary">
                        Currently in your cart
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="text-xs font-label uppercase tracking-wider text-secondary hover:text-primary transition-colors flex items-center gap-1"
                      >
                        Open cart <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2 border-b border-outline-variant/10 last:border-0">
                          {/* Thumbnail */}
                          {item.thumbnail && (
                            <div className="w-10 h-14 shrink-0 overflow-hidden bg-surface-container">
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                width={40}
                                height={56}
                                className="w-full h-full object-cover grayscale-[20%]"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-body text-on-surface truncate">{item.title}</p>
                            <p className="text-xs font-label text-outline mt-0.5">
                              {item.author?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <p className="text-sm font-label text-primary">
                              {(item.price).toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-outline hover:text-error transition-colors"
                              title="Remove from cart"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart total + checkout */}
                    <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-4 flex-wrap">
                      <p className="text-sm font-label text-on-surface-variant">
                        Total:{" "}
                        <span className="text-primary font-semibold">
                          {(cartTotal).toLocaleString("sv-SE", { style: "currency", currency: "SEK" })}
                        </span>
                      </p>
                      <Link
                        href="/checkout"
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-xs font-label uppercase tracking-wider hover:bg-primary/90 transition-colors duration-300"
                      >
                        Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Past orders */}
                <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                  <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                    Your Orders
                  </h2>

                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                      <Package className="w-10 h-10 text-outline/40" />
                      <p className="font-serif italic text-on-surface-variant text-lg">No orders yet.</p>
                      <p className="text-xs font-body text-outline tracking-wide">
                        When you purchase something, it will show up here. Thanks!
                      </p>
                      <Link
                        href="/catalog"
                        className="mt-2 flex items-center gap-2 text-xs font-label uppercase tracking-wider text-primary hover:underline underline-offset-4"
                      >
                        Browse the catalog <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-outline-variant/20 bg-surface-container-low p-5 space-y-3">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <p className="text-xs font-label uppercase tracking-widest text-outline mb-1">Order</p>
                              <p className="font-label text-sm text-on-surface" title={order.id}>
                                #{order.id.slice(0, 8)}…
                              </p>
                            </div>
                            <span className={`inline-block text-[11px] font-label uppercase tracking-wider px-2.5 py-1 ${STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING}`}>
                              {STATUS_LABELS[order.status] ?? order.status}
                            </span>
                          </div>
                          <div className="border-t border-outline-variant/10 pt-3 space-y-1.5">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-baseline gap-4">
                                <p className="text-sm font-body text-on-surface truncate">{item.title}</p>
                                <p className="text-xs font-label text-outline shrink-0">
                                  {(item.unitPrice).toLocaleString("sv-SE", { style: "currency", currency: order.currency.toUpperCase() })}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-outline-variant/10 pt-3 flex justify-between items-center flex-wrap gap-2">
                            <p className="text-xs font-body text-outline">
                              {new Date(order.createdAt).toLocaleDateString("en-SE", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                            <p className="text-sm font-label text-on-surface">
                              Total:{" "}
                              <span className="text-primary font-semibold">
                                {(order.totalAmount).toLocaleString("sv-SE", { style: "currency", currency: order.currency.toUpperCase() })}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECURITY TAB */}

            {activeTab === "security" && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                  Change Password
                </h2>
                {passwordSuccess && (
                  <div className="mb-6 p-3 bg-primary-fixed text-on-primary-fixed-variant text-sm font-label flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />Password updated successfully.
                  </div>
                )}
                {passwordError && (
                  <div className="mb-6 p-3 bg-error-container text-on-error-container text-sm font-label">{passwordError}</div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {(["new", "confirm"] as const).map((field) => (
                    <div key={field}>
                      <label className={labelClasses}>{field === "new" ? "New Password" : "Please Confirm New Password"}</label>
                      <div className="relative">
                        <input
                          type={showPasswords[field] ? "text" : "password"}
                          value={passwords[field]}
                          onChange={(e) => { setPasswords((p) => ({ ...p, [field]: e.target.value })); setPasswordError(""); setPasswordSuccess(false); }}
                          placeholder={field === "new" ? "Min. 8 characters" : "Please Repeat new password"}
                          disabled={passwordLoading}
                          className={inputClasses}
                        />
                        <button type="button" onClick={() => setShowPasswords((s) => ({ ...s, [field]: !s[field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" tabIndex={-1}>
                          {showPasswords[field] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={passwordLoading} className="w-full py-3 bg-primary text-on-primary font-label uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {passwordLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Updating…</> : "Update Password"}
                  </button>
                </form>
              </div>
            )}

            {/* PREFERENCES TAB */}

            {activeTab === "preferences" && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                  Account Preferences
                </h2>
                {prefSaved && (
                  <div className="mb-6 p-3 bg-primary-fixed text-on-primary-fixed-variant text-sm font-label flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />Preferences saved.
                  </div>
                )}
                <div className="space-y-5">
                  {[
                    { key: "newsletter" as const, label: "Newsletter", description: "Receive curated reading recommendations and archive updates." },
                    { key: "orderUpdates" as const, label: "Order Updates", description: "Get notified about your order status via email." },
                  ].map(({ key, label, description }) => (
                    <label key={key} className="flex items-start gap-4 cursor-pointer group">
                      <div className="mt-0.5 relative">
                        <input type="checkbox" checked={preferences[key]} onChange={(e) => setPreferences((p) => ({ ...p, [key]: e.target.checked }))} className="sr-only peer" />
                        <div className="w-5 h-5 border border-outline/50 bg-surface-container-low peer-checked:bg-primary peer-checked:border-primary transition-colors duration-200 flex items-center justify-center">
                          {preferences[key] && (
                            <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="block text-sm font-label uppercase tracking-wider text-on-surface">{label}</span>
                        <span className="block text-xs font-body text-on-surface-variant mt-0.5">{description}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <button type="button" onClick={handleSavePreferences} className="mt-8 w-full py-3 bg-primary text-on-primary font-label uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center">
                  Save Preferences
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
