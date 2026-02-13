
import { Router } from 'express';
import container from '../dependencyInject/container';
import validateRequest from '../validator/validateRequest';
import { adminLoginValidator, jobRoleValidator } from '../validator/adminValidator';

const router = Router();

const { adminAuthController, adminJobRoleController, authMiddleware } = container;

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

router.post(
  '/jobRoles',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  jobRoleValidator,
  validateRequest,
  adminJobRoleController.createJobRole.bind(adminJobRoleController)
);

router.put(
  '/jobRoles/:jobId',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  jobRoleValidator,
  validateRequest,
  adminJobRoleController.updateJobRole.bind(adminJobRoleController)
);

router.delete(
  '/jobRoles/:jobId',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.deleteJobRole.bind(adminJobRoleController)
);

router.get(
  '/jobRoles/all',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.getAllJobRolesAdmin.bind(adminJobRoleController)
);

router.get(
  '/jobRoles/:jobId',
  authMiddleware.authenticate.bind(authMiddleware),
  authMiddleware.isAdmin.bind(authMiddleware),
  adminJobRoleController.getJobRoleById.bind(adminJobRoleController)
);



export default router;