# Liberia Digital Insights – Frontend

Vite + React + Tailwind CSS design system and app shell.

## Quick Start

1. `cd frontend`
2. Install deps: `npm install`
3. Dev server: `npm run dev`
4. Lint: `npm run lint` | Format: `npm run format`
5. Test: `npm run test`

## Testing

- Run all tests once: `npm run test`
- Watch mode: `npm run test:watch`
- With coverage: `npm run test:coverage`
- Test utilities are in `src/test` (`renderWithProviders`, shared Providers).

## Coverage

- Provider: V8 (via `@vitest/coverage-v8`)
- Reports: text, HTML, lcov in `./coverage`
- Thresholds: lines 70, functions 70, branches 60, statements 70 (see `vitest.config.js`)
- Open `coverage/index.html` after running: `npm run test:coverage`

## CI

- GitHub Actions workflow runs tests with coverage on pushes/PRs to `main`.
- Coverage HTML is uploaded as an artifact.

## Project Structure

- `src/components/ui`: Design system primitives
- `src/components/layouts`: Layout components
- `src/components/charts`: Chart components
- `src/pages`: Route pages (e.g., `/components`, `/dashboard`)
- `src/context`: App providers (theme, toast)

## Design System

- Tokens are defined in `src/index.css` under `@theme` and CSS variables.
- Always use variables: `var(--color-*)`, `var(--radius-*)`, `var(--font-sans)`.
- Primitives: Button, Input, Select, Card, Typography, Badge, Alert, Modal, Tabs, Accordion, Table.
- Variants: pass `variant` and `size` where supported; prefer existing semantics.

See `/components` route for live examples.

### Tokens & Props

- Spacing and radius via CSS vars. Card additionally supports `elevation` (`none|sm|md|lg`) and `padding` (`sm|md|lg`).
- Colors: use `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, and brand ramp.
- Typography components (`H1`, `H2`, `Muted`, etc.) carry standardized sizing.

### Skeleton & Empty States

- Use `Skeleton` for loading placeholders that match final layout.
- Use `EmptyState` with a short `title` and optional `description` for no-results.
- Prefer replacing spinners with skeletons for perceived performance.

### Images

- Use `LazyImage` for responsive images. Provide `sizes` and, when appropriate, `fetchPriority="high"` for above-the-fold media.
- Always include informative `alt` text.

### Accessibility Guidelines

- Landmarks: header/nav/main/footer; provide `aria-label` when helpful.
- Forms: use `aria-invalid` and `aria-describedby` to connect inputs and messages.
- Focus: ensure `:focus-visible` styles on interactive elements. Keyboard-test dialogs and menus.
- Motion: `prefers-reduced-motion` is respected; avoid non-essential animations for reduced-motion users.
- Dialogs: trap focus, set initial focus, and restore on close.

## Theming

- Dark is default. Light mode via `[data-theme='light']` overrides in `src/index.css`.
- Toggle with `ThemeToggle` (in navbar) powered by `ThemeProvider`.

## Charts

- Recharts-based `TrafficChart`. Data is fetched from `/traffic.json` (public) in Dashboard.

## Conventions (Strict)

See top-level `CONTRIBUTING.md` for mandatory rules (style, a11y, commits, testing, docs).
