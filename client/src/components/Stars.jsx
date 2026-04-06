import { useMemo } from 'react';

export default function Stars({ count = 100 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
      animDelay: Math.random() * 4,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${2 + s.animDelay}s ease-in-out infinite alternate`,
            animationDelay: `${s.animDelay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          from { opacity: var(--from-op, 0.1); }
          to   { opacity: var(--to-op, 0.6); }
        }
      `}</style>
    </div>
  );
}
