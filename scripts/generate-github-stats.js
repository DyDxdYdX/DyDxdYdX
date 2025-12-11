const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'DyDxdYdX';
const THEMES = ['radical', 'dark', 'default'];

// Fallback data
const FALLBACK_LANGUAGES = {
  "PHP": 35,
  "TypeScript": 20,
  "JavaScript": 15,
  "Java": 10,
  "C++": 8,
  "Kotlin": 5,
  "HTML": 4,
  "CSS": 3
};

const getLanguageColor = (language) => {
  const colors = {
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    PHP: '#777BB4',
    HTML: '#E34F26',
    CSS: '#1572B6',
    Python: '#3776AB',
    Java: '#007396',
    'C++': '#00599C',
    Ruby: '#CC342D',
    Go: '#00ADD8',
    Rust: '#000000',
    Swift: '#FA7343',
    Kotlin: '#7F52FF',
    Dart: '#0175C2',
  };
  return colors[language] || '#6e6e6e';
};

async function fetchLanguageStats(username) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, { headers });
    
    if (!reposResponse.ok) {
      console.warn('Failed to fetch repos, using fallback data');
      return FALLBACK_LANGUAGES;
    }
    
    const repos = await reposResponse.json();
    
    if (!Array.isArray(repos)) {
      return FALLBACK_LANGUAGES;
    }

    const languagePromises = repos.map((repo) =>
      fetch(repo.languages_url, { headers })
        .then(res => res.ok ? res.json() : {})
        .catch(() => ({}))
    );

    const languagesData = await Promise.all(languagePromises);

    const combinedStats = {};
    languagesData.forEach((repoLanguages) => {
      Object.entries(repoLanguages).forEach(([language, bytes]) => {
        combinedStats[language] = (combinedStats[language] || 0) + bytes;
      });
    });

    if (Object.keys(combinedStats).length === 0) {
      return FALLBACK_LANGUAGES;
    }

    const total = Object.values(combinedStats).reduce((a, b) => a + b, 0);
    const percentages = {};
    Object.entries(combinedStats).forEach(([language, bytes]) => {
      const percentage = (bytes / total) * 100;
      if (percentage >= 1) {
        percentages[language] = Math.round(percentage * 10) / 10;
      }
    });

    return Object.fromEntries(
      Object.entries(percentages).sort(([,a], [,b]) => b - a)
    );
  } catch (error) {
    console.warn('Error fetching GitHub stats:', error);
    return FALLBACK_LANGUAGES;
  }
}

function generateSVG(languages, theme = 'radical') {
  const themes = {
    radical: {
      bg: '#141321',
      title: '#fe428e',
      text: '#a9fef7',
      border: '#fe428e'
    },
    dark: {
      bg: '#0d1117',
      title: '#58a6ff',
      text: '#c9d1d9',
      border: '#30363d'
    },
    default: {
      bg: '#fffefe',
      title: '#2f80ed',
      text: '#434d58',
      border: '#e4e2e2'
    }
  };

  const selectedTheme = themes[theme] || themes.radical;
  const entries = Object.entries(languages).slice(0, 8);
  const cardHeight = 45 + (entries.length * 40);
  const cardWidth = 300;

  const languageBars = entries.map(([language, percentage], index) => {
    const y = 50 + (index * 40);
    const barWidth = (percentage / 100) * 250;
    
    return `
      <g transform="translate(0, ${y})">
        <text x="10" y="0" class="lang-name">${language}</text>
        <text x="290" y="0" text-anchor="end" class="lang-percent">${percentage}%</text>
        <rect x="10" y="5" width="280" height="8" rx="4" fill="${selectedTheme.bg}" opacity="0.3"/>
        <rect x="10" y="5" width="${barWidth * 280 / 250}" height="8" rx="4" fill="${getLanguageColor(language)}"/>
      </g>
    `;
  }).join('');

  return `<svg width="${cardWidth}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { 
      font: 600 18px 'Segoe UI', Ubuntu, sans-serif; 
      fill: ${selectedTheme.title}; 
    }
    .lang-name { 
      font: 400 12px 'Segoe UI', Ubuntu, sans-serif; 
      fill: ${selectedTheme.text}; 
    }
    .lang-percent { 
      font: 600 12px 'Segoe UI', Ubuntu, sans-serif; 
      fill: ${selectedTheme.text}; 
    }
  </style>
  
  <rect width="${cardWidth}" height="${cardHeight}" fill="${selectedTheme.bg}" rx="4.5"/>
  ${theme !== 'default' ? '' : `<rect width="${cardWidth}" height="${cardHeight}" fill="none" stroke="${selectedTheme.border}" stroke-width="1" rx="4.5"/>`}
  
  <text x="10" y="30" class="header">Most Used Languages</text>
  
  ${languageBars}
</svg>`;
}

async function main() {
  console.log('🚀 Generating GitHub stats...');
  
  const languages = await fetchLanguageStats(USERNAME);
  console.log('📊 Fetched language stats:', Object.keys(languages).join(', '));
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'public', 'github-stats');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate SVGs for each theme
  for (const theme of THEMES) {
    const svg = generateSVG(languages, theme);
    const filename = theme === 'radical' ? 'stats.svg' : `stats-${theme}.svg`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, svg);
    console.log(`✅ Generated ${filename}`);
  }
  
  console.log('✨ Done! SVG files generated in public/github-stats/');
}

main().catch(console.error);

