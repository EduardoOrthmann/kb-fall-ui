export function formatDate(date: number | string): string {
  const dateStr = String(date);

  if (dateStr.length !== 8) return dateStr;

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${day}/${month}/${year}`;
}