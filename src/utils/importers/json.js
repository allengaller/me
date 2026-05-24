/**
 * JSON 文件导入器
 * 支持导入 profile.json 和其他格式的 JSON
 */

export function importFromJson(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // 验证基本结构
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }
    
    // 标准化数据结构
    const normalized = {
      profile: data.profile || {},
      social: Array.isArray(data.social) ? data.social : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      experience: Array.isArray(data.experience) ? data.experience : [],
      lobsterCommunities: Array.isArray(data.lobsterCommunities) ? data.lobsterCommunities : []
    };
    
    // 确保 profile 有默认值
    normalized.profile = {
      name: normalized.profile.name || '',
      title: normalized.profile.title || '',
      location: normalized.profile.location || '',
      about: normalized.profile.about || '',
      avatar: normalized.profile.avatar || '',
      contact: normalized.profile.contact || '',
      ...normalized.profile
    };
    
    return normalized;
    
  } catch (error) {
    if (error.message.includes('JSON')) {
      throw new Error('Invalid JSON format: ' + error.message);
    }
    throw error;
  }
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/json') {
      reject(new Error('Please select a valid JSON file'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = importFromJson(content);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}
