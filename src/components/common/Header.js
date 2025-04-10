'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    // Check if the header should be transparent (only on homepage)
    const isHomepage = pathname === '/';

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

    // Navigation links
    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Jobs', path: '/jobs' },
        { title: 'About', path: '/about' },
        { title: 'Blog', path: '/blog' },
        { title: 'Donate', path: '/donate' },
        { title: 'contact', path: '/contact' },
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
                        <Link
                            href="/admin"
                            className={`${isHomepage && !isScrolled
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white px-4 py-2 rounded transition duration-200`}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}