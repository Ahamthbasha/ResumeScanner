import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Briefcase, FileText, TrendingUp, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getScanHistory, deleteScanHistory, type ScanHistoryItem } from '../../api/action/userAction';


const ScanHistory = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalScans, setTotalScans] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchScanHistory(currentPage);
  }, [currentPage]);

  const fetchScanHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await getScanHistory(page, 10);
      setScans(response.data.scans);
      setTotalPages(response.data.totalPages);
      setTotalScans(response.data.total);
    } catch {
      toast.error('Failed to fetch scan history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    if (!window.confirm('Are you sure you want to delete this scan record?')) {
      return;
    }

    setDeletingId(scanId);
    try {
      await deleteScanHistory(scanId);
      toast.success('Scan deleted successfully');
      // Refresh current page
      fetchScanHistory(currentPage);
    } catch {
      toast.error('Failed to delete scan');
    } finally {
      setDeletingId(null);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/30 border-green-500';
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500';
    return 'bg-red-100 dark:bg-red-900/30 border-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-blue-600" />
            Scan History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track all your resume scans and match results.
          </p>
          {!loading && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              Total scans: {totalScans}
            </p>
          )}
        </div>

        {/* History List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : scans.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No scan history yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Upload your first resume and compare with job roles to see results here.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${getMatchBgColor(scan.matchPercentage)} hover:shadow-md transition-shadow`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section - Job & File Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {scan.jobRoleTitle}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FileText className="h-4 w-4 mr-1" />
                              <span>{scan.fileName}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mt-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(scan.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Match Percentage */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getMatchColor(scan.matchPercentage)}`}>
                            {scan.matchPercentage}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Match</div>
                        </div>

                        {/* Skills Preview */}
                        <div className="hidden md:block">
                          <div className="flex items-center gap-2">
                            <div className="text-sm">
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {scan.matchedSkills.length}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400"> matched</span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <div className="text-sm">
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                {scan.missingSkills.length}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400"> missing</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/history/${scan.id}`)}
                            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <TrendingUp className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteScan(scan.id)}
                            disabled={deletingId === scan.id}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {deletingId === scan.id ? (
                              <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Skills Tags - Mobile */}
                    <div className="mt-4 md:hidden">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                          {scan.matchedSkills.length} matched
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
                          {scan.missingSkills.length} missing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`
                            relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            ${currentPage === i + 1
                              ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScanHistory;