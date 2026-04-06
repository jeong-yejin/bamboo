import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

const MAX = 500;
const MIN = 10;

export default function Write() {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const remaining = MAX - content.length;
  const canSubmit = content.trim().length >= MIN && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const post = await createPost(content.trim(), '기타');
      navigate(`/post/${post.id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tighter text-gradient mb-2">
          New Confession
        </h1>
        <p className="text-sm text-text-muted tracking-tight">
          No name. No trace.{' '}
          <em className="font-serif" style={{ fontStyle: 'italic', color: 'rgba(240,240,240,0.6)' }}>Just honesty.</em>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX))}
            placeholder="What's on your mind..."
            rows={9}
            className="w-full glass glow-inset rounded-2xl px-5 py-4 text-[15px] text-text-primary placeholder-white/20 resize-none focus:outline-none focus:border-white/20 leading-relaxed tracking-snug transition-all duration-200"
          />
          <span className={`absolute bottom-3 right-4 text-xs tabular-nums transition-colors ${remaining < 50 ? 'text-rose-400/80' : 'text-text-faint'}`}>
            {remaining}
          </span>
        </div>

        {error && (
          <div className="glass rounded-xl px-4 py-3 text-sm text-rose-400/90 border border-rose-500/20">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-text-faint tracking-tight">Minimum {MIN} characters</p>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-tight transition-all duration-200
              ${canSubmit
                ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.12)]'
                : 'bg-white/8 text-white/24 border border-white/6 cursor-not-allowed'
              }`}
          >
            {submitting ? 'Posting...' : 'Post Anonymously'}
          </button>
        </div>
      </form>
    </div>
  );
}
