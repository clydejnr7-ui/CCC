'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2, Zap, Shield, Clock, TrendingUp, Star,
  ChevronRight, ArrowRight, BadgeCheck, Lock, Wallet,
  Bitcoin, BarChart3, Users, Award
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { RabbitHeroAnimation } from '@/components/animations/RabbitAnimation';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const PROP_FIRMS = [
  'FTMO', 'Funded Trader', 'E8 Funding', 'MyForexFunds', 'Apex Trader',
  'TopStep', 'Funded Next', 'Alpha Capital', '5%ers', 'Hola Prime',
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning Fast Passing',
    desc: 'Our expert traders begin working on your account immediately — most challenges are passed within 3-5 business days.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Shield,
    title: '95%+ Pass Rate',
    desc: 'We maintain strict risk management protocols that mirror exactly what prop firms want to see from funded traders.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Clock,
    title: '7-Day Guarantee',
    desc: 'Every challenge has a 7-day maximum timeline. If we don\'t pass it, you get a full refund — no questions asked.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Lock,
    title: 'Fully Secure',
    desc: 'Your credentials are encrypted end-to-end. We only use Investor Password access where possible for added security.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Bitcoin,
    title: 'Crypto Payments',
    desc: 'Pay with Bitcoin, USDT, ETH and 50+ other cryptocurrencies through our secure NowPayments gateway.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: BarChart3,
    title: 'All Prop Firms',
    desc: 'We work with every major prop firm — FTMO, Funded Trader, E8, Apex, TopStep, and dozens more.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
];

const PRICING = [
  {
    label: 'Starter',
    size: '$5K – $25K',
    price: '$149',
    features: ['Phase 1 & 2 Passing', '7-Day Guarantee', 'All Major Firms', 'Encrypted Credentials', 'Status Dashboard'],
    highlight: false,
  },
  {
    label: 'Professional',
    size: '$50K – $100K',
    price: '$299',
    features: ['Phase 1 & 2 Passing', '7-Day Guarantee', 'All Major Firms', 'Encrypted Credentials', 'Status Dashboard', 'Priority Queue', 'Telegram Updates'],
    highlight: true,
  },
  {
    label: 'Enterprise',
    size: '$200K – $500K',
    price: '$599',
    features: ['Phase 1 & 2 Passing', '7-Day Guarantee', 'All Major Firms', 'Encrypted Credentials', 'Status Dashboard', 'Priority Queue', 'Telegram Updates', 'Dedicated Trader', 'Refund Guarantee'],
    highlight: false,
  },
];

const STEPS = [
  { step: '01', title: 'Create Account', desc: 'Sign up in under 60 seconds. No KYC, no waiting.' },
  { step: '02', title: 'Submit Account', desc: 'Fill in your prop firm login details securely via our encrypted form.' },
  { step: '03', title: 'Pay & Confirm', desc: 'Pay with crypto through NowPayments. We start immediately upon confirmation.' },
  { step: '04', title: 'Get Funded', desc: 'Watch the rabbit race to the finish line. Collect your funded account.' },
];

const TESTIMONIALS = [
  { name: 'Marcus T.', handle: '@marcust_fx', text: 'Passed my FTMO $100K in 4 days. Unreal. The dashboard made tracking super easy.', stars: 5 },
  { name: 'Sarah K.', handle: '@sk_trader', text: 'Skeptical at first but they delivered. Both phases done in 6 days total. Highly recommend.', stars: 5 },
  { name: 'Raj P.', handle: '@rajp_funded', text: 'Third time using them. Always fast, always clean trading stats. No drawdown issues.', stars: 5 },
  { name: 'Alex M.', handle: '@alexm_prop', text: 'Funded Next $50K account passed in 5 days. Dashboard kept me updated every step.', stars: 5 },
];

const FAQS = [
  { q: 'Is this legal?', a: 'Yes. There is no rule against having professional traders assist with a challenge. We trade compliantly within all firm rules.' },
  { q: 'How do you access my account?', a: 'We use your MT4/MT5 login credentials to trade. We recommend changing your password after receiving your funded account.' },
  { q: 'What if you fail the challenge?', a: 'Simple — you get a full refund. No questions asked. We maintain a 95%+ success rate.' },
  { q: 'How long does it take?', a: 'Most challenges are passed in 3–5 business days. Our maximum is 7 days for any challenge.' },
  { q: 'Which prop firms do you support?', a: 'All of them. FTMO, Funded Trader, E8, Apex, TopStep, Funded Next, Alpha Capital, 5%ers, and any others.' },
  { q: 'What cryptocurrencies do you accept?', a: 'Bitcoin (BTC), Ethereum (ETH), USDT (TRC20/ERC20), and 50+ other coins via NowPayments.' },
];

const STATS = [
  { value: '2,400+', label: 'Accounts Passed', icon: Award },
  { value: '95.8%', label: 'Pass Rate', icon: TrendingUp },
  { value: '4.2 Days', label: 'Avg. Time', icon: Clock },
  { value: '1,800+', label: 'Happy Traders', icon: Users },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-green border border-green-500/20 text-sm font-medium text-green-400 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Professional Prop Firm Passing Service
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Pass Your{' '}
              <span className="gradient-text text-glow-green">Prop Firm</span>
              <br />
              Challenge in{' '}
              <span className="gradient-text">7 Days</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our expert traders handle your FTMO, Funded Trader, E8, or any other prop firm challenge — safely, fast, and with a 95%+ pass rate. Get funded without the stress.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/signup" className="btn-primary relative z-10 text-base px-8 py-3.5 inline-flex items-center gap-2 justify-center">
                Start Passing Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="px-8 py-3.5 rounded-lg glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all font-medium text-base inline-flex items-center gap-2 justify-center">
                How It Works
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-12">
              {['95%+ Pass Rate', '7-Day Guarantee', 'Crypto Payments', '2,400+ Passed'].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <BadgeCheck className="w-4 h-4 text-green-400" />
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* Rabbit animation */}
            <motion.div variants={fadeUp} className="glass rounded-2xl p-6 max-w-2xl mx-auto border border-white/5">
              <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">7-Day Challenge Timeline</p>
              <RabbitHeroAnimation />
              <div className="flex justify-between mt-4 text-xs text-slate-600 px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i}>Day {i}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PROP FIRMS TICKER ── */}
      <section className="py-8 border-y border-white/5 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...PROP_FIRMS, ...PROP_FIRMS].map((firm, i) => (
            <span key={i} className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
              {firm}
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <Icon className="w-6 h-6 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-display font-bold gradient-text mb-1">{value}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Why Choose Us</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-display font-bold mb-4">
            Built for Serious Traders
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-xl mx-auto">
            Everything you need to get funded fast, with the safety and professionalism you deserve.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="glass rounded-2xl p-6 card-hover group"
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Process</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-display font-bold mb-4">
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STEPS.map(({ step, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="relative">
                <div className="glass rounded-2xl p-6 h-full card-hover">
                  <div className="text-4xl font-display font-bold gradient-text mb-4">{step}</div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
                {step !== '04' && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-green-500/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-display font-bold mb-4">
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-xl mx-auto">
            Pay once per challenge. No subscriptions, no hidden fees. Refund if we fail.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {PRICING.map(({ label, size, price, features, highlight }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className={`relative rounded-2xl p-7 card-hover ${
                highlight
                  ? 'bg-gradient-to-b from-green-950/60 to-dark-800 border border-green-500/30 glow-green'
                  : 'glass'
              }`}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-green-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
                <p className="text-sm text-slate-500 mb-3">Account size: {size}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold gradient-text">{price}</span>
                  <span className="text-slate-500 text-sm">/challenge</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-7">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  highlight
                    ? 'bg-green-500 hover:bg-green-400 text-black'
                    : 'glass border border-white/10 text-white hover:border-green-500/30 hover:text-green-400'
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-display font-bold">
              Traders Love Us
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {TESTIMONIALS.map(({ name, handle, text, stars }) => (
              <motion.div key={name} variants={fadeUp} className="glass rounded-2xl p-5 card-hover">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-slate-500">{handle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl font-display font-bold">Common Questions</motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-4"
        >
          {FAQS.map(({ q, a }) => (
            <motion.div key={q} variants={fadeUp} className="glass rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">{q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-green rounded-3xl p-12 border border-green-500/20 glow-green"
        >
          <div className="text-5xl mb-4">🐇</div>
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Get <span className="gradient-text">Funded?</span>
          </h2>
          <p className="text-slate-400 mb-8">
            Join 1,800+ funded traders. Submit your account today and let our experts handle the rest.
          </p>
          <Link href="/signup" className="btn-primary relative z-10 text-base px-10 py-4 inline-flex items-center gap-2 justify-center">
            Start Passing Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <Footer />

      {/* Marquee keyframe */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
