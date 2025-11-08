# Components

## RichTextEditor (TipTap)

- Location: `src/components/ui/RichTextEditor.jsx`
- Props: `value` (HTML string), `onChange({ target: { value }})`, `disabled`
- Toolbar: Bold, Italic, Underline, H1–H3, lists, align, link, image, clear, code block, blockquote
- Images: inserted as base64 via file input (no backend upload)

### Example: Using in a form

```jsx
import { useState } from 'react';
import RichTextEditor from '../src/components/ui/RichTextEditor.jsx';

export default function ArticleFormExample() {
  const [form, setForm] = useState({ title: '', content: '' });

  return (
    <form className="space-y-4">
      <input
        className="w-full border rounded px-3 py-2 bg-[var(--color-surface)] text-[var(--color-text)]"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />

      <RichTextEditor
        value={form.content || ''}
        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
      />

      <button type="submit" className="px-4 py-2 rounded bg-[var(--color-brand-500)] text-white">
        Save
      </button>
    </form>
  );
}
```

## ContentRenderer

- Location: `src/components/ui/ContentRenderer.jsx`
- Sanitizes HTML via `utils/sanitizeHtml.js` before rendering
- Use for previews and detail pages to render stored rich HTML

### Example: Rendering content

```jsx
import ContentRenderer from '../src/components/ui/ContentRenderer.jsx';

export default function InsightPreview({ insight }) {
  const html = insight?.content || insight?.excerpt || '';
  return (
    <div className="prose prose-invert max-w-none">
      <ContentRenderer html={html} />
    </div>
  );
}
```
