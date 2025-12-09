"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800">
        <h1 className="text-lg font-semibold mb-2">Forgot password</h1>
        <p className="text-xs text-gray-500 mb-4">
          Enter your registered email, we’ll send you a reset link.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm"
        >
          Send reset link
        </button>
        {sent && (
          <p className="mt-2 text-xs text-emerald-500">
            If this email exists, a reset link has been sent.
          </p>
        )}
      </div>
    </div>
  );
}
