export interface JobRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  category?: string;
}

export interface UploadResumeData {
  resumeId: string;
  fileName: string;
  extractedSkills: string[];
  categorizedSkills: Record<string, string[]>;
  pageCount: number;
}

export interface ComparisonResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  suggestions: string[];
  scanId: string;
}

export interface ScanHistoryItem {
  id: string;
  jobRoleTitle: string;
  fileName: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: string;
}

export interface UserResume {
  id: string;
  fileName: string;
  extractedSkills: string[];
  createdAt: string;
}