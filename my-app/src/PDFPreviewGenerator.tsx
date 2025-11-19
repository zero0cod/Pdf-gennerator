import { useState, type SetStateAction } from "react";
import { Eye, Download, FileText, Loader2 } from "lucide-react";
import type { ComponentProps } from "./types";
import { PDFGenerator } from "./pdfGeneratorUtility";
import { sampleWorksheet } from "./sample-worksheeet";
import { getCertificateDataForPDF } from "./worksheet-to-pdf";

const PDFGeneratorApp = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (action: "preview" | "download") => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const generator = new PDFGenerator();
      console.log(sampleWorksheet);
      const certificateComponents =  getCertificateDataForPDF(JSON.parse(JSON.stringify(sampleWorksheet)));
      const worksheetToPdfPreviewData: ComponentProps[] = [
  // Header
  {
    type: "pageHeader",
    items: [
      {
        type: "image",
        src: "",
        x: 15,
        y: 12,
        width: 20,
        height: 15,
      },
      {
        type: "text",
        text: "Metquay",
        align: "center",
        y: 10,
        fontSize: 12,
        bold: true,
      },
      {
        type: "text",
        text: "Building No: 5421, Old Street\nAustin, Texas, USA 956585\nPh: +17186520848",
        y: 16,
        align: "center",
        fontSize: 9,
      },
      {
        type: "image",
        src: "",
        x: 170,
        y: 12,
        width: 25,
        height: 15,
      },
      {
        type: "text",
        text: "CERTIFICATE OF CALIBRATION",
        align: "center",
        y: 35,
        fontSize: 14,
        bold: true,
      },
      {
        type: "text",
        text: "Certificate No: UAL/000087/25",
        align: "center",
        y: 40,
        fontSize: 10,
      },
    ],
    backgroundColor: [255, 255, 255],
    pageNumbers: [1, 2, 3],
  },
 
  
  // Dynamic content from worksheet
  ...certificateComponents,
  
  // Footer
  {type:"pageFooter",
    height: 10,
    items:[
      {
        type:"line",
        width:0.5,
      },
      {
        type: "text",
        text: 'This certificate is confidential. For questions, contact: support@metquay.com',
        fontSize: 9,
        align: 'center',
        }
    ],
  },
];
      await generator.generate(worksheetToPdfPreviewData, {
        addPageNumbers: true,
        onProgress: (prog: SetStateAction<number>) => setProgress(prog)
      });

      if (action === "preview") generator.preview();
      else generator.download("business-report-2024.pdf");

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
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">PDF Generator Utility</h1>
              <p className="text-gray-600 mt-1">
                Generate PDFs with automatic page breaks • No split components
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => handleGenerate("preview")}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
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
                <span className="text-sm font-medium text-gray-700">Generating PDF...</span>
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

          {/* Document info, usage examples ... same as before */}
        </div>
      </div>
    </div>
  );
};

export default PDFGeneratorApp;
