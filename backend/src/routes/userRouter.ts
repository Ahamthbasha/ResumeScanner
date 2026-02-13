import { Router } from 'express';
import validateRequest from '../validator/validateRequest'; 
import { 
  registerValidator, 
  loginValidator, 
  otpValidator, 
  resendOTPValidator 
} from '../validator/authValidator';
import container from '../dependencyInject/container'; 
import upload from '../middleware/upload';
import { compareValidation } from '../validator/resumeValidator';

const router = Router();
const { authController, authMiddleware,resumeController } = container;

// ============ PUBLIC ROUTES ============
router.post(
  '/register',
  registerValidator,
  validateRequest,
  authController.register.bind(authController)
);

router.post(
  '/verifyOtp',
  otpValidator,
  validateRequest,
  authController.verifyOTP.bind(authController)
);

router.post(
  '/resendOtp',
  resendOTPValidator,
  validateRequest,
  authController.resendOTP.bind(authController)
);

router.post(
  '/login',
  loginValidator,
  validateRequest,
  authController.login.bind(authController)
);

router.post(
  '/logout',
  authMiddleware.authenticate.bind(authMiddleware),
  authController.logout.bind(authController)
);

router.get(
  '/profile',
  authMiddleware.authenticate.bind(authMiddleware),
  authController.getCurrentUser.bind(authController)
);

router.get('/jobRoles',
  authMiddleware.authenticate.bind(authMiddleware),
  resumeController.getAllJobRoles);

router.route('/upload')
  .post(
    authMiddleware.authenticate.bind(authMiddleware),
    upload.single('resume'),
    resumeController.uploadResume
  );

router.route('/compare')
  .post(
    authMiddleware.authenticate.bind(authMiddleware),
    compareValidation,
    validateRequest,
    resumeController.compareWithJobRole
  );

router.route('/resumes')
  .get(
    authMiddleware.authenticate.bind(authMiddleware),
    resumeController.getUserResumes
  );

router.route('/resumes/:resumeId')
  .delete(
    authMiddleware.authenticate.bind(authMiddleware),
    resumeController.deleteResume
  );

router.route('/history')
  .get(
    authMiddleware.authenticate.bind(authMiddleware),
    resumeController.getScanHistory
  );

router.route('/history/:scanId')
  .get(
    authMiddleware.authenticate.bind(authMiddleware),
    resumeController.getScanDetail
  )
  .delete(
    authMiddleware.authenticate.bind(authMiddleware),
    resumeController.deleteScanHistory
  );


export default router;