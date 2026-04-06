// Basic Korean/English profanity blocklist
const BLOCKLIST = [
  '씨발',  '개새끼', '병신', '쌍년', '쌍놈', '지랄', '미친놈', '미친년',
  '개년', '개놈', '꺼져', '닥쳐', 'fuck', 'shit', 'bitch', 'asshole', 'bastard',
];

function containsProfanity(text) {
  const lower = text.toLowerCase();
  return BLOCKLIST.some((word) => lower.includes(word));
}

module.exports = { containsProfanity };
