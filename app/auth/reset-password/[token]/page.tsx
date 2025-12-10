"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Password updated");
      router.push("/auth/login");
    } else {
      alert(json.error || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800">
        <h1 className="text-lg font-semibold mb-2">Set new password</h1>
        <input
          type="password"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm"
        >
          Update password
        </button>
      </div>
    </div>
  );
}
