"use client";

import React, { useState } from "react";
import StripeWrapper from "./StripeWrapper";
import StripeCardForm from "./StripeCardForm";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState("card");
  const [selectedAmount, setSelectedAmount] = useState(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-16 px-2 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-x-hidden">
      {/* Decorative SVG or blur background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-20 blur-2xl" style={{position:'absolute',top:0,left:0}}>
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="60%" cy="0" rx="700" ry="400" fill="url(#g1)" />
        </svg>
      </div>
      <div className="w-full max-w-lg mx-auto z-10">
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-2xl border border-blue-100 px-8 py-10 relative">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.png" alt="BTW Angels" className="w-10 h-10 rounded-full mr-2" />
            <h1 className="text-3xl font-bold text-blue-700 tracking-tight">Support Our Mission</h1>
          </div>
          <p className="text-gray-700 text-center mb-6">Your donation helps us connect more people, companies, and opportunities.<br/> <span className="font-medium text-blue-600">100% Secure & Impactful.</span></p>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-150 focus:outline-none ${activeTab === "card" ? "bg-white/80 border-b-2 border-blue-500 text-blue-700 shadow" : "bg-transparent text-gray-500"}`}
              onClick={() => setActiveTab("card")}
            >
              Card
            </button>
            <button
              className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-150 focus:outline-none ${activeTab === "paypal" ? "bg-white/80 border-b-2 border-yellow-400 text-yellow-700 shadow" : "bg-transparent text-gray-500"}`}
              onClick={() => setActiveTab("paypal")}
            >
              PayPal
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 bg-white/80 rounded-xl shadow-inner">
            {activeTab === "card" && (
              <StripeWrapper>
                {/* Animated Card Icons */}
                <div className="flex items-center justify-center mb-6 gap-2">
                  <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="w-9 h-7 hover:scale-110 transition-transform" />
                  <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="MasterCard" className="w-9 h-7 hover:scale-110 transition-transform" />
                  <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="w-9 h-7 hover:scale-110 transition-transform" />
                  <img src="https://img.icons8.com/color/48/000000/discover.png" alt="Discover" className="w-9 h-7 hover:scale-110 transition-transform" />
                </div>
                {/* Preset Amounts */}
                <div className="flex justify-center gap-3 mb-6">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`px-4 py-2 rounded-lg border font-semibold shadow-sm transition-all duration-150 focus:outline-none ${selectedAmount === amt ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
                      onClick={() => setSelectedAmount(amt)}
                    >
                      ${amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg border font-semibold shadow-sm transition-all duration-150 focus:outline-none ${selectedAmount === null ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
                    onClick={() => setSelectedAmount(null)}
                  >
                    Custom
                  </button>
                </div>
                {/* Stripe Card Form - Pass selectedAmount */}
                <StripeCardForm presetAmount={selectedAmount} />
              </StripeWrapper>
            )}
            {activeTab === "paypal" && (
              <a
                href="https://www.paypal.com/donate" // Replace with your actual PayPal link
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-lg text-center shadow transition-colors mt-6 mb-2"
              >
                <span className="inline-flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 32 32"><path fill="#003087" d="M29.7 7.1c-.5-.6-1.2-1-2-1.1-.2 0-.4-.1-.6-.1H12.7c-.6 0-1.1.4-1.2 1l-4.2 22.3c-.1.5.3 1 .8 1h4.3c.5 0 1-.4 1.1-.9l.7-3.9c.1-.5.6-.9 1.1-.9h2.2c5.6 0 10-2.3 11.3-8.9.6-3 .3-5.5-1.3-7.5z"/><path fill="#3086C8" d="M28.6 7.1c-.5-.6-1.2-1-2-1.1-.2 0-.4-.1-.6-.1H12.7c-.6 0-1.1.4-1.2 1l-4.2 22.3c-.1.5.3 1 .8 1h4.3c.5 0 1-.4 1.1-.9l.7-3.9c.1-.5.6-.9 1.1-.9h2.2c5.6 0 10-2.3 11.3-8.9.6-3 .3-5.5-1.3-7.5z" opacity=".5"/></svg>
                  Donate with PayPal
                </span>
              </a>
            )}
          </div>

          {/* Impact/Trust/Contact Info */}
          <div className="mt-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span className="font-semibold text-green-600">100% Secure payments by Stripe & PayPal</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">Your donation helps over <span className="text-blue-700 font-bold">500+</span> people each month.</div>
            <div className="text-sm text-gray-500">Email: <a className="text-blue-600 underline" href="mailto:donate@btwangels.com">donate@btwangels.com</a> | Phone: <a className="text-blue-600 underline" href="tel:+1234567890">+1 234 567 890</a></div>
            <div className="text-sm text-gray-500">Address: 123 Startup Lane, Innovation City, Country</div>
          </div>
        </div>
      </div>
    </div>
  );
}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Donate with Card
              </button>
            </form>
          </div>
        </div>
        {submitted && (
          <div className="mt-6 text-green-600 font-semibold text-center">
            Thank you for your generous support!
          </div>
        )}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-2 text-gray-700">Other Ways to Support</h2>
          <p className="text-gray-600 mb-1">Email: <a className="text-blue-600 underline" href="mailto:donate@btwangels.com">donate@btwangels.com</a></p>
          <p className="text-gray-600 mb-1">Phone: <a className="text-blue-600 underline" href="tel:+1234567890">+1 234 567 890</a></p>
          <p className="text-gray-600">Address: 123 Startup Lane, Innovation City, Country</p>
        </div>
      </div>
    </div>
  );
}
