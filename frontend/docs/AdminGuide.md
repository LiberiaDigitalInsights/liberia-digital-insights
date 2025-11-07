# Admin Guide

This guide covers the Admin dashboard: authentication gate, CRUD tables, and responsive patterns.

## Access & Auth

- Component: `src/components/auth/AuthGate.jsx`
- Roles: persisted in `localStorage` and enforced on mutating actions.
- Route: `/admin` is wrapped by `AuthGate`.

## Layout & Order

Sections are ordered:

1. Overview cards
2. Analytics
3. Articles
4. Insights
5. Podcasts
6. Training & Courses

## CRUD Tables

- Location: `src/pages/Admin.jsx`
- Entities: Articles, Insights, Podcasts, Training & Courses
- Capabilities:
  - Create/Edit modal with fields including Title, Category, Status, Excerpt, and Content.
  - `RichTextEditor` (TipTap) for Content.
  - Publish/Unpublish toggles.
  - Delete with confirmation.
  - Filters (status/category/search) and pagination.

## Modals

- Use responsive patterns: constrain height and enable internal scrolling.
- Content tabs: Edit / Preview; last selected tab is persisted via `localStorage: admin_editor_tab`.

## Rich Text Content

- Editor: `src/components/ui/RichTextEditor.jsx` (TipTap)
- Sanitizer: `src/utils/sanitizeHtml.js`
- Preview/detail rendering uses `src/components/ui/ContentRenderer.jsx`.

## Categories

- Centralized options in `src/data/categories.js` exporting `CATEGORIES`.
- Use in selects for consistent taxonomy.

## Responsive Tables

- Reduce non-essential columns at smaller breakpoints where applicable.
- Convert action buttons to icon-only on small screens.
- Avoid horizontal overflow: prefer wrapping text and narrowing widths.

## Scheduling

- Schedule inputs are collapsed into the create/edit modal on small screens to save space.

## Persisted UI State

- `admin_editor_tab` – last-used editor tab.
- `admin_chart_range` – selected analytics range for charts.

## Links to Detail Pages

- Articles table `View` ➜ `/article/:id`
- Insights table `View` ➜ `/insight/:id`
