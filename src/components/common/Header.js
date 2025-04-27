'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    
    // Use the auth context
    const { currentUser, isSuperAdmin, logout } = useAuth() || {};

    // Check if the header should be transparent (only on homepage)
    const isHomepage = pathname === '/';
    
    // Check if user is on admin pages
    const isAdminPage = pathname?.startsWith('/admin');

    // Add scroll event listener to make header solid on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle logout
    const handleLogout = async () => {
        if (logout) {
            await logout();
            router.push('/admin/login');
        }
    };

    // Navigation links
    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Jobs', path: '/jobs' },
        // { title: 'About', path: '/about' },
        // { title: 'Blog', path: '/blog' },
        { title: 'Donate', path: '/donate' },
        { title: 'Contact', path: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHomepage && !isScrolled
                ? 'bg-transparent'
                : 'bg-white shadow-md'
                }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/">
                        <div className="flex items-center">
                            {/* Logo icon - a stylized beer/agent icon as in the screenshot */}
                            <div className="mr-2 text-yellow-500">
                                <div className="w-9 h-8 bg-blue rounded-md flex items-center justify-center text-white font-bold">
                                    BTW
                                </div>
                            </div>
                            <span className={`text-xl font-bold ${isHomepage && !isScrolled ? 'text-white' : 'text-gray-800'}`}>
                                Angels
                            </span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`${isHomepage && !isScrolled
                                    ? 'text-white hover:text-yellow-300'
                                    : 'text-gray-700 hover:text-blue-600'
                                    } transition-colors duration-200 ${pathname === link.path ? 'font-semibold' : ''
                                    }`}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            className={`p-2 rounded-full ${isHomepage && !isScrolled
                                ? 'text-white hover:bg-white hover:bg-opacity-20'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FaSearch />
                        </button>

                        {/* Show Logout if logged in, Login if not */}
                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className={`${isHomepage && !isScrolled
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    } text-white px-4 py-2 rounded transition duration-200`}
                            >
                                Logout
                            </button>
                        ) : (
                            isAdminPage && (
                                <Link
                                    href="/admin/login"
                                    className={`${isHomepage && !isScrolled
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                        } text-white px-4 py-2 rounded transition duration-200`}
                                >
                                    Login
                                </Link>
                            )
                        )}

                        {/* Show Admin Portal link if logged in and not on admin pages */}
                        {currentUser && !isAdminPage && (
                            <Link
                                href="/admin"
                                className={`${isHomepage && !isScrolled
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white px-4 py-2 rounded transition duration-200`}
                            >
                                Admin Portal
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}