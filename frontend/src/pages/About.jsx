import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Users, Shield, Heart, Mail, Phone, Calendar, ArrowRight, CheckCircle2, Star, Building2, GraduationCap } from 'lucide-react'

export default function About() {
  const [openFaq, setOpenFaq] = useState(null)

  const highlights = [
    { label: 'Students served', value: '1,500+' },
    { label: 'Hostels onboarded', value: '50+' },
    { label: 'Support response', value: '< 2 hrs' },
  ]

  const storyPoints = [
    { year: '2021', title: 'Started with a simple idea', text: 'A cleaner way to manage hostel admissions, fees, and notices in one place.' },
    { year: '2022', title: 'Built for day-to-day operations', text: 'Added complaint tracking, attendance, and admin dashboards for smoother workflows.' },
    { year: '2024', title: 'Scaled for modern hostels', text: 'Expanded to support better security, communication, and student experience.' },
  ]

  const faqs = [
    { q: 'How do I apply?', a: 'Click "Get Started" or visit the Admission page to submit your application.' },
    { q: 'Is my data secure?', a: 'Yes — we prioritise privacy and follow best practices for data protection.' },
    { q: 'How do I report maintenance?', a: 'Use the Complaint feature in your student dashboard to report and track issues.' },
  ]

  const team = [
    { name: 'Vinayak Pawate', role: 'Developer', img: '/logo.jpeg', note: 'Builds and maintains the Hostel Hub experience.' },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans">
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.14),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-xs font-medium mb-5">
                <Sparkles size={14} />
                <span>About Hostel Hub</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.7rem] font-extrabold tracking-tight leading-[1.05] mb-5">
                Modern hostel operations,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">built for students and staff.</span>
              </h1>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                Hostel Hub simplifies every part of hostel life from admissions and fee management to notices, attendance, and maintenance. We focus on clarity, security, and a smooth experience for everyone in the ecosystem.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 border border-slate-700 px-4 py-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Secure by design
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 border border-slate-700 px-4 py-2 text-sm text-slate-300">
                  <Star className="w-4 h-4 text-amber-400" />
                  Trusted by students
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 border border-slate-700 px-4 py-2 text-sm text-slate-300">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Hostel operations platform
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4">
                    <p className="text-2xl font-extrabold text-white">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/25">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-3 rounded-xl border border-slate-700">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/60 bg-slate-800/40 shadow-2xl shadow-black/40">
                <img src="/hb.jpg" alt="Hostel building" className="h-[460px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                <div className="absolute left-4 top-4 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-slate-700 px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Student-first</p>
                      <p className="text-sm font-semibold text-white">Designed for everyday hostel life</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-slate-700 px-4 py-3 shadow-lg max-w-[220px]">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Community</p>
                      <p className="text-sm font-semibold text-white">1,500+ happy students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Security first', text: 'Access, notices, and communication are built with privacy and safety in mind.' },
              { icon: Users, title: 'Built for community', text: 'We make it easier for residents and staff to stay connected and informed.' },
              { icon: Calendar, title: 'Operational clarity', text: 'Attendance, complaints, and payments are easier to track in one place.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 hover:border-blue-500/35 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-2">Our Journey</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">How Hostel Hub evolved</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {storyPoints.map((point) => (
              <div key={point.year} className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
                <p className="text-sm font-semibold text-blue-300 mb-2">{point.year}</p>
                <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-2">Our Team</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">People behind the platform</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
                  <div>
                    <div className="font-semibold text-white text-lg">{m.name}</div>
                    <div className="text-sm text-blue-300">{m.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Questions we hear often</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={f.q} className="rounded-2xl border border-slate-700/50 bg-slate-800/40 overflow-hidden">
                  <button
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-white">{f.q}</span>
                    <span className="text-slate-400 text-xl leading-none">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-gradient-to-br from-slate-800/70 to-slate-900/70 p-6 lg:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300 mb-2">Contact</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Talk to our team</h2>
            <p className="text-slate-400 mb-6 max-w-md">If you want to partner with Hostel Hub or need help with onboarding, reach out and we’ll respond quickly.</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                <Mail className="w-5 h-5 text-blue-300" />
                <a href="mailto:admissions@hostelhub.com" className="text-slate-100">admissions@hostelhub.com</a>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                <Phone className="w-5 h-5 text-emerald-300" />
                <a href="tel:+919876543210" className="text-slate-100">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                <MapPin className="w-5 h-5 text-amber-300" />
                <span className="text-slate-100">Swargate, Pune, Maharashtra 411042</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/25">
                Contact Page <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-5 py-3 rounded-xl border border-slate-700">
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
