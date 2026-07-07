import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Simple Header */}
      <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="Hostel Hub" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Hostel Hub</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when registering at Hostel Hub. This includes your name, email address, phone number, and any government-issued ID required for hostel registration.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p>We use personal information collected via our system for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
            <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
