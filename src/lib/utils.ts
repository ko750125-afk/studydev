/**
 * Extracts a title from markdown content.
 * Looks for the first H1 heading, or uses the first line.
 */
export function extractTitle(markdown: string): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  if (titleMatch) return titleMatch[1];
  
  const firstLine = markdown.split('\n')[0].trim();
  return firstLine.substring(0, 50) || "Untitled Document";
}

/**
 * Formats a timestamp into a human-readable date.
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
