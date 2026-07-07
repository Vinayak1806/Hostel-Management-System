import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Wrench, CalendarCheck, Bell, ArrowRight, CheckCircle2, Sparkles, MapPin, Phone, Mail, Shield, Wifi } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const facilities = [
    { icon: CreditCard, title: 'Fee Management', description: 'Track and pay hostel fees online. Get instant receipts and overdue alerts.', color: 'from-blue-500 to-cyan-400' },
    { icon: Wrench, title: 'Complaint Tracking', description: 'Register maintenance issues and track resolution status in real-time.', color: 'from-violet-500 to-purple-400' },
    { icon: CalendarCheck, title: 'Smart Attendance', description: 'Automated tracking. View monthly presence and maintain required percentages.', color: 'from-emerald-500 to-teal-400' },
    { icon: Bell, title: 'Digital Notice Board', description: 'Get instant notifications for events, rules, and announcements.', color: 'from-amber-500 to-orange-400' },
  ]

  const stats = [
    { label: 'Happy Students', value: '1,500+' },
    { label: 'Rooms Managed', value: '450' },
    { label: 'Complaints Resolved', value: '99%' },
    { label: 'System Uptime', value: '99.9%' },
  ]

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      lines: ['Hostel Hub, Near Swargate Bus Stand', 'Swargate, Pune, Maharashtra 411042'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+91 98765 43210', 'Mon–Sat, 9 AM – 6 PM'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['admissions@hostelhub.com', 'support@hostelhub.com'],
    },
  ]

  return (
    <main className="min-h-screen bg-slate-900 font-sans text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/50  z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.jpeg" alt="Hostel Hub" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-xl font-bold text-white">Hostel Hub</span>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-300 hover:text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all"
            >
              Apply Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-3 pb-8 lg:pt-5 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium text-xs mb-4 border border-blue-500/20">
                <Sparkles size={14} />
                <span>Next-Gen Hostel Management</span>
              </div>
              <h1 className="text-4xl lg:text-[3.5rem] font-extrabold text-white tracking-tight mb-4 leading-[1.15]">
                Your Home <br className="hidden lg:block" />
                Away From{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Home.</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Comfort, security, and a digital-first community. Manage attendance, fees, and complaints seamlessly from your dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/signup')}
                  className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all"
                >
                  Book Your Room <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                >
                  Student Portal
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center lg:justify-start gap-5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm font-medium">Verified Security</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm font-medium">Top Rated</span>
                </div>
              </div>
            </div>

            <div className="relative h-[360px] lg:h-[560px] flex items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-3xl aspect-[16/10] rounded-3xl shadow-2xl shadow-black/40 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="/hb.jpg" alt="Hostel building" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - improved */}
      <section className="py-4 lg:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
                <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">{stat.value}</p>
                <p className="mt-2 text-xs md:text-sm text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Everything You Need
            </h2>
            <p className="text-slate-400 text-sm">
              Manage your entire hostel life right from your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {facilities.map((facility, idx) => {
              const Icon = facility.icon
              return (
                <div
                  key={idx}
                  className="group bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${facility.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Visit Us in Pune
            </h2>
            <p className="text-slate-400 text-sm">
              Easy access to major educational institutes and transit hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="group bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/40 hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:shadow-md group-hover:shadow-blue-600/20 transition-all duration-300">
                      <Icon className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-sm text-slate-400 leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black-500 to-gray-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to secure your spot?</h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            Rooms are filling up fast. Join our community today.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="group inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-7 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03]"
          >
            Start Application <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" alt="Hostel Hub" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-lg font-semibold">Hostel Hub</span>
              </div>
              <p className="text-sm text-slate-400">Comfort, security, and a digital-first community. Manage attendance, fees, and complaints seamlessly.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/signup" className="hover:text-white">Apply Now</Link></li>
                <li><Link to="/login" className="hover:text-white">Student Portal</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact & Newsletter</h4>
              <p className="text-sm text-slate-400 mb-3">admissions@hostelhub.com<br/>+91 98765 43210</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input aria-label="Email" type="email" placeholder="Your email" className="min-w-0 flex-1 bg-slate-900/40 border border-slate-800 rounded-md px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm">Subscribe</button>
              </form>
            </div>
          </div>

         
        </div>
      </footer>
    </main>
  )
}
