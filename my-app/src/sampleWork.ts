import { sampleWorksheet } from "./sample-worksheeet"

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
        "height": 50,
        "unit": "mm",
        "pageType": "firstPage",
        "active": true,
        "version": "6.7.1",
        "canvasData": {
          "objects": [
            {
              "type": "rect",
              "left": 0,
              "top": 0,
              "width": 794,
              "height": 200,
              "fill": "#eee",
              "stroke": null
            },
            {
              "type": "rect",
              "left": 0,
              "top": 200,
              "width": 794,
              "height": 8,
              "fill": "#fbbf24",
              "stroke": null
            },
            {
            "cropX": 0,
            "cropY": 0,
            "type": "Image",
            "version": "6.7.1",
            "originX": "left",
            "originY": "top",
            "left": 50,
            "top": 50,
            "width": 110,
            "height": 110,
            "fill": "rgb(0,0,0)",
            "stroke": null,
            "strokeWidth": 0,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeUniform": false,
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "skewX": 0,
            "skewY": 0,
            "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAABuCAYAAADGWyb7AAAITklEQVR4AeydAW7bOhBE/Xr/O+eHcJl9crgV6fgnIrJFBI5Hs8M1BysoKIr+ud1ub6++3pI/M/u41HrzGbbeONNnvGtncOZjfsZnRdOCe9fXz24nUMHtltjffg/BvY/27dnrr9+nBbjB/bK3hRlvjTHc/QDTUxj46AcCzxTP9AnnnvZZxb3PQ3CdrPX6J1DBXT+jYYdpcBAjD2M8dPwHCeHjRwQED4EzzQzvNiA8zdtnhoexz0ytNcYQnjDG1necBtcFtV7zBCq4a+Zy2tWPBQftsXC/si7hfh84vO3CmLePH4MZhvBxrbFrMx7OfVz7Cvxjwb2i+d/sUcFtmv63Bpc9dlbPbtUH4lEGgTMfCI17sx5Ck/GufTX+1uBe3fxv9qvgNk0/Dc7jn+HV7wzjx0vmbx6idmZfONfDmgbO9TO9WePvmGHrO06D64Jar3kCFdw1cznt6hAcxKMA1vDpTu8CPwog/N9vffzAmP8QPAA413tfl7+9vX38Yg/hM6O3zyqG2AvWcN/rEFwna73+CVRw189o2OEfPxZehb2TPSEeCxnvWgh9xtvHmoy3JsOwti+M9fZ3P6/ANXE+3Y1wBbdRWG41DQ7Oxx9CA+fYG2fYjxFrzBvDeF/XQmiyWutXsT2NIfa1JwQPa7j7pMF1Qa3XPIEK7pq5nHb1B2JUrc5GHkJvzSqG8PG+ELw9IXjrZ3DmY37GZ1WT+Xf+cbX/473+Ge7nUBPn09oIV3AbheVWD7+A+4ZxH9O2mof72MJxXdVY3/boV8ZD7Ne1jyuExj7GMNbYy/qMh7EPBA/nOPN3Dx3XxPWT2Gyt4DYLrLd7eKuE83HuhW31aBtD+DTd6LLe9yFqIbA1xnCusT7b1zyEp3n7wLnGtcb2yXhr4PNeNXE+oY1wBbdRWG41fav0CBu72Bg+j7PrHrFrja0zD+FvfgZD1EJg7wXnvPfKaiF8rIcxn2kg9KO9XjBx3rrwd51ABfddJ/3ifQ5vlfaGGFXzo7GF47+msX4VQ+zrvVZ9Mr094XyvTJ/5m4fwN59h72UNfPapifMJbYQruI3CcqvpW6VFGfZow+dxzuoaD6G3j3HT9esrvGsh9u3ejyuEBgI/6kafvZfvZ7w1MN5rVFsT55PbCFdwG4XlVg/BeSSNXWAMMdrWQ/DWG1tvHtZqYayHMT+zb6YxD+Gf8f5extabN840nT8E58Jt8C9ttILbNPhDcBDjv/p9IGr7OLcVgofA9ofgW02/rDGGsR7GfFZrPsO9l7ZmGoh9v6Jpe/TrzOcQXCYu/nonUMFdL5OpjqaCg/NHQR/xtsK5HkLTavo103XXtnVGD8/vZX9Y82n99SvzMb+Cp4JbMSzt95xABfc95/zyXdLg4Pyx0B8DbYXQZ102Xb+sgaiFNWyf7t3WGX5GA9FP8+2Xa437/bZC1K5qYFzbfdLguqDWf5/AT92t4H7q5L+4b/o34G3U+wUxtjDGXdvWrCeI2qYbXVmttdZAeK7yq54z/tYYZ3uZh/gu5u3TcU1cP4nN1gpus8B6u4e/Afd4QoxtF7fVGmMY61tNv6zv3OOaaSD8rTF+9Dr7DOEJge1pDKHJvCE0q7XWZ/5dUxOXndDF+Qru4gFl7aVvlVkBxKMAAvcR/tcKoYdzvNqD9e5jlYdxb5ln5g/hYw2c8zDWdJ+auH4Sm61/g9us62r3dnir9Hn4sWBsjTGMRxvGvGuNvZdxpjEP53vBuSbbF85r4Vwz0/NZDzVxPsWNcAW3UVhu9RAcxJhDYBdkI/wqHmJfCLzqD1ELgWe+izXGWQ+ZxnrjTG8+w93nEFwmLv56J1DBXS+TqY4Ov4D3MXxcZ5xg/DiaqbXGe5uHsT+MefsY2zPDEJ6uheBdm2kg9BDYtTDmMw3c9TVxPqGN8DWC2+jArtLq4RdwuI8hzK3+En5cmM8wxB6uhTGf+bjWGggf8zP6TGOfGWwf46zWGoj+zffamrh+EputFdxmgfV2D2+VnWyrx9O43euXeYjR7vfbCsFbbwyhaTX9gjW+1z2zzvRjX+vNG0P0D4GteRbXxD17cj9cV8H9cADPbn94q/T4Q4w2BLbGm2a8NcYQnubtY5xpzM9gGO/r2pl9IXwgsH0ynPnD2Ac+8zVx2elenK/gbrfbxTMatnd4q4QYyWychy7vJETt+8fhD4TG/sYQGghsjc3heQ1ELYyx9zJ2P8bWZBhiL2vsk+Gur4nrJ7HZWsFtFlhvN32r7IK2emzb59H1FQ3Eo8M+xqM9GzejabrRtVoL0efI75Gzf4ZdA2N/+MzXxPnkNsIV3EZhudX0rRJiPGENewNjGPvMaOC81j5+NJmH8DFv7FoIvXnrZzCEz6p+tG9N3MwpXlBTwf18KE91cAjOI7mKZ3bPPLPaTG8e4hEEY5z5Q+gzTcZD1ELgTO+eM4156yH8O38IzoWFr30CFdy180m7S4ODGE8Y49RVN/potxXCR5Jbu9cv8zDWQ/C97nG1j/GjbvQZwt+1xq4zbwzhA2NsfeZpHu4+aXA2LHy9E6jgrpfJVEeXC86PhZlvAPdHB3CQZz7ADe7XoUAfslpJDtD6GXwo1ge49wWIvX30C/F/GF0uuFv9mTqBCm7qmK4nel1wyXcDPkY9kaS0HzupSDcg9oLAMz4QelkeIIQGAlsEY96arB/zMPaBO/+/B+eGC7/uBCq4153ltzqlwXlsMzzTqWuth/vIw9zqWmP7ZxhiD2syHwh9psl8rIfwgTG2D4TG/AinwbmBwtc7gQrueplMdXQIDmJUYQ3P7OaRz/TWGFuf8dbMYBh/R/sb2xOi1nyG7WMMaz5w1x+CyzYt/non8B8AAAD//8kvwNkAAAAGSURBVAMAPsO2eNk+PNUAAAAASUVORK5CYII=",
            "crossOrigin": "anonymous",
            "filters": []
        },
            {
              "type": "Textbox",
              "fontSize": 56,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "CERTIFICATE OF CALIBRATION",
              "textAlign": "center",
              "left": 397,
              "top": 60,
              "width": 600,
              "fill": "#ffffff"
            },
            {
              "type": "Textbox",
              "fontSize": 28,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "ISO/IEC 17025:2017 Accredited Laboratory",
              "textAlign": "center",
              "left": 397,
              "top": 125,
              "width": 600,
              "fill": "#fbbf24"
            },
            {
              "type": "Textbox",
              "fontSize": 24,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Certificate No: CERT-{{certificateNo}}",
              "textAlign": "center",
              "left": 397,
              "top": 165,
              "width": 500,
              "fill": "#e5e7eb"
            },
            {
              "type": "Image",
              "left": 700,
              "top": 30,
              "width": 80,
              "height": 80,
              "src": "data:image/svg+xml;base64,..."
            }
          ]
        },
        "background": "#ffffff"
      }
    ],
    "defaultHeader": [
      {
        "height": 30,
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
              "width": 794,
              "height": 120,
              "fill": "#f3f4f6",
              "stroke": null,
              "comment": "Light gray background"
            },
            {
              "type": "rect",
              "left": 0,
              "top": 110,
              "width": 794,
              "height": 10,
              "fill": "#1e3a8a",
              "stroke": null,
              "comment": "Blue bottom border"
            },
            {
              "type": "Image",
              "left": 30,
              "top": 20,
              "width": 80,
              "height": 80,
              "scaleX": 1,
              "scaleY": 1,
              "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMTkzYThhIi8+PHRleHQgeD0iNDAiIHk9IjQ4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxPR088L3RleHQ+PC9zdmc+",
              "comment": "Small logo"
            },
            {
              "type": "Textbox",
              "fontSize": 32,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "Metquay Calibration Services",
              "textAlign": "left",
              "left": 130,
              "top": 30,
              "width": 500,
              "fill": "#1f2937",
              "comment": "Company name"
            },
            {
              "type": "Textbox",
              "fontSize": 20,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Precision • Accuracy • Reliability",
              "textAlign": "left",
              "left": 130,
              "top": 70,
              "width": 400,
              "fill": "#6b7280",
              "comment": "Tagline"
            },
            {
              "type": "Textbox",
              "fontSize": 18,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Certificate No: CERT-{{certificateNo}}",
              "textAlign": "right",
              "left": 550,
              "top": 50,
              "width": 220,
              "fill": "#1e3a8a",
              "comment": "Certificate reference"
            }
          ]
        }
      }
    ],

    "lastPageHeader": [
      {
        "height": 25,
        "unit": "mm",
        "pageType": "lastPage",
        "active": true,
        "canvasData": {
          "version": "5.3.0",
          "objects": [
            {
              "type": "rect",
              "left": 0,
              "top": 0,
              "width": 794,
              "height": 100,
              "fill": "#eee",
              "stroke": null,
              "comment": "Green background for completion"
            },
            {
              "type": "rect",
              "left": 0,
              "top": 100,
              "width": 794,
              "height": 5,
              "fill": "#10b981",
              "stroke": null,
              "comment": "Lighter green accent"
            },
            {
              "type": "Textbox",
              "fontSize": 38,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "END OF CERTIFICATE",
              "textAlign": "center",
              "left": 397,
              "top": 20,
              "width": 600,
              "fill": "#ffffff",
              "comment": "End marker"
            },
            {
              "type": "Textbox",
              "fontSize": 20,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "This certificate is issued in accordance with ISO/IEC 17025:2017",
              "textAlign": "center",
              "left": 397,
              "top": 65,
              "width": 650,
              "fill": "#d1fae5",
              "comment": "Compliance statement"
            },
            {
              "type": "circle",
              "left": 50,
              "top": 35,
              "radius": 25,
              "fill": "none",
              "stroke": "#ffffff",
              "strokeWidth": 3,
              "comment": "Checkmark circle"
            },
            {
              "type": "path",
              "left": 55,
              "top": 40,
              "path": "M 0 5 L 8 13 L 20 0",
              "fill": "none",
              "stroke": "#ffffff",
              "strokeWidth": 4,
              "comment": "Checkmark inside circle"
            }
          ]
        }
      }
    ]
  },

  "footers": {
    "firstPageFooter": [
      {
        "height": 35,
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
              "width": 794,
              "height": 5,
              "fill": "#fbbf24",
              "stroke": null,
              "comment": "Gold top border"
            },
            {
              "type": "rect",
              "left": 0,
              "top": 5,
              "width": 794,
              "height": 145,
              "fill": "#1e3a8a",
              "stroke": null,
              "comment": "Blue background"
            },
            {
              "type": "Textbox",
              "fontSize": 20,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "CONFIDENTIAL",
              "textAlign": "center",
              "left": 397,
              "top": 20,
              "width": 300,
              "fill": "#fbbf24",
              "comment": "Confidential notice"
            },
            {
              "type": "line",
              "x1": 297,
              "y1": 50,
              "x2": 497,
              "y2": 50,
              "stroke": "#fbbf24",
              "strokeWidth": 2,
              "comment": "Decorative line under confidential"
            },
            {
              "type": "Textbox",
              "fontSize": 16,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "This certificate is issued under the laboratory's scope of accreditation and may not be reproduced except in full without written approval.",
              "textAlign": "center",
              "left": 100,
              "top": 65,
              "width": 594,
              "fill": "#e5e7eb",
              "comment": "Legal notice"
            },
            {
              "type": "Textbox",
              "fontSize": 14,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Metquay Calibration Services | Building No: 5421, Old Street, Austin, Texas, USA 956585",
              "textAlign": "center",
              "left": 100,
              "top": 115,
              "width": 594,
              "fill": "#9ca3af",
              "comment": "Address line 1"
            },
            {
              "type": "Textbox",
              "fontSize": 14,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Phone: +1 (718) 652-0848 | Email: support@metquay.com | Web: www.metquay.com",
              "textAlign": "center",
              "left": 100,
              "top": 133,
              "width": 594,
              "fill": "#9ca3af",
              "comment": "Contact information"
            }
          ]
        }
      }
    ],

    "defaultFooter": [
      {
        "height": 20,
        "unit": "mm",
        "pageType": "default",
        "active": true,
        "canvasData": {
          "version": "5.3.0",
          "objects": [
            {
              "type": "line",
              "x1": 40,
              "y1": 10,
              "x2": 754,
              "y2": 10,
              "stroke": "#1e3a8a",
              "strokeWidth": 2,
              "comment": "Top separator line"
            },
            {
              "type": "rect",
              "left": 0,
              "top": 15,
              "width": 794,
              "height": 70,
              "fill": "#f9fafb",
              "stroke": null,
              "comment": "Light background"
            },
            {
              "type": "Textbox",
              "fontSize": 16,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Metquay Calibration Services • ISO/IEC 17025:2017 Accredited",
              "textAlign": "left",
              "left": 40,
              "top": 25,
              "width": 400,
              "fill": "#4b5563",
              "comment": "Company info"
            },
            {
              "type": "Textbox",
              "fontSize": 16,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "Page {{page}} of {{total}}",
              "textAlign": "right",
              "left": 650,
              "top": 25,
              "width": 120,
              "fill": "#1e3a8a",
              "comment": "Page numbers"
            },
            {
              "type": "Textbox",
              "fontSize": 12,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Document ID: {{certificateNo}} | Date: {{issueDate}}",
              "textAlign": "left",
              "left": 40,
              "top": 50,
              "width": 400,
              "fill": "#9ca3af",
              "comment": "Document metadata"
            },
            {
              "type": "Textbox",
              "fontSize": 12,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "www.metquay.com",
              "textAlign": "right",
              "left": 650,
              "top": 50,
              "width": 120,
              "fill": "#6b7280",
              "comment": "Website"
            },
            {
              "type": "rect",
              "left": 380,
              "top": 30,
              "width": 34,
              "height": 30,
              "fill": "#1e3a8a",
              "stroke": null,
              "comment": "Center divider decoration"
            }
          ]
        }
      }
    ],

    "lastPageFooter": [
      {
        "height": 40,
        "unit": "mm",
        "pageType": "lastPage",
        "active": true,
        "canvasData": {
          "version": "5.3.0",
          "objects": [
            {
              "type": "rect",
              "left": 0,
              "top": 0,
              "width": 794,
              "height": 3,
              "fill": "#eee",
              "stroke": null,
              "comment": "Green top accent"
            },
            {
              "type": "rect",
              "left": 0,
              "top": 3,
              "width": 794,
              "height": 160,
              "fill": "#f0fdf4",
              "stroke": null,
              "comment": "Light green background"
            },
            {
              "type": "line",
              "x1": 40,
              "y1": 50,
              "x2": 354,
              "y2": 50,
              "stroke": "#059669",
              "strokeWidth": 2,
              "comment": "Signature line left"
            },
            {
              "type": "line",
              "x1": 440,
              "y1": 50,
              "x2": 754,
              "y2": 50,
              "stroke": "#059669",
              "strokeWidth": 2,
              "comment": "Signature line right"
            },
            {
              "type": "Textbox",
              "fontSize": 16,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "Calibrated By",
              "textAlign": "center",
              "left": 40,
              "top": 60,
              "width": 314,
              "fill": "#047857",
              "comment": "Left signature label"
            },
            {
              "type": "Textbox",
              "fontSize": 16,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "Approved By",
              "textAlign": "center",
              "left": 440,
              "top": 60,
              "width": 314,
              "fill": "#047857",
              "comment": "Right signature label"
            },
            {
              "type": "Textbox",
              "fontSize": 13,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Technician Name\nDate: {{calibrationDate}}",
              "textAlign": "center",
              "left": 40,
              "top": 85,
              "width": 314,
              "fill": "#065f46",
              "comment": "Technician details"
            },
            {
              "type": "Textbox",
              "fontSize": 13,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Quality Manager\nDate: {{approvalDate}}",
              "textAlign": "center",
              "left": 440,
              "top": 85,
              "width": 314,
              "fill": "#065f46",
              "comment": "Manager details"
            },
            {
              "type": "Textbox",
              "fontSize": 18,
              "fontWeight": "bold",
              "fontFamily": "Arial",
              "text": "Page {{page}} of {{total}}",
              "textAlign": "center",
              "left": 347,
              "top": 120,
              "width": 100,
              "fill": "#059669",
              "comment": "Final page number"
            },
            {
              "type": "Textbox",
              "fontSize": 11,
              "fontWeight": "normal",
              "fontFamily": "Arial",
              "text": "Metquay Calibration Services • Austin, Texas • www.metquay.com • support@metquay.com",
              "textAlign": "center",
              "left": 100,
              "top": 145,
              "width": 594,
              "fill": "#6b7280",
              "comment": "Footer contact info"
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

  "worksheetData": {...sampleWorksheet}
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
      "procedure": {...procedure},
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
      "procedure": {...procedure},
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