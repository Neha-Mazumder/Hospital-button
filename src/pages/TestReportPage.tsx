import { useState } from 'react';
import { FileText, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface TestReport {
  id: number;
  test_name: string;
  date: string;
  status: 'Ready' | 'Processing' | 'Pending';
  doctor: string;
  file_path?: string;
}

const TestReportPage = () => {
  const [patientId, setPatientId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reports, setReports] = useState<TestReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!patientId.trim()) return;
    setLoadingReports(true);
    try {
      const res = await fetch(`http://localhost:5000/api/testreports/${patientId.trim()}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
        setIsLoggedIn(true);
      } else {
        setError('No reports found for this Patient ID');
      }
    } catch (err) {
      setError('Could not fetch reports. Backend running?');
    } finally {
      setLoadingReports(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Ready') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'Processing') return <Clock className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-orange-500" />;
  };

  const getStatusBgColor = (status: string) => {
    if (status === 'Ready') return 'bg-green-100 text-green-800';
    if (status === 'Processing') return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Online Test Reports</h1>
          <p className="text-gray-600 text-lg">
            Access your medical test results safely, anytime and anywhere
          </p>
        </div>

        {/* Login Section */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">Access Reports</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID / Admission Number
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter your patient ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={loadingReports}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors font-medium"
                  disabled={loadingReports}
                >
                  {loadingReports ? 'Loading...' : 'View My Reports'}
                </button>
                              {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                  <p className="text-red-600 text-sm">{error}</p>
                                </div>
                              )}
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Patient Info + Download All */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <h2 className="text-2xl font-bold text-primary">Your Test Reports</h2>
                <div className="flex gap-2">
                  <a
                    href={`http://localhost:5000/api/testreports/download-all/${patientId}`}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors flex items-center gap-2 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="h-4 w-4" /> Download All
                  </a>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setPatientId('');
                    }}
                    className="text-sm bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">Patient ID: {patientId}</p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusBgColor(
                        report.status
                      )}`}
                    >
                      <span>{getStatusIcon(report.status)}</span>
                      <span>{report.status === 'Ready' ? 'Ready' : report.status === 'Processing' ? 'Processing' : 'Pending'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.test_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Date:</strong> {report.date}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Doctor:</strong> {report.doctor}
                  </p>

                  {report.status === 'Ready' && report.file_path && (
                    <a
                      href={`http://localhost:5000/api/testreports/download/${report.id}`}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2 text-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="h-4 w-4 inline" />
                      <span>Download Report</span>
                    </a>
                  )}

                  {report.status === 'Processing' && (
                    <div className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-center text-sm">
                      Processing... will be available soon
                    </div>
                  )}

                  {report.status === 'Pending' && (
                    <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md text-center text-sm">
                      Pending
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {reports.length === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Found</h3>
                <p className="text-gray-500">You don't have any test reports available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestReportPage; 