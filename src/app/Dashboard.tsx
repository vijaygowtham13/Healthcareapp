"use client";


import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
Search,
ChevronDown,
ChevronRight,
Download,
Plus,
LogIn,
EllipsisVertical,
Settings,
HelpCircle,
ChevronLeft,
ChevronUp,
} from "lucide-react";

// ✅ Import Recharts directly (fixes XAxis, YAxis, ReferenceLine, ReferenceDot errors)
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer,
ReferenceLine,
ReferenceDot,
AreaChart,
Area,
} from "recharts";

// ---- Utility primitives (Cards, Badges, Buttons) ----

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`bg-white rounded-2xl shadow-sm ring-1 ring-black/5 ${className}`} {...props}>{children}</div>
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`px-5 pt-5 ${className}`} {...props}>{children}</div>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`px-5 pb-5 ${className}`} {...props}>{children}</div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "soft" }>
  = ({ className = "", variant = "secondary", children, ...props }) => {
  const base = "inline-flex items-center gap-2 rounded-xl text-sm font-medium px-3.5 py-2.5 transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    soft: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
  );
};

const Badge: React.FC<{ tone?: "success" | "danger" | "warning" | "muted"; children: React.ReactNode }>
  = ({ tone = "muted", children }) => {
  const styles: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    muted: "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
  };
  return <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${styles[tone]}`}>{children}</span>;
};

function exportToCSV(data: Record<string, unknown>[], filename: string) {

  if (!data || data.length === 0) return;

  const keys = Object.keys(data[0]);
  const rows = data.map((row) => keys.map((k) => row[k]).join(","));
  const csv = [keys.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}








// Simple Dropdown component (no external dependency)
function Dropdown<T extends string>({ label, items, onChange, align = "end" }: { label: React.ReactNode; items: { label: string; value: T }[]; onChange: (value: T) => void; align?: "start" | "end" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="secondary" className="!py-1 !px-1" onClick={() => setOpen(o => !o)}>
        <span className="text-sm text-gray-800 cursor-pointer">{label}</span>
        <ChevronDown className="h-4 w-4 text-gray-500 cursor-pointer" />
      </Button>
      {open && (
        <div className={`absolute z-20 mt-2 min-w-[10rem] rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 ${align === "end" ? "right-0" : "left-0"}`} onMouseLeave={() => setOpen(false)}>
          {items.map(it => (
            <button key={it.value} className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer" onClick={() => { onChange(it.value); setOpen(false); }}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Fake data generation ----

function makeSeries(seed = 1) {
  const rng = (n: number) => Math.abs(Math.sin(n * seed)) * 100;
  const days = Array.from({ length: 26 }, (_, i) => i + 1);
  return days.map((d) => ({ day: String(d), value: Math.round(30000 + rng(d) * 1000) }));
}
function makeBookings() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => ({ m, value: 800 + i * 160 + Math.round(Math.sin(i) * 120) }));
}

const initialConsultants = [
  { doctor: "Terry Culhane", time: "11:45pm", status: "Active" as const },
  { doctor: "Jaxson Calzoni", time: "11:15pm", status: "In-Active" as const },
  { doctor: "Kianna Press", time: "11:40pm", status: "Confirmed" as const },
  { doctor: "James Torff", time: "11:15pm", status: "In-Active" as const },
  { doctor: "Haylie Vaccaro", time: "10:45pm", status: "In-Active" as const },
  { doctor: "Zaire Franci", time: "10:30pm", status: "Confirmed" as const },
  { doctor: "Ahmad Westerve", time: "10:00pm", status: "Confirmed" as const },
];

const initialActivities = [
  { name: "Ryan Gouse", doctor: "Terry Culhane", time: "11:45pm", type: "Chat", status: "Confirmed" as const },
  { name: "Jakob Workman", doctor: "Jaxson Calzoni", time: "11:15pm", type: "Video Call", status: "Completed" as const },
  { name: "Madelyn Franci", doctor: "Kianna Press", time: "11:40pm", type: "Chat", status: "Confirmed" as const },
  { name: "Kalya Press", doctor: "James Torff", time: "11:15pm", type: "Call", status: "Confirmed" as const },
  { name: "Angel Curtis", doctor: "Haylie Vaccaro", time: "10:45pm", type: "Call", status: "Confirmed" as const },
  { name: "Kadin Bergson", doctor: "Zaire Franci", time: "10:30pm", type: "Video Call", status: "Cancelled" as const },
  { name: "Gustavo Vaccar", doctor: "Ahmad Westerve", time: "10:00pm", type: "Video Call", status: "Confirmed" as const },
];
// Status badge mapping
function statusBadge(status: string) {
  switch (status) {
    case "Active":
    case "Confirmed":
      return <Badge tone="success">{status}</Badge>;
    case "In-Active":
      return <Badge tone="muted">{status}</Badge>;
    case "Completed":
      return <Badge tone="warning">{status}</Badge>;
    case "Cancelled":
      return <Badge tone="danger">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

// ---- Main Component ----
export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>({ name: "Dr Prerna" });
  const [period, setPeriod] = useState<"this_month" | "last_month" | "custom">("this_month");
  const [series, setSeries] = useState(makeSeries());
  const [bookings, setBookings] = useState(makeBookings());

  // Auto-refresh stub every minute — replace fetchers with real API calls
  useEffect(() => {
    const id = setInterval(() => {
      setSeries(makeSeries(Math.random() * 10 + 1));
      setBookings(makeBookings());
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const totals = useMemo(() => ([
    { label: "Total customers", value: "2,420", delta: "+40%", tone: "success" as const },
    { label: "Total Consultants", value: "1,210", delta: "-10%", tone: "danger" as const },
    { label: "Total Live Consultants", value: "1,210", delta: "-10%", tone: "danger" as const },
    { label: "Revenue", value: "$9316", delta: "+20%", tone: "success" as const },
  ]), []);

  // Fake login handler 
  function handleGoogleLogin() {
    const name = prompt("Enter Google account name (demo)") || "Kunal Bro";
    setUser({ name });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Shell */}
      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="flex min-h-screen flex-col justify-between border-r border-gray-200 bg-white px-4 py-4">
          <div>
            {/* Brand */}
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500" />
              <div className="font-semibold">Sukoon</div>
            </div>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input placeholder="Search" className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500" />
            </div>
            {/* Nav groups */}
            <NavGroup title="Dashboard" defaultOpen>
              <NavItem label="Overview" active />
              <NavItem label="Notifications" badge="10" />
              <NavItem label="Transition History" />
            </NavGroup>

           <NavGroup title="Reporting">
            <></>
            </NavGroup>



<NavGroup title="Users">
<></>
</NavGroup>
          </div>
          {/* Footer (Support / Settings + Login) */}
          <div>
            <div className="space-y-1">
              <NavItem icon={<HelpCircle className="h-4 w-4" />} label="Support" />
              <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gray-100" />
                <div>
                  <div className="text-sm font-medium">{user?.name || "Guest"}</div>
                  <div className="text-xs text-gray-500">dr prerna@sukoon.com</div>
                </div>
              </div>
              <button onClick={handleGoogleLogin} className="rounded-lg p-2 hover:bg-gray-50" title="Login with Google (demo)">
                <LogIn className="h-5 w-5 text-gray-500 cursor-pointer" />
              </button>
            </div>
          </div>
        </aside>
        {/* Main */}
        <main className="mr-6 mt-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, {user?.name || "Guest"}</h1>
              <p className="text-sm text-gray-500">Track, manage your customers</p>
            </div>
            <div className="flex items-center gap-2">
           <Button
  variant="secondary"
  onClick={() => exportToCSV(initialConsultants, "consultants.csv")}
>
  <Download className="h-4 w-4" /> Export
</Button>

         <Link href="/Csvupload">
  <Button variant="primary">
    <Plus className="h-4 w-4" /> Add
  </Button>
</Link>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {totals.map((t) => (
              <Card key={t.label}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="text-sm text-gray-500 cursor-pointer">{t.label}</div>
                    <button className="rounded-lg p-1 hover:bg-gray-50 cursor-pointer"><EllipsisVertical className="h-4 w-4 text-gray-400 cursor-pointer" /></button>
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">{t.value}</div>
                </CardHeader>
                <CardContent className="pt-0">
                  {t.tone === "success" ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-600"><ChevronUp className="h-4 w-4" />{t.delta}<span className="text-gray-400">vs last month</span></div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-red-600"><ChevronDown className="h-4 w-4" />{t.delta}<span className="text-gray-400">vs last month</span></div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Sales Funnel</div>
                  <Dropdown
                    label={period === "this_month" ? "This Month" : period === "last_month" ? "Last Month" : "Custom"}
                    items={[
                      { label: "This Month", value: "this_month" },
                      { label: "Last Month", value: "last_month" },
                      { label: "Custom", value: "custom" },
                    ]}
                    onChange={(v) => setPeriod(v)}
                  />
                </div>
              </CardHeader>
              <CardContent>
             
<div className="h-64">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={series}
      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
      <XAxis
        dataKey="day"
        tickLine={false}
        axisLine={false}
        // Fix: use stroke for tick color
        tick={{ stroke: "#94a3b8", fontSize: 12 }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ stroke: "#94a3b8", fontSize: 12 }}
      />
      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }} />
      <ReferenceLine x="17" stroke="#10b981" strokeDasharray="3 3" />
      <ReferenceDot
        x="17"
        y={series[16]?.value}
        r={5}
        fill="#10b981"
        stroke="#10b981"
      />
      <Line
        type="monotone"
        dataKey="value"
        strokeWidth={2}
        stroke="#10b981"
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
</div>







              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Bookings</div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Chat</div>
                    <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Video Call</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
  <AreaChart data={bookings} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
    <XAxis
      dataKey="m"
      tickLine={false}
      axisLine={false}
      tick={{ stroke: "#94a3b8", fontSize: 12 }}
    />
    <YAxis hide />
    <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }} />
    <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#g1)" strokeWidth={2} />
  </AreaChart>
</ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Tables */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Consultant Activity&apos;s</div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Button variant="secondary" className="!py-2 !px-3 cursor-pointer"><Plus className="h-4 w-4 cursor-pointer" /> More filters</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table columns={["Doctor Name", "Time", "Status"]}>
                  {initialConsultants.map((r) => (
                    <tr key={r.doctor} className="border-t border-gray-100">
                      <td className="py-3 text-sm">{r.doctor}</td>
                      <td className="py-3 text-sm text-gray-600">{r.time}</td>
                      <td className="py-3">{statusBadge(r.status)}</td>
                    </tr>
                  ))}
                </Table>
                <TableFooter />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Recent Activity&apos; s</div>
                  <Dropdown
                    label="All time"
                    items={[{ label: "All time", value: "all" }, { label: "Last 30 days", value: "30" }, { label: "Last 7 days", value: "7" }]}
                    onChange={() => {}}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table columns={["Name", "Doctor Name", "Time", "Type", "Status"]}>
                  {initialActivities.map((r, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-3 text-sm">{r.name}</td>
                      <td className="py-3 text-sm">{r.doctor}</td>
                      <td className="py-3 text-sm text-gray-600">{r.time}</td>
                      <td className="py-3 text-sm text-gray-600">{r.type}</td>
                      <td className="py-3">{statusBadge(r.status)}</td>
                    </tr>
                  ))}
                </Table>
                <TableFooter />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

// ---- Subcomponents ----
function NavGroup({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[13px] font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
        <span>{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
      </button>
      {open && (
        <div className="mt-1 space-y-1 pl-2 cursor-pointer">{children}</div>
      )}
    </div>
  );
}


function NavItem({ label, active, badge, icon }: { label: string; active?: boolean; badge?: string; icon?: React.ReactNode }) {
  return (
    <button className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm ${active ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50 cursor-pointer"}`}>
      <span className="flex items-center gap-2">{icon}<span>{label}</span></span>
      {badge && <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 cursor-pointer">{badge}</span>}
    </button>
  );
}


function Table({ columns, children }: { columns: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {children}
        </tbody>
      </table>
    </div>
  );
}

function TableFooter() {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-2 ">
        <Button variant="secondary" className="!py-1.5 !px-3 cursor-pointer"><ChevronLeft className="h-4 w-4" /> Previous</Button>
        <Button variant="secondary" className="!py-1.5 !px-3 cursor-pointer">Next</Button>
      </div>
      <div>Page 1 of 10</div>
    </div>
  );
}
