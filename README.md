# Matha Chickens

Chicken Farm Ordering & Store Management System

## Color System

This project uses shadcn/ui design tokens with Matha Chicken brand color overrides in `src/index.css`.

### Color Architecture

**Problem: CSS Cascade Issue** — Matha brand colors declared at the top of `:root` are overwritten by shadcn overrides because CSS reads top-to-bottom. The actual values in use are the shadcn values declared later.

### Matha Brand Colors (correctly override shadcn)

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `oklch(0.145 0 0)` | Headings (dark near-black) |
| `--foreground` | `oklch(0.322 0 0)` | Body text (gray) |
| `--muted-foreground` | `oklch(0.437 0 0)` | Subtitles (light gray) |
| `--border` | `oklch(0 0 0 / 0.1)` | Borders |
| `--background-secondary` | `oklch(0.967 0 0)` | Gradient end |
| `--admin` | `oklch(0.577 0.245 27.325)` | Admin brand (red) |
| `--store` | `oklch(0.708 0.17 55)` | Store brand (orange) |
| `--admin-accent` | `oklch(0.933 0.06 30)` | Admin icon bg |
| `--store-accent` | `oklch(0.953 0.08 80)` | Store icon bg |

### Shadcn Tokens (used as-is)

| Token | Usage |
|-------|-------|
| `--secondary` + `--secondary-foreground` | Background + text pair |
| `--muted` + `--muted-foreground` | Background + text pair |
| `--accent` + `--accent-foreground` | Background + text pair |
| `--primary` + `--primary-foreground` | Button primary + text |
| `--destructive` | Error/danger actions |

### Usage in Tailwind

- `text-primary` → heading text
- `text-foreground` → body text
- `text-muted-foreground` → subtitles
- `bg-admin`, `text-admin`, `bg-admin-accent`, `bg-store-accent`, etc.

### Important: Shadcn's Paired Token Pattern

Shadcn uses **paired tokens** (background + foreground). Don't use `--secondary` or `--muted` as text colors — use `--secondary-foreground` and `--muted-foreground` for text on those backgrounds.

**Correct:**
```tsx
<div className="bg-secondary text-secondary-foreground">Text</div>
```

**Incorrect:**
```tsx
<div className="bg-secondary text-secondary">Low contrast - won't work!</div>
```

## Development

```bash
pnpm install
pnpm dev
pnpm build
```
