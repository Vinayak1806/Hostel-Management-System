import { useNavigate } from 'react-router-dom'
import { Button } from '../components'
import { Building2, Wifi, Utensils, Users, Award, Shield, BookOpen, Heart } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const facilities = [
    { icon: Wifi, title: 'High-Speed WiFi', description: '24/7 internet connectivity in all rooms' },
    { icon: Utensils, title: 'Dining Facility', description: 'Hygienic and nutritious meals daily' },
    { icon: Users, title: 'Common Areas', description: 'Recreational spaces for student activities' },
    { icon: Shield, title: 'Security', description: '24/7 CCTV monitoring and security staff' },
  ]

  const rules = [
    'Maintain discipline and cleanliness in the hostel',
    'No loud music or noise after 10 PM',
    'Visitors must register at the reception desk',
    'Alcohol and smoking are strictly prohibited',
    'Respect your roommates and maintain cordial relations',
    'Participate in hostel activities and events',
  ]

  const announcements = [
    {
      title: 'Admission Portal Now Open',
      description: 'Students can now submit their hostel admission requests through the online portal.',
      date: 'May 29, 2026'
    },
    {
      title: 'Sports Day - June 15, 2026',
      description: 'Annual hostel sports day with various competitions and events. All students welcome!',
      date: 'May 28, 2026'
    },
    {
      title: 'Fee Submission Deadline',
      description: 'Submit your hostel fees by month-end to avoid penalties.',
      date: 'May 25, 2026'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">HMS</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => navigate('/signup')}>
              Register
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[500px]">
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Welcome to Your <span className="text-blue-600 dark:text-blue-400">Perfect Hostel</span> Home
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-10 leading-relaxed max-w-xl">
                Experience comfortable living with world-class facilities, security, and a vibrant community. Your second home awaits!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-fit">
                <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
                  Apply for Admission
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                  Existing Student? Login
                </Button>
              </div>
            </div>
            
            {/* Right Column - Visual */}
            <div className="relative h-96 md:h-full min-h-[400px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <Building2 className="w-40 h-40 mx-auto mb-6 opacity-90" />
                <p className="text-3xl font-bold">Modern Hostel Living</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Our Hostel?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl text-center">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">500+ Students</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Living happily</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-xl text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">100% Secure</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">24/7 Safety</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl text-center">
              <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">Study Friendly</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Quiet zones available</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-xl text-center">
              <Heart className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">Community</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Like a family</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            World-Class Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, idx) => {
              const Icon = facility.icon
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
                >
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{facility.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hostel Rules */}
      <section className="py-16 bg-slate-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Hostel Rules & Regulations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  {idx + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-200">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Latest Announcements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {announcements.map((announcement, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-600"
              >
                <p className="text-sm text-blue-600 font-semibold mb-2">{announcement.date}</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {announcement.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{announcement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Join Us?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your hostel journey today with a simple registration process.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Register Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
              className="border-white text-white hover:bg-white/20"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-white">HMS</span>
              </div>
              <p className="text-sm">Your second home with world-class facilities.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Facilities</a></li>
                <li><a href="#" className="hover:text-white transition">Admissions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Phone: +91 98765 43210</li>
                <li>Email: info@hostel.com</li>
                <li>Address: Campus Road, City</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Hostel Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
