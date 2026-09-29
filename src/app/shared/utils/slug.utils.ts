/**
 * Normalizes any category slug (from the API, a URL, or a category name)
 * to a canonical form: lowercase, non-alphanumerics collapsed to a single
 * hyphen, and leading/trailing hyphens stripped.
 *
 * The live API stores some slugs with trailing hyphens (e.g. "rings-",
 * "earrings-"), so comparing raw slugs against route params silently
 * fails and category pages show "0 items". Always compare normalized.
 */
export function normalizeSlug(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
