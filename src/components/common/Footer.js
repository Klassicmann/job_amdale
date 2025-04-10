'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1 - About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About BTW Angels</h3>
                        <p className="text-gray-400 mb-4">
                            We connect talented professionals with top employers around the world.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2 - Job Seekers */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/jobs" className="text-gray-400 hover:text-white transition duration-200">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/companies" className="text-gray-400 hover:text-white transition duration-200">
                                    Browse Companies
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-white transition duration-200">
                                    Career Advice
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="text-gray-400 hover:text-white transition duration-200">
                                    Resume Tips
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition duration-200">
                                    Our Mission
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition duration-200">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-white transition duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">
                            Subscribe to our newsletter for the latest job opportunities.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="px-4 py-2 w-full bg-gray-800 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r transition duration-200"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; {currentYear} Back-to-Work Angels. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}