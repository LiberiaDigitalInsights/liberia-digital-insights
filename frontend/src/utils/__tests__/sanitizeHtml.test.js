import sanitizeHtml from '../../utils/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('strips dangerous tags and attributes', () => {
    const input = `
      <div onclick="alert('x')">
        <a href="javascript:alert('x')">click</a>
        <script>alert('bad')</script>
        <style>body{background:red}</style>
        <img src="#" onerror="alert('x')" />
      </div>
    `;
    const out = sanitizeHtml(input);
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/<style/i);
    expect(out).not.toMatch(/onerror=|onclick=/i);
    expect(out).not.toMatch(/javascript:/i);
  });

  it('preserves allowed content', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const out = sanitizeHtml(input);
    expect(out).toMatch(/<p>/i);
    expect(out).toMatch(/<strong>world<\/strong>/i);
  });
});
