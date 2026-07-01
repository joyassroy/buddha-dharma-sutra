export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 font-serif">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Sutras" value="0" color="bg-blue-50 text-blue-600" border="border-blue-200" />
        <StatCard title="Total Blogs" value="0" color="bg-emerald-50 text-emerald-600" border="border-emerald-200" />
        <StatCard title="Total Books" value="0" color="bg-purple-50 text-purple-600" border="border-purple-200" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Admin Panel</h2>
        <p className="text-gray-600 leading-relaxed">
          From the sidebar on the left, you can navigate to different modules to add, edit, or delete content across the platform. 
          All changes made here are instantly reflected on the main website.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, border }: { title: string, value: string, color: string, border: string }) {
  return (
    <div className={`p-6 rounded-2xl border ${border} ${color} flex flex-col gap-2`}>
      <h3 className="text-lg font-medium opacity-80">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
