import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/ui";
import { useAdminCollection } from "@/lib/admin-store";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { FolderKanban, Wrench, Users, FileText, Eye, MessageSquare, Loader2 } from "lucide-react";


interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  totalLeads: number;
  totalBlogs: number;
  totalTestimonials: number;
  totalVisitors: number;
}

interface WeeklyVisitorData {
  day: string;
  visitors: number;
}

interface LeadsByDayData {
  day: string;
  leads: number;
}

export default function AdminDashboardPage() {
  const [services] = useAdminCollection("services");
  const [projects] = useAdminCollection("projects");
  const [blog] = useAdminCollection("blog");
  const [testimonials] = useAdminCollection("testimonials");
  const [leads, setLeads] = useState<any[]>([]);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyVisitors, setWeeklyVisitors] = useState<WeeklyVisitorData[]>([]);
  const [leadsByDay, setLeadsByDay] = useState<LeadsByDayData[]>([]);

  useEffect(() => {
    async function fetchStats(isRefresh = false) {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message || 'Failed to fetch stats');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }

    async function fetchWeeklyVisitors() {
      try {
        const response = await fetch('/api/admin/dashboard/weekly-visitors');
        const data = await response.json();
        if (data.success) setWeeklyVisitors(data.data);
      } catch (err) {
        console.error('Error fetching weekly visitors:', err);
      }
    }

    async function fetchLeadsByDay() {
      try {
        const response = await fetch('/api/admin/dashboard/leads-by-day');
        const data = await response.json();
        if (data.success) setLeadsByDay(data.data);
      } catch (err) {
        console.error('Error fetching leads by day:', err);
      }
    }

    // Fetch recent leads from MongoDB for the Recent Inquiries widget
    async function fetchRecentLeads() {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (data.success) setLeads(data.data);
      } catch (err) {
        console.error('Error fetching recent leads:', err);
      }
    }

    async function fetchAllData(isRefresh = false) {
      await Promise.all([
        fetchStats(isRefresh),
        fetchWeeklyVisitors(),
        fetchLeadsByDay(),
        fetchRecentLeads(),
      ]);
    }

    // Initial fetch
    fetchAllData();

    // Auto-refresh every 60 seconds
    const intervalId = setInterval(() => fetchAllData(true), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const cards = [
    { label: "Total Projects", value: stats?.totalProjects ?? 0, icon: FolderKanban, to: "/admin/projects", color: "from-sky-500 to-cyan-400" },
    { label: "Total Services", value: stats?.totalServices ?? 0, icon: Wrench, to: "/admin/services", color: "from-emerald-500 to-teal-400" },
    { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: Users, to: "/admin/leads", color: "from-amber-500 to-orange-400" },
    { label: "Total Blogs", value: stats?.totalBlogs ?? 0, icon: FileText, to: "/admin/blog", color: "from-fuchsia-500 to-pink-400" },
    { label: "Website Visitors", value: stats?.totalVisitors ?? 0, icon: Eye, to: "/admin/dashboard", color: "from-indigo-500 to-blue-400" },
    { label: "Testimonials", value: stats?.totalTestimonials ?? 0, icon: MessageSquare, to: "/admin/testimonials", color: "from-rose-500 to-red-400" },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="flex items-center justify-between mb-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex-1">
            {error}
          </div>
        )}
        {refreshing && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Refreshing...</span>
          </div>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-11 w-11 bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            </Card>
          ))
        ) : (
          cards.map((c) => (
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
          ))
        )}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display font-bold">Weekly Visitors</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <LineChart data={weeklyVisitors}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display font-bold">Leads by Day</h3>
          <div className="mt-4 h-60">
            <ResponsiveContainer>
              <BarChart data={leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="leads" fill="#0891b2" radius={[6, 6, 0, 0]} />
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
