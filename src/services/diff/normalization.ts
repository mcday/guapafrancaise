export function normalizeText(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[\u2018\u2019]/g, "'")   // Smart quotes
    .replace(/[\u201C\u201D]/g, '"')   // Smart double quotes
    .replace(/[\u2013\u2014]/g, '-')   // Em/en dash
    .replace(/\u00A0/g, ' ')           // Non-breaking space
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .trim()
}

export function normalizeForComparison(text: string): string {
  return normalizeText(text).toLowerCase()
}

export function isAccentError(original: string, user: string): boolean {
  const stripAccents = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return (
    stripAccents(original.toLowerCase()) === stripAccents(user.toLowerCase()) &&
    original.toLowerCase() !== user.toLowerCase()
  )
}
