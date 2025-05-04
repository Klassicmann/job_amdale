'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    
    // Use the auth context
    const { currentUser, logout } = useAuth() || {};

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
    
    // Close mobile menu when changing routes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);
    
    // Close mobile menu when screen is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setMobileMenuOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle logout
    const handleLogout = async () => {
        if (logout) {
            await logout();
            router.push('/admin/login');
        }
    };
    
    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
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

                    {/* Desktop Navigation */}
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

                        {/* Show Logout if logged in, Login if not - Only on desktop */}
                        <div className="hidden md:block">
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

                            {/* Show Admin Portal link if logged in and not on admin pages - Only on desktop */}
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
                        
                        {/* Mobile Menu Toggle Button */}
                        <button 
                            className={`md:hidden p-2 rounded-md ${
                                isHomepage && !isScrolled
                                    ? 'text-white hover:bg-white hover:bg-opacity-20'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}
            
            {/* Mobile Navigation Menu */}
            <div className={`fixed top-0 right-0 bottom-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <span className="text-xl font-bold text-gray-800">Menu</span>
                        <button 
                            className="p-2 text-gray-500 hover:text-gray-700"
                            onClick={toggleMobileMenu}
                            aria-label="Close menu"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                    
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-2 px-4">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        href={link.path}
                                        className={`block py-2 px-4 rounded-md ${
                                            pathname === link.path
                                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={toggleMobileMenu}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    
                    {/* Mobile menu footer with auth buttons */}
                    <div className="border-t p-4">
                        {currentUser ? (
                            <div className="space-y-2">
                                {!isAdminPage && (
                                    <Link
                                        href="/admin"
                                        className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-center rounded transition duration-200"
                                    >
                                        Admin Portal
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-center rounded transition duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            isAdminPage && (
                                <Link
                                    href="/admin/login"
                                    className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded transition duration-200"
                                >
                                    Login
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}