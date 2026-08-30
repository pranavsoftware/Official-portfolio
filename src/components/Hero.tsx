import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section
      className="relative pt-0 pb-6 md:pb-8 border-b border-white/10 mb-12 sm:mb-16 flex flex-col justify-between lg:min-h-[calc(100vh-80px)] lg:max-h-[880px]"
    >
      {/* ═══════════════════════════════════════════════════════════════
          CREATIVE BACKGROUND — breaks out of max-w-7xl container
          Uses left:50% + translateX(-50vw) trick to span full viewport
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute overflow-hidden pointer-events-none select-none z-0"
        style={{
          top: 0,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50vw)',
          width: '100vw',
        }}
      >
        {/* Giant CREATIVE — full viewport width, starts high */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="font-bebas absolute whitespace-nowrap leading-none tracking-tighter text-center"
          style={{
            fontSize: 'min(22vw, 320px)',
            color: 'rgba(118, 10, 10, 0.72)',
            textShadow:
              '0 0 60px rgba(160, 15, 15, 0.28), 0 0 140px rgba(100, 5, 5, 0.16)',
            top: '4%',
            left: '50%',
            transform: 'translateX(-50%) scaleY(1.35)',
            transformOrigin: 'top center',
            width: '100vw',
          }}
        >
          CREATIVE
        </motion.h1>

        {/* Ambient crimson halo — follows the portrait position */}
        <div
          className="absolute rounded-full blur-[100px] sm:blur-[140px] animate-pulse-glow"
          style={{
            top: '35%',
            left: '58%',
            transform: 'translate(-50%, -50%)',
            width: 'min(580px, 90vw)',
            height: 'min(580px, 90vw)',
            background: 'rgba(160, 10, 10, 0.14)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TOP LABELS BAR
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] pt-2 sm:pt-3 pb-2 sm:pb-1 px-1 gap-2 shrink-0"
      >
        <div className="flex flex-col leading-tight">
          <span className="text-red-500 font-bold tracking-widest">AI/ML ENGINEER</span>
          <span className="text-white font-medium tracking-wider">UI/UX CREATOR &amp; RESEARCHER</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <span className="tracking-widest text-[9px] sm:text-[11px]">AVAILABLE FOR FREELANCE &amp; ROLES</span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN HERO BODY
          Desktop: 12-col art-directed poster layout (cols 1-4 | 5-9 | 10-12)
          Mobile & Tablet: Structured, stacked & balanced layout
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center min-h-0 pt-2 lg:pt-0">

        {/* ─── LEFT COLUMN: Name, Role, Bio & CTA ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="order-1 lg:col-span-4 space-y-3 pr-0 lg:pr-2 self-center z-20"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-signature text-3xl sm:text-4xl lg:text-[42px] text-[#e83d3d] mb-0.5 tracking-wide"
            >
              Hello, I'm
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.83] tracking-tight text-white"
            >
              RAYBAN<br />
              PRANAV<br />
              MAHESH
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-1.5"
          >
            <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs md:text-[13px] leading-snug">
              AI/ML ENGINEER &amp;<br />
              UI/UX CREATOR
            </h3>
            <p className="text-gray-300 text-xs md:text-[12px] leading-relaxed max-w-sm lg:max-w-[320px]">
              I design and build stylish, user-focused AI systems and
              research-driven applications. Published researcher at{' '}
              <span className="text-white font-medium">IEEE COMPSAC &amp; IPTA 2026</span>{' '}
              and inventor on{' '}
              <span className="text-red-500 font-semibold">13 Indian patents</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="pt-1"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-red-900/80 hover:border-red-500 active:scale-95 bg-black/40 text-gray-200 hover:text-white text-xs uppercase tracking-[0.18em] font-medium transition-all duration-200 group rounded-none cursor-pointer"
            >
              <span className="text-red-500 font-bold group-hover:translate-x-0.5 transition-transform">
                →
              </span>
              <span>VIEW MY WORK</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ─── CENTER COLUMN: Portrait Cutout ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          className="order-2 lg:col-span-5 flex justify-center items-end h-[380px] sm:h-[480px] md:h-[540px] lg:h-full pointer-events-none relative z-10"
        >
          <img
            src="/rayban_half.png"
            alt="Rayban Pranav Mahesh"
            className="w-auto h-full max-h-[380px] sm:max-h-[480px] md:max-h-[540px] lg:max-h-[min(610px,calc(100vh-130px))] object-contain object-bottom select-none z-10 relative"
            style={{
              maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
              filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.96))',
            }}
          />
        </motion.div>

        {/* ─── RIGHT COLUMN: 3 Prominent Statistics (Clean & Editorial) ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-3 lg:col-span-3 flex flex-col justify-center gap-4 lg:gap-3.5 pl-0 lg:pl-4 self-center z-20 w-full"
        >
          {/* Stats Container: 3 cols on mobile/tablet, vertical stack on desktop */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-4 lg:gap-3.5 w-full">
            
            {/* Stat 1: 13+ PATENTS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-1.5 sm:gap-3 group cursor-default"
            >
              <span className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-red-500 leading-none min-w-[56px] sm:min-w-[68px] group-hover:text-red-400 transition-colors">
                13<span className="text-lg sm:text-xl text-white font-light">+</span>
              </span>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.18em] leading-tight">
                PATENTS<br />
                <span className="text-white font-bold tracking-widest">PUBLISHED</span>
              </p>
            </motion.div>

            <div className="hidden lg:block border-t border-white/10 w-full max-w-[190px]" />

            {/* Stat 2: 03 RESEARCH */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-1.5 sm:gap-3 group cursor-default border-l border-white/10 pl-2 sm:pl-3 lg:border-l-0 lg:pl-0"
            >
              <span className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-red-500 leading-none min-w-[56px] sm:min-w-[68px] group-hover:text-red-400 transition-colors">
                03
              </span>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.18em] leading-tight">
                RESEARCH<br />
                <span className="text-white font-bold tracking-widest">PUBLICATIONS</span>
              </p>
            </motion.div>

            <div className="hidden lg:block border-t border-white/10 w-full max-w-[190px]" />

            {/* Stat 3: 05+ PROJECTS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-1.5 sm:gap-3 group cursor-default border-l border-white/10 pl-2 sm:pl-3 lg:border-l-0 lg:pl-0"
            >
              <span className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-red-500 leading-none min-w-[56px] sm:min-w-[68px] group-hover:text-red-400 transition-colors">
                05<span className="text-lg sm:text-xl text-white font-light">+</span>
              </span>
              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-[0.18em] leading-tight">
                AI &amp; SYSTEMS<br />
                <span className="text-white font-bold tracking-widest">PROJECTS</span>
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
