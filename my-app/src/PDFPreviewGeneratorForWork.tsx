import { useState } from "react";
import { Eye, Download, FileText, Loader2 } from "lucide-react";
import { PDFGeneratorUtilityForWorks } from "./pdfGeneratorUtilityForWork";
import { template } from "./sampleWork";
import { sampleWorksheet } from "./sample-worksheeet";


const TemplatePDFApp = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);


  const sampleWork = {
    workNo: "WK-2025-5501",
    calibrations: [
      {
        type: "As Found",
        startDate: "2025-01-12T10:15:00Z",
        endDate: "2025-01-12T10:45:00Z",
        passed: true
      }
    ]
  };

  const handleGenerate = async (action: "preview" | "download") => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const generator = new PDFGeneratorUtilityForWorks();
      
      await generator.generateCertificateFromTemplate(template, sampleWork,sampleWorksheet ,{
        addPageNumbers: false,
        onProgress: (prog: number) => setProgress(prog)
      });

      if (action === "preview") {
        generator.preview();
      } else {
        generator.download("calibration-certificate.pdf");
      }

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    } catch (err: any) {
      console.error("PDF Generation Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Template-Based PDF Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Supports first page, default, and last page headers/footers
              </p>
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Template Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Format:</span>
                <span className="ml-2 text-gray-600">{template.certificateConfig.format}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">{template.templateType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">First Page Header:</span>
                <span className="ml-2 text-green-600">✓ Active</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Page Footer:</span>
                <span className="ml-2 text-green-600">✓ Active</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-md font-semibold text-blue-900 mb-3">✨ Key Features</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Different headers/footers for first, default, and last pages</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fabric.js canvas data automatically converted to PDF elements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Automatic page breaks with proper header/footer inheritance</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleGenerate("preview")}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              Preview PDF
            </button>

            <button
              onClick={() => handleGenerate("download")}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Generating PDF...
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Use</h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <pre>{`// Import the enhanced PDF generator
import { PDFGenerator } from './pdfGeneratorUtility';
import { template, sampleWork } from './sampleWork';

// Generate PDF from template
const generator = new PDFGenerator();
await generator.generateFromTemplate(template, sampleWork, {
  addPageNumbers: true,
  onProgress: (progress) => console.log(progress)
});

// Preview or download
generator.preview();
generator.download('certificate.pdf');`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePDFApp;