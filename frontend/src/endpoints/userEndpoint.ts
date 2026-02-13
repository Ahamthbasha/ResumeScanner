const userRouterEndPoints = {
    userRegister : '/api/user/register',
    userLogin : '/api/user/login',
    userLogout : '/api/user/logout',
    userProfile : '/api/user/profile',
    userSearch : '/api/user/users/search',
    userAll:'/api/user/users/all',
    userVerifyOTP: '/api/user/verifyOtp',
    userResendOTP: '/api/user/resendOtp',

    // resume

     jobRoles: '/api/user/jobRoles',
    uploadResume: '/api/user/upload',
    compareResume: '/api/user/compare',
    userResumes: '/api/user/resumes',
    deleteResume: (resumeId: string) => `/api/user/resumes/${resumeId}`,
    scanHistory: '/api/user/history',
    scanDetail: (scanId: string) => `/api/user/history/${scanId}`,
    deleteScan: (scanId: string) => `/api/user/history/${scanId}`,
}

export default userRouterEndPoints