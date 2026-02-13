// src/pages/Resume/ScanDetail.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
} from "lucide-react";
import { getScanDetail } from "../../api/action/userAction";

// ✅ Fix: Update interface to match actual API response
interface ScanDetailData {
  id: string;
  jobRoleTitle: string;
  fileName: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  suggestions: string[];
  createdAt: string;
  resume?: {
    id: string;
    fileName: string;
    extractedSkills: string[];
    categorizedSkills: Record<string, string[]>;
  };
}

const ScanDetail = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<ScanDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScanDetail = useCallback(async () => {
    if (!scanId) return;
    
    setLoading(true);
    try {
      const response = await getScanDetail(scanId);
      // ✅ Fix: response.data already matches the structure we need
      setScan(response.data);
    } catch {
      toast.error("Failed to fetch scan details");
      navigate("/history");
    } finally {
      setLoading(false);
    }
  }, [scanId, navigate]);

  useEffect(() => {
    fetchScanDetail();
  }, [fetchScanDetail]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!scan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/history")}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to History
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {scan.jobRoleTitle}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FileText className="h-5 w-5 mr-2" />
                <span>{scan.fileName}</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className={`text-5xl font-bold ${getMatchColor(scan.matchPercentage)}`}>
                {scan.matchPercentage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Match Score</div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scan Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(scan.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Job Role</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {scan.jobRoleTitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Match Progress Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Match Analysis
          </h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Match</span>
              <span className={`text-lg font-bold ${getMatchColor(scan.matchPercentage)}`}>
                {scan.matchPercentage}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getMatchBgColor(scan.matchPercentage)} transition-all duration-500`}
                style={{ width: `${scan.matchPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matched Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Matched Skills
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {scan.matchedSkills.length} skills
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {scan.matchedSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
              {scan.matchedSkills.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No matching skills found
                </p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Missing Skills
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {scan.missingSkills.length} skills
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {scan.missingSkills.map((skill: string) => (
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Extra Skills
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {scan.extraSkills?.length || 0} skills
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {scan.extraSkills?.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
              {(!scan.extraSkills || scan.extraSkills.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No extra skills found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Resume Skills Section */}
        {scan.resume && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Complete Skills Extracted from Resume
            </h2>
            
            {/* All Extracted Skills */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                All Skills Found ({scan.resume.extractedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {scan.resume.extractedSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      scan.matchedSkills.includes(skill)
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {skill}
                    {scan.matchedSkills.includes(skill) && (
                      <span className="ml-1">✓</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Categorized Skills */}
            {scan.resume.categorizedSkills && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skills by Category
                </h3>
                {Object.entries(scan.resume.categorizedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string) => (
                        <span
                          key={skill}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            scan.matchedSkills.includes(skill)
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-sm p-6 border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Improvement Suggestions
          </h2>
          <ul className="space-y-3">
            {scan.suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="flex items-start text-yellow-700 dark:text-yellow-400">
                <span className="mr-2 font-bold">•</span>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanDetail;