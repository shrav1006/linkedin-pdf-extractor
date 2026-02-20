export function extractLinkedInFields(text) {
  const lower = text.toLowerCase();

  const firstLineGuess = text.split("\n")[0]?.trim() || "";
  const name = firstLineGuess.length <= 60 ? firstLineGuess : "";

  function sectionBetween(startKeywords, endKeywords) {
    const startIdx = startKeywords
      .map((k) => lower.indexOf(k))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b)[0];

    if (startIdx === undefined) return "";

    const matchedKey = startKeywords.find((k) => lower.indexOf(k) === startIdx);
    const afterStart = startIdx + matchedKey.length;

    const slice = text.slice(afterStart);
    const sliceLower = slice.toLowerCase();

    const endIdx = endKeywords
      .map((k) => sliceLower.indexOf(k))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b)[0];

    return (endIdx === undefined ? slice : slice.slice(0, endIdx)).trim();
  }

  const about = sectionBetween(
    ["about"],
    ["experience", "education", "skills", "projects", "certifications"]
  );

  const experienceRaw = sectionBetween(
    ["experience"],
    ["education", "skills", "projects", "certifications"]
  );

  const educationRaw = sectionBetween(
    ["education"],
    ["skills", "projects", "certifications", "experience"]
  );

  const skillsRaw = sectionBetween(
    ["skills"],
    ["projects", "certifications", "education", "experience"]
  );

  const skills = skillsRaw
    ? skillsRaw
        .split("•")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 60)
    : [];

  return {
    name,
    about,
    experienceRaw,
    educationRaw,
    skills,
    rawText: text,
  };
}