import { useState } from 'react';
import { AlertCircle, Pill, User, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MedicalUpdatePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleMedicalUpdateClick = () => {
    if (!isLoggedIn) {
      alert('Please login with your Patient admission number');
      setShowLoginForm(true);
    } else {
      alert('Napa 250mg needed');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      setIsLoggedIn(true);
      setShowLoginForm(false);
      alert('Login successful! Click Medical Update again to see your medication alerts.');
    } else {
      alert('Please enter your Patient admission number');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Medical Updates</h1>
          <p className="text-gray-600 text-lg">
            Stay informed about your medical status and medication requirements
          </p>
        </div>

        {/* Login Status */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              {isLoggedIn ? (
                <>
                  <User className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-green-600 font-medium">Logged In</span>
                </>
              ) : (
                <>
                  <Lock className="h-6 w-6 text-red-500 mr-2" />
                  <span className="text-red-600 font-medium">Not Logged In</span>
                </>
              )}
            </div>
            
            {!isLoggedIn && (
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
              >
                Login with Patient ID
              </button>
            )}
          </div>
        </div>

        {/* Login Form */}
        {showLoginForm && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Patient Login</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Admission Number
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter your admission number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Medical Update Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-2">Medical Updates</h2>
              <p className="text-gray-600">
                Click below to check your latest medical updates and medication requirements
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={handleMedicalUpdateClick}
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
              >
                <Pill className="h-5 w-5 mr-2" />
                Check Medical Updates
              </button>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
                <p className="text-blue-700 text-sm">
                  Enter your patient admission number to access personalized medical updates and medication alerts.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Stay Updated</h3>
                <p className="text-green-700 text-sm">
                  Get real-time notifications about your medication schedule and medical requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block text-primary hover:text-primary-dark font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MedicalUpdatePage; 