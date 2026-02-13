// src/utils/skillDatabase.ts

export interface SkillData {
  name: string;
  category: string;
  aliases: string[];
}

export const skillDatabase: SkillData[] = [
  // Frontend
  { name: 'HTML', category: 'Frontend', aliases: ['html5'] },
  { name: 'CSS', category: 'Frontend', aliases: ['css3'] },
  { name: 'JavaScript', category: 'Frontend', aliases: ['js', 'ecmascript', 'es6', 'es8', 'es2020'] },
  { name: 'TypeScript', category: 'Frontend', aliases: ['ts'] },
  { name: 'React', category: 'Frontend', aliases: ['reactjs', 'react.js'] },
  { name: 'Redux', category: 'Frontend', aliases: ['reduxjs', 'redux.js'] },
  { name: 'Vue', category: 'Frontend', aliases: ['vuejs', 'vue.js'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angularjs', 'angular.js', 'ng'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['next', 'nextjs'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss'] },
  { name: 'Bootstrap', category: 'Frontend', aliases: ['bootstrap4', 'bootstrap5', 'bs'] },
  { name: 'jQuery', category: 'Frontend', aliases: ['jquery'] },
  { name: 'SASS', category: 'Frontend', aliases: ['scss'] },
  { name: 'LESS', category: 'Frontend', aliases: ['less'] },
  { name: 'Webpack', category: 'Frontend', aliases: ['webpack'] },
  { name: 'Vite', category: 'Frontend', aliases: ['vitejs'] },
  
  // Backend
  { name: 'Node.js', category: 'Backend', aliases: ['node', 'nodejs'] },
  { name: 'Express', category: 'Backend', aliases: ['expressjs', 'express.js'] },
  { name: 'Python', category: 'Backend', aliases: ['py'] },
  { name: 'Django', category: 'Backend', aliases: ['django'] },
  { name: 'Flask', category: 'Backend', aliases: ['flask'] },
  { name: 'Java', category: 'Backend', aliases: ['java8', 'java11', 'java17'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring', 'springboot'] },
  { name: 'C#', category: 'Backend', aliases: ['csharp'] },
  { name: '.NET', category: 'Backend', aliases: ['dotnet', '.net core'] },
  { name: 'PHP', category: 'Backend', aliases: ['php'] },
  { name: 'Laravel', category: 'Backend', aliases: ['laravel'] },
  { name: 'Go', category: 'Backend', aliases: ['golang'] },
  { name: 'Rust', category: 'Backend', aliases: ['rust'] },
  { name: 'Ruby', category: 'Backend', aliases: ['ruby'] },
  { name: 'Rails', category: 'Backend', aliases: ['ruby on rails'] },
  
  // Database
  { name: 'SQL', category: 'Database', aliases: ['structured query language'] },
  { name: 'MySQL', category: 'Database', aliases: ['mysql'] },
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgres', 'postgresql'] },
  { name: 'MongoDB', category: 'Database', aliases: ['mongo', 'mongodb'] },
  { name: 'Redis', category: 'Database', aliases: ['redis'] },
  { name: 'Elasticsearch', category: 'Database', aliases: ['elastic', 'es'] },
  { name: 'Oracle', category: 'Database', aliases: ['oracle db'] },
  { name: 'SQLite', category: 'Database', aliases: ['sqlite'] },
  { name: 'Firebase', category: 'Database', aliases: ['firebase'] },
  { name: 'DynamoDB', category: 'Database', aliases: ['dynamodb'] },
  
  // DevOps & Cloud
  { name: 'Docker', category: 'DevOps', aliases: ['docker'] },
  { name: 'Kubernetes', category: 'DevOps', aliases: ['k8s', 'kubernetes'] },
  { name: 'AWS', category: 'Cloud', aliases: ['amazon web services', 'ec2', 's3', 'lambda'] },
  { name: 'Azure', category: 'Cloud', aliases: ['microsoft azure'] },
  { name: 'GCP', category: 'Cloud', aliases: ['google cloud', 'google cloud platform'] },
  { name: 'CI/CD', category: 'DevOps', aliases: ['cicd', 'continuous integration', 'continuous deployment'] },
  { name: 'Jenkins', category: 'DevOps', aliases: ['jenkins'] },
  { name: 'GitHub Actions', category: 'DevOps', aliases: ['github actions', 'ga'] },
  { name: 'GitLab CI', category: 'DevOps', aliases: ['gitlab ci'] },
  { name: 'Terraform', category: 'DevOps', aliases: ['terraform'] },
  { name: 'Ansible', category: 'DevOps', aliases: ['ansible'] },
  
  // Testing
  { name: 'Jest', category: 'Testing', aliases: ['jest'] },
  { name: 'Mocha', category: 'Testing', aliases: ['mocha'] },
  { name: 'Chai', category: 'Testing', aliases: ['chai'] },
  { name: 'Cypress', category: 'Testing', aliases: ['cypress'] },
  { name: 'Selenium', category: 'Testing', aliases: ['selenium'] },
  { name: 'JUnit', category: 'Testing', aliases: ['junit'] },
  { name: 'PyTest', category: 'Testing', aliases: ['pytest'] },
  
  // Mobile
  { name: 'React Native', category: 'Mobile', aliases: ['react native'] },
  { name: 'Flutter', category: 'Mobile', aliases: ['flutter'] },
  { name: 'Swift', category: 'Mobile', aliases: ['swift'] },
  { name: 'Kotlin', category: 'Mobile', aliases: ['kotlin'] },
  { name: 'iOS', category: 'Mobile', aliases: ['ios'] },
  { name: 'Android', category: 'Mobile', aliases: ['android'] },
  
  // Version Control
  { name: 'Git', category: 'Version Control', aliases: ['git'] },
  { name: 'GitHub', category: 'Version Control', aliases: ['github'] },
  { name: 'GitLab', category: 'Version Control', aliases: ['gitlab'] },
  { name: 'Bitbucket', category: 'Version Control', aliases: ['bitbucket'] },
  
  // Soft Skills
  { name: 'Communication', category: 'Soft Skills', aliases: ['comm'] },
  { name: 'Teamwork', category: 'Soft Skills', aliases: ['team'] },
  { name: 'Problem Solving', category: 'Soft Skills', aliases: ['problem solving', 'analytical'] },
  { name: 'Leadership', category: 'Soft Skills', aliases: ['leadership'] },
  { name: 'Time Management', category: 'Soft Skills', aliases: ['time management'] },
];

// Get all unique skill names
export const getAllSkillNames = (): string[] => {
  return skillDatabase.map(skill => skill.name);
};

// Get skill aliases map
export const getSkillAliasesMap = (): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  skillDatabase.forEach(skill => {
    map.set(skill.name, skill.aliases);
  });
  return map;
};

// Normalize skill name (case insensitive)
export const normalizeSkillName = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  // Check direct match
  const directMatch = skillDatabase.find(skill => 
    skill.name.toLowerCase() === lowerInput
  );
  if (directMatch) return directMatch.name;
  
  // Check aliases
  for (const skill of skillDatabase) {
    if (skill.aliases.some(alias => alias.toLowerCase() === lowerInput)) {
      return skill.name;
    }
  }
  
  return input; // Return original if no match
};