// // src/services/adminApi.ts
// import { API } from "../../services/axios"; 
// import adminRouterEndPoints from "../../endpoints/adminEndpoints"; 

// export interface AdminLoginRequest {
//   email: string;
//   password: string;
// }

// export interface AdminLoginResponse {
//   success: boolean;
//   message: string;
//   data: {
//     admin: {
//       id: string;
//       name: string;
//       email: string;
//       role: string;
//     };
//   };
// }

// export interface JobRole {
//   id: string;
//   title: string;
//   description: string;
//   requiredSkills: string[];
//   category?: string;
//   experienceLevel?: string;
//   minExperience?: number;
//   maxExperience?: number;
//   isActive: boolean;
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateJobRoleRequest {
//   title: string;
//   description: string;
//   requiredSkills: string[];
//   category?: string;
//   experienceLevel?: string;
//   minExperience?: number;
//   maxExperience?: number;
// }

// // ✅ Fix: Use type alias instead of empty interface
// export type UpdateJobRoleRequest = Partial<CreateJobRoleRequest>;

// export interface JobRoleResponse {
//   success: boolean;
//   message?: string;
//   data: JobRole | JobRole[];
// }

// // ============ ADMIN AUTH ACTIONS ============

// /**
//  * Admin Login
//  */
// export const adminLogin = async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
//   const response = await API.post(adminRouterEndPoints.adminLogin, data);
//   return response.data;
// };

// /**
//  * Admin Logout
//  */
// export const adminLogout = async (): Promise<{ success: boolean; message: string }> => {
//   const response = await API.post(adminRouterEndPoints.adminLogout);
//   return response.data;
// };

// // ============ JOB ROLE MANAGEMENT ACTIONS ============

// /**
//  * Create new job role
//  */
// export const createJobRole = async (data: CreateJobRoleRequest): Promise<JobRoleResponse> => {
//   const response = await API.post(adminRouterEndPoints.createJobRole, data);
//   return response.data;
// };

// /**
//  * Update job role
//  */
// export const updateJobRole = async (id: string, data: UpdateJobRoleRequest): Promise<JobRoleResponse> => {
//   const response = await API.put(adminRouterEndPoints.updateJobRole(id), data);
//   return response.data;
// };

// /**
//  * Delete job role (soft delete)
//  */
// export const deleteJobRole = async (id: string): Promise<{ success: boolean; message: string }> => {
//   const response = await API.delete(adminRouterEndPoints.deleteJobRole(id));
//   return response.data;
// };

// /**
//  * Get all job roles (including inactive) - Admin only
//  */
// export const getAllJobRolesAdmin = async (): Promise<JobRoleResponse> => {
//   const response = await API.get(adminRouterEndPoints.getAllJobRolesAdmin);
//   return response.data;
// };

// /**
//  * Get job role by ID
//  */
// export const getJobRoleById = async (id: string): Promise<JobRoleResponse> => {
//   const response = await API.get(adminRouterEndPoints.getJobRoleById(id));
//   return response.data;
// };

// /**
//  * Toggle job role active status
//  */
// export const toggleJobRoleStatus = async (id: string): Promise<JobRoleResponse> => {
//   const response = await API.patch(adminRouterEndPoints.toggleJobRoleStatus(id));
//   return response.data;
// };



























// src/services/adminApi.ts
import { API } from "../../services/axios"; 
import adminRouterEndPoints from "../../endpoints/adminEndpoints"; 

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  category?: string;
  experienceLevel?: string;
  minExperience?: number;
  maxExperience?: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedJobRoleResponse {
  success: boolean;
  data: {
    jobRoles: JobRole[];
    pagination: PaginationMeta;
  };
}

export interface CreateJobRoleRequest {
  title: string;
  description: string;
  requiredSkills: string[];
  category?: string;
  experienceLevel?: string;
  minExperience?: number;
  maxExperience?: number;
}

export type UpdateJobRoleRequest = Partial<CreateJobRoleRequest>;

export interface JobRoleResponse {
  success: boolean;
  message?: string;
  data: JobRole;
}

export interface JobRoleListResponse {
  success: boolean;
  data: JobRole[];
}

// ============ ADMIN AUTH ACTIONS ============

export const adminLogin = async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
  const response = await API.post(adminRouterEndPoints.adminLogin, data);
  return response.data;
};

export const adminLogout = async (): Promise<{ success: boolean; message: string }> => {
  const response = await API.post(adminRouterEndPoints.adminLogout);
  return response.data;
};

// ============ JOB ROLE MANAGEMENT ACTIONS ============

export const createJobRole = async (data: CreateJobRoleRequest): Promise<JobRoleResponse> => {
  const response = await API.post(adminRouterEndPoints.createJobRole, data);
  return response.data;
};

export const updateJobRole = async (id: string, data: UpdateJobRoleRequest): Promise<JobRoleResponse> => {
  const response = await API.put(adminRouterEndPoints.updateJobRole(id), data);
  return response.data;
};

export const deleteJobRole = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await API.delete(adminRouterEndPoints.deleteJobRole(id));
  return response.data;
};

/**
 * Get all job roles with pagination - Admin only
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param search - Search term (optional)
 */
export const getAllJobRolesAdmin = async (
  page: number = 1, 
  limit: number = 10,
  search: string = ''
): Promise<PaginatedJobRoleResponse> => {
  const response = await API.get(adminRouterEndPoints.getAllJobRolesAdmin, {
    params: { page, limit, search }
  });
  return response.data;
};

export const getJobRoleById = async (id: string): Promise<JobRoleResponse> => {
  const response = await API.get(adminRouterEndPoints.getJobRoleById(id));
  return response.data;
};

export const toggleJobRoleStatus = async (id: string): Promise<JobRoleResponse> => {
  const response = await API.patch(adminRouterEndPoints.toggleJobRoleStatus(id));
  return response.data;
};