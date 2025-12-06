"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

// Animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

const fireGlow = {
  initial: { textShadow: "0 0 20px rgba(255, 69, 0, 0)" },
  animate: {
    textShadow: [
      "0 0 20px rgba(255, 69, 0, 0.3)",
      "0 0 40px rgba(255, 69, 0, 0.6)",
      "0 0 20px rgba(255, 69, 0, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--poder-midnight)] via-[var(--poder-charcoal)] to-[var(--poder-midnight)]" />

      {/* Geometric Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, var(--poder-fire) 1px, transparent 1px),
            linear-gradient(-45deg, var(--poder-fire) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[var(--poder-fire)] opacity-[0.05] blur-[120px]" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div variants={item}>
          <span className="badge-neon mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--poder-neon)] animate-pulse mr-2" />
            Powered by the People
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="font-display text-7xl sm:text-8xl md:text-9xl text-center tracking-tight"
          variants={item}
        >
          <motion.span
            className="block text-[var(--poder-fire)]"
            variants={fireGlow}
            initial="initial"
            animate="animate"
          >
            PODER
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-body text-xl sm:text-2xl text-[var(--poder-paper)] opacity-80 text-center max-w-xl mt-4 leading-relaxed"
          variants={item}
        >
          Reclaiming rights.<br />
          Empowering people.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md"
          variants={item}
        >
          <Link href="/learn" className="btn-fire flex-1 text-center">
            Start Learning
          </Link>
          <Link href="/play" className="btn-neon flex-1 text-center">
            Enter Simulation
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-16"
          variants={item}
        >
          <div className="text-center">
            <p className="font-display text-4xl text-[var(--poder-gold)]">1,247</p>
            <p className="font-code text-xs text-[var(--poder-paper)] opacity-60 uppercase tracking-wider">Rights Archived</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl text-[var(--poder-neon)]">12</p>
            <p className="font-code text-xs text-[var(--poder-paper)] opacity-60 uppercase tracking-wider">Languages</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl text-[var(--poder-fire)]">∞</p>
            <p className="font-code text-xs text-[var(--poder-paper)] opacity-60 uppercase tracking-wider">Power to You</p>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          variants={item}
        >
          <a
            href="#about"
            className="flex flex-col items-center text-[var(--poder-paper)] opacity-50 hover:opacity-100 transition-opacity"
          >
            <span className="font-code text-xs uppercase tracking-widest mb-2">Scroll to Learn More</span>
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </motion.svg>
          </a>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <section id="about" className="relative z-10 min-h-screen px-6 py-20 bg-[var(--poder-charcoal)]">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-5xl sm:text-6xl text-[var(--poder-paper)] mb-8">
            Know Your <span className="text-[var(--poder-fire)]">Rights</span>
          </h2>

          <p className="font-body text-lg text-[var(--poder-paper)] opacity-80 mb-12 leading-relaxed">
            Information is power. But critical rights information has been removed, hidden, or buried
            in government websites. <strong className="text-[var(--poder-neon)]">Poder</strong> recovers this knowledge
            and transforms it into interactive, gamified learning experiences — in whatever language you speak.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📜",
                title: "Archive",
                desc: "Recovered government documents simplified for everyone.",
                color: "var(--poder-fire)",
              },
              {
                icon: "🎮",
                title: "Play",
                desc: "Real-life scenarios to practice asserting your rights.",
                color: "var(--poder-neon)",
              },
              {
                icon: "🌍",
                title: "Translate",
                desc: "Instant translation to your native language.",
                color: "var(--poder-gold)",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="card-resistance"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3
                  className="font-display text-2xl mb-2"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h3>
                <p className="font-body text-[var(--poder-paper)] opacity-70">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-[var(--poder-midnight)]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-power mb-6 inline-block">
              ☕ Buy Us a Matcha
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[var(--poder-paper)] mb-6">
              Fueled by <span className="text-[var(--poder-gold)]">Performative People</span>
            </h2>
            <p className="font-body text-lg text-[var(--poder-paper)] opacity-70 mb-8">
              This project is built by people who believe knowledge should be free.
              Support us by sharing, contributing, or buying us a matcha.
            </p>
            <button className="btn-fire animate-pulse-fire">
              Support the Movement
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 bg-[var(--poder-charcoal)] border-t border-[var(--poder-slate)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-code text-sm text-[var(--poder-paper)] opacity-50">
            © 2024 Poder. Reclaiming Power.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100 transition-opacity">
              GitHub
            </a>
            <a href="#" className="font-code text-sm text-[var(--poder-paper)] opacity-50 hover:opacity-100 transition-opacity">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
