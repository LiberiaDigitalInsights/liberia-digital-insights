# Design System

## Tokens

- Colors, typography, radius, and spacing defined in `src/index.css` using `@theme`.
- Primary brand: `--color-brand-500: #882627`.
- Always use CSS variables in Tailwind utilities: `text-[var(--color-text)]`, `bg-[var(--color-surface)]`.

## Primitives

- `Button` (variants: `solid`, `outline`, `ghost`, `subtle`, `secondary`, `danger`; sizes: `sm|md|lg`; props: `loading`, `leftIcon`, `rightIcon`).
- `Input`, `Select` (include focus rings and proper text colors).
- `Card` (Header, Title, Content subcomponents).
- `Typography` (`H1`, `H2`, `Muted`).
- `Badge`, `Alert`, `Modal`, `Tabs`, `Accordion`, `Table`.
- `Textarea` (for multi-line plain text input).
- `RichTextEditor` (TipTap-based rich text editor component).
- `ContentRenderer` (safe HTML renderer with sanitization).

## Theming

- Dark default; light overrides via `[data-theme='light']`.
- Use `ThemeProvider` and `ThemeToggle`.

## Patterns

- Forms: `Field`, `Label`, `HelperText`, `ErrorText`.
- Toasts: `ToastProvider`, `useToast`, `ToastViewport`.
- Modals: Constrain max-height and enable internal scroll to avoid viewport overflow.
- Responsive Tables: Reduce column widths on small screens; use icon-only actions.
- Rich Text Editing: Use `RichTextEditor` with `value` and `onChange({ target: { value }})`.
- Sanitized Rendering: Use `ContentRenderer` for any stored HTML content.
- Category Selects: Source options from `src/data/categories.js` (`CATEGORIES`).

## Rich Text Editor (TipTap)

- Location: `src/components/ui/RichTextEditor.jsx`
- Toolbar: Bold, Italic, Underline, H1–H3, lists, align, link, image, clear, code block, blockquote
- Image upload: file input, inserts base64 data URL. No backend.
- Props:
  - `value`: HTML string
  - `onChange`: receives `{ target: { value: html } }`
  - `disabled`: boolean

Example:

```jsx
<RichTextEditor
  value={form.content || ''}
  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
/>
```

## Sanitization & Rendering

- Sanitizer: `src/utils/sanitizeHtml.js`
- Renderer: `src/components/ui/ContentRenderer.jsx`
- Always sanitize before rendering user-generated HTML in previews and detail pages.

## Modal Responsiveness

- Apply max-height constraints and `overflow-y-auto` inside modal content areas to prevent viewport overflow.
- Ensure padding and focus traps work on small screens.

## Persisted UI State

- `admin_editor_tab`: remembers last editor tab (Edit/Preview)
- `admin_chart_range`: remembers selected analytics time range

## Adding a New Primitive

1. Create component in `src/components/ui/Name.jsx`.
2. Use tokens and consistent props/variants.
3. Add demo to `/components` page.
4. Write a minimal test (render + behavior) in `__tests__`.
