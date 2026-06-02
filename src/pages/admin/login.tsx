import { useNavigate, Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { BrandLogoLink } from "@/components/BrandLogo";
import { login } from "@/lib/admin-store";
import { heroPlant } from "@/lib/images";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@khminfra.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 4) { setError("Enter valid credentials"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (login(email, password, remember)) navigate("/admin/dashboard");
    else { setError("Invalid email or password"); setLoading(false); }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img src={heroPlant} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-slate-950/95" />

      <div className="relative z-10 min-h-screen grid place-items-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 flex justify-center">
            <BrandLogoLink withBackground imageClassName="h-14 w-auto max-w-[240px] sm:h-16" />
          </div>
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-aqua">Admin Portal</p>

          <div
            className="rounded-3xl border border-white/15 p-7 sm:p-9 shadow-2xl"
            style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-white/70">Sign in to manage your website.</p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full rounded-xl border border-white/20 bg-white/5 pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-aqua"
                    placeholder="admin@khminfra.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua" />
                  <input
                    type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full rounded-xl border border-white/20 bg-white/5 pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-aqua"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-aqua" />
                  Remember me
                </label>
                <a className="text-aqua hover:underline" href="#">Forgot password?</a>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </motion.div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-aqua py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <p className="text-center text-[11px] text-white/50">
                Demo credentials: <code className="text-aqua">admin@khminfra.com</code> / <code className="text-aqua">admin123</code>
              </p>
            </form>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-white/70 hover:text-aqua">← Back to website</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
