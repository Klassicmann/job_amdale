'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaBriefcase, FaChartLine, FaCog, FaUsers, FaBars, FaTimes } from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
        { path: '/admin/jobs', label: 'Manage Jobs', icon: FaBriefcase },
        { path: '/admin/analytics', label: 'Analytics', icon: FaChartLine },
        { path: '/admin/users', label: 'User Activity', icon: FaUsers },
        { path: '/admin/settings', label: 'Settings', icon: FaCog },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname?.startsWith(path);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-20 left-4 z-30">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-50"
                >
                    {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-20 h-full pt-20 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:w-64 w-64`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className="mb-4 px-4">
                        <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
                        <p className="text-sm text-gray-500">Back-to-Work Angels</p>
                    </div>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center p-3 text-base font-medium rounded-lg transition ${isActive(item.path)
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <Link
                            href="/"
                            className="flex items-center p-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span>Return to Website</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Page content */}
            <div className={`lg:ml-64 transition-all duration-300 ease-in-out`}>
                {children}
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}