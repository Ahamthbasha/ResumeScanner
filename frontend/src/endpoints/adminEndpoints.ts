// src/endpoints/adminEndpoints.ts
const adminRouterEndPoints = {
    // Auth endpoints
    adminLogin: '/api/admin/login',
    adminLogout: '/api/admin/logout',
    
    // Job role management endpoints (camelCase)
    createJobRole: '/api/admin/jobRoles',
    updateJobRole: (jobId: string) => `/api/admin/jobRoles/${jobId}`, // ✅ Changed to jobId
    deleteJobRole: (jobId: string) => `/api/admin/jobRoles/${jobId}`, // ✅ Changed to jobId
    getAllJobRolesAdmin: '/api/admin/jobRoles/all',
    getJobRoleById: (jobId: string) => `/api/admin/jobRoles/${jobId}`, // ✅ Changed to jobId
    toggleJobRoleStatus: (jobId: string) => `/api/admin/jobRoles/${jobId}/toggleStatus`, // ✅ Changed to jobId
}

export default adminRouterEndPoints;