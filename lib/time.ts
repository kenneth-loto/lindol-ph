export function formatTime(epochMs: number): string {
  const diffSec = Math.round((Date.now() - epochMs) / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return new Date(epochMs).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
