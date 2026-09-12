"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">✉️</div>
        <h3 className="text-lg font-semibold text-gray-100">Check your email</h3>
        <p className="text-sm text-gray-400">
          We sent a confirmation link to <strong className="text-gray-200">{email}</strong>. Click it to
          activate your account.
        </p>
        <Link href="/login" className="text-accent hover:text-accent-hover text-sm transition-colors">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-surface-card border border-surface-border rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-surface-card border border-surface-border rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          placeholder="Min 6 characters"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
