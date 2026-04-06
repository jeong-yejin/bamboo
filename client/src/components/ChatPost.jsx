import { Link } from 'react-router-dom';
import ReactionBar from './ReactionBar';
import { timeAgo } from '../utils';

export default function ChatPost({ post, index = 0 }) {
  return (
    <div
      className="animate-fadeInUp"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link to={`/post/${post.id}`} className="block group">
        <div className="glass glow-inset rounded-2xl px-5 pt-4 pb-3 transition-all duration-200 group-hover:bg-white/9 group-hover:border-white/16">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs text-text-faint">Anonymous</span>
            <span className="text-xs text-text-faint">{timeAgo(post.created_at)}</span>
          </div>
          <p className="text-text-primary/85 text-[14px] leading-relaxed tracking-snug line-clamp-3 group-hover:text-white/90 transition-colors">
            {post.content}
          </p>
        </div>
      </Link>
      <div className="px-5 pb-1">
        <ReactionBar postId={post.id} initialReactions={post.reactions} />
      </div>
    </div>
  );
}
