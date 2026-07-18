"use client";

import { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { Activity, BookOpen, Users, Search } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ sutras: 0, blogs: 0, books: 0 });
  const [analytics, setAnalytics] = useState<any>({
    chartData: [],
    topPages: [],
    topSearches: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Parallel fetches for speed
      const [sutrasRes, blogsRes, booksRes, analyticsRes] = await Promise.all([
        fetch("/api/sutras"),
        fetch("/api/admin/blogs"),
        fetch("/api/books"),
        fetch("/api/analytics")
      ]);

      const [sutras, blogs, books, analyticsData] = await Promise.all([
        sutrasRes.json(),
        blogsRes.json(),
        booksRes.json(),
        analyticsRes.json()
      ]);

      setStats({
        sutras: sutras.data?.length || 0,
        blogs: blogs.data?.length || 0,
        books: books.data?.length || 0
      });

      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Dashboard Analytics...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 font-serif">Dashboard Overview</h1>
      
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Sutras" value={stats.sutras.toString()} color="bg-blue-50 text-blue-600" border="border-blue-200" icon={<BookOpen size={24} />} />
        <StatCard title="Total Blogs" value={stats.blogs.toString()} color="bg-emerald-50 text-emerald-600" border="border-emerald-200" icon={<Activity size={24} />} />
        <StatCard title="Total Books" value={stats.books.toString()} color="bg-purple-50 text-purple-600" border="border-purple-200" icon={<Users size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visitors Chart (Left, 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="text-primary" />
            Unique Visitors (Last 7 Days)
          </h2>
          <div className="h-[300px] w-full">
            {analytics.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#059669" strokeWidth={3} dot={{r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">No visit data yet. Wait a few hours.</div>
            )}
          </div>
        </div>

        {/* Top Pages & Searches (Right, 1 col) */}
        <div className="space-y-8">
          
          {/* Top Pages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4">
              Top Visited Pages
            </h2>
            <div className="space-y-4">
              {analytics.topPages.length > 0 ? analytics.topPages.map((page: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-600 truncate max-w-[200px]" title={page.path}>
                    {page.path === '/' ? '/home' : page.path}
                  </span>
                  <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {page.views}
                  </span>
                </div>
              )) : (
                <div className="text-sm text-gray-400">No page data.</div>
              )}
            </div>
          </div>

          {/* Top Searches */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Search size={18} className="text-gray-400" />
              Recent Searches
            </h2>
            <div className="space-y-4">
              {analytics.topSearches.length > 0 ? analytics.topSearches.map((search: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium capitalize">
                    "{search.query}"
                  </span>
                  <span className="text-xs text-gray-400">{search.count} times</span>
                </div>
              )) : (
                <div className="text-sm text-gray-400">No recent searches.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, border, icon }: { title: string, value: string, color: string, border: string, icon: React.ReactNode }) {
  return (
    <div className={`p-6 rounded-2xl border ${border} ${color} flex items-center justify-between gap-4 transition-transform hover:-translate-y-1 duration-300`}>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-bold font-serif">{value}</p>
      </div>
      <div className="p-4 bg-white/50 rounded-full">
        {icon}
      </div>
    </div>
  );
}
