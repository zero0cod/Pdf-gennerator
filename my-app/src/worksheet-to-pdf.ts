

import type { AssetType, CertificateContent, ComponentProps, CustomerType, FooterSection, HeaderSection, TemplateType, WorksheetStateType, WorkType } from "./types";

// export function getCertificateDataBySection(worksheet: WorksheetStateType) {
//   return worksheet.sections
//     .sort((a, b) => a.order - b.order)
//     .map(section => {
//       const components = worksheet.components
//         .filter(comp => comp.sectionId === section.sectionId && comp.showInCertificate === true)
//         .sort((a, b) => a.order - b.order)
//         .map(comp => {
//           // For table components, filter columns with showInCertificate true
//           if (comp.componentType === 'Table' && comp.tableComponent) {
//             const visibleColumns = comp.tableComponent.columns
//               .filter(col => col.showInCertificate === true)
//               .sort((a, b) => a.order - b.order);
            
//             return {
//               ...comp,
//               tableComponent: {
//                 ...comp.tableComponent,
//                 columns: visibleColumns
//               }
//             };
//           }
//           return comp;
//         });

//       return {
//         sectionId: section.sectionId,
//         sectionName: section.sectionName,
//         order: section.order,
//         components
//       };
//     })
//     .filter(section => section.components.length > 0); // Only include sections with visible components
// }


export function getCertificateDataForPDF(worksheet: WorksheetStateType): ComponentProps[] {
  const pdfComponents: ComponentProps[] = [];

  // Get sections sorted by order
  const sections = worksheet.sections
    .sort((a, b) => a.order - b.order)
    .filter(section => {
      // Check if section has any visible components
      return worksheet.components.some(
        comp => comp.sectionId === section.sectionId && comp.showInCertificate === true
      );
    });

  sections.forEach((section, sectionIndex) => {
    // Add section heading
    pdfComponents.push({
      type: 'heading',
      text: section.sectionName,
      level: 1,
      fontSize: 14
    });

    // Get components for this section
    const components = worksheet.components
      .filter(comp => comp.sectionId === section.sectionId && comp.showInCertificate === true)
      .sort((a, b) => a.order - b.order);

    const sectionData = worksheet.data[section.sectionId] || {};

    components.forEach(comp => {
      switch (comp.componentType) {
        case 'Text':
          if (comp.textComponent) {
            if (comp.textComponent.type === 'Heading') {
              pdfComponents.push({
                type: 'heading',
                text: comp.textComponent.heading || comp.label,
                level: 2,
                fontSize: 12
              });
            } else {
              pdfComponents.push({
                type: 'paragraph',
                text: comp.textComponent.heading || comp.label,
                fontSize: 11
              });
            }
          }
          break;

        case 'Input':
          const inputValue = sectionData[comp.componentId] || '';
          pdfComponents.push({
            type: 'paragraph',
            text: `${comp.label}: ${inputValue}`,
            fontSize: 11
          });
          break;

        case 'Select':
          const selectValue = sectionData[comp.componentId] || '';
          let displayValue = selectValue;
          
          // Convert key to display value
          if (comp.selectComponent) {
            const selectedItem = comp.selectComponent.values.find(
              item => item.key === selectValue
            );
            displayValue = selectedItem?.value || selectValue;
          }
          
          pdfComponents.push({
            type: 'paragraph',
            text: `${comp.label}: ${displayValue}`,
            fontSize: 11
          });
          break;

        case 'Table':
          if (comp.tableComponent) {
            const tableData = sectionData[comp.componentId];
            
            if (Array.isArray(tableData) && tableData.length > 0) {
              // Filter visible columns
              const visibleColumns = comp.tableComponent.columns
                .filter(col => col.showInCertificate === true)
                .sort((a, b) => a.order - b.order);

              // Create headers
              const headers = visibleColumns.map(col => col.columnName);

              // Create data rows
              const data = tableData.map(row => {
                return visibleColumns.map(col => {
                  const value = row[col.columnId];
                  
                  // Handle select columns - convert key to display value
                  if (col.columnType === 'Select' && col.selectComponent) {
                    const selectedItem = col.selectComponent.values.find(
                      item => item.key === value
                    );
                    return selectedItem?.value || String(value || '');
                  }
                  
                  // Handle number formatting
                  if (col.columnType === 'Input' && col.inputComponent?.type === 'Number' && value != null) {
                    const roundingDigits = col.inputComponent.roundingDigits || 0;
                    return Number(value).toFixed(roundingDigits);
                  }
                  
                  return value != null ? String(value) : '';
                });
              });

              pdfComponents.push({
                type: 'table',
                headers,
                data,
                theme: 'grid',
                headerColor: [52, 73, 94],
                spacing: 10
              });
            }
          }
          break;

        case 'Graph':
          // Placeholder for graph - you can customize this
          pdfComponents.push({
            type: 'paragraph',
            text: `[Graph: ${comp.label}]`,
            fontSize: 10,
            align: 'center'
          });
          pdfComponents.push({
            type: 'space',
            height: 2
          });
          break;
      }
    });

    // Add space after section (except last section)
    if (sectionIndex < sections.length - 1) {
      pdfComponents.push({
        type: 'space',
        height: 10
      });
    }
  });
console.log(pdfComponents,"pdfCom");
  return pdfComponents;
}






import type { 
  PageHeaderOrFooterComponent,
  HeaderOrFooterContent 
} from './types';
import { PDFGenerator } from "./pdfGeneratorUtility";

/**
 * Converts a Fabric.js canvas JSON to PDF header/footer items
 */
function parseCanvasDataToHeaderFooterItems(
  canvasData: string | any,
  pageType: "firstPage" | "lastPage" | "default"
): HeaderOrFooterContent[] {
  const items: HeaderOrFooterContent[] = [];
  
  try {
    const canvas = typeof canvasData === 'string' 
      ? JSON.parse(canvasData) 
      : canvasData;
    
    const objects = canvas?.objects || [];
    
    for (const obj of objects) {
      if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
        items.push({
          type: "text",
          text: obj.text || "",
          x: obj.left || 0,
          y: obj.top || 0,
          fontSize: obj.fontSize || 12,
          bold: obj.fontWeight === 'bold',
          align: obj.textAlign || "left"
        });
      } 
      else if (obj.type === 'image') {
        items.push({
          type: "image",
          src: obj.src || "",
          x: obj.left || 0,
          y: obj.top || 0,
          width: obj.width || 50,
          height: obj.height || 50
        });
      }
      else if (obj.type === 'line') {
        items.push({
          type: "line",
          x: obj.x1 || 0,
          y: obj.y1 || 0,
          width: obj.strokeWidth || 1
        });
      }
      else if (obj.type === 'rect' && obj.fill) {
        // Background rectangles can be handled via backgroundColor
        // Skip for now or add as a separate background layer
      }
    }
  } catch (error) {
    console.error('Error parsing canvas data:', error);
  }
  
  return items;
}

/**
 * Converts header sections to PDF page header components
 */
function convertHeadersToPDFComponents(
  headers: {
    firstPageHeader: HeaderSection[];
    lastPageHeader: HeaderSection[];
    defaultHeader: HeaderSection[];
  }
): PageHeaderOrFooterComponent[] {
  const components: PageHeaderOrFooterComponent[] = [];
  
  // First Page Header
  if (headers.firstPageHeader?.length > 0) {
    const firstHeader = headers.firstPageHeader[0];
    if (firstHeader.active) {
      const items = parseCanvasDataToHeaderFooterItems(
        firstHeader.canvasData, 
        "firstPage"
      );
      
      components.push({
        type: "pageHeader",
        items,
        height: firstHeader.height || 40,
        pageNumbers: [1] // only on first page
      });
    }
  }
  
  // Default Header (for middle pages)
  if (headers.defaultHeader?.length > 0) {
    const defaultHeader = headers.defaultHeader[0];
    if (defaultHeader.active) {
      const items = parseCanvasDataToHeaderFooterItems(
        defaultHeader.canvasData,
        "default"
      );
      
      components.push({
        type: "pageHeader",
        items,
        height: defaultHeader.height || 30
        // no pageNumbers means all pages (will be filtered later)
      });
    }
  }
  
  return components;
}

/**
 * Converts footer sections to PDF page footer components
 */
function convertFootersToPDFComponents(
  footers: {
    firstPageFooter: FooterSection[];
    lastPageFooter: FooterSection[];
    defaultFooter: FooterSection[];
  }
): PageHeaderOrFooterComponent[] {
  const components: PageHeaderOrFooterComponent[] = [];
  
  // First Page Footer
  if (footers.firstPageFooter?.length > 0) {
    const firstFooter = footers.firstPageFooter[0];
    if (firstFooter.active) {
      const items = parseCanvasDataToHeaderFooterItems(
        firstFooter.canvasData,
        "firstPage"
      );
      
      components.push({
        type: "pageFooter",
        items,
        height: firstFooter.height || 40,
        pageNumbers: [1]
      });
    }
  }
  
  // Default Footer
  if (footers.defaultFooter?.length > 0) {
    const defaultFooter = footers.defaultFooter[0];
    if (defaultFooter.active) {
      const items = parseCanvasDataToHeaderFooterItems(
        defaultFooter.canvasData,
        "default"
      );
      
      components.push({
        type: "pageFooter",
        items,
        height: defaultFooter.height || 30
      });
    }
  }
  
  // Last Page Footer
  if (footers.lastPageFooter?.length > 0) {
    const lastFooter = footers.lastPageFooter[0];
    if (lastFooter.active) {
      const items = parseCanvasDataToHeaderFooterItems(
        lastFooter.canvasData,
        "lastPage"
      );
      
      components.push({
        type: "pageFooter",
        items,
        height: lastFooter.height || 40,
        pageNumbers: [-1] // last page indicator
      });
    }
  }
  
  return components;
}

/**
 * Converts certificate content to PDF components
 */
function convertContentToPDFComponents(
  contents: CertificateContent[],
  work?: WorkType
): ComponentProps[] {
  const components: ComponentProps[] = [];
  
  // Sort by order
  const sortedContents = [...contents].sort((a, b) => a.order - b.order);
  
  for (const content of sortedContents) {
    switch (content.componentType) {
      case "Custom Field":
        if (content.customField) {
          components.push({
            type: "heading",
            text: content.customField.fieldValue,
            level: 2,
            align: "center",
            spacing: 10
          });
        }
        break;
        
      case "Customer and Instrument Details":
        if (content.customerAndInstrumentDetails) {
          const details = content.customerAndInstrumentDetails;
          const activeFields = Object.entries(details.fields)
            .filter(([_, field]) => field.isActive)
            .sort((a, b) => a[1].order - b[1].order);
          
          // Create table data
          const tableData: any[][] = [];
          const cols = details.noOfColumns || 2;
          
          for (let i = 0; i < activeFields.length; i += cols) {
            const row: any[] = [];
            for (let j = 0; j < cols; j++) {
              if (i + j < activeFields.length) {
                const [label, field] = activeFields[i + j];
                row.push(label);
                row.push(field.value || "N/A");
              }
            }
            tableData.push(row);
          }
          
          components.push({
            type: "space",
            height: 5
          });
          
          components.push({
            type: "table",
            data: tableData,
            theme: "grid",
            spacing: 10
          });
        }
        break;
        
      case "Reference Instrument":
        if (content.referenceInstrument) {
          const refInst = content.referenceInstrument;
          
          if (refInst.title) {
            components.push({
              type: "heading",
              text: refInst.title,
              level: 3,
              spacing: 8
            });
          }
          
          const activeFields = Object.entries(refInst.fields)
            .filter(([_, field]) => field.isActive)
            .sort((a, b) => a[1].order - b[1].order);
          
          const headers = activeFields.map(([key]) => 
            key.replace(/([A-Z])/g, ' $1').trim()
          );
          
          const data = [
            activeFields.map(([_, field]) => field.value || "N/A")
          ];
          
          components.push({
            type: "table",
            headers,
            data,
            theme: "striped",
            spacing: 10
          });
        }
        break;
        
      case "Calibration Data":
        if (content.calibrationData || work) {
          const workData = content.calibrationData || work;
          
          components.push({
            type: "heading",
            text: "Calibration Data",
            level: 3,
            spacing: 8
          });
          
          if (workData?.calibrations) {
            const headers = ["Type", "Start Date", "End Date", "Status"];
            const data = workData.calibrations.map(cal => [
              cal.type,
              new Date(cal.startDate).toLocaleDateString(),
              new Date(cal.endDate).toLocaleDateString(),
              cal.passed ? "Passed" : "Failed"
            ]);
            
            components.push({
              type: "table",
              headers,
              data,
              theme: "striped",
              spacing: 10
            });
          }
        }
        break;
        
      case "Image":
        // Image handling would require additional properties in your types
        components.push({
          type: "space",
          height: 10
        });
        break;
    }
  }
  
  return components;
}

/**
 * Main function: Converts a certificate template to PDF components
 */
export function getCertificateDataForPDFFromWork(
  template: TemplateType,
  work?: WorkType,
): ComponentProps[] {
  const pdfComponents: ComponentProps[] = [];
  
  if (!template.certificateConfig) {
    console.warn('No certificate config found in template');
    return pdfComponents;
  }
  
  const config = template.certificateConfig;
  
  // 1. Add headers
  const headerComponents = convertHeadersToPDFComponents(config.headers);
  pdfComponents.push(...headerComponents);
  
  // 2. Add content
  const contentComponents = convertContentToPDFComponents(
    config.contents || [],
    work || config.work
  );
  pdfComponents.push(...contentComponents);
  
  // 3. Add footers
  const footerComponents = convertFootersToPDFComponents(config.footers);
  pdfComponents.push(...footerComponents);
  
  return pdfComponents;
}

/**
 * Usage example:
 */
export async function generateCertificatePDF(
  template: TemplateType,
  work?: WorkType,
  onProgress?: (progress: number) => void
) {
  
  const components = getCertificateDataForPDFFromWork(template, work);
  const generator = new PDFGenerator();
  
  await generator.generate(components, {
    addPageNumbers: true,
    onProgress
  });
  
  return generator;
}