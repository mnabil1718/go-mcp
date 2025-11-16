export function appendSizeUnit(b: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let idx = 0;
  while (b >= 1024 && idx < units.length - 1) {
    b /= 1024;
    idx++;
  }

  return `${b.toFixed()} ${units[idx]}`;
}
