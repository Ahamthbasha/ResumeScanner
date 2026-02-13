

export interface IResume {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
  contentText: string;
  parsed?: IResumeData;
}

export interface IResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: IExperience[];
  education?: IEducation[];
  skills?: string[];
}

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IError extends Error {
  status?: number;
  code?: string;
}
