import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Short</h1>
          <p className="text-gray-400 mt-2">Your personal reading & task hub</p>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Create account</h2>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
