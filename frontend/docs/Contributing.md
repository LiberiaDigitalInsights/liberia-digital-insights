# Contributing

Thanks for your interest in contributing! Please follow the guidelines below to keep the project healthy and consistent.

## Getting Set Up

- Node.js 18+
- From `frontend/`: `npm install`
- Dev app: `npm run dev`
- Docs site: `npm run docs:dev`

## Branching

- Create feature branches from `main`: `feat/<scope>-<short-desc>` or `fix/<scope>-<short-desc>`
- Keep PRs small and focused.

## Commits

- Prefer conventional commits, e.g.
  - `feat(admin): add TipTap editor to create modal`
  - `fix(insights): correct /insight/:id link`

## Code Style

- Run `npm run lint` and `npm run format` before committing.
- Use design tokens and primitives (no hardcoded colors/spacing).

## Tests

- Add/adjust unit tests when changing behavior: `npm run test`
- Keep tests fast and isolated.

## UI/UX

- Follow patterns in `DesignSystem.md`.
- Ensure modals and tables are responsive across breakpoints.

## Docs

- Update or add docs when introducing new components/patterns.
- For the docs site, update pages under `frontend/docs/` and verify with `npm run docs:dev`.

## PR Checklist

- [ ] Linted and formatted
- [ ] Tests added/updated and passing
- [ ] Docs updated (if applicable)
- [ ] Screenshots for UI changes (optional but helpful)

## Release & Changelog

- Maintainers curate release notes; keep commit messages clear to ease this.
