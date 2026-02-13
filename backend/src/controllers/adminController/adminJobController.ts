// src/controllers/adminController/adminJobController.ts
import { Response, NextFunction } from 'express';
import JobRole from '../../models/jobRoleModel';
import AppError from '../../utils/appError';
import { AuthRequest } from '../../middleware/authMiddleware';
import { Op } from 'sequelize';

export class AdminJobRoleController {
  /**
   * Create new job role
   * POST /api/v1/admin/jobRoles
   */
  async createJobRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { 
        title, 
        description, 
        requiredSkills, 
        category, 
        experienceLevel, 
        minExperience, 
        maxExperience 
      } = req.body;

      // Check if job role already exists (case insensitive)
      const existingRole = await JobRole.findOne({ 
        where: { 
          title: { [Op.like]: title } 
        } 
      });
      
      if (existingRole) {
        throw new AppError('Job role with this title already exists', 400);
      }

      const jobRole = await JobRole.create({
        title,
        description,
        requiredSkills,
        category,
        experienceLevel,
        minExperience,
        maxExperience,
        createdBy: req.user!.userId,
        isActive: true
      });

      res.status(201).json({
        success: true,
        message: 'Job role created successfully',
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update job role by jobId
   * PUT /api/v1/admin/jobRoles/:jobId
   */
  async updateJobRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
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

      // Check if title already exists on OTHER job roles (case insensitive)
      if (title && title !== jobRole.title) {
        const existingRole = await JobRole.findOne({
          where: {
            title: { [Op.like]: title },
            id: { [Op.ne]: jobId }
          }
        });
        
        if (existingRole) {
          throw new AppError('Job role with this title already exists', 400);
        }
      }

      const updates = {
        title: title || jobRole.title,
        description: description !== undefined ? description : jobRole.description,
        requiredSkills: requiredSkills || jobRole.requiredSkills,
        category: category !== undefined ? category : jobRole.category,
        experienceLevel: experienceLevel !== undefined ? experienceLevel : jobRole.experienceLevel,
        minExperience: minExperience !== undefined ? minExperience : jobRole.minExperience,
        maxExperience: maxExperience !== undefined ? maxExperience : jobRole.maxExperience,
      };

      await jobRole.update(updates);

      res.status(200).json({
        success: true,
        message: 'Job role updated successfully',
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete job role (soft delete) by jobId
   * DELETE /api/v1/admin/jobRoles/:jobId
   */
  async deleteJobRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      const jobRole = await JobRole.findByPk(jobId);
      if (!jobRole) {
        throw new AppError('Job role not found', 404);
      }

      // Soft delete by setting isActive to false
      await jobRole.update({ isActive: false });

      res.status(200).json({
        success: true,
        message: 'Job role deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all job roles with pagination (including inactive) - Admin only
   * GET /api/v1/admin/jobRoles/all?page=1&limit=10
   */
  async getAllJobRolesAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string || '';

      // Build where clause
      let whereClause = {};
      
      if (search) {
        whereClause = {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { category: { [Op.like]: `%${search}%` } }
          ]
        };
      }

      const { count, rows } = await JobRole.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      res.status(200).json({
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

  /**
   * Get single job role by jobId
   * GET /api/v1/admin/jobRoles/:jobId
   */
  async getJobRoleById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      const jobRole = await JobRole.findByPk(jobId);
      if (!jobRole) {
        throw new AppError('Job role not found', 404);
      }

      res.status(200).json({
        success: true,
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate/Deactivate job role by jobId
   * PATCH /api/v1/admin/jobRoles/:jobId/toggleStatus
   */
  async toggleJobRoleStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;

      const jobRole = await JobRole.findByPk(jobId);
      if (!jobRole) {
        throw new AppError('Job role not found', 404);
      }

      await jobRole.update({ isActive: !jobRole.isActive });

      res.status(200).json({
        success: true,
        message: `Job role ${jobRole.isActive ? 'activated' : 'deactivated'} successfully`,
        data: jobRole
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminJobRoleController;