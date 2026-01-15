import { useState } from 'react';
import { FileText } from 'lucide-react';

const TestReportPage = () => {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Online Test Reports</h1>
          <p className="text-gray-600 text-lg">
            Access your medical test results anytime, anywhere, securely and instantly online
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Complete Blood Count (CBC)</h2>
            <p className="text-gray-600 mb-6">Patient: Yosh M. Patel</p>
            <button
              onClick={() => setShowReport(true)}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors"
            >
              View Test Report
            </button>
          </div>
        </div>

        {/* Test Report Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Complete Blood Count (CBC) Report</h3>
                <button
                  onClick={() => setShowReport(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-center">
                <img
                  src="/img/test-report-cbc.jpg"
                  alt="Complete Blood Count (CBC) Report"
                  className="max-w-full h-auto mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div className="hidden mt-4 p-8 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Test Report Image</p>
                  <p className="text-sm text-gray-400">Complete Blood Count (CBC) Report</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestReportPage; 