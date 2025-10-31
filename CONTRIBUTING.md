## Contributing Guidelines (Strict Rules)

These rules are mandatory for all contributors. PRs that do not comply will be rejected.

1) Code Style & Formatting
- Use Prettier and ESLint configs in `frontend/`. Run `npm run format` and `npm run lint` before commits.
- No inline style objects; use Tailwind tokens and CSS variables defined in `src/index.css`.
- Keep components small, composable, and co-locate UI primitives under `src/components/ui`.

2) Design System First
- Use tokens: `--color-*`, `--radius-*`, `--font-sans`. Never hardcode colors, spacing, radii, or fonts.
- Prefer existing primitives (`Button`, `Input`, `Select`, `Card`, `Typography`, `Badge`, `Alert`, `Modal`, `Tabs`, `Accordion`, `Table`). Add new primitives only if necessary and document them.
- Variants: expose `variant`, `size`, `loading`, and icon slots consistently across components when relevant.

3) Accessibility
- All interactive elements must be keyboard accessible and have focus styles.
- Provide `aria-*` attributes and labels for non-text UI (icons, toggles, drawers, modals).
- Respect reduced motion preferences if adding animations.

4) Routing & Pages
- Use React Router. Keep routes in `src/App.jsx`; pages go in `src/pages`.
- Shared layout belongs in `src/components/layouts`.

5) State & Context
- Keep global UI state in React Context only when truly cross-cutting (`Theme`, `Toast`). Prefer local state otherwise.

6) Testing
- Add Vitest + RTL tests for all complex logic and for any new UI primitive.
- Minimum: render test and critical behavior test.

7) Git & Commits
- Conventional Commits required: `type(scope): subject` (e.g., `feat(button): add loading state`).
- Squash-merge only. Each PR must have a clear description, screenshots for UI changes, and reference the issue.

8) Performance & Quality
- Avoid unnecessary re-renders. Memoize expensive components when needed.
- No unused dependencies. Keep bundle lean; prefer dynamic imports for heavy modules.

9) File Structure (frontend)
- `src/components/ui/*`: primitives only.
- `src/components/*`: composite components, layouts, utilities.
- `src/pages/*`: route-level views only; thin containers.
- `src/context/*`: cross-cutting app providers.
- `src/components/charts/*`: chart components.

10) Documentation
- Any new primitive or pattern must be showcased on `/components` with usage examples.

By contributing, you agree to follow these rules.


