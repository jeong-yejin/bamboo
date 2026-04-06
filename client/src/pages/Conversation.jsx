import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

export default function Conversation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, createdAt } = location.state ?? {};

  // Load messages from localStorage by id
  const [messages, setMessages] = useState(() => {
    if (!id) return [];
    const chat = loadChats().find((c) => c.id === id);
    return chat?.messages ?? [];
  });

  const [reply, setReply] = useState('');
  const bottomRef = useRef(null);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (!id) return;
    const chats = loadChats();
    const idx = chats.findIndex((c) => c.id === id);
    if (idx !== -1) {
      chats[idx].messages = messages;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
  }, [messages, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleReplySubmit(e) {
    e.preventDefault();
    const text = reply.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setReply('');
  }

  function handleReplyKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit(e);
    }
  }

  const title = createdAt ? formatDate(createdAt) : '';

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-white/8"
        style={{ background: 'rgba(10,12,20,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-text-faint hover:text-white transition-colors p-1 -ml-1"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="text-sm font-medium text-white/80 truncate max-w-[220px]">{title}</span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-text-faint text-xs">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>0</span>
          </div>
          <button className="text-text-faint hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 max-w-xl w-full mx-auto">
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div
                className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] leading-relaxed tracking-snug text-white"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-xs text-text-faint">Lessie</span>
              <div
                className="max-w-[78%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-[14px] leading-relaxed tracking-snug text-white/80"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {msg.text}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div
        className="sticky bottom-0 z-20 px-4 pb-6 pt-3 max-w-xl w-full mx-auto"
        style={{ background: 'linear-gradient(to top, rgba(10,12,20,1) 70%, transparent)' }}
      >
        <form onSubmit={handleReplySubmit}>
          <div
            className="glass glow-inset rounded-2xl overflow-hidden flex items-center gap-2 px-4 py-2.5"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.5)' }}
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleReplyKeyDown}
              placeholder="Reply..."
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-white/25 focus:outline-none tracking-snug"
              autoFocus
            />
            <button
              type="submit"
              disabled={!reply.trim()}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 shrink-0
                ${reply.trim()
                  ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
            >
              Send
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
