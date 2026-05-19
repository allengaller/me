/**
 * Generate resume in Markdown or HTML format
 */

/**
 * Generate Markdown resume
 * @param {Object} data - Resume data
 * @returns {string} Markdown content
 */
export function generateResumeMarkdown(data) {
  const { profile, experience, skills, projects, social } = data;

  let md = `# ${profile.name}\n\n`;
  md += `**${profile.title}**\n\n`;
  md += `${profile.location} | ${profile.contact}\n\n`;
  md += `---\n\n`;

  // Summary
  md += `## About\n\n${profile.about}\n\n`;

  // Experience
  md += `## Experience\n\n`;
  for (const exp of experience) {
    md += `### ${exp.title}`;
    if (exp.company) md += ` @ ${exp.company}`;
    md += `\n\n`;
    md += `**${exp.period}**\n\n`;
    if (exp.description) md += `${exp.description}\n\n`;
    if (exp.achievements && exp.achievements.length > 0) {
      md += `**Achievements:**\n`;
      for (const a of exp.achievements) {
        md += `- ${a}\n`;
      }
      md += `\n`;
    }
  }

  // Skills
  md += `## Skills\n\n`;
  for (const skill of skills) {
    md += `- **${skill.name}** (${skill.level}): ${skill.technologies.join(', ')}\n`;
  }
  md += `\n`;

  // Projects
  if (projects.length > 0) {
    md += `## Projects\n\n`;
    for (const proj of projects) {
      md += `### ${proj.title}\n\n`;
      md += `${proj.description}\n\n`;
      md += `**Technologies:** ${proj.technologies.join(', ')}\n\n`;
      if (proj.github) md += `- GitHub: ${proj.github}\n`;
      if (proj.live) md += `- Live: ${proj.live}\n`;
      if (proj.highlights && proj.highlights.length > 0) {
        md += `**Highlights:**\n`;
        for (const h of proj.highlights) {
          md += `- ${h}\n`;
        }
      }
      md += `\n`;
    }
  }

  // Social Links
  if (social.length > 0) {
    md += `## Connect\n\n`;
    for (const s of social) {
      md += `- [${s.platform}](${s.url})\n`;
    }
  }

  md += `\n---\n*Generated with ME Profile Generator*\n`;

  return md;
}

/**
 * Generate HTML resume for print/PDF
 * @param {Object} data - Resume data
 * @returns {string} HTML content
 */
export function generateResumeHTML(data) {
  const { profile, experience, skills, projects, social } = data;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${profile.name} - Resume</title>
  <style>
    body {
      font-family: 'IBM Plex Sans', -apple-system, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #1a1a1a;
      line-height: 1.6;
    }
    h1 { font-family: 'Cinzel', Georgia, serif; font-size: 2rem; margin-bottom: 0.25rem; }
    h2 { font-family: 'Cinzel', Georgia, serif; font-size: 1.1rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; margin-top: 2rem; }
    h3 { font-size: 1rem; font-weight: 600; }
    .subtitle { color: #2563eb; font-weight: 500; }
    .contact { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
    .section { margin-bottom: 2rem; }
    .entry { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e5e5; }
    .entry-header { display: flex; justify-content: space-between; }
    .entry-title { font-weight: 500; }
    .entry-company { color: #2563eb; }
    .entry-period { font-size: 0.85rem; color: #999; }
    .entry-achievements { padding-left: 1.25rem; }
    .entry-achievements li { margin-bottom: 0.25rem; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    .skill-item { background: #f5f5f5; padding: 1rem; border-radius: 4px; }
    .skill-bar { height: 3px; background: #e5e5e5; margin: 0.5rem 0; }
    .skill-bar-fill { height: 100%; background: #2563eb; }
    .tech-tag { font-size: 0.75rem; background: #eee; padding: 0.1rem 0.35rem; border-radius: 2px; margin-right: 0.35rem; }
    @media print {
      body { padding: 0; }
      .skill-item { break-inside: avoid; }
      .entry { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${profile.name}</h1>
  <p class="subtitle">${profile.title}</p>
  <p class="contact">${profile.location} | ${profile.contact}</p>

  <div class="section">
    <h2>About</h2>
    <p>${profile.about}</p>
  </div>

  <div class="section">
    <h2>Experience</h2>
    ${experience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <div>
            <span class="entry-title">${exp.title}</span>
            ${exp.company ? ` <span class="entry-company">@ ${exp.company}</span>` : ''}
          </div>
          <span class="entry-period">${exp.period}</span>
        </div>
        ${exp.description ? `<p>${exp.description}</p>` : ''}
        ${exp.achievements && exp.achievements.length > 0 ? `
          <ul class="entry-achievements">
            ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Skills</h2>
    <div class="skills-grid">
      ${skills.map(skill => {
        const percent = skill.level === 'Expert' ? 95 : skill.level === 'Advanced' ? 75 : skill.level === 'Intermediate' ? 50 : 25;
        return `
          <div class="skill-item">
            <strong>${skill.name}</strong> (${skill.level})
            <div class="skill-bar"><div class="skill-bar-fill" style="width: ${percent}%"></div></div>
            <div>${skill.technologies.slice(0, 5).map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
          </div>
        `;
      }).join('')}
    </div>
  </div>

  ${projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${projects.map(proj => `
      <div class="entry">
        <strong>${proj.title}</strong>
        <p>${proj.description}</p>
        <p><strong>Technologies:</strong> ${proj.technologies.join(', ')}</p>
        ${proj.highlights && proj.highlights.length > 0 ? `
          <ul class="entry-achievements">
            ${proj.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${social.length > 0 ? `
  <div class="section">
    <h2>Connect</h2>
    <p>${social.map(s => `<a href="${s.url}">${s.platform}</a>`).join(' | ')}</p>
  </div>
  ` : ''}
</body>
</html>`;
}

/**
 * Download resume as Markdown file
 * @param {Object} data - Resume data
 * @param {string} filename - Output filename
 */
export function downloadResumeMarkdown(data, filename = 'resume.md') {
  const content = generateResumeMarkdown(data);
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Open resume in new tab as HTML (for print/PDF)
 * @param {Object} data - Resume data
 */
export function openResumeHTML(data) {
  const html = generateResumeHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}