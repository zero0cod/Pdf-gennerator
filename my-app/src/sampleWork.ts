const template = {
  "id": "tmpl_full_001",
  "name": "Metquay Standard Calibration Certificate",
  "templateType": "Certificate" as const,

  "certificateConfig": {
    "format": "A4",
    "dimensions": { "width": 210, "height": 297, "unit": "mm" },
    "margin": { "top": 15, "right": 12, "bottom": 15, "left": 12 },

    "isTemplateBilingual": false,
    "work": "work_5001",

    "headers": {
      "firstPageHeader": [
        {
          "height": 25,
          "unit": "mm",
          "pageType": "firstPage",
          "active": true,

          "canvasData": {
            "version": "5.3.0",
            "objects": [
              {
                "type": "rect",
                "left": 0,
                "top": 0,
                "width": 600,
                "height": 120,
                "fill": "#f5f5f5"
              },
              {
                "type": "text",
                "left": 20,
                "top": 40,
                "text": "Metquay Calibration Lab",
                "fontSize": 28,
                "fill": "#222",
                "fontWeight": "bold"
              },
              {
                "type": "text",
                "left": 20,
                "top": 80,
                "text": "Calibration Certificate",
                "fontSize": 20,
                "fill": "#444"
              }
            ]
          }
        }
      ],

      "lastPageHeader": [
        {
          "height": 15,
          "unit": "mm",
          "pageType": "lastPage",
          "active": true,

          "canvasData": {
            "version": "5.3.0",
            "objects": [
              {
                "type": "text",
                "left": 250,
                "top": 10,
                "text": "End of Certificate",
                "fontSize": 16,
                "fill": "#333",
                "fontStyle": "italic"
              }
            ]
          }
        }
      ],

      "defaultHeader": [
        {
          "height": 20,
          "unit": "mm",
          "pageType": "default",
          "active": true,

          "canvasData": {
            "version": "5.3.0",
            "objects": [
              {
                "type": "rect",
                "left": 0,
                "top": 0,
                "width": 600,
                "height": 80,
                "fill": "#ffffff"
              },
              {
                "type": "text",
                "left": 20,
                "top": 20,
                "text": "Metquay Calibration Services",
                "fontSize": 18,
                "fill": "#000"
              }
            ]
          }
        }
      ]
    },

    "footers": {
      "firstPageFooter": [
        {
          "height": 18,
          "unit": "mm",
          "pageType": "firstPage",
          "active": true,

          "canvasData": {
            "version": "5.3.0",
            "objects": [
              {
                "type": "line",
                "x1": 0,
                "y1": 0,
                "x2": 600,
                "y2": 0,
                "stroke": "#000",
                "strokeWidth": 2
              },
            ]
          }
        }
      ],

      "lastPageFooter": [
        {
          "height": 20,
          "unit": "mm",
          "pageType": "lastPage",
          "active": true,

          "canvasData": {
            "version": "5.3.0",
            "objects": [
              {
                "type": "text",
                "left": 20,
                "top": 10,
                "text": "Page {{page}} of {{totalPages}}",
                "fontSize": 12,
                "fill": "#444"
              },
              {
                "type": "text",
                "left": 430,
                "top": 10,
                "text": "Metquay • www.metquay.com",
                "fontSize": 12,
                "fill": "#444"
              }
            ]
          }
        }
      ],

      "defaultFooter": [
        {
          "height": 15,
          "unit": "mm",
          "pageType": "default",
          "active": true,

          "canvasData": {
            "version": "5.3.0",
            "objects": [
              {
                "type": "text",
                "left": 250,
                "top": 10,
                "text": "Confidential",
                "fontSize": 12,
                "fill": "#000"
              }
            ]
          }
        }
      ]
    },

    "contents": [
      {
        "order": 1,
        "componentType": "Custom Field",
        "customField": {
          "id": "cf_001",
          "fieldLabel": "Certificate Title",
          "fieldValue": "CALIBRATION CERTIFICATE"
        }
      },

      {
        "order": 2,
        "componentType": "Customer and Instrument Details",
        "customerAndInstrumentDetails": {
          "noOfColumns": 2,
          "fields": {
            "Customer name and Address": {
              "isActive": true,
              "order": 1,
              "value": "ABC Industries, Bengaluru"
            },
            "Received Date": {
              "isActive": true,
              "order": 2,
              "value": "2025-01-10"
            },
            "Calibrated Date": {
              "isActive": true,
              "order": 3,
              "value": "2025-01-12"
            },
            "Calibration Due On": {
              "isActive": true,
              "order": 4,
              "value": "2026-01-12"
            },
            "Location": {
              "isActive": true,
              "order": 5,
              "value": "Metquay Calibration Lab"
            },
            "Temperature": {
              "isActive": true,
              "order": 6,
              "value": "23°C"
            },
            "Humidity": {
              "isActive": true,
              "order": 7,
              "value": "45%"
            }
          }
        }
      },

      {
        "order": 3,
        "componentType": "Reference Instrument",
        "referenceInstrument": {
          "title": "Reference Standards Used",
          "nextLevelOfmasterInstrument": false,
          "fields": {
            "equipmentName": { "isActive": true, "order": 1, "value": "Reference Weight Set" },
            "serialNumber": { "isActive": true, "order": 2, "value": "RW-3344" },
            "traceability": { "isActive": true, "order": 3, "value": "NABL Traceable" },
            "certificateNumber": { "isActive": true, "order": 4, "value": "REF-CERT-9921" },
            "calibrationDueOn": { "isActive": true, "order": 5, "value": "2025-06-10" },
            "companyName": { "isActive": true, "order": 6, "value": "Metquay Lab" },
            "companyEmail": { "isActive": true, "order": 7, "value": "support@metquay.com" },
            "recommendedDue": { "isActive": true, "order": 8, "value": "2026-06-10" }
          }
        }
      },

      {
        "order": 4,
        "componentType": "Calibration Data",
        "calibrationData": {
          "id": "work_5001",
          "workNo": "WK-2025-5501",
          "workType": "At Lab",
          "calibrations": [
            {
              "type": "As Found",
              "startDate": "2025-01-12T10:15:00Z",
              "endDate": "2025-01-12T10:45:00Z",
              "passed": true
            },
            {
              "type": "As Left",
              "startDate": "2025-01-12T11:00:00Z",
              "endDate": "2025-01-12T11:20:00Z",
              "passed": true
            }
          ]
        }
      },

      {
        "order": 5,
        "componentType": "Image",
        "image": {
          "url": "data:image/png;base64,XYZ123...",
          "caption": "Instrument Photo"
        }
      }
    ]
  }
}
const customer = {
  "id": "cust_001",
  "customerName": "ABC Industries",
  "customerEmail": "info@abcindustries.com",
  "displayName": "ABC Industries Pvt Ltd",
  "contactPersonName": "Rahul Kumar",
  "contactPersonNumber": "+91-9876543210",
  "additionalDetails": "Preferred customer – annual calibration contract",
  "customerSpecificRequirement": "Requires NABL accredited certificate only",
  "primaryAddress": "12, Industrial Layout, Whitefield, Bengaluru, Karnataka - 560066",
  "parentCompany": "ABC Global Holdings",
  "childCompanies": "ABC Engineering, ABC Tools",
  "customerCurrency": "INR",
  "website": "https://abcindustries.com",
  "attachments": [],
  "addresses": [
    {
      "type": "Billing",
      "addressLine1": "12, Industrial Layout",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560066",
      "country": "India"
    },
    {
      "type": "Shipping",
      "addressLine1": "Plot 22, Phase 1, Peenya",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560057",
      "country": "India"
    }
  ],
  "availableWorkspaces": ["default"]
}
const asset = {
  "id": "asset_1001",
  "customerId": "cust_001",

  "assetName": "Digital Vernier Caliper",
  "make": "Mitutoyo",
  "model": "500-196-30",
  "range": "0 - 150 mm",
  "assetType": "Dimensional",
  "isReference": false,

  "serialNo": "VC-78945",
  "tagNo": "TAG-VC-45",

  "assetImages": [
    "https://example.com/assets/vernier-1.png",
    "https://example.com/assets/vernier-2.png"
  ],

  "assetRemarks": "Used for precision linear measurements.",
  "calibrationFrequency": "12 Months",

  "lastCalibratedDate": "2024-01-15",
  "calibrationDueDate": "2025-01-15",

  "assetStatus": "Active",
  "lastReceivedDate": "2025-01-10",
  "lastDeliveredDate": "2025-01-12"
}

const refAsset = {
  "id": "ref_2001",
  "isReference": true,

  "assetName": "Reference Weight Set",
  "make": "WENSAR",
  "model": "Class F1",
  "range": "1 g – 2 kg",
  "assetType": "Mass Standards",

  "serialNo": "RW-3344",
  "tagNo": "REF-WGT-3344",

  "assetImages": [
    "https://example.com/reference-assets/weights.png"
  ],

  "assetRemarks": "Primary reference weight set used for traceability.",
  "calibrationFrequency": "12 Months",

  "verificationDueDate": "2025-06-10",
  "certificateUrl": "https://example.com/certificates/ref/RW-3344.pdf",
  "certificateNo": "REF-CERT-9921",
  "traceability": "Traceable to NABL master mass standards",

  "certificateAgency": "Metquay Calibration Lab",
  "isActive": true,

  "referenceWorksheetId": "ws_ref_2001",
  "referenceWorksheet": null
}
const procedure = {
  "id": "proc_001",
  "procedureName": "Calibration of Digital Vernier Caliper",
  "procedureNo": "DVC-CAL-01",
  "paperProcedureNo": "PP-DVC-2024-01",
  "isActive": true,

  "issueNo": "02",
  "issueDate": "2024-01-10",

  "temperature": "23°C",
  "humidity": "45%",

  "internationalStandardsUsed": "ISO 3611:2010",
  "preparedBy": "Ravi Shankar (QA Engineer)",
  "approvedBy": "S. P. Menon (Technical Manager)",

  "ammendmentNo": "01",
  "amendmentDate": "2024-06-15",
  "approvedDate": "2024-06-20",
  "revisionRemark": "Updated measurement method and acceptance limits.",

  "attachments": [
    "https://example.com/procedures/DVC-CAL-01.pdf",
    "https://example.com/procedures/diagram.png"
  ],

  "certificateApprovers": [
    "Technical Manager",
    "Quality Manager"
  ],

  "assignedTo": ["tech_001", "tech_004"],

  "worksheetData": []
}

const sampleWork = {
  "id": "work_5001",

  "customerId": "cust_001",
  "assetId": "asset_1001",
  "procedureId": "proc_001",
  "templateId": "tmpl_full_001",

  "customer": null,
  "asset": null,
  "procedure": null,

  "startDate": "2025-01-10",
  "finishDate": "2025-01-12",
  "dueDate": "2025-01-15",

  "isSalesOrderNoAvailable": true,
  "orderNo": "SO-2025-122",

  "workNo": "WK-2025-5501",
  "workType": "At Lab",
  "accreditation": "NABL",
  "workStatus": "Done",

  "remarks": "All checks completed. Calibration within acceptable limits.",
  "comments": [
    "Received instrument in good condition.",
    "Customer requested NABL certificate."
  ],

  "certificate": {
    "certificateIssuedTo": "ABC Industries",
    "certificateType": "Supplementary",
    "certificateAddress": "12, Industrial Layout, Whitefield, Bengaluru",
    "certificateTemplate": "tmpl_full_001",
    "certificateUrl": "https://example.com/certificates/WK-2025-5501.pdf",
    "certificateNo": "CERT-2025-5501"
  },

  "calibrations": [
    {
      "id": "cal_9001",
      "type": "As Found",
      "procedure": null,
      "startDate": "2025-01-12T10:15:00Z",
      "endDate": "2025-01-12T10:45:00Z",
      "calibrationTime": "30 min",
      "passed": true,
      "showInCertificate": true,
      "status": "Done"
    },
    {
      "id": "cal_9002",
      "type": "As Left",
      "procedure": null,
      "startDate": "2025-01-12T11:00:00Z",
      "endDate": "2025-01-12T11:20:00Z",
      "calibrationTime": "20 min",
      "passed": true,
      "showInCertificate": true,
      "status": "Done"
    }
  ],

  "attachments": [
    "https://example.com/uploads/work/WK-2025-5501-jobcard.pdf"
  ]
}
export { sampleWork, template, customer, asset, refAsset, procedure }