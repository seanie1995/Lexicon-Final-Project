"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@supabase-lib/supabase/client";
import { Eye, EyeOff, Loader2, CheckCircle, User as UserIcon, Mail, Lock, Settings, BookOpen } from "lucide-react";

interface AccountFormProps {
  user: User;
}

type ActiveTab = "profile" | "security" | "preferences";

const inputClasses =
  "w-full px-4 py-3 bg-surface-container-low border border-outline/40 text-on-surface font-label text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-300 placeholder:text-outline/50 disabled:opacity-50 disabled:cursor-not-allowed";

const labelClasses =
  "block text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2";

export default function AccountForm({ user }: AccountFormProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Password change state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState({
    newsletter: false,
    orderUpdates: true,
  });
  const [prefSaved, setPrefSaved] = useState(false);

  const username = user.user_metadata?.username || user.email?.split("@")[0] || "Reader";
  const displayEmail = user.email ?? "";
  const memberSince = new Date(user.created_at).toLocaleDateString("en-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwords.new || !passwords.confirm) {
      setPasswordError("Please fill in all/required fields.");
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError("Sorry, Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });
      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setPasswords({ current: "", new: "", confirm: "" });
      }
    } catch {
      setPasswordError("Sorry, Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = () => {
    // In a real app you'd persist to Supabase user_metadata here
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "preferences", label: "Preferences", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-surface pt-28 pb-20 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-12 border-b border-outline-variant/30 pb-8">
          <div className="flex items-start gap-6">
            {/* Avatar monogram */}
            <div className="w-16 h-16 bg-primary-container flex items-center justify-center shrink-0 border border-outline-variant/20">
              <span className="text-on-primary-container font-headline text-2xl italic">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-label uppercase tracking-widest text-secondary mb-1">
                Your Archive
              </p>
              <h1 className="text-3xl font-serif italic text-primary leading-tight">
                Welcome, {username}.
              </h1>
              <p className="text-on-surface-variant font-body text-sm mt-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar tabs */}
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
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Panel */}
          <div className="flex-1">

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>Username</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-outline/20 text-on-surface font-label text-sm text-outline">
                      <UserIcon className="w-4 h-4 shrink-0 text-outline" />
                      {username}
                    </div>
                    <p className="mt-1.5 text-xs font-label text-outline">
                      Username is set at registration and cannot be changed.
                    </p>
                  </div>

                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-surface-container border border-outline/20 text-on-surface font-label text-sm text-outline">
                      <Mail className="w-4 h-4 shrink-0 text-outline" />
                      {displayEmail}
                    </div>
                    <p className="mt-1.5 text-xs font-label text-outline">
                      To change your email, please contact support.
                    </p>
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

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                  Change Password
                </h2>

                {passwordSuccess && (
                  <div className="mb-6 p-3 bg-primary-fixed text-on-primary-fixed-variant text-sm font-label flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    Password updated successfully.
                  </div>
                )}

                {passwordError && (
                  <div className="mb-6 p-3 bg-error-container text-on-error-container text-sm font-label">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {(["new", "confirm"] as const).map((field) => (
                    <div key={field}>
                      <label className={labelClasses}>
                        {field === "new" ? "New Password" : "Please Confirm New Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[field] ? "text" : "password"}
                          value={passwords[field]}
                          onChange={(e) => {
                            setPasswords((p) => ({ ...p, [field]: e.target.value }));
                            setPasswordError("");
                            setPasswordSuccess(false);
                          }}
                          placeholder={field === "new" ? "Min. 8 characters" : "Please Repeat new password"}
                          disabled={passwordLoading}
                          className={inputClasses}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((s) => ({ ...s, [field]: !s[field] }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                          tabIndex={-1}
                        >
                          {showPasswords[field] ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full py-3 bg-primary text-on-primary font-label uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ── PREFERENCES TAB ── */}
            {activeTab === "preferences" && (
              <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-lg p-8 md:p-10">
                <h2 className="text-xl font-serif text-primary mb-6 border-b border-outline-variant/20 pb-4">
                  Account Preferences
                </h2>

                {prefSaved && (
                  <div className="mb-6 p-3 bg-primary-fixed text-on-primary-fixed-variant text-sm font-label flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    Preferences saved.
                  </div>
                )}

                <div className="space-y-5">
                  {[
                    {
                      key: "newsletter" as const,
                      label: "Newsletter",
                      description: "Receive curated reading recommendations and archive updates.",
                    },
                    {
                      key: "orderUpdates" as const,
                      label: "Order Updates",
                      description: "Get notified about your order status via email.",
                    },
                  ].map(({ key, label, description }) => (
                    <label
                      key={key}
                      className="flex items-start gap-4 cursor-pointer group"
                    >
                      <div className="mt-0.5 relative">
                        <input
                          type="checkbox"
                          checked={preferences[key]}
                          onChange={(e) =>
                            setPreferences((p) => ({ ...p, [key]: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        {/* Custom checkbox */}
                        <div className="w-5 h-5 border border-outline/50 bg-surface-container-low peer-checked:bg-primary peer-checked:border-primary transition-colors duration-200 flex items-center justify-center">
                          {preferences[key] && (
                            <svg
                              className="w-3 h-3 text-on-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="block text-sm font-label uppercase tracking-wider text-on-surface">
                          {label}
                        </span>
                        <span className="block text-xs font-body text-on-surface-variant mt-0.5">
                          {description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="mt-8 w-full py-3 bg-primary text-on-primary font-label uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center"
                >
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
