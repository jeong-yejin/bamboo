import { Link } from 'react-router-dom';
import ReactionBar from './ReactionBar';
import { timeAgo } from '../utils';

export default function PostCard({ post, index = 0 }) {
  return (
    <article
      className="glass glass-hover glow-inset rounded-2xl p-5 transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-faint">Anonymous</span>
        <span className="text-xs text-text-faint">{timeAgo(post.created_at)}</span>
      </div>

      <Link to={`/post/${post.id}`} className="block group">
        <p className="text-text-primary/90 leading-relaxed text-[15px] tracking-snug whitespace-pre-wrap break-words group-hover:text-white transition-colors duration-200 line-clamp-5">
          {post.content}
        </p>
      </Link>

      <ReactionBar postId={post.id} initialReactions={post.reactions} />
    </article>
  );
}
