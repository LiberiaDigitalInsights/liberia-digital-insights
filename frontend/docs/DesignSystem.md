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

## Theming
- Dark default; light overrides via `[data-theme='light']`.
- Use `ThemeProvider` and `ThemeToggle`.

## Patterns
- Forms: `Field`, `Label`, `HelperText`, `ErrorText`.
- Toasts: `ToastProvider`, `useToast`, `ToastViewport`.

## Adding a New Primitive
1. Create component in `src/components/ui/Name.jsx`.
2. Use tokens and consistent props/variants.
3. Add demo to `/components` page.
4. Write a minimal test (render + behavior) in `__tests__`.
