import { Link } from "react-router-dom";
import { CheckCircle, Zap, ArrowRight, Upload, Briefcase, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store"; 
const LandingPage = () => {
  // Get user from Redux store
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!user.userId; // Check if user is logged in

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Resume Analysis
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scan Your Resume
              </span>
              <br />
              Match Your Dream Job
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
              Upload your resume in PDF format and instantly see how well your skills match 
              with top job roles. Get personalized suggestions to improve your chances.
            </p>
            
            {/* CTA Buttons - Only show if user is NOT logged in */}
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Optional: Show a welcome message for logged in users */}
            {isLoggedIn && (
              <div className="text-center">
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                  Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.name}</span>! 👋
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Resumes Scanned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Job Roles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">5K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Three simple steps to get your resume analyzed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">STEP 01</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Resume</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your resume in PDF format. Secure and confidential.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">STEP 02</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select Job Role</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from 50+ job roles with predefined skill requirements.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">STEP 03</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Results</h3>
              <p className="text-gray-600 dark:text-gray-400">
                View match percentage, matched skills, and improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ResumeScanner?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features to help you land your dream job
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
          
            
            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Instant Results
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get your match percentage and skill gaps within seconds.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Scan History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track all your resume scans and compare progress over time.
                </p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Skill Suggestions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Personalized recommendations to improve your skill set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Roles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Job Roles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See how your resume matches with these in-demand positions
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Frontend Developer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">React, TypeScript, CSS</p>
            </div>
            
            {/* Role 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Backend Developer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Node.js, Python, SQL</p>
            </div>
            
            {/* Role 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Full Stack Developer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">MERN, Java, DevOps</p>
            </div>
            
            {/* Role 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Data Scientist</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Python, ML, SQL</p>
            </div>
          </div>
          
        </div>
      </section>

     
    </div>
  );
};

export default LandingPage;