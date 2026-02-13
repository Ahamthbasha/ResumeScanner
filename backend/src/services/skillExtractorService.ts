// src/services/skillExtractorService.ts
import { skillDatabase, getAllSkillNames, getSkillAliasesMap } from '../utils/skillDatabase';

export interface SkillData {
  name: string;
  category: string;
  aliases: string[];
}

export class SkillExtractorService {
  private skillAliasesMap: Map<string, string[]>;
  // Cache for normalized skill names (lowercase)
  private normalizedSkillNames: Set<string>;
  private skillNameMap: Map<string, string>; // Maps lowercase -> original case

  constructor() {
    this.skillAliasesMap = getSkillAliasesMap();
    this.normalizedSkillNames = new Set();
    this.skillNameMap = new Map();
    
    // Pre-populate normalized skill names for case-insensitive matching
    getAllSkillNames().forEach((skill: string) => {
      const skillLower = skill.toLowerCase();
      this.normalizedSkillNames.add(skillLower);
      this.skillNameMap.set(skillLower, skill);
    });
  }

  /**
   * Escape special characters for regex
   */
  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Extract skills from text - CASE INSENSITIVE
   */
  extractSkills(text: string): string[] {
    const foundSkills = new Set<string>();
    const lowerText = text.toLowerCase();

    // Check each skill (using normalized lowercase for comparison)
    getAllSkillNames().forEach((skill: string) => {
      const skillLower = skill.toLowerCase();
      
      // Direct match (case insensitive)
      if (lowerText.includes(skillLower)) {
        foundSkills.add(skill); // Add original case version
        return;
      }

      // Check aliases (case insensitive)
      const aliases = this.skillAliasesMap.get(skill) || [];
      for (const alias of aliases) {
        if (lowerText.includes(alias.toLowerCase())) {
          foundSkills.add(skill); // Add original case version
          break;
        }
      }

      // Check word boundary regex (case insensitive)
      const pattern = new RegExp(`\\b${this.escapeRegExp(skillLower)}\\b`, 'gi');
      if (pattern.test(lowerText)) {
        foundSkills.add(skill); // Add original case version
      }
    });

    // Convert Set to sorted array
    return Array.from(foundSkills).sort();
  }

  /**
   * Extract skills with frequency count - CASE INSENSITIVE
   */
  extractSkillsWithFrequency(text: string): Array<{ name: string; count: number }> {
    const skillCount = new Map<string, number>();
    const lowerText = text.toLowerCase();

    getAllSkillNames().forEach((skill: string) => {
      const skillLower = skill.toLowerCase();
      let count = 0;

      // Count direct matches (case insensitive)
      const directMatches = lowerText.match(new RegExp(`\\b${this.escapeRegExp(skillLower)}\\b`, 'gi'));
      if (directMatches) {
        count += directMatches.length;
      }

      // Count alias matches (case insensitive)
      const aliases = this.skillAliasesMap.get(skill) || [];
      aliases.forEach((alias: string) => {
        const aliasLower = alias.toLowerCase();
        const aliasMatches = lowerText.match(new RegExp(`\\b${this.escapeRegExp(aliasLower)}\\b`, 'gi'));
        if (aliasMatches) {
          count += aliasMatches.length;
        }
      });

      if (count > 0) {
        skillCount.set(skill, count); // Store with original case
      }
    });

    return Array.from(skillCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Categorize skills by category
   */
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

  /**
   * Compare extracted skills with required skills - CASE INSENSITIVE
   */
  compareSkills(
    extractedSkills: string[],
    requiredSkills: string[]
  ): {
    matched: string[];
    missing: string[];
    matchPercentage: number;
    extra: string[];
  } {
    // Normalize both arrays to lowercase for comparison
    const extractedLower = extractedSkills.map(s => s.toLowerCase());
    const requiredLower = requiredSkills.map(s => s.toLowerCase());
    
    // Find matched skills (case insensitive) - ✅ FIXED: removed unused 'skill' parameter
    const matched = requiredSkills.filter((_skill, index) => 
      extractedLower.includes(requiredLower[index])
    );

    // Find missing skills (case insensitive) - ✅ FIXED: removed unused 'skill' parameter
    const missing = requiredSkills.filter((_skill, index) => 
      !extractedLower.includes(requiredLower[index])
    );

    // Find extra skills (case insensitive) - ✅ FIXED: removed unused 'skill' parameter
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

  /**
   * Generate suggestions for missing skills
   */
  generateSuggestions(missingSkills: string[]): string[] {
    const suggestions: string[] = [];

    if (missingSkills.length === 0) {
      suggestions.push('Excellent! You have all the required skills for this role.');
      return suggestions;
    }

    // General suggestion
    suggestions.push(`You are missing ${missingSkills.length} key skill(s) for this role.`);

    // Specific suggestions for each missing skill
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

    // Add resources suggestion
    suggestions.push('Online resources: Coursera, Udemy, freeCodeCamp, YouTube tutorials, and official documentation.');

    return suggestions;
  }
  
  /**
   * Normalize skill name to database standard
   */
  normalizeSkillName(skillName: string): string {
    const lowerSkill = skillName.toLowerCase();
    
    // Check if we have a normalized version
    if (this.skillNameMap.has(lowerSkill)) {
      return this.skillNameMap.get(lowerSkill)!;
    }
    
    // Check aliases
    for (const [standardSkill, aliases] of this.skillAliasesMap.entries()) {
      if (aliases.some(alias => alias.toLowerCase() === lowerSkill)) {
        return standardSkill;
      }
    }
    
    // Return original if no match found
    return skillName;
  }
}