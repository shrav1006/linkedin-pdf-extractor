export function safeJsonParse(text) {
  if (!text) return null;

  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {}

  // Try to extract JSON block
  const match =
    text.match(/```json\s*([\s\S]*?)\s*```/i) ||
    text.match(/(\{[\s\S]*\})/);

  if (!match) return null;

  try {
    return JSON.parse(match[1] || match[0]);
  } catch {
    return null;
  }
}