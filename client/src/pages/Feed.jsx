import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShaderAnimation } from '../components/ui/shader-animation';

const MAX = 500;
const STORAGE_KEY = 'bamboo_chats';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function loadChats() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export default function Feed() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => { setChats(loadChats()); }, []);

  const remaining = MAX - content.length;
  const canSubmit = content.trim().length > 0;

  function go() {
    if (!canSubmit) return;
    const id = Date.now();
    const createdAt = new Date().toISOString();
    const text = content.trim();
    const newChat = { id, createdAt, preview: text, messages: [{ role: 'user', text }] };
    const updated = [newChat, ...loadChats()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setChats(updated);
    navigate('/conversation', { state: { id, createdAt } });
  }

  function openChat(chat) {
    setShowHistory(false);
    navigate('/conversation', { state: { id: chat.id, createdAt: chat.createdAt } });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); }
  }

  return (
    <div className="min-h-screen bg-dark">
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <ShaderAnimation />

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

          <form
            onSubmit={(e) => { e.preventDefault(); go(); }}
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
                      : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                >
                  Confess
                </button>
              </div>
            </div>
          </form>

          {chats.length > 0 && (
            <button
              onClick={() => { setChats(loadChats()); setShowHistory(true); }}
              className="flex items-center gap-2 text-xs text-text-faint hover:text-white/70 transition-colors animate-fadeInUp"
              style={{ animationDelay: '300ms' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {chats.length} previous {chats.length === 1 ? 'confession' : 'confessions'}
            </button>
          )}
        </div>
      </section>

      {/* History overlay */}
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowHistory(false)}
        >
          <div
            className="w-full max-w-xl rounded-t-3xl flex flex-col"
            style={{
              background: 'rgba(14,16,28,0.98)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderBottom: 'none',
              maxHeight: '70vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/8 shrink-0">
              <span className="text-sm font-medium text-white/80">Previous confessions</span>
              <button
                onClick={() => setShowHistory(false)}
                className="text-text-faint hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex flex-col divide-y divide-white/6">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => openChat(chat)}
                  className="text-left px-5 py-4 hover:bg-white/5 transition-colors flex flex-col gap-1"
                >
                  <span className="text-xs text-text-faint">{formatDate(chat.createdAt)}</span>
                  <span className="text-[14px] text-white/75 leading-snug line-clamp-2">{chat.preview}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
