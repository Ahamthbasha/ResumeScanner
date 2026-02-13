// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { FileText, Upload, Briefcase, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
// import type { RootState } from '../../redux/store';
// import { getJobRoles, uploadResume, compareResume } from '../../api/action/userAction';
// import type { JobRole, UploadResumeResponse, CompareResumeResponse } from '../../api/action/userAction';
// import type { ComparisonResult, UploadResumeData } from '../../types/resumeInterface';

// interface ErrorResponse {
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
//   message?: string;
// }

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.user);
  
//   const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
//   const [selectedJobRole, setSelectedJobRole] = useState<string>('');
//   const [uploadedResume, setUploadedResume] = useState<UploadResumeData | null>(null);
//   const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isComparing, setIsComparing] = useState(false);
//   const [dragActive, setDragActive] = useState(false);

//   useEffect(() => {
//     fetchJobRoles();
//   }, []);

//   const fetchJobRoles = async () => {
//     try {
//       const response = await getJobRoles();
//       setJobRoles(response.data);
//     } catch {
//       toast.error('Failed to fetch job roles');
//     }
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = async (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       await handleFileUpload(files[0]);
//     }
//   };

//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       await handleFileUpload(files[0]);
//     }
//   };

//   const handleFileUpload = async (file: File) => {
//     // Validate file type
//     if (file.type !== 'application/pdf') {
//       toast.error('Please upload a PDF file');
//       return;
//     }

//     // Validate file size (5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('File size must be less than 5MB');
//       return;
//     }

//     setIsUploading(true);
//     try {
//       const response = await uploadResume(file) as UploadResumeResponse;
//       setUploadedResume(response.data);
//       toast.success('Resume uploaded and analyzed successfully!');
      
//       // Reset comparison when new resume is uploaded
//       setComparisonResult(null);
//     } catch (error) {
//       const err = error as ErrorResponse;
//       toast.error(err.response?.data?.message || err.message || 'Failed to upload resume');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleCompare = async () => {
//     if (!uploadedResume) {
//       toast.error('Please upload a resume first');
//       return;
//     }

//     if (!selectedJobRole) {
//       toast.error('Please select a job role');
//       return;
//     }

//     setIsComparing(true);
//     try {
//       const response = await compareResume({
//         resumeId: uploadedResume.resumeId,
//         jobRoleId: selectedJobRole
//       }) as CompareResumeResponse;
      
//       setComparisonResult(response.data);
//       toast.success('Resume compared successfully!');
//     } catch (error) {
//       const err = error as ErrorResponse;
//       toast.error(err.response?.data?.message || err.message || 'Failed to compare resume');
//     } finally {
//       setIsComparing(false);
//     }
//   };

//   const getMatchColor = (percentage: number) => {
//     if (percentage >= 80) return 'text-green-600 dark:text-green-400';
//     if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
//     return 'text-red-600 dark:text-red-400';
//   };

//   const getMatchBgColor = (percentage: number) => {
//     if (percentage >= 80) return 'bg-green-500';
//     if (percentage >= 60) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Welcome Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Welcome back, {user.name?.split(' ')[0] || 'User'}! 👋
//           </h1>
//           <p className="mt-2 text-gray-600 dark:text-gray-400">
//             Upload your resume and see how well you match with your dream job.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Upload & Job Selection */}
//           <div className="space-y-6">
//             {/* Upload Section */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
//                 <Upload className="h-5 w-5 mr-2 text-blue-600" />
//                 Upload Resume
//               </h2>
              
//               <div
//                 className={`
//                   border-2 border-dashed rounded-lg p-8 text-center
//                   transition-colors duration-200 cursor-pointer
//                   ${dragActive 
//                     ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
//                     : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
//                   }
//                 `}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//                 onClick={() => document.getElementById('resume-upload')?.click()}
//               >
//                 <input
//                   id="resume-upload"
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileSelect}
//                   className="hidden"
//                 />
//                 <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
//                 <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
//                   {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   PDF only (Max 5MB)
//                 </p>
//               </div>

//               {uploadedResume && (
//                 <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                   <div className="flex items-start">
//                     <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
//                     <div>
//                       <p className="text-sm font-medium text-green-800 dark:text-green-200">
//                         {uploadedResume.fileName}
//                       </p>
//                       <p className="text-xs text-green-600 dark:text-green-400 mt-1">
//                         {uploadedResume.extractedSkills.length} skills extracted • {uploadedResume.pageCount} page(s)
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Job Role Selection */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
//                 <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
//                 Select Job Role
//               </h2>
              
//               <select
//                 value={selectedJobRole}
//                 onChange={(e) => setSelectedJobRole(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 disabled={!uploadedResume}
//               >
//                 <option value="">Choose a job role...</option>
//                 {jobRoles.map((role) => (
//                   <option key={role.id} value={role.id}>
//                     {role.title} {role.category ? `(${role.category})` : ''}
//                   </option>
//                 ))}
//               </select>

//               {selectedJobRole && jobRoles.find(r => r.id === selectedJobRole) && (
//                 <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Required Skills:
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {jobRoles.find(r => r.id === selectedJobRole)?.requiredSkills.map((skill) => (
//                       <span
//                         key={skill}
//                         className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <button
//                 onClick={handleCompare}
//                 disabled={!uploadedResume || !selectedJobRole || isComparing}
//                 className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
//               >
//                 {isComparing ? 'Comparing...' : 'Compare Resume'}
//               </button>
//             </div>
//           </div>

//           {/* Right Column - Results */}
//           <div className="lg:col-span-1">
//             {comparisonResult ? (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
//                   <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
//                   Match Results
//                 </h2>

//                 {/* Match Percentage */}
//                 <div className="text-center mb-8">
//                   <div className="inline-block">
//                     <div className="text-6xl font-bold mb-2">
//                       <span className={getMatchColor(comparisonResult.matchPercentage)}>
//                         {comparisonResult.matchPercentage}%
//                       </span>
//                     </div>
//                     <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                       <div
//                         className={`h-full ${getMatchBgColor(comparisonResult.matchPercentage)} transition-all duration-500`}
//                         style={{ width: `${comparisonResult.matchPercentage}%` }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Skills Comparison */}
//                 <div className="space-y-6">
//                   {/* Matched Skills */}
//                   <div>
//                     <div className="flex items-center mb-3">
//                       <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
//                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                         Matched Skills ({comparisonResult.matchedSkills.length})
//                       </h3>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {comparisonResult.matchedSkills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                       {comparisonResult.matchedSkills.length === 0 && (
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">
//                           No matching skills found
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Missing Skills */}
//                   <div>
//                     <div className="flex items-center mb-3">
//                       <XCircle className="h-5 w-5 text-red-600 mr-2" />
//                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                         Missing Skills ({comparisonResult.missingSkills.length})
//                       </h3>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {comparisonResult.missingSkills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm font-medium"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Extra Skills */}
//                   {comparisonResult.extraSkills.length > 0 && (
//                     <div>
//                       <div className="flex items-center mb-3">
//                         <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
//                         <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                           Extra Skills ({comparisonResult.extraSkills.length})
//                         </h3>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {comparisonResult.extraSkills.map((skill) => (
//                           <span
//                             key={skill}
//                             className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
//                           >
//                             {skill}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Suggestions */}
//                   <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
//                     <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-3">
//                       💡 Suggestions to Improve
//                     </h3>
//                     <ul className="space-y-2">
//                       {comparisonResult.suggestions.map((suggestion, index) => (
//                         <li key={index} className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start">
//                           <span className="mr-2">•</span>
//                           {suggestion}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 {/* View Full History Button */}
//                 <div className="mt-6 text-center">
//                   <button
//                     onClick={() => navigate('/history')}
//                     className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
//                   >
//                     View Scan History →
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <TrendingUp className="h-10 w-10 text-gray-400 dark:text-gray-500" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                     No Results Yet
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400 max-w-sm">
//                     Upload your resume and select a job role to see your match results here.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;













































// src/pages/Resume/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FileText, Upload, Briefcase, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { RootState } from '../../redux/store';
import { getJobRoles, uploadResume, compareResume } from '../../api/action/userAction';
import type { JobRole, UploadResumeResponse, CompareResumeResponse } from '../../api/action/userAction';
import type { ComparisonResult, UploadResumeData } from '../../types/resumeInterface';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedJobRole, setSelectedJobRole] = useState<string>('');
  const [uploadedResume, setUploadedResume] = useState<UploadResumeData | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loadingJobRoles, setLoadingJobRoles] = useState(true);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    setLoadingJobRoles(true);
    try {
      const response = await getJobRoles();
      setJobRoles(response.data);
    } catch {
      toast.error('Failed to fetch job roles');
    } finally {
      setLoadingJobRoles(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadResume(file) as UploadResumeResponse;
      setUploadedResume(response.data);
      toast.success('Resume uploaded and analyzed successfully!');
      
      // Reset comparison when new resume is uploaded
      setComparisonResult(null);
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || err.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompare = async () => {
    if (!uploadedResume) {
      toast.error('Please upload a resume first');
      return;
    }

    if (!selectedJobRole) {
      toast.error('Please select a job role');
      return;
    }

    setIsComparing(true);
    try {
      const response = await compareResume({
        resumeId: uploadedResume.resumeId,
        jobRoleId: selectedJobRole
      }) as CompareResumeResponse;
      
      setComparisonResult(response.data);
      toast.success('Resume compared successfully!');
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || err.message || 'Failed to compare resume');
    } finally {
      setIsComparing(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload your resume and see how well you match with your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Job Selection */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Upload Resume
              </h2>
              
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center
                  transition-colors duration-200 cursor-pointer
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                  }
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onDragEnter={!isUploading ? handleDrag : undefined}
                onDragLeave={!isUploading ? handleDrag : undefined}
                onDragOver={!isUploading ? handleDrag : undefined}
                onDrop={!isUploading ? handleDrop : undefined}
                onClick={() => !isUploading && document.getElementById('resume-upload')?.click()}
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PDF only (Max 5MB)
                </p>
              </div>

              {uploadedResume && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        {uploadedResume.fileName}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {uploadedResume.extractedSkills.length} skills extracted • {uploadedResume.pageCount} page(s)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Job Role Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                Select Job Role
              </h2>
              
              {loadingJobRoles ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <select
                  value={selectedJobRole}
                  onChange={(e) => setSelectedJobRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={!uploadedResume || isComparing}
                >
                  <option value="">Choose a job role...</option>
                  {jobRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title} {role.category ? `(${role.category})` : ''}
                    </option>
                  ))}
                </select>
              )}

              {selectedJobRole && jobRoles.find(r => r.id === selectedJobRole) && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Required Skills:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jobRoles.find(r => r.id === selectedJobRole)?.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleCompare}
                disabled={!uploadedResume || !selectedJobRole || isComparing || loadingJobRoles}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isComparing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Comparing...
                  </span>
                ) : (
                  'Compare Resume'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            {comparisonResult ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Match Results
                </h2>

                {/* Match Percentage */}
                <div className="text-center mb-8">
                  <div className="inline-block">
                    <div className="text-6xl font-bold mb-2">
                      <span className={getMatchColor(comparisonResult.matchPercentage)}>
                        {comparisonResult.matchPercentage}%
                      </span>
                    </div>
                    <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getMatchBgColor(comparisonResult.matchPercentage)} transition-all duration-500`}
                        style={{ width: `${comparisonResult.matchPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills Comparison */}
                <div className="space-y-6">
                  {/* Matched Skills */}
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Matched Skills ({comparisonResult.matchedSkills.length})
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {comparisonResult.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {comparisonResult.matchedSkills.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No matching skills found
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <div className="flex items-center mb-3">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Missing Skills ({comparisonResult.missingSkills.length})
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {comparisonResult.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Extra Skills */}
                  {comparisonResult.extraSkills.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Extra Skills ({comparisonResult.extraSkills.length})
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {comparisonResult.extraSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="mt-6 p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-3">
                      💡 Suggestions to Improve
                    </h3>
                    <ul className="space-y-2">
                      {comparisonResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start">
                          <span className="mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* View Full History Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/history')}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    View Scan History →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Results Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Upload your resume and select a job role to see your match results here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;