
import { Router } from 'express';
import container from '../dependencyInject/container';
import validateRequest from '../validator/validateRequest';
import { adminLoginValidator, jobRoleValidator } from '../validator/adminValidator';

const router = Router();

const { adminAuthController, adminJobRoleController, authMiddleware } = container;

// ============ ADMIN AUTH ROUTES ============
router.post(
  '/login',
  adminLoginValidator,
  validateRequest,
  adminAuthController.login.bind(adminAuthController)
);

router.post(
  '/logout',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminAuthController.logout.bind(adminAuthController)
);

// ============ JOB ROLE MANAGEMENT ROUTES (camelCase) ============

/**
 * Create new job role
 * POST /api/v1/admin/jobRoles
 */
router.post(
  '/jobRoles',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  jobRoleValidator,
  validateRequest,
  adminJobRoleController.createJobRole.bind(adminJobRoleController)
);

/**
 * Update job role by jobId
 * PUT /api/v1/admin/jobRoles/:jobId
 */
router.put(
  '/jobRoles/:jobId',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  jobRoleValidator,
  validateRequest,
  adminJobRoleController.updateJobRole.bind(adminJobRoleController)
);

/**
 * Delete job role (soft delete) by jobId
 * DELETE /api/v1/admin/jobRoles/:jobId
 */
router.delete(
  '/jobRoles/:jobId',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.deleteJobRole.bind(adminJobRoleController)
);

/**
 * Get all job roles (including inactive)
 * GET /api/v1/admin/jobRoles/all
 */
router.get(
  '/jobRoles/all',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.getAllJobRolesAdmin.bind(adminJobRoleController)
);

/**
 * Get single job role by jobId
 * GET /api/v1/admin/jobRoles/:jobId
 */
router.get(
  '/jobRoles/:jobId',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.getJobRoleById.bind(adminJobRoleController)
);

/**
 * Toggle job role active status by jobId
 * PATCH /api/v1/admin/jobRoles/:jobId/toggleStatus
 */
router.patch(
  '/jobRoles/:jobId/toggleStatus',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.toggleJobRoleStatus.bind(adminJobRoleController)
);

export default router;