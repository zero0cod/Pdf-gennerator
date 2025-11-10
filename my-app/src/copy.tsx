// import { useState } from 'react';
// import { Eye, Download, FileText, Loader2 } from 'lucide-react';
// import type { ComponentProps, GenerateOptions, HeadingComponent, LineComponent, ListComponent, ParagraphComponent, SpaceComponent, TableComponent, TitleComponent } from './types';



// // ============================================
// // PDF GENERATOR UTILITY CLASS
// // ============================================
// class PDFGenerator {
//   doc: any;
//   jsPDF: any;
//   pageWidth: number;
//   pageHeight: number;
//   margins: { top: number; right: number; bottom: number; left: number; };
//   contentWidth: number;
//   contentHeight: number;
//   currentY: number;
//   constructor() {
//     this.doc = null;
//     this.jsPDF = null;
//     this.pageWidth = 0;
//     this.pageHeight = 0;
//     this.margins = { top: 20, right: 20, bottom: 20, left: 20 };
//     this.contentWidth = 0;
//     this.contentHeight = 0;
//     this.currentY = 0;
//   }

//   async initialize() {
//     // Load jsPDF if not already loaded
//     if (!window.jspdf) {
//       await this.loadJsPDF();
//     }
    
//     const { jsPDF } = window.jspdf;
//     this.jsPDF = jsPDF;
//     this.doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });
    
//     if (!this.doc) {
//       throw new Error('Failed to initialize PDF document');
//     }
    
//     this.pageWidth = this.doc.internal.pageSize.getWidth();
//     this.pageHeight = this.doc.internal.pageSize.getHeight();
//     this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
//     this.contentHeight = this.pageHeight - this.margins.top - this.margins.bottom;
//     this.currentY = this.margins.top;
//   }

//   loadJsPDF() {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
//       script.onload = () => {
//         const autoTableScript = document.createElement('script');
//         autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
//         autoTableScript.onload = resolve;
//         autoTableScript.onerror = reject;
//         document.head.appendChild(autoTableScript);
//       };
//       script.onerror = reject;
//       document.head.appendChild(script);
//     });
//   }

//   // Calculate component height BEFORE rendering
//   calculateComponentHeight(
//     component:ComponentProps
//   ): number {
//     switch (component.type) {
//       case 'title': {
//         const fontSize = component.fontSize || 24;
//         this.doc.setFontSize(fontSize);
//         const lines = this.doc.splitTextToSize(component.text || '', this.contentWidth);
//         return (lines.length * fontSize * 0.35) + (component.spacing ?? 15);
//       }

//       case 'heading': {
//         const fontSizes: Record<1 | 2 | 3 | 4, number> = { 1: 20, 2: 16, 3: 14, 4: 12 };
//         const fontSize = component.fontSize || fontSizes[component.level as 1 | 2 | 3 | 4 || 2];
//         this.doc.setFontSize(fontSize);
//         const lines = this.doc.splitTextToSize(component.text || '', this.contentWidth);
//         return (lines.length * fontSize * 0.35) + (component.spacing ?? 8);
//       }

//       case 'paragraph': {
//         const fontSize = component.fontSize || 12;
//         this.doc.setFontSize(fontSize);
//         const lines = this.doc.splitTextToSize(component.text || '', this.contentWidth);
//         return (lines.length * fontSize * 0.5) + (component.spacing ?? 5);
//       }

//       case 'space':
//         return component.height ?? 10;

//       case 'line':
//         return (component.spacing ?? 5);

//       case 'list': {
//         const fontSize = component.fontSize || 12;
//         const itemSpacing = component.itemSpacing ?? 3;
//         let total = 0;
//         (component.items || []).forEach(item => {
//           this.doc.setFontSize(fontSize);
//           const lines = this.doc.splitTextToSize(item, this.contentWidth - 10);
//           total += (lines.length * fontSize * 0.5) + itemSpacing;
//         });
//         return total + (component.spacing ?? 5);
//       }

//       case 'table': {
//         const rowHeight = 10;
//         const rows = (component.data?.length || 0) + (component.headers ? 1 : 0);
//         return (rows * rowHeight) + (component.spacing ?? 10);
//       }

//       default:
//         return 10;
//     }
//   }

//   // Check if we need a new page
//   needsNewPage(requiredHeight: number) {
//     return (this.currentY + requiredHeight) > (this.pageHeight - this.margins.bottom);
//   }

//   // Add new page
//   addNewPage() {
//     this.doc.addPage();
//     this.currentY = this.margins.top;
//   }


//   // Render individual component
//   renderComponent(component: ComponentProps) {
//     switch (component.type) {
//       case 'title':
//         return this.renderTitle(component);
//       case 'heading':
//         return this.renderHeading(component);
//       case 'paragraph':
//         return this.renderParagraph(component);
//       case 'space':
//         return this.renderSpace(component);
//       case 'line':
//         return this.renderLine(component);
//       case 'list':
//         return this.renderList(component);
//       case 'table':
//         return this.renderTable(component);
//       default:
//         console.warn('Unknown component type:', component);
//         return 0;
//     }
//   }

//   renderTitle(component: TitleComponent) {
//     const fontSize = component.fontSize || 24;
//     const align = component.align || 'center';
    
//     this.doc.setFontSize(fontSize);
//     this.doc.setFont('helvetica', 'bold');
//     this.doc.setTextColor(0, 0, 0);
    
//     const x = align === 'center' ? this.pageWidth / 2 : this.margins.left;
//     this.doc.text(component.text, x, this.currentY, { align });
    
//     const height = this.calculateComponentHeight(component);
//     this.currentY += height;
//     return height;
//   }

//   renderHeading(component: HeadingComponent) {
//     const fontSizes = { 1: 20, 2: 16, 3: 14, 4: 12 };
//     const fontSize = component.fontSize || fontSizes[(component.level as 1 | 2 | 3 | 4) || 2];
    
//     this.doc.setFontSize(fontSize);
//     this.doc.setFont('helvetica', 'bold');
//     this.doc.setTextColor(0, 0, 0);
    
//     this.doc.text(component.text, this.margins.left, this.currentY);
    
//     const height = this.calculateComponentHeight(component);
//     this.currentY += height;
//     return height;
//   }

//   renderParagraph(component:ParagraphComponent) {
//     const fontSize = component.fontSize || 12;
//     const align = component.align || 'left';
    
//     this.doc.setFontSize(fontSize);
//     this.doc.setFont('helvetica', 'normal');
//     this.doc.setTextColor(0, 0, 0);
    
//     const lines = this.doc.splitTextToSize(component.text, this.contentWidth);
//     this.doc.text(lines, this.margins.left, this.currentY, { align });
    
//     const height = this.calculateComponentHeight(component);
//     this.currentY += height;
//     return height;
//   }

//   renderSpace(component :SpaceComponent) {
//     const height = component.height || 10;
//     this.currentY += height;
//     return height;
//   }

//   renderLine(component : LineComponent) {
//     const color = component.color || [0, 0, 0];
//     this.doc.setDrawColor(...color);
//     this.doc.setLineWidth(component.width || 0.5);
//     this.doc.line(this.margins.left, this.currentY, this.pageWidth - this.margins.right, this.currentY);
    
//     const height = component.spacing || 5;
//     this.currentY += height;
//     return height;
//   }

//   renderList(component : ListComponent) {
//     const fontSize = component.fontSize || 12;
//     const itemSpacing = component.itemSpacing || 3;
//     const listType = component.listType || 'bullet';
    
//     this.doc.setFontSize(fontSize);
//     this.doc.setFont('helvetica', 'normal');
//     this.doc.setTextColor(0, 0, 0);
    
//     (component.items || []).forEach((item, idx) => {
//       const prefix = listType === 'number' ? `${idx + 1}. ` : '• ';
//       const text = prefix + item;
//       const lines = this.doc.splitTextToSize(text, this.contentWidth - 10);
//       this.doc.text(lines, this.margins.left + 5, this.currentY);
//       this.currentY += (lines.length * fontSize * 0.5) + itemSpacing;
//     });
    
//     const spacing = component.spacing || 5;
//     this.currentY += spacing;
//     return this.calculateComponentHeight(component);
//   }

//   renderTable(component : TableComponent) {
//     const startY = this.currentY;
    
//     this.doc.autoTable({
//       head: component.headers ? [component.headers] : undefined,
//       body: component.data || [],
//       startY: this.currentY,
//       theme: component.theme || 'striped',
//       headStyles: {
//         fillColor: component.headerColor || [41, 128, 185],
//         textColor: [255, 255, 255],
//         fontStyle: 'bold'
//       },
//       margin: { left: this.margins.left, right: this.margins.right }
//     });
    
//     this.currentY = this.doc.lastAutoTable.finalY + (component.spacing || 10);
//     return this.currentY - startY;
//   }

//   // Main generation function
//   async generate(components : ComponentProps[], options:GenerateOptions) {
//     await this.initialize();

//     const totalComponents = components.length;
    
//     // Process each component
//     for (let i = 0; i < totalComponents; i++) {
//       const component = components[i];
      
//       // Calculate height needed for this component
//       const requiredHeight = this.calculateComponentHeight(component);
      
//       // Check if component fits on current page
//       if (this.needsNewPage(requiredHeight)) {
//         this.addNewPage();
//       }
      
//       // Render the component
//       this.renderComponent(component);
      
//       // Progress callback
//       if (options.onProgress) {
//         const progress = ((i + 1) / totalComponents) * 100;
//         options.onProgress(progress);
//       }
//     }

//     // Add page numbers
//     if (options.addPageNumbers !== false) {
//       const totalPages = this.doc.internal.getNumberOfPages();
//       for (let i = 1; i <= totalPages; i++) {
//         this.doc.setPage(i);
//         this.doc.setFontSize(10);
//         this.doc.setTextColor(150);
//         this.doc.text(
//           `Page ${i} of ${totalPages}`,
//           this.pageWidth / 2,
//           this.pageHeight - 10,
//           { align: 'center' }
//         );
//       }
//     }

//     return this.doc;
//   }

//   preview() {
//     const blob = this.doc.output('blob');
//     const url = URL.createObjectURL(blob);
//     window.open(url, '_blank');
//   }

//   download(filename = 'document.pdf') {
//     this.doc.save(filename);
//   }

//   getBlob() {
//     return this.doc.output('blob');
//   }
// }

// // ============================================
// // REACT COMPONENT
// // ============================================
// const PDFGeneratorApp = () => {
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);

//   // Sample data that you would pass to the utility
//   const sampleData : ComponentProps[]= [
//     {
//       type: 'title',
//       text: 'Annual Business Report 2024',
//       fontSize: 28,
//       align: 'center',
//       spacing: 20
//     },
//     {
//       type: 'space',
//       height: 10
//     },
//     {
//       type: 'heading',
//       text: 'Executive Summary',
//       level: 1
//     },
//     {
//       type: 'paragraph',
//       text: 'This report provides a comprehensive overview of our company performance throughout 2024. We have achieved significant milestones in revenue growth, customer acquisition, and market expansion. Our strategic initiatives have positioned us well for continued success in the coming years.',
//       fontSize: 12
//     },
//     {
//       type: 'space',
//       height: 10
//     },
//     {
//       type: 'heading',
//       text: 'Key Metrics',
//       level: 1
//     },
//     {
//       type: 'table',
//       headers: ['Metric', 'Q1', 'Q2', 'Q3', 'Q4'],
//       data: [
//         ['Revenue ($M)', '12.5', '15.3', '18.7', '22.1'],
//         ['Customers', '1,250', '1,680', '2,100', '2,850'],
//         ['Growth Rate', '12%', '15%', '18%', '21%'],
//         ['Market Share', '8.2%', '9.1%', '10.5%', '12.3%']
//       ],
//       theme: 'grid',
//       headerColor: [52, 73, 94],
//       spacing: 15
//     },
//     {
//       type: 'heading',
//       text: 'Product Performance',
//       level: 1
//     },
//     {
//       type: 'paragraph',
//       text: 'Our product portfolio has shown exceptional performance across all categories. The following highlights demonstrate our commitment to innovation and customer satisfaction.',
//       fontSize: 12
//     },
//     {
//       type: 'list',
//       listType: 'bullet',
//       items: [
//         'Product A achieved 150% of sales target',
//         'Product B expanded to 5 new markets',
//         'Product C received industry recognition award',
//         'New Product D launched successfully in Q4'
//       ],
//       fontSize: 11,
//       spacing: 10
//     },
//     {
//       type: 'heading',
//       text: 'Customer Satisfaction',
//       level: 1
//     },
//     {
//       type: 'paragraph',
//       text: 'Customer satisfaction remains our top priority. We conducted comprehensive surveys and gathered feedback throughout the year.',
//       fontSize: 12
//     },
//     {
//       type: 'table',
//       headers: ['Category', 'Rating', 'Responses'],
//       data: [
//         ['Product Quality', '4.8/5.0', '2,450'],
//         ['Customer Service', '4.7/5.0', '2,380'],
//         ['Value for Money', '4.6/5.0', '2,410'],
//         ['Overall Experience', '4.7/5.0', '2,500']
//       ],
//       theme: 'striped',
//       spacing: 15
//     },
//     {
//       type: 'heading',
//       text: 'Future Outlook',
//       level: 1
//     },
//     {
//       type: 'paragraph',
//       text: 'Looking ahead to 2025, we are optimistic about continued growth and expansion. Our strategic initiatives include:',
//       fontSize: 12
//     },
//     {
//       type: 'list',
//       listType: 'number',
//       items: [
//         'Expansion into 3 new international markets',
//         'Launch of 2 innovative product lines',
//         'Investment in AI and automation technologies',
//         'Enhanced customer support infrastructure'
//       ],
//       fontSize: 11,
//       spacing: 10
//     },
//     {
//       type: 'space',
//       height: 15
//     },
//     {
//       type: 'line',
//       color: [200, 200, 200]
//     },
//     {
//       type: 'paragraph',
//       text: 'This report is confidential and intended for internal use only. For questions, contact: reports@company.com',
//       fontSize: 9,
//       align: 'center'
//     }
//   ];

//   const handleGenerate = async (action: string) => {
//     setLoading(true);
//     setProgress(0);
//     setError(null);

//     try {
//       const generator = new PDFGenerator();
      
//      await generator.generate(sampleData, {
//         addPageNumbers: true,
//         onProgress: (prog) => {
//           setProgress(prog);
//         }
//       });

//       if (action === 'preview') {
//         generator.preview();
//       } else if (action === 'download') {
//         generator.download('business-report-2024.pdf');
//       }

//       setTimeout(() => {
//         setLoading(false);
//         setProgress(0);
//       }, 500);

//     } catch (err: any) {
//       console.error('PDF Generation Error:', err);
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white rounded-lg shadow-2xl p-8">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-8">
//             <div className="bg-indigo-600 p-3 rounded-lg">
//               <FileText className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">
//                 PDF Generator Utility
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Generate PDFs with automatic page breaks • No split components
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4 mb-8">
//             <button
//               onClick={() => handleGenerate('preview')}
//               disabled={loading}
//               className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-lg"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <Eye className="w-5 h-5" />
//               )}
//               Preview PDF
//             </button>

//             <button
//               onClick={() => handleGenerate('download')}
//               disabled={loading}
//               className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium shadow-lg"
//             >
//               <Download className="w-5 h-5" />
//               Download PDF
//             </button>
//           </div>

//           {/* Progress Bar */}
//           {loading && (
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">
//                   Generating PDF...
//                 </span>
//                 <span className="text-sm font-medium text-indigo-600">
//                   {progress.toFixed(0)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                 <div
//                   className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Error Display */}
//           {error && (
//             <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//               <p className="text-red-800 font-medium">Error: {error}</p>
//             </div>
//           )}

//           {/* Document Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
//               <h3 className="text-lg font-semibold text-blue-900 mb-4">
//                 Document Structure
//               </h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-blue-700">Total Components:</span>
//                   <span className="font-bold text-blue-900">{sampleData.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-blue-700">Component Types:</span>
//                   <span className="font-bold text-blue-900">
//                     {new Set(sampleData.map(c => c.type)).size}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
//               <h3 className="text-lg font-semibold text-green-900 mb-4">
//                 Key Features
//               </h3>
//               <ul className="space-y-2 text-sm text-green-800">
//                 <li className="flex items-center gap-2">
//                   <span className="text-green-600">✓</span>
//                   <span>Automatic page calculation</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <span className="text-green-600">✓</span>
//                   <span>No component splitting</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <span className="text-green-600">✓</span>
//                   <span>Progress tracking</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Usage Example */}
//           <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               How to Use:
//             </h3>
//             <div className="bg-gray-800 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
//               <pre>{`// Create generator instance
// const generator = new PDFGenerator();

// // Generate PDF from your data
// const doc = await generator.generate(yourData, {
//   addPageNumbers: true,
//   onProgress: (progress) => {
//     console.log(\`Progress: \${progress}%\`);
//   }
// });

// // Preview in browser
// generator.preview();

// // Or download directly
// generator.download('my-document.pdf');`}</pre>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PDFGeneratorApp;