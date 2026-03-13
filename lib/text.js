/**
 * Removes all HTML tags from a string.
 * Works both in Node.js and Browser environments.
 * @param {string} html - The string containing HTML.
 * @returns {string} - The plain text content.
 */
export function stripHtml(html) {
  if (!html) return "";

  // Basic regex cleaning for server-side and quick client-side use
  let text = html
    .replace(/<[^>]*>?/gm, "") // Remove all HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim();

  return text;
}
