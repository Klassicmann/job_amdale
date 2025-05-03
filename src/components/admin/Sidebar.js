'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Assuming useAuth provides logout
import { FaFilter, FaBriefcase, FaUsers, FaCheck, FaTachometerAlt, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, isSuperAdmin } = useAuth(); // Get logout function and admin status from context

    const isActive = (path) => pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
            // Redirect handled by AuthProvider/ProtectedRoute or router push if needed
            console.log("User logged out");
        } catch (error) {
            console.error("Logout failed:", error);
            // Handle logout error (e.g., show notification)
        }
    };

    const linkClasses = (path) =>
        `flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${isActive(path)
            ? 'bg-blue-600 text-white font-semibold shadow-md'
            : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
        }`;

    return (
        <aside className="w-64 h-screen bg-white shadow-lg flex flex-col fixed top-0 left-0 z-40 border-r border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                {/* You can replace this with a logo or title */}
                <h2 className="text-2xl font-bold text-blue-700">Admin Panel</h2>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                <Link href="/admin" className={linkClasses('/admin')}>
                    <FaTachometerAlt className="mr-2" />
                    <span>Dashboard</span>
                </Link>
                <Link href="/admin/jobs" className={linkClasses('/admin/jobs')}>
                    <FaBriefcase className="mr-2" />
                    <span>Manage Jobs</span>
                </Link>
                {/* New link to Manage Filters */}
                <Link href="/admin/filters" className={linkClasses('/admin/filters')}>
                    <FaFilter className="mr-2" />
                    <span>Manage Filters</span>
                </Link>
                {isSuperAdmin && (
                    <Link href="/admin/users" className={linkClasses('/admin/users')}>
                        <FaUsers className="mr-2" />
                        <span>Manage Users</span>
                    </Link>
                )}
                {isSuperAdmin && (
                    <Link href="/admin/jobs/approvals" className={linkClasses('/admin/jobs/approvals')}>
                        <FaCheck className="mr-2" />
                        <span>Job Approvals</span>
                    </Link>
                )}
                <Link href="/admin/analytics" className={linkClasses('/admin/analytics')}>
                    <FaChartLine className="mr-2" />
                    <span>Analytics</span>
                </Link>
            </nav>
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                >
                    <FaSignOutAlt className="mr-2" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
