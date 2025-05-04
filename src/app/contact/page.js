"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // You could add API integration here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Contact Us</h1>
        <p className="text-gray-600 mb-8">We&apos;d love to hear from you! Fill out the form below and our team will get back to you soon.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>
        {submitted && (
          <div className="mt-6 text-green-600 font-semibold text-center">
            Thank you for contacting us! We&apos;ll get back to you soon.
          </div>
        )}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Contact Information</h2>
          <p className="text-gray-600 mb-1">Email: <a className="text-blue-600 underline" href="mailto:info@btwangels.com">info@btwangels.com</a></p>
          <p className="text-gray-600 mb-1">Phone: <a className="text-blue-600 underline" href="tel:+1234567890">+1 234 567 890</a></p>
          <p className="text-gray-600">Address: 123 Startup Lane, Innovation City, Country</p>
        </div>
      </div>
    </div>
  );
}
