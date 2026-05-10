'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RabbitAnimationProps {
  progress?: number;
  daysRemaining?: number;
  totalDays?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function RabbitSVG({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 36 : size === 'lg' ? 80 : 56;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Body */}
      <g className="rabbit-body-anim">
        {/* Tail */}
        <ellipse cx="14" cy="48" rx="8" ry="6" fill="white" opacity="0.9" />
        {/* Body */}
        <ellipse cx="38" cy="50" rx="22" ry="18" fill="white" />
        {/* Head */}
        <ellipse cx="58" cy="36" rx="16" ry="14" fill="white" />

        {/* Left Ear */}
        <g className="rabbit-ear-anim" style={{ transformOrigin: '50px 26px' }}>
          <ellipse cx="50" cy="14" rx="5" ry="14" fill="white" />
          <ellipse cx="50" cy="14" rx="2.5" ry="11" fill="#fca5a5" opacity="0.6" />
        </g>
        {/* Right Ear */}
        <g className="rabbit-ear-anim" style={{ transformOrigin: '62px 26px', animationDelay: '0.1s' }}>
          <ellipse cx="62" cy="12" rx="5" ry="14" fill="white" />
          <ellipse cx="62" cy="12" rx="2.5" ry="11" fill="#fca5a5" opacity="0.6" />
        </g>

        {/* Eye */}
        <circle cx="64" cy="33" r="3" fill="#0a0f1e" />
        <circle cx="65.5" cy="31.5" r="1" fill="white" />

        {/* Nose */}
        <ellipse cx="72" cy="38" rx="2.5" ry="1.5" fill="#fca5a5" />

        {/* Mouth */}
        <path d="M70 40 Q72 42 74 40" stroke="#94a3b8" strokeWidth="1" fill="none" />

        {/* Front legs */}
        <g className="rabbit-leg-front" style={{ transformOrigin: '52px 58px' }}>
          <rect x="49" y="58" width="8" height="18" rx="4" fill="#f0fdf4" />
          <ellipse cx="53" cy="76" rx="6" ry="3" fill="#e2e8f0" />
        </g>
        <g className="rabbit-leg-front" style={{ transformOrigin: '62px 58px', animationDelay: '0.15s' }}>
          <rect x="59" y="58" width="8" height="16" rx="4" fill="white" />
          <ellipse cx="63" cy="74" rx="6" ry="3" fill="#e2e8f0" />
        </g>

        {/* Back legs */}
        <g className="rabbit-leg-back" style={{ transformOrigin: '24px 56px' }}>
          <rect x="20" y="56" width="10" height="20" rx="5" fill="#f0fdf4" />
          <ellipse cx="25" cy="76" rx="8" ry="3.5" fill="#e2e8f0" />
        </g>
        <g className="rabbit-leg-back" style={{ transformOrigin: '34px 56px', animationDelay: '0.15s' }}>
          <rect x="30" y="56" width="10" height="18" rx="5" fill="white" />
          <ellipse cx="35" cy="74" rx="8" ry="3.5" fill="#e2e8f0" />
        </g>

        {/* Speed lines */}
        <line x1="0" y1="44" x2="12" y2="44" stroke="rgba(34,197,94,0.5)" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="50" x2="10" y2="50" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="56" x2="10" y2="56" stroke="rgba(34,197,94,0.2)" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function RabbitProgressBar({
  progress = 0,
  daysRemaining = 7,
  totalDays = 7,
  className,
  size = 'md',
  showLabel = true,
}: RabbitAnimationProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  const daysPassed = totalDays - daysRemaining;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-slate-300">Challenge Progress</span>
          <span className="text-sm font-bold text-green-400">
            Day {daysPassed} of {totalDays}
          </span>
        </div>
      )}

      {/* Track */}
      <div className="relative w-full h-10 bg-dark-700 rounded-full border border-white/10 overflow-visible">
        {/* Day markers */}
        <div className="absolute inset-0 flex items-center px-2">
          {Array.from({ length: totalDays - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-3 w-px bg-white/10"
              style={{ left: `${((i + 1) / totalDays) * 100}%` }}
            />
          ))}
        </div>

        {/* Progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(34,197,94,0.3), rgba(34,197,94,0.6))',
            borderRight: '2px solid rgba(34,197,94,0.8)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Rabbit */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ marginTop: size === 'sm' ? '-12px' : '-24px' }}
          initial={{ left: '0%' }}
          animate={{ left: `calc(${safeProgress}% - ${size === 'sm' ? '18px' : '28px'})` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <RabbitSVG size={size} />
        </motion.div>
      </div>

      {/* Day labels */}
      {showLabel && (
        <div className="flex justify-between mt-2 px-1">
          {Array.from({ length: totalDays + 1 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'text-xs',
                i <= daysPassed ? 'text-green-400' : 'text-slate-600'
              )}
            >
              D{i}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      {showLabel && (
        <div className="flex justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400">
              {safeProgress.toFixed(0)}% complete
            </span>
          </div>
          <span className="text-xs font-medium text-slate-300">
            {daysRemaining > 0
              ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
              : 'Completed!'}
          </span>
        </div>
      )}
    </div>
  );
}

export function RabbitHeroAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-32 flex items-end">
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

      {/* Day markers on ground */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: `${(i / 7) * 100}%` }}
        >
          <div className="w-px h-3 bg-green-500/30" />
          <span className="text-[10px] text-green-500/50 mt-1">D{i}</span>
        </div>
      ))}

      {/* Animated rabbit running across */}
      <motion.div
        className="absolute bottom-0"
        animate={{
          x: [0, '75vw'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1,
        }}
      >
        <div style={{ transform: 'translateY(-4px)' }}>
          <RabbitSVG size="lg" />
        </div>

        {/* Dust particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-1 -left-2"
            style={{ width: 6, height: 6 }}
            animate={{
              x: [0, -15 - i * 8],
              y: [0, -4 - i * 2],
              opacity: [0.6, 0],
              scale: [1, 2],
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              repeat: Infinity,
              repeatDelay: 0,
            }}
          >
            <div className="w-full h-full rounded-full bg-green-400/30" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function CountdownTimer({ targetDate }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime() + 7 * 24 * 60 * 60 * 1000;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="glass rounded-lg px-3 py-2 min-w-[56px]">
            <span className="text-2xl font-bold font-display gradient-text">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  );
}
