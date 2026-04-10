/**
 * Calculates estimated reading time based on word count
 * @param {string} content - HTML or plain text content
 * @param {number} wordsPerMinute - Average reading speed
 * @returns {number} - Read time in minutes
 */
export function calculateReadTime(content, wordsPerMinute = 225) {
  if (!content) return 0;

  // Strip HTML tags to get plain text
  const text = content.replace(/<[^>]*>/g, " ");

  // Count words
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  // Calculate minutes
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Extracts H2 and H3 headings from HTML content for a Table of Contents
 * @param {string} html - The article content HTML
 * @returns {Array} - Array of heading objects { id, text, level }
 */
export function extractHeadings(html) {
  if (typeof window === "undefined" || !html) return [];

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const headings = Array.from(tempDiv.querySelectorAll("h2, h3")).map(
    (h, i) => {
      // Ensure headings have IDs for linking
      const text = h.textContent.trim();
      const id =
        h.id ||
        text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-") +
          "-" +
          i;

      return {
        id,
        text,
        level: parseInt(h.tagName.substring(1), 10),
      };
    },
  );

  return headings;
}
