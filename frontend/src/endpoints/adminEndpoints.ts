const adminRouterEndPoints = {
    adminLogin: '/api/admin/login',
    adminLogout: '/api/admin/logout',
    
    createJobRole: '/api/admin/jobRoles',
    updateJobRole: (jobId: string) => `/api/admin/jobRoles/${jobId}`,
    deleteJobRole: (jobId: string) => `/api/admin/jobRoles/${jobId}`, 
    getAllJobRolesAdmin: '/api/admin/jobRoles/all',
    getJobRoleById: (jobId: string) => `/api/admin/jobRoles/${jobId}`,
    toggleJobRoleStatus: (jobId: string) => `/api/admin/jobRoles/${jobId}/toggleStatus`, 
}

export default adminRouterEndPoints;