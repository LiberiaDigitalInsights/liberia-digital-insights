// Lightweight HTML sanitizer without external dependencies.
// Removes <script>, <style>, <iframe>, inline event handlers, and javascript: URLs.
export default function sanitizeHtml(input) {
  if (!input) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const container = doc.body.firstElementChild;

  // Remove disallowed elements
  const blockedTags = ['script', 'style', 'iframe', 'object', 'embed'];
  blockedTags.forEach((tag) => {
    container.querySelectorAll(tag).forEach((el) => el.remove());
  });

  // Strip dangerous attributes and URLs
  const walker = doc.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, null);
  let node = walker.nextNode();
  while (node) {
    // Remove event handler attrs like onClick
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = String(attr.value || '');
      if (name.startsWith('on')) {
        node.removeAttribute(attr.name);
        return;
      }
      if ((name === 'src' || name === 'href') && /^\s*javascript:/i.test(value)) {
        node.removeAttribute(attr.name);
        return;
      }
      if (name === 'style' && /expression\s*\(/i.test(value)) {
        node.removeAttribute('style');
        return;
      }
    });
    node = walker.nextNode();
  }

  return container.innerHTML;
}
