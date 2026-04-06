export function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr + 'Z').getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STORAGE_KEY = 'bamboo_reactions';

export function getReactionState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function setReactionState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getUserReaction(postId) {
  return getReactionState()[postId] ?? null;
}

export function saveUserReaction(postId, type) {
  const state = getReactionState();
  if (type === null) {
    delete state[postId];
  } else {
    state[postId] = type;
  }
  setReactionState(state);
}
