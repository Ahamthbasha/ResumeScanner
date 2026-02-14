
import { skillDatabase, getAllSkillNames, getSkillAliasesMap } from '../utils/skillDatabase';

export interface SkillData {
  name: string;
  category: string;
  aliases: string[];
}

export class SkillExtractorService {
  private skillAliasesMap: Map<string, string[]>;
  private normalizedSkillNames: Set<string>;
  private skillNameMap: Map<string, string>;

  constructor() {
    this.skillAliasesMap = getSkillAliasesMap();
    this.normalizedSkillNames = new Set();
    this.skillNameMap = new Map();
    
    getAllSkillNames().forEach((skill: string) => {
      const skillLower = skill.toLowerCase();
      this.normalizedSkillNames.add(skillLower);
      this.skillNameMap.set(skillLower, skill);
    });
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  extractSkills(text: string): string[] {
    const foundSkills = new Set<string>();
    const lowerText = text.toLowerCase();

    getAllSkillNames().forEach((skill: string) => {
      const skillLower = skill.toLowerCase();
      
      if (lowerText.includes(skillLower)) {
        foundSkills.add(skill);
        return;
      }

      const aliases = this.skillAliasesMap.get(skill) || [];
      for (const alias of aliases) {
        if (lowerText.includes(alias.toLowerCase())) {
          foundSkills.add(skill); 
          break;
        }
      }

      const pattern = new RegExp(`\\b${this.escapeRegExp(skillLower)}\\b`, 'gi');
      if (pattern.test(lowerText)) {
        foundSkills.add(skill);
      }
    });


    return Array.from(foundSkills).sort();
  }

  extractSkillsWithFrequency(text: string): Array<{ name: string; count: number }> {
    const skillCount = new Map<string, number>();
    const lowerText = text.toLowerCase();

    getAllSkillNames().forEach((skill: string) => {
      const skillLower = skill.toLowerCase();
      let count = 0;

      const directMatches = lowerText.match(new RegExp(`\\b${this.escapeRegExp(skillLower)}\\b`, 'gi'));
      if (directMatches) {
        count += directMatches.length;
      }

      const aliases = this.skillAliasesMap.get(skill) || [];
      aliases.forEach((alias: string) => {
        const aliasLower = alias.toLowerCase();
        const aliasMatches = lowerText.match(new RegExp(`\\b${this.escapeRegExp(aliasLower)}\\b`, 'gi'));
        if (aliasMatches) {
          count += aliasMatches.length;
        }
      });

      if (count > 0) {
        skillCount.set(skill, count);
      }
    });

    return Array.from(skillCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  categorizeSkills(skills: string[]): Record<string, string[]> {
    const categorized: Record<string, string[]> = {};

    skills.forEach((skill: string) => {
      const skillData = skillDatabase.find((s: SkillData) => s.name === skill);
      const category = skillData?.category || 'Other';
      
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(skill);
    });

    return categorized;
  }

  compareSkills(
    extractedSkills: string[],
    requiredSkills: string[]
  ): {
    matched: string[];
    missing: string[];
    matchPercentage: number;
    extra: string[];
  } {
    const extractedLower = extractedSkills.map(s => s.toLowerCase());
    const requiredLower = requiredSkills.map(s => s.toLowerCase());
    const matched = requiredSkills.filter((_skill, index) => 
      extractedLower.includes(requiredLower[index])
    );

    const missing = requiredSkills.filter((_skill, index) => 
      !extractedLower.includes(requiredLower[index])
    );

    const extra = extractedSkills.filter((_skill, index) => 
      !requiredLower.includes(extractedLower[index])
    );

    const matchPercentage = requiredSkills.length > 0
      ? (matched.length / requiredSkills.length) * 100
      : 0;

    return {
      matched,
      missing,
      matchPercentage: Math.round(matchPercentage * 100) / 100,
      extra,
    };
  }
  generateSuggestions(missingSkills: string[]): string[] {
    const suggestions: string[] = [];

    if (missingSkills.length === 0) {
      suggestions.push('Excellent! You have all the required skills for this role.');
      return suggestions;
    }

    suggestions.push(`You are missing ${missingSkills.length} key skill(s) for this role.`);

    missingSkills.forEach((skill: string) => {
      switch (skill) {
        case 'React':
          suggestions.push('Learn React through official documentation and build projects like todo apps or e-commerce sites.');
          break;
        case 'Node.js':
        case 'Node':
          suggestions.push('Take Node.js courses on Udemy or freeCodeCamp and build REST APIs.');
          break;
        case 'TypeScript':
          suggestions.push('Start with TypeScript handbook and convert existing JavaScript projects to TypeScript.');
          break;
        case 'Python':
          suggestions.push('Learn Python basics on Codecademy and practice with small automation scripts.');
          break;
        case 'Docker':
          suggestions.push('Understand containerization basics through Docker\'s getting started guide.');
          break;
        case 'AWS':
          suggestions.push('Get AWS Certified Cloud Practitioner certification to understand cloud fundamentals.');
          break;
        case 'MongoDB':
        case 'Mongo':
          suggestions.push('Practice MongoDB with their free university courses and build a CRUD application.');
          break;
        case 'PostgreSQL':
        case 'Postgres':
          suggestions.push('Learn SQL fundamentals and practice complex queries with PostgreSQL.');
          break;
        case 'JavaScript':
        case 'JS':
          suggestions.push('Master JavaScript fundamentals through modern ES6+ features and practice coding challenges.');
          break;
        case 'HTML':
        case 'HTML5':
          suggestions.push('Learn semantic HTML5 and accessibility best practices.');
          break;
        case 'CSS':
        case 'CSS3':
          suggestions.push('Master CSS3 including Flexbox, Grid, and responsive design.');
          break;
        case 'Tailwind':
        case 'Tailwind CSS':
          suggestions.push('Learn Tailwind CSS utility-first framework for rapid UI development.');
          break;
        case 'Bootstrap':
          suggestions.push('Master Bootstrap framework for responsive, mobile-first websites.');
          break;
        case 'Redux':
          suggestions.push('Learn Redux state management with Redux Toolkit for React applications.');
          break;
        case 'Next.js':
        case 'Next':
          suggestions.push('Learn Next.js framework for production-ready React applications with SSR.');
          break;
        default:
          suggestions.push(`Consider learning ${skill} through online courses, tutorials, and hands-on projects.`);
      }
    });

    suggestions.push('Online resources: Coursera, Udemy, freeCodeCamp, YouTube tutorials, and official documentation.');

    return suggestions;
  }
  
  normalizeSkillName(skillName: string): string {
    const lowerSkill = skillName.toLowerCase();
    
    if (this.skillNameMap.has(lowerSkill)) {
      return this.skillNameMap.get(lowerSkill)!;
    }
    
    for (const [standardSkill, aliases] of this.skillAliasesMap.entries()) {
      if (aliases.some(alias => alias.toLowerCase() === lowerSkill)) {
        return standardSkill;
      }
    }
    
    return skillName;
  }
}