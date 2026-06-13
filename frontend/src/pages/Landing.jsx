import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Aurora from '../reactbits/Aurora'
import BlurText from '../reactbits/BlurText'
import TiltCard from '../reactbits/TiltCard'
import ShinyButton from '../reactbits/ShinyButton'
import Particles from '../reactbits/Particles'
import {
  BookOpen, Users, Briefcase, Heart,
  FileText, Zap, TrendingUp, ArrowRight,
  Brain, Target, BarChart3
} from 'lucide-react'

const USE_CASES = [
  { icon: BookOpen, label: '1-on-1 Tutoring', color: '#4F46E5' },
  { icon: Users, label: 'Group Classes', color: '#7C3AED' },
  { icon: Briefcase, label: 'Business Meetings', color: '#06B6D4' },
  { icon: Heart, label: 'Coaching Sessions', color: '#10B981' },
]

const STEPS = [
  {
    number: '01',
    icon: FileText,
    title: 'Upload Your Materials',
    desc: 'Add reference documents, curriculum files, or notes. SessionIQ reads them to understand your context.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'Paste Your Transcript',
    desc: 'Drop in your Granola transcript from the last session. Our AI analyzes what happened and what\'s needed next.',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Generate Your Plan',
    desc: 'Get a structured, actionable session plan tailored to your specific group, goals, and session type.',
  },
]

const FEATURES = [
  {
    icon: Target,
    title: 'Smart Session Plans',
    desc: 'AI-powered plans built from your actual materials and past sessions — not generic templates.',
    color: '#4F46E5',
  },
  {
    icon: TrendingUp,
    title: 'Improvement Reports',
    desc: 'Honest, constructive feedback on how your session went and specific things to try next time.',
    color: '#7C3AED',
  },
  {
    icon: BarChart3,
    title: 'Full Session History',
    desc: 'Every plan, transcript, and report saved and searchable. Track progress over time.',
    color: '#06B6D4',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">SessionIQ</span>
        </div>
        <ShinyButton onClick={() => navigate('/app')} className="text-sm px-4 py-2">
          Open App
        </ShinyButton>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <Aurora colorStops={['#4F46E5', '#7C3AED', '#06B6D4']} speed={0.5} />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-8"
          >
            <Zap size={14} className="text-accent" />
            Powered by Claude AI
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <BlurText text="Plan smarter sessions." className="block" delay={0.1} />
            <BlurText
              text="Improve every time."
              className="block bg-gradient-to-r from-accent via-primary to-violet bg-clip-text text-transparent"
              delay={0.4}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
          >
            SessionIQ turns your Granola transcripts and reference materials into
            structured session plans and honest improvement reports — for tutors,
            coaches, teachers, and meeting hosts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <ShinyButton onClick={() => navigate('/app')} className="text-base px-8 py-4">
              Get Started Free <ArrowRight size={18} />
            </ShinyButton>
          </motion.div>

          {/* Use case pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {USE_CASES.map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70"
              >
                <Icon size={14} style={{ color }} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Particles count={50} color="#4F46E5" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold">Three steps to a better session</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent -translate-y-1/2 z-0" />
                )}
                <div className="bg-surface border border-border rounded-2xl p-6 relative z-10">
                  <div className="text-5xl font-black text-white/5 mb-4">{step.number}</div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center mb-4">
                    <step.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold">Everything you need</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltCard glowColor={f.color} className="group h-full">
                  <div className="bg-surface border border-border rounded-2xl p-6 h-full">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
                    >
                      <f.icon size={22} style={{ color: f.color }} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/20 to-violet/20 border border-primary/30 rounded-3xl p-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to plan smarter?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Upload your first materials and generate your next session plan in minutes.
            </p>
            <ShinyButton onClick={() => navigate('/app')} className="text-lg px-10 py-4 mx-auto">
              Start for Free <ArrowRight size={20} />
            </ShinyButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-muted text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-violet flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-medium text-white">SessionIQ</span>
          </div>
          <span>AI-powered session planning</span>
        </div>
      </footer>
    </div>
  )
}
