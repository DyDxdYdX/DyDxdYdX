'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';

interface LanguageStats {
  [key: string]: number;
}

export function GitHubStats() {
  const [languages, setLanguages] = useState<LanguageStats>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguageStats() {
      try {
        // Fetch all repositories
        const reposResponse = await fetch('https://api.github.com/users/DyDxdYdX/repos');
        const repos = await reposResponse.json();

        // Fetch language stats for each repository
        const languagePromises = repos.map((repo: any) =>
          fetch(repo.languages_url).then(res => res.json())
        );

        const languagesData = await Promise.all(languagePromises);

        // Combine language stats from all repositories
        const combinedStats: LanguageStats = {};
        languagesData.forEach((repoLanguages: LanguageStats) => {
          Object.entries(repoLanguages).forEach(([language, bytes]) => {
            combinedStats[language] = (combinedStats[language] || 0) + bytes;
          });
        });

        // Calculate percentages
        const total = Object.values(combinedStats).reduce((a, b) => a + b, 0);
        const percentages: LanguageStats = {};
        Object.entries(combinedStats).forEach(([language, bytes]) => {
          percentages[language] = Math.round((bytes / total) * 100);
        });

        // Sort languages by percentage
        const sortedLanguages: LanguageStats = Object.fromEntries(
          Object.entries(percentages).sort(([,a], [,b]) => b - a)
        );

        setLanguages(sortedLanguages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setIsLoading(false);
      }
    }

    fetchLanguageStats();
  }, []);

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Languages Used on GitHub</h3>
        <div className="space-y-3">
          {Object.entries(languages).map(([language, percentage]) => (
            <div key={language} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{language}</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getLanguageColor(language),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Technical Skills</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Web Development',
            'Wordpress Development',
            'Mobile Development',
            'API Development',
            'Database Design',
            'UI/UX Design',
            'Testing',
            'Laravel',
            'React',
            'Tailwind CSS',
            'Bootstrap',
            'Material UI',
          ].map((skill) => (
            <div
              key={skill}
              className="px-3 py-2 rounded-lg bg-muted/50 text-sm font-medium"
            >
              {skill}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 