/**
 * JSON 导出器
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToJson(profile: Record<string, any>, pretty = true) {
  const data = {
    ...profile,
    _meta: {
      generator: 'ME Tool',
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    }
  };

  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadJSON(profile: Record<string, any>, filename: string = 'profile.json'): void {
  const content = exportToJson(profile);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
