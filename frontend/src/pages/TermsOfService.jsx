import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans selection:bg-blue-500/30 flex flex-col">
      <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="Hostel Hub" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Hostel Hub</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
            <p>These Terms of Service constitute a legally binding agreement made between you and Hostel Hub, concerning your access to and use of our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Hostel Rules & Regulations</h2>
            <p>By staying at Hostel Hub, you agree to abide by all the rules and regulations set forth by the administration. This includes but is not limited to curfew times, visitor policies, and behavioral expectations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Fee Payments</h2>
            <p>All hostel fees and dues must be paid by the deadlines specified in your student dashboard. Failure to pay on time may result in penalties or termination of your stay.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
