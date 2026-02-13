// src/controllers/adminController/adminJobController.ts
import { Response, NextFunction } from 'express';
import JobRole from '../../models/jobRoleModel';
import AppError from '../../utils/appError';
import { AuthRequest } from '../../middleware/authMiddleware';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

export class AdminJobRoleController {

  async createJobRole(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { 
        title, 
        description, 
        requiredSkills, 
        category, 
        experienceLevel, 
        minExperience, 
        maxExperience 
      } = req.body;

      // Sanitize title and description
      const sanitizedTitle = title?.trim();
      const sanitizedDescription = description ? description.trim() : description;
      
      // Sanitize skills array
      const sanitizedSkills = requiredSkills
        ?.map((skill: string) => skill?.trim())
        .filter((skill: string) => skill && skill.length > 0) || [];

      // Validate required fields
      if (!sanitizedTitle || sanitizedTitle.length === 0) {
        throw new AppError('Job role title is required', 400);
      }

      if (!sanitizedSkills || sanitizedSkills.length === 0) {
        throw new AppError('At least one required skill is needed', 400);
      }

      // Check if job role already exists (case insensitive)
      const existingRole = await JobRole.findOne({ 
        where: { 
          title: { [Op.iLike]: sanitizedTitle } // Use iLike for case-insensitive search
        } 
      });
      
      if (existingRole) {
        throw new AppError('Job role with this title already exists', 400);
      }

      const jobRole = await JobRole.create({
        title: sanitizedTitle,
        description: sanitizedDescription,
        requiredSkills: sanitizedSkills,
        category: category?.trim() || null,
        experienceLevel: experienceLevel?.trim() || null,
        minExperience,
        maxExperience,
        createdBy: req.user!.userId,
        isActive: true
      });

      return res.status(201).json({
        success: true,
        message: 'Job role created successfully',
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }

  async updateJobRole(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { jobId } = req.params;
      const { 
        title, 
        description, 
        requiredSkills, 
        category, 
        experienceLevel, 
        minExperience, 
        maxExperience 
      } = req.body;

      const jobRole = await JobRole.findByPk(jobId);
      if (!jobRole) {
        throw new AppError('Job role not found', 404);
      }

      // Sanitize inputs
      const sanitizedTitle = title ? title.trim() : jobRole.title;
      const sanitizedDescription = description !== undefined ? description?.trim() : jobRole.description;
      
      // Sanitize skills if provided
      let sanitizedSkills = jobRole.requiredSkills;
      if (requiredSkills) {
        sanitizedSkills = requiredSkills
          .map((skill: string) => skill?.trim())
          .filter((skill: string) => skill && skill.length > 0);
        
        if (sanitizedSkills.length === 0) {
          throw new AppError('At least one valid skill is required', 400);
        }
      }

      // Validate title if provided
      if (title && (!sanitizedTitle || sanitizedTitle.length === 0)) {
        throw new AppError('Job role title cannot be empty', 400);
      }

      // Check if title already exists on OTHER job roles (case insensitive)
      if (title && sanitizedTitle && sanitizedTitle !== jobRole.title) {
        const existingRole = await JobRole.findOne({
          where: {
            title: { [Op.iLike]: sanitizedTitle },
            id: { [Op.ne]: jobId }
          }
        });
        
        if (existingRole) {
          throw new AppError('Job role with this title already exists', 400);
        }
      }

      const updates = {
        title: sanitizedTitle,
        description: sanitizedDescription,
        requiredSkills: sanitizedSkills,
        category: category !== undefined ? (category?.trim() || null) : jobRole.category,
        experienceLevel: experienceLevel !== undefined ? (experienceLevel?.trim() || null) : jobRole.experienceLevel,
        minExperience: minExperience !== undefined ? minExperience : jobRole.minExperience,
        maxExperience: maxExperience !== undefined ? maxExperience : jobRole.maxExperience,
      };

      await jobRole.update(updates);

      return res.status(200).json({
        success: true,
        message: 'Job role updated successfully',
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteJobRole(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { jobId } = req.params;

      const jobRole = await JobRole.findByPk(jobId);
      if (!jobRole) {
        throw new AppError('Job role not found', 404);
      }

      // Soft delete by setting isActive to false
      await jobRole.update({ isActive: false });

      return res.status(200).json({
        success: true,
        message: 'Job role deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllJobRolesAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string || '';

      // Build where clause
      let whereClause = {};
      
      if (search && search.trim()) {
        const sanitizedSearch = search.trim();
        whereClause = {
          [Op.or]: [
            { title: { [Op.iLike]: `%${sanitizedSearch}%` } },
            { description: { [Op.iLike]: `%${sanitizedSearch}%` } },
            { category: { [Op.iLike]: `%${sanitizedSearch}%` } }
          ]
        };
      }

      const { count, rows } = await JobRole.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return res.status(200).json({
        success: true,
        data: {
          jobRoles: rows,
          pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            hasNextPage: page < Math.ceil(count / limit),
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobRoleById(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { jobId } = req.params;

      const jobRole = await JobRole.findByPk(jobId);
      if (!jobRole) {
        throw new AppError('Job role not found', 404);
      }

      return res.status(200).json({
        success: true,
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminJobRoleController;