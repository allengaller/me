/**
 * JSON 导出器
 */

export function exportToJson(profile, pretty = true) {
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

export function downloadJson(profile, filename = 'profile.json') {
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
