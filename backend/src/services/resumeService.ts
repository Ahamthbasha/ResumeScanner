import Resume from '../models/ResumeModel';
import JobRole from '../models/jobRoleModel';
import ScanHistory from '../models/scanHistoryModel';
import { PDFParserService } from './pdfParserService';
import { SkillExtractorService } from './skillExtractorService';
import AppError from '../utils/appError';
import '../models/index'

export class ResumeService {
  constructor(
    private pdfParserService: PDFParserService,
    private skillExtractorService: SkillExtractorService
  ) {}


async uploadResume(
  userId: string,
  file: Express.Multer.File
): Promise<Resume> {
  try {
    console.log(`📤 Uploading resume for user: ${userId}`);
    console.log(`📁 File: ${file.originalname}, Size: ${file.size} bytes`);
    
    // Parse PDF
    const parsedData = await this.pdfParserService.parsePDF(file);
    console.log(`✅ PDF parsed: ${parsedData.pageCount} pages, ${parsedData.text.length} chars`);

    // Extract skills from text
    console.log('🔍 Extracting skills...');
    const extractedSkills = this.skillExtractorService.extractSkills(parsedData.text);
    console.log(`✅ Found ${extractedSkills.length} skills:`, extractedSkills);
    
    const categorizedSkills = this.skillExtractorService.categorizeSkills(extractedSkills);
    console.log('📊 Categorized skills:', Object.keys(categorizedSkills));

    // Save resume to database
    const resume = await Resume.create({
      userId,
      fileName: parsedData.fileName,
      filePath: '', // No file path when using memoryStorage
      fileSize: parsedData.fileSize,
      extractedText: parsedData.text,
      extractedSkills,
      categorizedSkills,
      pageCount: parsedData.pageCount,
    });

    console.log(`💾 Resume saved to DB with ID: ${resume.id}`);
    return resume;
  } catch (error) {
    console.error('❌ Resume upload error:', error);
    throw error;
  }
}

  async compareWithJobRole(
    userId: string,
    resumeId: string,
    jobRoleId: string
  ): Promise<{
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    extraSkills: string[];
    suggestions: string[];
    scanId: string;
  }> {
    const startTime = Date.now();

    // Get resume and job role
    const resume = await Resume.findByPk(resumeId);
    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    const jobRole = await JobRole.findByPk(jobRoleId);
    if (!jobRole) {
      throw new AppError('Job role not found', 404);
    }

    // Compare skills
    const comparison = this.skillExtractorService.compareSkills(
      resume.extractedSkills,
      jobRole.requiredSkills
    );

    // Generate suggestions
    const suggestions = this.skillExtractorService.generateSuggestions(comparison.missing);

    // Calculate scan duration
    const scanDuration = Date.now() - startTime;

    // Save scan history
    const scanHistory = await ScanHistory.create({
      userId,
      resumeId,
      jobRoleId,
      jobRoleTitle: jobRole.title,
      fileName: resume.fileName,
      matchPercentage: comparison.matchPercentage,
      matchedSkills: comparison.matched,
      missingSkills: comparison.missing,
      extraSkills: comparison.extra,
      suggestions,
      scanDuration,
    });

    return {
      matchPercentage: comparison.matchPercentage,
      matchedSkills: comparison.matched,
      missingSkills: comparison.missing,
      extraSkills: comparison.extra,
      suggestions,
      scanId: scanHistory.id,
    };
  }

  async getUserScanHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    scans: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await ScanHistory.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: [
        'id',
        'jobRoleTitle',
        'fileName',
        'matchPercentage',
        'matchedSkills',
        'missingSkills',
        'suggestions',
        'createdAt',
      ],
    });

    return {
      scans: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getScanDetail(scanId: string, userId: string): Promise<ScanHistory> {
    const scan = await ScanHistory.findOne({
      where: {
        id: scanId,
        userId,
      },
      include: [
        {
          model: Resume,
          as:'resume',
          attributes: ['id', 'fileName', 'extractedSkills', 'categorizedSkills'],
        },
      ],
    });

    if (!scan) {
      throw new AppError('Scan not found', 404);
    }

    return scan;
  }

  async deleteScanHistory(scanId: string, userId: string): Promise<void> {
    const scan = await ScanHistory.findOne({
      where: {
        id: scanId,
        userId,
      },
    });

    if (!scan) {
      throw new AppError('Scan not found', 404);
    }

    await scan.destroy();
  }

  async getAllJobRoles(): Promise<JobRole[]> {
    return await JobRole.findAll({
      where: { isActive: true },
      attributes: ['id', 'title', 'description', 'requiredSkills', 'category'],
      order: [['title', 'ASC']],
    });
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return await Resume.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'fileName', 'extractedSkills', 'createdAt'],
    });
  }

  async deleteResume(resumeId: string, userId: string): Promise<void> {
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        userId,
      },
    });

    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    await ScanHistory.destroy({
      where: { resumeId },
    });

    await resume.destroy();
  }
}
