import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/ui";
import { useAdminCollection } from "@/lib/admin-store";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { FolderKanban, Wrench, Users, FileText, Eye, MessageSquare } from "lucide-react";

const visits = [
  { d: "Mon", v: 420 }, { d: "Tue", v: 510 }, { d: "Wed", v: 480 },
  { d: "Thu", v: 690 }, { d: "Fri", v: 740 }, { d: "Sat", v: 560 }, { d: "Sun", v: 620 },
];

export default function AdminDashboardPage() {
  const [services] = useAdminCollection("services");
  const [projects] = useAdminCollection("projects");
  const [leads] = useAdminCollection("leads");
  const [blog] = useAdminCollection("blog");
  const [testimonials] = useAdminCollection("testimonials");

  const cards = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban, to: "/admin/projects", color: "from-sky-500 to-cyan-400" },
    { label: "Total Services", value: services.length, icon: Wrench, to: "/admin/services", color: "from-emerald-500 to-teal-400" },
    { label: "Total Leads", value: leads.length, icon: Users, to: "/admin/leads", color: "from-amber-500 to-orange-400" },
    { label: "Total Blogs", value: blog.length, icon: FileText, to: "/admin/blog", color: "from-fuchsia-500 to-pink-400" },
    { label: "Website Visitors", value: 4380, icon: Eye, to: "/admin/dashboard", color: "from-indigo-500 to-blue-400" },
    { label: "Testimonials", value: testimonials.length, icon: MessageSquare, to: "/admin/testimonials", color: "from-rose-500 to-red-400" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group">
            <Card className="p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</div>
                  <div className="mt-2 text-3xl font-bold font-display">{c.value}</div>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-md`}>
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display font-bold">Weekly Visitors</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={visits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="d" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-bold">Leads by Day</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={visits.map((d) => ({ d: d.d, v: Math.floor(d.v / 80) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="d" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="v" fill="#0891b2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Recent Inquiries</h3>
            <Link to="/admin/leads" className="text-xs font-semibold text-aqua-foreground hover:underline">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {leads.slice(0, 5).map((l) => (
              <div key={l.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-xs text-slate-500">{l.service}</div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${l.status === "new" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{l.status}</span>
              </div>
            ))}
            {leads.length === 0 && <p className="text-sm text-slate-500 py-6 text-center">No inquiries yet.</p>}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Recent Projects</h3>
            <Link to="/admin/projects" className="text-xs font-semibold text-aqua-foreground hover:underline">Manage</Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3 text-sm">
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-slate-500">{p.category} · {p.location}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
