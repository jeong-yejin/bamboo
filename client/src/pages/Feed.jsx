import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from '../components/Stars';

const MAX = 500;
const MIN = 10;

export default function Feed() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const remaining = MAX - content.length;
  const canSubmit = content.trim().length >= MIN;

  function go() {
    if (canSubmit) navigate('/conversation', { state: { content: content.trim() } });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      go();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    go();
  }

  return (
    <div className="min-h-screen bg-dark">
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <Stars count={120} />

        {/* Planet arc */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-45vw',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140vw',
            height: '90vw',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 0%, #1b2035 0%, #0d1020 50%, #080a12 100%)',
            boxShadow: '0 -2px 80px rgba(180,200,255,0.07), inset 0 2px 60px rgba(255,255,255,0.04)',
            borderTop: '1px solid rgba(255,255,255,0.18)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-45vw',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: '4px',
            borderRadius: '50%',
            boxShadow: '0 0 60px 20px rgba(255,255,255,0.12)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-xl text-center flex flex-col items-center gap-6">
          <h1
            className="text-5xl sm:text-6xl font-medium tracking-tighter leading-tight animate-fadeInUp"
            style={{ animationDelay: '80ms' }}
          >
            <span className="text-gradient">Say what's on</span>
            <br />
            <em className="font-serif" style={{ fontStyle: 'italic', color: 'rgba(240,240,240,0.72)' }}>
              your mind.
            </em>
          </h1>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="w-full animate-fadeInUp"
            style={{ animationDelay: '200ms' }}
          >
            <div
              className="glass glow-inset rounded-2xl overflow-hidden flex flex-col"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.5)' }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX))}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind..."
                rows={4}
                className="w-full bg-transparent px-5 pt-4 pb-2 text-[15px] text-text-primary placeholder-white/25 resize-none focus:outline-none leading-relaxed tracking-snug"
              />

              <div className="flex items-center justify-end gap-3 px-4 py-2.5 border-t border-white/6">
                <span className={`text-xs tabular-nums ${remaining < 50 ? 'text-rose-400/80' : 'text-text-faint'}`}>
                  {remaining}
                </span>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`px-5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200
                    ${canSubmit
                      ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                >
                  Confess
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
