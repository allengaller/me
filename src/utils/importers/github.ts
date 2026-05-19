/**
 * GitHub 数据导入器
 * 从 GitHub API 获取用户公开资料
 */

export async function importFromGitHub(username: string): Promise<Record<string, any>> {
  if (!username || typeof username !== 'string') {
    throw new Error('GitHub username is required');
  }

  // 清理用户名
  const cleanUsername = username.trim().replace('@', '');
  
  try {
    // 获取用户资料
    const userResponse = await fetch(`https://api.github.com/users/${cleanUsername}`);
    
    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        throw new Error(`GitHub user "${cleanUsername}" not found`);
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    // 获取用户仓库
    const reposResponse = await fetch(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=10`);
    const reposData = reposResponse.ok ? await reposResponse.json() : [];
    
    // 构建导入的数据结构
    const imported = {
      profile: {
        name: userData.name || userData.login,
        title: 'Developer',
        location: userData.location || '',
        about: userData.bio || `GitHub user @${userData.login}`,
        avatar: userData.avatar_url || '',
        contact: userData.email || ''
      },
      social: [
        {
          platform: 'GitHub',
          url: userData.html_url,
          icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
        }
      ],
      skills: [],
      projects: [],
      experience: []
    };
    
    // 从仓库推断技能
    const languageCounts = {};
    reposData.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });
    
    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);
    
    if (topLanguages.length > 0) {
      imported.skills.push({
        name: 'Languages',
        name_zh: '编程语言',
        level: 'Advanced',
        level_zh: '高级',
        technologies: topLanguages
      });
    }
    
    // 转换仓库为项目
    const pinnedRepos = reposData
      .filter(repo => !repo.fork)
      .slice(0, 6);
    
    imported.projects = pinnedRepos.map(repo => ({
      title: repo.name,
      title_zh: repo.name,
      description: repo.description || `A ${repo.language || 'software'} project`,
      description_zh: repo.description || `一个 ${repo.language || '软件'} 项目`,
      technologies: repo.language ? [repo.language] : [],
      github: repo.html_url,
      live: repo.homepage || '',
      highlights: [
        `${repo.stargazers_count} stars`,
        `${repo.forks_count} forks`
      ],
      highlights_zh: [
        `${repo.stargazers_count} 星标`,
        `${repo.forks_count} 分支`
      ]
    }));
    
    return imported;
    
  } catch (error) {
    if (error.message.includes('not found')) {
      throw error;
    }
    throw new Error(`Failed to import from GitHub: ${error.message}`);
  }
}
