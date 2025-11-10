

import type { ComponentProps, WorksheetStateType } from "./types";

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