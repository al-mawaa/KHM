import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Wrench, FolderKanban, Image as ImageIcon, FileText,
  Users, MessageSquare, UsersRound, Settings as SettingsIcon, LogOut, Menu, X,
} from "lucide-react";
import { BrandLogoLink } from "@/components/BrandLogo";
import { isAuthed, logout } from "@/lib/admin-store";

const menu = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/leads", label: "Contact Leads", icon: Users },
  { to: "/admin/team", label: "Team Members", icon: UsersRound },
  { to: "/admin/settings", label: "Website Settings", icon: SettingsIcon },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAuthed()) navigate("/admin/login");
    else setReady(true);
  }, [navigate]);

  useEffect(() => { setOpen(false); }, [pathname]);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center bg-slate-950 text-white">Loading…</div>;
  }

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-100 transform transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <BrandLogoLink
            to="/admin/dashboard"
            withBackground
            imageClassName="h-10 w-auto max-w-[160px]"
          />
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 rounded text-white/70 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem-3.5rem)]">
          {menu.map((m) => {
            const active = pathname === m.to;
            return (
              <Link
                key={m.to}
                to={m.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-aqua/15 text-aqua border border-aqua/30" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <m.icon className="h-4 w-4" />
                {m.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="absolute bottom-0 inset-x-0 flex items-center gap-3 px-5 h-14 border-t border-white/10 text-sm font-medium text-red-300 hover:bg-red-500/10">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="flex items-center justify-between px-4 sm:px-8 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg border border-slate-200"><Menu className="h-5 w-5" /></button>
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xs font-medium text-slate-600 hover:text-aqua-foreground">← View Site</Link>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-aqua text-primary-foreground text-xs font-bold">AD</div>
            </div>
          </div>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-8 max-w-7xl"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
