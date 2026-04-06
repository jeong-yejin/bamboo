import { useState } from 'react';
import { addReaction } from '../api';
import { getUserReaction, saveUserReaction } from '../utils';

const REACTIONS = [
  { type: 'like',      emoji: '👍', label: 'Relate' },
  { type: 'comfort',   emoji: '🤗', label: 'Comfort' },
  { type: 'surprised', emoji: '😮', label: 'Whoa' },
];

export default function ReactionBar({ postId, initialReactions }) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState(() => getUserReaction(postId));

  async function handleClick(type) {
    try {
      if (userReaction === type) {
        const data = await addReaction(postId, type, 'remove');
        setReactions(data.reactions);
        setUserReaction(null);
        saveUserReaction(postId, null);
        return;
      }
      if (userReaction) {
        const data = await addReaction(postId, userReaction, 'remove');
        setReactions(data.reactions);
      }
      const data = await addReaction(postId, type, 'add');
      setReactions(data.reactions);
      setUserReaction(type);
      saveUserReaction(postId, type);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex gap-2 mt-4">
      {REACTIONS.map(({ type, emoji, label }) => {
        const active = userReaction === type;
        return (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
              ${active
                ? 'bg-white/15 text-white border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-white/5 text-white/50 border border-white/8 hover:bg-white/10 hover:text-white/70'
              }`}
          >
            <span className="text-sm">{emoji}</span>
            <span>{label}</span>
            <span className="tabular-nums opacity-70">{reactions[type] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
