import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import Marquee from '../skiper/Marquee'
import {
  BookOpen, Users, Briefcase, Heart, Zap, FileText,
  Brain, TrendingUp, ArrowRight, Star, Target, BarChart3,
  Sparkles, Check, ArrowUpRight
} from 'lucide-react'

// ─── Animation helpers ────────────────────────────────────────────────────────────────────────────────

const stagger = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
})

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} variants={stagger(delay)} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  { icon: BookOpen, label: '1-on-1 Tutoring' },
  { icon: Users, label: 'Group Classes' },
  { icon: Briefcase, label: 'Business Meetings' },
  { icon: Heart, label: 'Coaching Sessions' },
  { icon: Star, label: 'Hebrew Lessons' },
  { icon: Target, label: 'Test Preparation' },
  { icon: Brain, label: 'Language Learning' },
  { icon: Sparkles, label: 'Bar Mitzvah Prep' },
]

const STEPS = [
  { num: '01', icon: FileText,   title: 'Upload your materials',      desc: 'Curriculum files, reference notes, vocabulary lists, or any documents. SessionIQ reads and understands your content.',                                   detail: 'PDF · DOCX · TXT · Markdown' },
  { num: '02', icon: Brain,      title: 'Paste your transcript',       desc: "Drop in the transcript from your last session. Claude AI analyses what happened, what was covered, and what's needed next.",                               detail: 'Works with any meeting transcript' },
  { num: '03', icon: Zap,        title: 'Generate your session plan',  desc: 'Get a structured, actionable plan tailored to your specific group, goals, and session type — ready in seconds.',                                          detail: 'Tutoring · Coaching · Meetings · Classes' },
  { num: '04', icon: TrendingUp, title: 'Get your improvement report', desc: 'After each session, receive honest, specific feedback on your teaching. Track your progress over time.',                                                  detail: 'Personal · Constructive · Actionable' },
]

const FEATURES = [
  { icon: Target,    title: 'Plans built from your context',  desc: 'Not generic templates. Every plan is generated from your actual materials and what happened in your last session.' },
  { icon: TrendingUp, title: 'Honest improvement reports',    desc: 'Specific, constructive feedback addressed directly to you. Know exactly what to do differently next time.' },
  { icon: BarChart3,  title: 'Full session history',          desc: 'Every plan, transcript, and report saved per group. Track progress and spot patterns across sessions.' },
]

const QUOTES = [
  '"Completely changed how I prepare for lessons"',
  '"The improvement reports are incredibly accurate"',
  '"Saves me an hour of prep time every week"',
  '"Like having a personal teaching coach"',
  '"My students have noticed the difference"',
  '"The best tool I\'ve found for tutors"',
]

// ─── Hero mockup ────────────────────────────────────────────────────────────────────────────────

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="animate-float"
    >
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: '1px solid #1C1C26', background: '#0E0E12', maxWidth: 420 }}>
        {/* Titlebar */}
        <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: '1px solid #1C1C26', background: '#0B0B0E' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,80,80,0.45)' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,200,50,0.45)' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(50,200,80,0.45)' }} />
          <div className="flex-1 mx-3 text-center">
            <span style={{ fontSize: 10, color: '#4D4B58' }}>localhost:8000</span>
          </div>
        </div>
        {/* Preview */}
        <div className="flex" style={{ height: 250 }}>
          <div className="flex flex-col gap-1 p-2" style={{ width: 70, borderRight: '1px solid #1C1C26', background: '#0B0B0E' }}>
            <div className="w-full h-5 rounded mb-2" style={{ background: '#1C1C26' }} />
            {['Tutoring', 'Group', 'Meet'].map((n, i) => (
              <div key={n} className="w-full h-4 rounded px-1 flex items-center" style={{ background: i === 0 ? 'rgba(180,255,69,0.08)' : 'transparent', border: i === 0 ? '1px solid rgba(180,255,69,0.12)' : 'none' }}>
                <div className="w-1.5 h-1.5 rounded-full mr-1 shrink-0" style={{ background: i === 0 ? '#B4FF45' : '#26262F' }} />
                <div className="flex-1 h-1.5 rounded" style={{ background: i === 0 ? 'rgba(180,255,69,0.25)' : '#1C1C26' }} />
              </div>
            ))}
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#B4FF45' }} />
              <div className="h-1.5 w-20 rounded" style={{ background: 'rgba(180,255,69,0.25)' }} />
            </div>
            <div className="space-y-2 mb-4">
              {[75, 55, 82, 48, 68].map((w, i) => (
                <div key={i} className="h-1.5 rounded" style={{ background: '#1C1C26', width: `${w}%` }} />
              ))}
            </div>
            <div className="rounded-lg p-3" style={{ background: '#0E1A0A', border: '1px solid rgba(180,255,69,0.12)' }}>
              <div className="h-1.5 rounded mb-2" style={{ background: 'rgba(180,255,69,0.3)', width: '55%' }} />
              <div className="h-1.5 rounded mb-1.5" style={{ background: '#1A2614', width: '80%' }} />
              <div className="h-1.5 rounded" style={{ background: '#1A2614', width: '60%' }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY       = useTransform(scrollYProgress, [0, 0.6], [0, -40])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#080809', color: '#EEEAE2' }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(8,8,9,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: '#B4FF45' }}>
              <Zap size={14} style={{ color: '#080809' }} />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: '#EEEAE2', letterSpacing: '0.04em' }}>SESSIONIQ</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-3">
            <button onClick={() => navigate('/app')} className="text-xs font-medium px-3 py-1.5 transition-colors" style={{ color: '#4D4B58' }}
              onMouseEnter={e => e.currentTarget.style.color = '#EEEAE2'} onMouseLeave={e => e.currentTarget.style.color = '#4D4B58'}>
              Sign in
            </button>
            <motion.button onClick={() => navigate('/app')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded transition-all"
              style={{ background: '#EEEAE2', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
              Open app <ArrowUpRight size={12} />
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(180,255,69,0.055) 0%, transparent 65%)' }} />
        <div className="grid-bg absolute inset-0" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 mb-10">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#B4FF45' }} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4D4B58' }}>Powered by Claude AI</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="display-xl mb-8">
                Plan smarter
                <br />
                <span style={{ color: 'rgba(238,234,226,0.28)' }}>sessions.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                className="text-sm leading-relaxed mb-10 max-w-xs" style={{ color: '#4D4B58' }}>
                Upload your materials, paste your Granola transcript, and get an AI-generated session plan and improvement report — in seconds.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap items-center gap-3 mb-10">
                <motion.button onClick={() => navigate('/app')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded transition-all"
                  style={{ background: '#EEEAE2', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
                  Start for free <ArrowRight size={15} />
                </motion.button>
                <button onClick={() => navigate('/app')} className="flex items-center gap-1.5 text-xs px-4 py-3.5 rounded transition-all"
                  style={{ color: '#4D4B58', border: '1px solid #1C1C26' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#EEEAE2'; e.currentTarget.style.borderColor = '#26262F' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4D4B58'; e.currentTarget.style.borderColor = '#1C1C26' }}>
                  See how it works
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-5">
                {['Free to use', 'No credit card', 'Data stays local'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5" style={{ fontSize: 11, color: '#3A3A45' }}>
                    <Check size={9} style={{ color: '#B4FF45' }} /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="hidden md:flex justify-end">
              <HeroMockup />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="relative overflow-hidden py-4" style={{ borderTop: '1px solid #1C1C26', borderBottom: '1px solid #1C1C26' }}>
        <div className="absolute left-0 inset-y-0 w-20 z-10" style={{ background: 'linear-gradient(to right, #080809, transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-20 z-10" style={{ background: 'linear-gradient(to left, #080809, transparent)' }} />
        <Marquee pauseOnHover className="[--duration:36s] [--gap:0px]">
          {MARQUEE_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 px-8" style={{ color: '#4D4B58', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em' }}>
              <Icon size={11} style={{ color: '#B4FF45', opacity: 0.65 }} />
              {label.toUpperCase()}
            </div>
          ))}
        </Marquee>
      </div>

      {/* Process */}
      <section className="py-36 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-20 gap-10 flex-wrap">
            <Reveal>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', color: '#4D4B58', textTransform: 'uppercase', marginBottom: 16 }}>01 / PROCESS</p>
              <h2 className="display-md" style={{ color: '#EEEAE2' }}>
                From transcript<br />
                <span style={{ color: 'rgba(238,234,226,0.28)' }}>to plan in four steps</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="max-w-xs">
              <p style={{ color: '#4D4B58', fontSize: 13, lineHeight: 1.75, marginTop: 32 }}>
                A simple workflow designed to save you prep time and make every session count.
              </p>
            </Reveal>
          </div>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.05}>
                <div className="grid md:grid-cols-[72px_1fr_auto] gap-6 items-center py-7" style={{ borderTop: '1px solid #1C1C26' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#4D4B58', fontFamily: 'Syne, sans-serif' }}>{step.num}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: '#1C1C26' }}>
                      <step.icon size={14} style={{ color: '#B4FF45' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#EEEAE2', letterSpacing: '-0.01em', marginBottom: 4, fontFamily: 'Syne, sans-serif' }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: 12, color: '#4D4B58', lineHeight: 1.65 }}>{step.desc}</p>
                    </div>
                  </div>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded whitespace-nowrap" style={{ background: '#0E0E12', border: '1px solid #1C1C26', color: '#4D4B58', fontSize: 10, letterSpacing: '0.04em' }}>
                    <Check size={8} style={{ color: '#B4FF45' }} /> {step.detail}
                  </span>
                </div>
              </Reveal>
            ))}
            <div style={{ height: 1, background: '#1C1C26' }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-36 px-6 md:px-10" style={{ background: '#0B0B0E' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <Reveal>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', color: '#4D4B58', textTransform: 'uppercase', marginBottom: 16 }}>02 / FEATURES</p>
              <h2 className="display-md" style={{ color: '#EEEAE2' }}>
                Everything you need<br />
                <span style={{ color: 'rgba(238,234,226,0.28)' }}>to run better sessions</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3" style={{ border: '1px solid #1C1C26', borderRadius: 8, overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <motion.div
                  className="group p-8 h-full"
                  style={{ background: '#0B0B0E', borderRight: i < 2 ? '1px solid #1C1C26' : 'none', position: 'relative', overflow: 'hidden', cursor: 'default' }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(180,255,69,0.05), transparent 60%)' }}
                  />
                  <div className="relative z-10">
                    <div className="w-8 h-8 rounded flex items-center justify-center mb-6" style={{ background: '#1C1C26' }}>
                      <f.icon size={14} style={{ color: '#B4FF45' }} />
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#EEEAE2', letterSpacing: '-0.01em', marginBottom: 10, fontFamily: 'Syne, sans-serif' }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#4D4B58', lineHeight: 1.75 }}>{f.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quote strip */}
      <div className="relative overflow-hidden py-4" style={{ borderTop: '1px solid #1C1C26', borderBottom: '1px solid #1C1C26' }}>
        <div className="absolute left-0 inset-y-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #080809, transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #080809, transparent)' }} />
        <Marquee reverse pauseOnHover className="[--duration:42s]">
          {QUOTES.map((q, i) => (
            <div key={i} className="flex items-center gap-3 px-8" style={{ color: '#2E2E3A', fontSize: 11, fontStyle: 'italic' }}>
              <Star size={9} style={{ color: '#B4FF45', opacity: 0.35 }} />
              {q}
              <span style={{ color: '#1C1C26', margin: '0 8px' }}>·</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* CTA */}
      <section className="relative py-44 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(180,255,69,0.035) 0%, transparent 70%)' }} />
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative max-w-7xl mx-auto">
          <Reveal>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', color: '#4D4B58', textTransform: 'uppercase', marginBottom: 32 }}>03 / START</p>
          </Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <Reveal delay={0.1}>
              <h2 className="display-lg" style={{ color: '#EEEAE2' }}>
                Ready to plan<br />
                <span style={{ color: '#B4FF45' }}>smarter?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2} className="flex flex-col gap-5 md:items-end">
              <p style={{ color: '#4D4B58', fontSize: 13, lineHeight: 1.75, maxWidth: 260 }}>
                Upload your first materials and generate a session plan in under a minute. Free forever, no sign-up required.
              </p>
              <motion.button onClick={() => navigate('/app')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded self-start md:self-auto transition-all"
                style={{ background: '#B4FF45', color: '#080809', fontFamily: 'Syne, sans-serif' }}>
                Open SessionIQ <ArrowRight size={15} />
              </motion.button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1C1C26', padding: '28px 40px' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#B4FF45' }}>
              <Zap size={11} style={{ color: '#080809' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4D4B58', letterSpacing: '0.12em', fontFamily: 'Syne, sans-serif' }}>SESSIONIQ</span>
          </div>
          <span style={{ color: '#2E2E3A', fontSize: 10, letterSpacing: '0.08em' }}>AI-POWERED SESSION PLANNING · BUILT WITH CLAUDE</span>
        </div>
      </footer>
    </div>
  )
}
