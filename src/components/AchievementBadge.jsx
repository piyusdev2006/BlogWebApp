import React from "react";

const BADGE_META = {
  first_word:  { emoji: "🖊️",  label: "First Word",      desc: "Published your first post" },
  storyteller: { emoji: "📚",  label: "Storyteller",      desc: "Published 5+ posts" },
  prolific:    { emoji: "🏆",  label: "Prolific Writer",  desc: "Published 10+ posts" },
  legend:      { emoji: "💎",  label: "Legend",           desc: "Published 25+ posts" },
  words_1k:    { emoji: "✍️",  label: "1K Words",         desc: "Written over 1,000 words" },
  words_10k:   { emoji: "🔥",  label: "10K Words",        desc: "Written over 10,000 words" },
  words_50k:   { emoji: "🌟",  label: "50K Words",        desc: "Written over 50,000 words" },
};

/**
 * AchievementBadge
 * Props:
 *   badgeKey  – one of the keys in BADGE_META
 *   earned    – boolean; if false renders as locked/dimmed
 */
function AchievementBadge({ badgeKey, earned = true }) {
  const meta = BADGE_META[badgeKey];
  if (!meta) return null;

  return (
    <div
      title={meta.desc}
      className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-default select-none
        ${earned
          ? "bg-surface-1 border-hairline-strong hover:border-primary/40 hover:bg-surface-2"
          : "bg-canvas border-hairline opacity-35 grayscale"
        }`}
    >
      <span className="text-2xl leading-none">{meta.emoji}</span>
      <span className={`text-[11px] font-semibold text-center leading-tight ${earned ? "text-ink-subtle" : "text-ink-tertiary"}`}>
        {meta.label}
      </span>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-surface-2 border border-hairline text-[11px] text-ink-subtle whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
        {meta.desc}
      </div>
    </div>
  );
}

export { BADGE_META };
export default AchievementBadge;
