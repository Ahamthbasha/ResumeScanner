import {Request,  Response, NextFunction } from 'express';
import { ResumeService } from '../services/resumeService';
import AppError from '../utils/appError';
import { AuthRequest } from '../middleware/authMiddleware';

export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  /**
   * Upload and parse resume
   * POST /api/v1/resumes/upload
   */
  uploadResume = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const resume = await this.resumeService.uploadResume(
        req.user.userId,
        req.file
      );

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and parsed successfully',
        data: {
          resumeId: resume.id,
          fileName: resume.fileName,
          extractedSkills: resume.extractedSkills,
          categorizedSkills: resume.categorizedSkills,
          pageCount: resume.pageCount,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Compare resume with job role
   * POST /api/v1/resumes/compare
   */
  compareWithJobRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { resumeId, jobRoleId } = req.body;

      if (!resumeId || !jobRoleId) {
        throw new AppError('Resume ID and Job Role ID are required', 400);
      }

      const result = await this.resumeService.compareWithJobRole(
        req.user.userId,
        resumeId,
        jobRoleId
      );

      res.status(200).json({
        success: true,
        message: 'Resume compared successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's scan history
   * GET /api/v1/resumes/history
   */
  getScanHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const history = await this.resumeService.getUserScanHistory(
        req.user.userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get single scan detail
   * GET /api/v1/resumes/history/:scanId
   */
  getScanDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { scanId } = req.params;

      const scan = await this.resumeService.getScanDetail(scanId, req.user.userId);

      res.status(200).json({
        success: true,
        data: scan,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete scan history
   * DELETE /api/v1/resumes/history/:scanId
   */
  deleteScanHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { scanId } = req.params;

      await this.resumeService.deleteScanHistory(scanId, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Scan history deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all job roles for dropdown
   * GET /api/v1/resumes/job-roles
   */
  getAllJobRoles = async (_req:Request, res: Response, next: NextFunction) => {
    try {
      const jobRoles = await this.resumeService.getAllJobRoles();

      res.status(200).json({
        success: true,
        data: jobRoles,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's resumes
   * GET /api/v1/resumes
   */
  getUserResumes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const resumes = await this.resumeService.getUserResumes(req.user.userId);

      res.status(200).json({
        success: true,
        data: resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete resume
   * DELETE /api/v1/resumes/:resumeId
   */
  deleteResume = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { resumeId } = req.params;

      await this.resumeService.deleteResume(resumeId, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Resume deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}