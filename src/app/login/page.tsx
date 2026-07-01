"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Verifying credentials...");

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error, { id: loadingToast });
    } else {
      toast.success("Login successful! Welcome back.", { id: loadingToast });
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-60">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#A7F3D0]/60 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#6EE7B7]/40 to-transparent blur-[140px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="text-white font-serif font-bold text-3xl">B</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Welcome Back</h1>
          <p className="text-foreground/60 mt-2 font-light">Sign in to your digital sanctuary account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-primary/10 border border-white/50">
          
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white/50"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-primary to-[#059669] text-white py-3.5 rounded-xl font-medium shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Authenticating..." : "Sign In with Email"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-foreground/50 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          className="w-full bg-white text-gray-700 py-3.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-foreground/50 mt-10 font-light">
          Join the community of Buddha Dharma Sutra
        </p>
      </div>
    </div>
  );
}
