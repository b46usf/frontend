export function compactNumber(value) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);
}

export function percent(value) {
  return `${Math.round(value)}%`;
}
