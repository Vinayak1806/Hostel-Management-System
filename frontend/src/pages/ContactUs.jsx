import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button, Input, Textarea } from '../components';

export default function ContactUs() {
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

      <div className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Have questions? We'd love to hear from you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Location</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Hostel Hub, Near Swargate Bus Stand,<br />
                  Swargate, Pune, Maharashtra 411042
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  admissions@hostelhub.com
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <Input placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <Input placeholder="Your Email" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <Textarea placeholder="How can we help you?" rows={4} />
              </div>
              <Button variant="primary" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
