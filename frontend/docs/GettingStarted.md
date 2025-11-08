# Getting Started

## Prerequisites

- Node.js 18+
- npm

## Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev` and open http://localhost:5173

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint
- `npm run format` – run Prettier
- `npm run test` – run Vitest

## Key Routes

- `/components` – design system showcase
- `/dashboard` – sample admin dashboard

## Coding Rules

- Read and follow `CONTRIBUTING.md`.
- Use design tokens and primitives. Do not hardcode colors or spacing.
- Add demos and tests for new primitives.
- See the Contributing guide: [Contributing](./Contributing.md)

---

## Rich Text Editing (TipTap)

- Editor component: `src/components/ui/RichTextEditor.jsx` (TipTap)
- Props API: `value` (HTML string), `onChange({ target: { value: html }})`, `disabled`
- Toolbar: Bold, Italic, Underline, H1–H3, lists, align, link, image, clear, code block, blockquote
- Image uploads use file input and embed as base64. No backend upload.

### Using in forms

```jsx
<RichTextEditor
  value={form.content || ''}
  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
/>
```

## HTML Sanitization

- Utility: `src/utils/sanitizeHtml.js`
- Always sanitize user-generated HTML before display (preview/detail pages).
- Preview and detail pages use `ContentRenderer` which wraps sanitization.

## Content Rendering

- Component: `src/components/ui/ContentRenderer.jsx`
- Usage:

```jsx
<ContentRenderer html={article.content || article.excerpt} />
```

## Centralized Categories

- Source: `src/data/categories.js` exporting `CATEGORIES`.
- Use in Admin forms and filters via `<Select>`.

## Modal & Table Responsiveness

- Modals: constrain height and enable scroll to avoid viewport overflow.
- Tables: reduce column widths on small screens, convert action buttons to icons.

## Routes

- Public: `/`, `/insights`, `/articles`, `/insight/:id`, `/article/:id`
- Admin (protected by `AuthGate`): `/admin`

## Persisted UI State

- `localStorage` keys
  - `admin_editor_tab` – last-used editor tab (Edit/Preview)
  - `admin_chart_range` – selected analytics range

## Search

The docs site supports search via Algolia DocSearch.

- App ID: `0MG5COI1YB`
- Index name: `liberia-digital-insights`
- Configuration lives in `docs/.vitepress/config.mjs` under `themeConfig.algolia`.
