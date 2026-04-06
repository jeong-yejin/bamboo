import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, createComment } from '../api';
import ReactionBar from '../components/ReactionBar';
import { timeAgo } from '../utils';

const MAX_COMMENT = 200;

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    getPost(id)
      .then((data) => { setPost(data); setLoading(false); })
      .catch(() => { setError('Could not load this post.'); setLoading(false); });
  }, [id]);

  async function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setCommentError('');
    try {
      const comment = await createComment(id, commentText.trim());
      setPost((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
      setCommentText('');
      setCommentsOpen(true);
    } catch (err) {
      setCommentError(err.response?.data?.error ?? 'Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-text-faint text-sm animate-pulse">
        Loading...
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="text-center py-24 text-rose-400/80">
        <p className="text-sm mb-4">{error || 'Post not found.'}</p>
        <Link to="/" className="text-text-muted text-xs underline underline-offset-2">Go back</Link>
      </div>
    );
  }

  const commentCount = post.comments.length;
  const remaining = MAX_COMMENT - commentText.length;

  return (
    <div className="animate-fadeInUp">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-text-muted mb-6 transition-colors tracking-tight"
      >
        ← Back
      </Link>

      {/* Post */}
      <article className="glass glow-inset rounded-2xl p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-text-faint">Anonymous</span>
          <span className="text-xs text-text-faint">{timeAgo(post.created_at)}</span>
        </div>
        <p className="text-text-primary/90 leading-relaxed text-[15px] tracking-snug whitespace-pre-wrap break-words">
          {post.content}
        </p>
        <ReactionBar postId={post.id} initialReactions={post.reactions} />
      </article>

      {/* Comment form */}
      <div className="glass glow-inset rounded-2xl p-5 mb-4">
        <p className="text-xs font-medium text-text-muted mb-3 tracking-tight uppercase">Leave a reply</p>
        <form onSubmit={handleComment} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value.slice(0, MAX_COMMENT))}
              placeholder="Say something kind..."
              rows={3}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-text-primary placeholder-white/20 resize-none focus:outline-none focus:border-white/16 leading-relaxed tracking-snug transition-all duration-200"
            />
            <span className={`absolute bottom-3 right-3 text-xs tabular-nums ${remaining < 30 ? 'text-rose-400/80' : 'text-text-faint'}`}>
              {remaining}
            </span>
          </div>
          {commentError && (
            <p className="text-xs text-rose-400/80">{commentError}</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className={`px-5 py-2 rounded-full text-xs font-medium tracking-tight transition-all duration-200
                ${commentText.trim() && !submitting
                  ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.10)]'
                  : 'bg-white/4 text-white/24 border border-white/6 cursor-not-allowed'
                }`}
            >
              {submitting ? 'Posting...' : 'Reply Anonymously'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      {commentCount > 0 && (
        <div>
          <button
            onClick={() => setCommentsOpen((v) => !v)}
            className="w-full flex items-center justify-between text-xs text-text-muted hover:text-text-primary py-2.5 px-1 transition-colors tracking-tight"
          >
            <span>{commentCount} {commentCount === 1 ? 'reply' : 'replies'}</span>
            <span className="text-text-faint">{commentsOpen ? '▲ collapse' : '▼ expand'}</span>
          </button>

          {commentsOpen && (
            <div className="flex flex-col gap-2 mt-2">
              {post.comments.map((c, i) => (
                <div
                  key={c.id}
                  className="glass glow-inset rounded-xl px-4 py-3 animate-fadeInUp"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <p className="text-sm text-text-primary/80 leading-relaxed tracking-snug whitespace-pre-wrap break-words">
                    {c.content}
                  </p>
                  <p className="text-xs text-text-faint mt-2">{timeAgo(c.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
