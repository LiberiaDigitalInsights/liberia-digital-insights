# Liberia Digital Insights – Frontend

Vite + React + Tailwind CSS design system and app shell.

## Quick Start

1. `cd frontend`
2. Install deps: `npm install`
3. Dev server: `npm run dev`
4. Lint: `npm run lint` | Format: `npm run format`
5. Test: `npm run test`

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

## Theming

- Dark is default. Light mode via `[data-theme='light']` overrides in `src/index.css`.
- Toggle with `ThemeToggle` (in navbar) powered by `ThemeProvider`.

## Charts

- Recharts-based `TrafficChart`. Data is fetched from `/traffic.json` (public) in Dashboard.

## Conventions (Strict)

See top-level `CONTRIBUTING.md` for mandatory rules (style, a11y, commits, testing, docs).
