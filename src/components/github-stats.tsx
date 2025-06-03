'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { GITHUB_TOKEN } from '@/config';

interface LanguageStats {
  [key: string]: number;
}

interface GitHubRepo {
  languages_url: string;
}

// Fallback data in case GitHub API fails
const FALLBACK_LANGUAGES: LanguageStats = {
  "PHP": 35,
  "TypeScript": 20,
  "JavaScript": 15,
  "Java": 10,
  "C++": 8,
  "Kotlin": 5,
  "HTML": 4,
  "CSS": 3
};

export function GitHubStats() {
  const [languages, setLanguages] = useState<LanguageStats>(FALLBACK_LANGUAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    async function fetchLanguageStats() {
      try {
        // Setup headers with GitHub token if available
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json',
        };

        // Add token if available (both in development and production)
        if (GITHUB_TOKEN) {
          headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
        }

        // Fetch all repositories with authentication
        const reposResponse = await fetch('https://api.github.com/users/DyDxdYdX/repos', {
          headers,
          // Add cache control
          next: {
            revalidate: 3600 // Revalidate every hour
          }
        });
        
        if (!reposResponse.ok) {
          const errorText = await reposResponse.text();
          console.warn('Failed to fetch repos:', errorText);
          return; // Will use fallback data
        }
        
        const repos = await reposResponse.json();
        
        if (!Array.isArray(repos)) {
          console.warn('Invalid repos response:', repos);
          return; // Will use fallback data
        }

        // Fetch language stats for each repository with authentication
        const languagePromises = repos.map((repo: GitHubRepo) =>
          fetch(repo.languages_url, { 
            headers,
            next: {
              revalidate: 3600 // Revalidate every hour
            }
          })
            .then(res => res.ok ? res.json() : {})
            .catch(error => {
              console.warn('Error fetching language stats:', error);
              return {};
            })
        );

        const languagesData = await Promise.all(languagePromises);

        // Combine language stats from all repositories
        const combinedStats: LanguageStats = {};
        languagesData.forEach((repoLanguages: LanguageStats) => {
          Object.entries(repoLanguages).forEach(([language, bytes]) => {
            combinedStats[language] = (combinedStats[language] || 0) + bytes;
          });
        });

        if (Object.keys(combinedStats).length === 0) {
          console.warn('No languages found in repositories');
          return; // Will use fallback data
        }

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
        setIsFallback(false);
      } catch (error) {
        console.warn('Error fetching GitHub stats:', error);
        // Fallback data will be used
      } finally {
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
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Languages Used on GitHub</h3>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
            {isFallback && (
              <div className="relative group">
                <FontAwesomeIcon 
                  icon={faCircleInfo} 
                  className="w-4 h-4 text-muted-foreground cursor-help" 
                />
                <div className="absolute hidden group-hover:block right-0 top-6 w-48 p-2 text-xs bg-popover text-popover-foreground rounded-md shadow-lg z-50">
                  Using cached data - GitHub API unavailable
                </div>
              </div>
            )}
          </div>
        </div>
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