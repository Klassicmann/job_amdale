import React, { useEffect, useState } from 'react';
import { getAllFilterAnalytics } from '../../lib/jobFilterAnalytics';
import { FaUsers, FaBriefcase, FaFilter, FaHistory, FaChartLine } from 'react-icons/fa'; // Example icons

// Mock Data (assuming this stays for now)
const mockGeoData = [
  { location: 'Lagos, Nigeria', count: 120 },
  { location: 'Abuja, Nigeria', count: 80 },
  { location: 'London, UK', count: 30 },
  { location: 'Remote', count: 25 },
];
const mockRecentActivity = [
  { user: 'Ada', action: 'Applied for Software Engineer', time: '2m ago' },
  { user: 'Emeka', action: 'Saved Data Analyst job', time: '5m ago' },
  { user: 'Jane', action: 'Viewed Product Designer', time: '10m ago' },
];
const mockTopJobs = [
  { title: 'Frontend Developer', company: 'TechCorp', views: 220 },
  { title: 'Backend Engineer', company: 'InnoSoft', views: 180 },
  { title: 'UI/UX Designer', company: 'Designify', views: 120 },
];
const mockEngagement = {
  activeUsers: 320,
  applicationsToday: 45,  totalJobs: 87,
};

// Helper component for Stat Cards
const StatCard = ({ title, value, icon }) => (
  <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-transform hover:scale-105 cursor-default">
    <div className="text-blue-400 text-3xl">{icon}</div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  </div>
);

// Helper component for Section Cards
const SectionCard = ({ title, children }) => (
  <div className="bg-slate-800 rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-white mb-5">{title}</h2>
    {children}
  </div>
);

// Helper for Progress Bars
const ProgressBar = ({ value, maxValue, colorClass = 'bg-blue-500' }) => {
  const percent = Math.round((value / maxValue) * 100);
  return (
    <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

const AnalyticsDashboard = () => {
  const [filterAnalytics, setFilterAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true); // Start loading
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await getAllFilterAnalytics();
        setFilterAnalytics(data.sort((a, b) => b.count - a.count));
      } catch (e) {
        console.error("Failed to fetch filter analytics:", e);
        setFilterAnalytics([]); // Set empty on error
      } finally {
        setLoading(false); // End loading
      }
    }
    fetchAnalytics();
  }, []);

  const maxFilterCount = filterAnalytics[0]?.count || 1;
  const maxGeoCount = Math.max(...mockGeoData.map(g => g.count), 1);
  const maxJobViews = Math.max(...mockTopJobs.map(j => j.views), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Analytics Dashboard</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Active Users" value={mockEngagement.activeUsers} icon={<FaUsers />} />
          <StatCard title="Applications Today" value={mockEngagement.applicationsToday} icon={<FaBriefcase />} />
          <StatCard title="Total Jobs" value={mockEngagement.totalJobs} icon={<FaChartLine />} />
          <StatCard title="Tracked Filters" value={filterAnalytics.length} icon={<FaFilter />} />
        </div>

        {/* Main Content Sections */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Most Selected Filters */}
          <SectionCard title="Most Selected Filters">
            <div className="space-y-4">
              {filterAnalytics.slice(0, 8).map(filter => (
                <div key={filter.id}>
                  <div className="flex justify-between text-sm mb-1.5 text-slate-300">
                    <span>{filter.id.replace(/_/g, ': ')}</span>
                    <span className="font-medium text-white">{filter.count}</span>
                  </div>
                  <ProgressBar value={filter.count} maxValue={maxFilterCount} colorClass="bg-purple-500" />
                </div>
              ))}
              {filterAnalytics.length === 0 && <p className="text-slate-400 text-sm">No filter data available.</p>}
            </div>
          </SectionCard>

          {/* Visitors by Location */}
          <SectionCard title="Visitors by Location">
            <div className="space-y-4">
              {mockGeoData.map(geo => (
                <div key={geo.location}>
                  <div className="flex justify-between text-sm mb-1.5 text-slate-300">
                    <span>{geo.location}</span>
                    <span className="font-medium text-white">{geo.count}</span>
                  </div>
                  <ProgressBar value={geo.count} maxValue={maxGeoCount} colorClass="bg-pink-500" />
                </div>
              ))}
            </div>
          </SectionCard>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <SectionCard title="Recent Activity">
            <ul className="space-y-3">
              {mockRecentActivity.map((act, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                     <FaHistory className="text-slate-400" />
                     <div>
                       <p className="text-sm text-white"><span className="font-semibold">{act.user}</span> {act.action}</p>
                       <p className="text-xs text-slate-400">{act.time}</p>
                     </div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Top Job Postings */}
          <SectionCard title="Top Job Postings">
            <div className="space-y-5">
              {mockTopJobs.map((job, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1.5 text-slate-300">
                    <span>{job.title} <span className="text-slate-400">@ {job.company}</span></span>
                    <span className="font-medium text-white">{job.views}</span>
                  </div>
                  <ProgressBar value={job.views} maxValue={maxJobViews} colorClass="bg-green-500" />
                </div>
              ))}
            </div>
          </SectionCard>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
