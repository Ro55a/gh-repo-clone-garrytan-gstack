import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Marquee from '../skiper/Marquee'
import ApplePlayButton from '../skiper/ApplePlayButton'
import {
  BookOpen, Users, Briefcase, Heart, Zap, FileText,
  Brain, TrendingUp, ArrowRight, Star, Target, BarChart3,
  Sparkles, ChevronRight, Check
} from 'lucide-react'

const MARQUEE_ITEMS = [
  { icon: BookOpen, label: '1-on-1 Tutoring', color: '#4F46E5' },
  { icon: Users, label: 'Group Classes', color: '#7C3AED' },
  { icon: Briefcase, label: 'Business Meetings', color: '#06B6D4' },
  { icon: Heart, label: 'Coaching Sessions', color: '#10B981' },
  { icon: Star, label: 'Hebrew Lessons', color: '#FFD93D' },
  { icon: Target, label: 'Test Prep', color: '#FF6B6B' },
  { icon: Brain, label: 'Language Learning', color: '#4F46E5' },
  { icon: Sparkles, label: 'Bar Mitzvah Prep', color: '#7C3AED' },
]

const STEPS = [
  {
    icon: FileText,
    title: 'Upload your materials',
    desc: 'Add curriculum files, reference notes, vocabulary lists, or any documents. SessionIQ reads and understands your content.',
    detail: 'Supports PDF, DOCX, TXT, and Markdown',
  },
  {
    icon: Brain,
    title: 'Paste your Granola transcript',
    desc: 'Drop in the transcript from your last session. Claude AI analyses what happened, what was covered, and what\'s needed next.',
    detail: 'Works with any meeting transcript',
  },
  {
    icon: Zap,
    title: 'Generate your session plan',
    desc: 'Get a structured, actionable plan tailored to your specific group, goals, and session type — ready in seconds.',
    detail: 'Tutoring, coaching, meetings, classes',
  },
  {
    icon: TrendingUp,
    title: 'Get your improvement report',
    desc: 'After each session, receive honest, specific feedback on your teaching. Track your progress over time.',
    detail: 'Personal, constructive, actionable',
  },
]

const FEATURES = [
  {
    icon: Target,
    title: 'Plans built from your context',
    desc: 'Not generic templates. Every plan is generated from your actual materials and what happened in your last session.',
    color: '#4F46E5',
  },
  {
    icon: TrendingUp,
    title: 'Honest improvement reports',
    desc: 'Specific, constructive feedback addressed directly to you. Know exactly what to do differently next time.',
    color: '#7C3AED',
  },
  {
    icon: BarChart3,
    title: 'Full session history',
    desc: 'Every plan, transcript, and report saved per group. Track progress and spot patterns across sessions.',
    color: '#06B6D4',
  },
]

const TESTIMONIAL_MARQUEE = [
  '"Completely changed how I prepare for lessons"',
  '"The improvement reports are incredibly accurate"',
  '"Saves me an hour of prep time every week"',
  '"Like having a personal teaching coach"',
  '"My students have noticed the difference"',
  '"The best tool I\'ve found for tutors"',
]

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
      className="animate-float"
      style={{ perspective: 1000 }}
    >
      <div className="glass-card rounded-3xl p-1 shadow-2xl glow-primary" style={{ maxWidth: 460 }}>
        {/* Window chrome */}
        <div className="bg-surface rounded-[22px] overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex-1 mx-4">
              <div className="bg-bg rounded-lg px-3 py-1 text-xs text-muted text-center">localhost:8000</div>
            </div>
          </div>
          {/* App preview content */}
          <div className="flex" style={{ height: 280 }}>
            {/* Sidebar */}
            <div className="w-20 border-r border-border p-2 space-y-1">
              <div className="w-full h-6 rounded-lg bg-primary/30 mb-3" />
              {['Emma C.', 'Fri Group', 'Team Q3'].map((name, i) => (
                <div key={i} className={`w-full h-5 rounded-lg text-xs flex items-center px-1 truncate ${i === 0 ? 'bg-primary/20 text-white/80' : 'bg-white/5 text-muted'}`} style={{ fontSize: 7 }}>
                  {name}
                </div>
              ))}
            </div>
            {/* Main */}
            <div className="flex-1 p-3">
              <div className="text-xs text-white/60 mb-2" style={{ fontSize: 9 }}>Session Plan · Emma Cohen</div>
              <div className="space-y-1.5">
                {['## Session Goals', '- Review Genesis 1:1-5', '- Practice Segol trope', '- Work on Etnacha pause', '## Activities', '- Read-aloud x3', '- Teacher models trope'].map((line, i) => (
                  <div key={i} className={`h-2 rounded ${line.startsWith('##') ? 'bg-accent/30 w-3/4' : 'bg-white/10'}`}
                    style={{ width: line.startsWith('-') ? `${50 + (i * 13) % 35}%` : undefined }}
                  />
                ))}
              </div>
              <div className="mt-3 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-400 mb-1" style={{ fontSize: 8 }}>✓ Improvement Report ready</div>
                <div className="h-1.5 rounded bg-emerald-500/20 w-4/5" />
                <div className="h-1.5 rounded bg-emerald-500/20 w-3/5 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-strong border-b border-white/5 flex items-center justify-between px-6 md:px-10 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shadow-lg glow-primary">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SessionIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app')}
              className="text-sm text-muted hover:text-white transition-colors px-3 py-1.5"
            >
              Sign in
            </button>
            <motion.button
              onClick={() => navigate('/app')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-white text-bg hover:bg-white/90 transition-colors"
            >
              Get started free
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-mesh-1" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Radial vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, #0A0A0F 100%)' }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to top, #0A0A0F, transparent)' }} />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/70 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Powered by Claude AI
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight mb-6"
              >
                <span className="text-gradient block">Plan smarter</span>
                <span className="text-gradient block">sessions.</span>
                <span className="text-gradient-primary block mt-1">Teach better</span>
                <span className="text-gradient-primary block">every time.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-white/50 mb-10 max-w-lg leading-relaxed"
              >
                Upload your materials, paste your Granola transcript, and get
                an AI-generated session plan and improvement report — in seconds.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap items-center gap-3 mb-10"
              >
                <ApplePlayButton onClick={() => navigate('/app')} className="text-base">
                  Start for free <ArrowRight size={18} />
                </ApplePlayButton>
                <button
                  onClick={() => navigate('/app')}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-3"
                >
                  See how it works <ChevronRight size={14} />
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 text-xs text-white/40"
              >
                {['Free to use', 'No credit card needed', 'Your data stays local'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check size={11} className="text-accent" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — App mockup */}
            <div className="hidden md:flex justify-center">
              <HeroMockup />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="relative py-6 border-y border-white/5 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to right, #0A0A0F, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to left, #0A0A0F, transparent)' }} />
        <Marquee pauseOnHover className="[--duration:30s]">
          {MARQUEE_ITEMS.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2.5 px-6 text-sm text-white/50 hover:text-white/80 transition-colors">
              <Icon size={15} style={{ color }} />
              <span>{label}</span>
              <span className="text-white/20 mx-2">·</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ── How it works ── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-mesh-2 opacity-40" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              From transcript to plan
              <br /><span className="text-gradient-primary">in four steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden group">
                  <div
                    className="absolute top-0 right-0 text-8xl font-black text-white/[0.03] leading-none select-none"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6"
                    style={{ background: `linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.3))`, border: '1px solid rgba(79,70,229,0.3)' }}
                  >
                    <step.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-3">{step.desc}</p>
                  <span className="text-xs text-accent/70 flex items-center gap-1">
                    <Check size={10} /> {step.detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Everything you need
              <br /><span className="text-white/40">to run better sessions</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="gradient-border p-6 h-full rounded-2xl relative overflow-hidden">
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${f.color}15, transparent 70%)` }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                  >
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials marquee ── */}
      <div className="py-8 border-y border-white/5 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #0A0A0F, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #0A0A0F, transparent)' }} />
        <Marquee reverse pauseOnHover className="[--duration:35s]">
          {TESTIMONIAL_MARQUEE.map((t, i) => (
            <div key={i} className="flex items-center gap-3 px-6 text-sm text-white/35 italic">
              <Star size={12} className="text-gold shrink-0" />
              {t}
            </div>
          ))}
        </Marquee>
      </div>

      {/* ── CTA ── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-1 opacity-60" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm text-white/60 mb-8">
              <Sparkles size={13} className="text-accent" /> Free forever, no sign-up required
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-5">
              Ready to plan
              <br /><span className="text-gradient-primary">smarter sessions?</span>
            </h2>
            <p className="text-white/40 text-lg mb-10">
              Upload your first materials and generate a session plan in under a minute.
            </p>
            <ApplePlayButton onClick={() => navigate('/app')} className="text-lg mx-auto">
              Open SessionIQ <ArrowRight size={20} />
            </ApplePlayButton>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Gradient divider */}
          <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, rgba(79,70,229,0.5), rgba(6,182,212,0.5), transparent)' }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-violet flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <span className="font-bold text-white/60">SessionIQ</span>
            </div>
            <span>AI-powered session planning · Built with Claude</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
