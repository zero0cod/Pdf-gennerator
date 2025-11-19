// PDFGeneratorUtilityForWorks.ts
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import type {
  ComponentProps,
  ParagraphComponent,
  LineComponent,
  TableComponentForPdf,
  ListComponent,
  GenerateOptions,
  SpaceComponent,
  PageHeaderOrFooterComponent,
  HeadingComponent,
  TemplateType,
  WorkType,
  HeaderOrFooterContent,
  WorksheetStateType
} from "./types";


export class PDFGeneratorUtilityForWorks {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margins: { top: number; right: number; bottom: number; left: number };
  contentWidth: number;
  contentHeight: number;
  currentY: number;
  headerHeight: number;
  footerHeight: number;
  usableBottom: number;

  constructor() {
    this.doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margins = { top: 15, right: 12, bottom: 15, left: 12 };
    this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
    this.contentHeight = this.pageHeight - this.margins.top - this.margins.bottom;
    this.currentY = this.margins.top;
    this.headerHeight = 0;
    this.footerHeight = 0;
    this.usableBottom = this.pageHeight - this.margins.bottom;
  }

  
  private pixelsToMM(pixels: number): number {
   
    return pixels * 0.264583;
  }

  private convertToMM(value: number, unit?: string): number {
    if (!unit || unit === "px") return this.pixelsToMM(value);
    switch (unit) {
      case "mm":
        return value;
      case "cm":
        return value * 10;
      case "in":
        return value * 25.4;
      default:
        return value;
    }
  }
  
  updateLayoutDimensions() {
    this.contentHeight =
      this.pageHeight - this.margins.top - this.margins.bottom - (this.headerHeight ?? 0) - (this.footerHeight ?? 0);
    this.usableBottom = this.pageHeight - (this.footerHeight ?? 0);
  }

  private parseCanvasData(canvasData: any): HeaderOrFooterContent[] {
    const items: HeaderOrFooterContent[] = [];
    const canvas = typeof canvasData === "string" ? JSON.parse(canvasData) : canvasData;
    const objects = canvas?.objects || [];

    for (const obj of objects) {
      const type = (obj.type || "").toLowerCase();
      const left = this.pixelsToMM(obj.left ?? 0);
      const top = this.pixelsToMM(obj.top ?? 0);

      if (["i-text", "textbox", "text"].includes(type)) {
        items.push({
          type: "text",
          text: obj.text ?? "",
          x: left,
          y: top,
          width: this.pixelsToMM(obj.width ?? 200),
          fontSize: (obj.fontSize ?? 14) * 0.35,
          bold: obj.fontWeight === "bold" || (obj.fontWeight ?? "").toLowerCase() === "bold",
          align: obj.textAlign ?? "left",
          color: obj.fill ?? "#000"
        } as any);
      } else if (type === "image") {
        items.push({
          type: "image",
          src: obj.src ?? "",
          x: left,
          y: top,
          width: this.pixelsToMM((obj.width ?? 50) * (obj.scaleX ?? 1)),
          height: this.pixelsToMM((obj.height ?? 50) * (obj.scaleY ?? 1))
        } as any);
      } else if (type === "rect") {
        items.push({
          type: "rect",
          x: left,
          y: top,
          width: this.pixelsToMM(obj.width ?? 0),
          height: this.pixelsToMM(obj.height ?? 0),
          fill: obj.fill ?? null,
          stroke: obj.stroke ?? null
        } as any);
      } else if (type === "line") {
        items.push({
          type: "line",
          x1: this.pixelsToMM(obj.x1 ?? 0),
          y1: this.pixelsToMM(obj.y1 ?? 0),
          x2: this.pixelsToMM(obj.x2 ?? 0),
          y2: this.pixelsToMM(obj.y2 ?? 0),
          strokeWidth: obj.strokeWidth ?? 1,
          color: obj.stroke ?? "#000"
        } as any);
      } else if (type === "circle") {
        items.push({
          type: "circle",
          x: left,
          y: top,
          radius: this.pixelsToMM(obj.radius ?? 0),
          stroke: obj.stroke ?? null,
          fill: obj.fill ?? null,
          strokeWidth: obj.strokeWidth ?? 1
        } as any);
      } else if (type === "path") {
        items.push({
          type: "path",
          x: left,
          y: top,
          path: obj.path ?? "",
          stroke: obj.stroke ?? null,
          strokeWidth: obj.strokeWidth ?? 1
        } as any);
      } else {
       
      }
    }

    return items;
  }
 
  private computeUsedHeightForSection(items: HeaderOrFooterContent[] | undefined, declaredHeightMM: number) {
    if (!items || items.length === 0) return declaredHeightMM || 0;
    let maxBottom = 0;
    for (const it of items) {
      const top = Number((it as any).y ?? (it as any).y1 ?? 0);
      let bottom = top;
      if (it.type === "image") bottom = top + Number((it as any).height ?? 0);
      else if (it.type === "text") {
        const fs = Number((it as any).fontSize ?? 11);
        bottom = top + fs * 0.6;
      } else if (it.type === "rect") bottom = top + Number((it as any).height ?? 0);
      else if (it.type === "line") bottom = Number((it as any).y1 ?? it.y ?? 0) + ((it as any).strokeWidth ?? 1);
      else if (it.type === "circle") bottom = top + (Number((it as any).radius ?? 0) * 2);
      else if (it.type === "path") bottom = top + 5;
      maxBottom = Math.max(maxBottom, bottom);
    }
    return Math.max(declaredHeightMM, maxBottom + 2);
  }

  private drawRect(x: number, y: number, w: number, h: number, fill?: string | null, stroke?: string | null) {
    if (fill) {
     
      const rgb = this.hexToRgb(fill);
      if (rgb) this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
      this.doc.rect(x, y, w, h, "F");
    }
    if (stroke) {
      const rgb = this.hexToRgb(stroke);
      if (rgb) this.doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      this.doc.rect(x, y, w, h);
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, width = 0.5, stroke = "#000") {
    const rgb = this.hexToRgb(stroke);
    if (rgb) this.doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    this.doc.setLineWidth(width);
    this.doc.line(x1, y1, x2, y2);
  }

  private drawCircle(cx: number, cy: number, radius: number, fill?: string | null, stroke?: string | null, strokeWidth = 1) {
    if (fill) {
      const rgb = this.hexToRgb(fill);
      if (rgb) this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
      this.doc.circle(cx, cy, radius, "F");
    }
    if (stroke) {
      const rgb = this.hexToRgb(stroke);
      if (rgb) this.doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      this.doc.setLineWidth(strokeWidth);
      this.doc.circle(cx, cy, radius);
    }
  }
  
  private drawPath(pathString: string, offsetX: number, offsetY: number, stroke?: string | null, strokeWidth = 1) {
   
    const commands = pathString.trim().split(/(?=[MLCQZmlcqz])/);
    this.doc.setLineWidth(strokeWidth);
    if (stroke) {
      const rgb = this.hexToRgb(stroke);
      if (rgb) this.doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    }
    let startX = 0;
    let startY = 0;
    for (const cmd of commands) {
      const t = cmd.trim();
      if (!t) continue;
      const letter = t[0];
      const nums = t.slice(1).trim().split(/[ ,]+/).map(Number).filter((n) => !isNaN(n));
      if (letter === "M" || letter === "m") {
        const nx = nums[0] ?? 0;
        const ny = nums[1] ?? 0;
        startX = offsetX + nx;
        startY = offsetY + ny;
      } else if (letter === "L" || letter === "l") {
        const nx = nums[0] ?? 0;
        const ny = nums[1] ?? 0;
        const x = offsetX + nx;
        const y = offsetY + ny;
        this.doc.line(startX, startY, x, y);
        startX = x;
        startY = y;
      } else {
       
      }
    }
  }

  private async drawImageData(src: string, x: number, y: number, w: number, h: number) {
   
    try {
     
      this.doc.addImage(src, "PNG", x, y, w, h);
    } catch (err) {
     
      this.doc.setDrawColor(150);
      this.doc.rect(x, y, w, h);
      this.doc.setFontSize(8);
      this.doc.text("No Image", x + w / 2, y + h / 2 + 3, { align: "center" });
    }
  }

  private hexToRgb(hex?: string | null) {
    if (!hex) return null;
   
    const m = String(hex).replace(/\s/g, "");
    if (m.charAt(0) !== "#") return null;
    const hexClean = m.slice(1);
    if (hexClean.length === 3) {
      const rPart = hexClean.charAt(0);
      const gPart = hexClean.charAt(1);
      const bPart = hexClean.charAt(2);
      const r = parseInt(rPart + rPart, 16);
      const g = parseInt(gPart + gPart, 16);
      const b = parseInt(bPart + bPart, 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return { r, g, b };
    } else if (hexClean.length === 6) {
      const r = parseInt(hexClean.slice(0, 2), 16);
      const g = parseInt(hexClean.slice(2, 4), 16);
      const b = parseInt(hexClean.slice(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return { r, g, b };
    }
    return null;
  }

  private addTextBlock(
    text: string,
    x: number,
    y: number,
    width: number,
    fontSize = 11,
    bold = false,
    align: "left" | "center" | "right" = "left",
    lineHeightFactor = 0.6
  ): { height: number; yStart: number } {
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", bold ? "bold" : "normal");
   
    const linesArr: string[] = [];
    const explicitLines = String(text || "").split("\n");
    for (const l of explicitLines) {
      const pieces = this.doc.splitTextToSize(l || "", width) as string[];
      if (Array.isArray(pieces)) linesArr.push(...pieces);
      else linesArr.push(String(pieces));
    }
    const lineHeight = fontSize * lineHeightFactor;
    const blockHeight = linesArr.length * lineHeight;
   
    let drawX = x;
    if (align === "center") drawX = this.pageWidth / 2;
    else if (align === "right") drawX = this.pageWidth - this.margins.right;

    for (let i = 0; i < linesArr.length; i++) {
      const lineY = y + i * lineHeight;
      this.doc.text(String(linesArr[i]), drawX, lineY, { align: align as any, baseline: "middle" });
    }

    return { height: blockHeight, yStart: y };
  }

  private async renderCanvasItem(item: any, originX: number, originY: number, pageNumber?: number, totalPages?: number) {
   
    if (!item) return;
    const type = item.type;
    if (type === "rect") {
      const x = originX + (item.x ?? 0);
      const y = originY + (item.y ?? 0);
      this.drawRect(x, y, item.width ?? 0, item.height ?? 0, item.fill ?? null, item.stroke ?? null);
    } else if (type === "image") {
      const x = originX + (item.x ?? 0);
      const y = originY + (item.y ?? 0);
      await this.drawImageData(item.src ?? "", x, y, item.width ?? 0, item.height ?? 0);
    } else if (type === "text") {
     
      let raw = String(item.text ?? "");
      raw = raw.replace(/{{\s*page\s*}}/gi, pageNumber != null ? String(pageNumber) : "{{page}}");
      raw = raw.replace(/{{\s*total\s*}}/gi, totalPages != null ? String(totalPages) : "{{total}}");
      raw = raw.replace(/{pageNumber}/g, String(pageNumber ?? ""));
      raw = raw.replace(/{totalPages}/g, String(totalPages ?? ""));
      const fontSize = Number(item.fontSize ?? 11);
      const align = (item.align ?? "left") as "left" | "center" | "right";
     
      const x = originX + (typeof item.x === "number" ? item.x : 0);
      const y = originY + (typeof item.y === "number" ? item.y : 0);
     
      const width = Number(item.width ?? Math.max(10, this.contentWidth - 10));
     
      let drawX = x;
      if (typeof item.x !== "number") {
        if (align === "center") drawX = this.pageWidth / 2;
        else if (align === "right") drawX = this.pageWidth - this.margins.right;
        else drawX = this.margins.left;
      }
     
      const yToUse = y || originY + (item.containerCenter ? (item.containerHeight ?? 0) / 2 : 0);
      this.addTextBlock(raw, drawX, yToUse + fontSize * 0.0, width, fontSize, !!item.bold, align, item.lineHeight ?? 0.6);
    } else if (type === "line") {
      const x1 = originX + (item.x1 ?? 0);
      const y1 = originY + (item.y1 ?? 0);
      const x2 = originX + (item.x2 ?? 0);
      const y2 = originY + (item.y2 ?? 0);
      this.drawLine(x1, y1, x2, y2, item.strokeWidth ?? 0.5, item.color ?? "#000");
    } else if (type === "circle") {
      const cx = originX + (item.x ?? 0) + (item.radius ?? 0);
      const cy = originY + (item.y ?? 0) + (item.radius ?? 0);
      this.drawCircle(cx, cy, item.radius ?? 0, item.fill ?? null, item.stroke ?? null, item.strokeWidth ?? 1);
    } else if (type === "path") {
     
     
      const offsetX = originX + (item.x ?? 0);
      const offsetY = originY + (item.y ?? 0);
      this.drawPath(item.path ?? "", offsetX, offsetY, item.stroke ?? "#000", item.strokeWidth ?? 1);
    }
  }
 
  async renderPageHeader(component: PageHeaderOrFooterComponent, pageNumber: number, totalPages: number): Promise<number> {
    if (!this.doc || !component) return this.margins.top;
    const headerY = 0;
    const declaredHeight = component.height ?? 40;
   
    const items = component.items ?? [];
   
   
    for (const it of items) {
     
      await this.renderCanvasItem(it, 0, headerY, pageNumber, totalPages);
    }
   
    const headerBottom = headerY + (component.height ?? declaredHeight);
   
    this.headerHeight = headerBottom - headerY;
    this.updateLayoutDimensions();
    return headerBottom;
  }

  async renderPageFooter(component: PageHeaderOrFooterComponent, pageNumber: number, totalPages: number): Promise<number> {
    if (!this.doc || !component) return this.pageHeight;
    const footerHeight = component.height ?? 40;
   
    const footerY = this.pageHeight - footerHeight;
    const items = component.items ?? [];
   
    for (const it of items) {
      await this.renderCanvasItem(it, 0, footerY, pageNumber, totalPages);
    }
   
    // const footerBottom = footerY + (component.height ?? footerHeight);
    // this.footerHeight = footerBottom - footerY;
    // this.updateLayoutDimensions();
    // return footerBottom;

    this.footerHeight = footerHeight;
    this.updateLayoutDimensions();

  return footerY + footerHeight;


  }

  calculateComponentHeight(component: ComponentProps): number {
    switch (component.type) {
      case "title": {
        const fontSize = component.fontSize || 24;
        this.doc.setFontSize(fontSize);
        const lines = this.doc.splitTextToSize(component.text || "", this.contentWidth);
        return lines.length * fontSize * 0.35 + (component.spacing ?? 15);
      }
      case "heading": {
        const fontSizes: Record<1 | 2 | 3 | 4, number> = { 1: 20, 2: 16, 3: 14, 4: 12 };
        const fontSize = component.fontSize || fontSizes[(component.level as 1 | 2 | 3 | 4) || 2];
        this.doc.setFontSize(fontSize);
        const lines = this.doc.splitTextToSize(component.text || "", this.contentWidth);
        return lines.length * fontSize * 0.35 + (component.spacing ?? 8);
      }
      case "paragraph": {
        const fontSize = component.fontSize || 12;
        this.doc.setFontSize(fontSize);
        const lines = this.doc.splitTextToSize(component.text || "", this.contentWidth);
        return lines.length * fontSize * 0.5 + (component.spacing ?? 5);
      }
      case "space":
        return component.height ?? 10;
      case "line":
        return component.spacing ?? 5;
      case "list": {
        const fontSize = component.fontSize || 12;
        const itemSpacing = component.itemSpacing ?? 3;
        let total = 0;
        (component.items || []).forEach((item: any) => {
          this.doc.setFontSize(fontSize);
          const lines = this.doc.splitTextToSize(item, this.contentWidth - 10);
          total += lines.length * fontSize * 0.5 + itemSpacing;
        });
        return total + (component.spacing ?? 5);
      }
      case "table": {
        const rowHeight = 10;
        const rows = (component.data?.length || 0) + (component.headers ? 1 : 0);
        return rows * rowHeight + (component.spacing ?? 10);
      }
      default:
        return 10;
    }
  }

  renderHeading(component: HeadingComponent) {
    const fontSizes = { 1: 20, 2: 16, 3: 14, 4: 12 };
    const fontSize = component.fontSize || fontSizes[(component.level as 1 | 2 | 3 | 4) || 2];
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(component.text, this.margins.left, this.currentY);
    const height = this.calculateComponentHeight(component);
    this.currentY += height;
    return height;
  }

  renderParagraph(component: ParagraphComponent) {
    const fontSize = component.fontSize || 12;
    const align = component.align || "left";
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(0, 0, 0);
    const lines = this.doc.splitTextToSize(component.text, this.contentWidth);
    this.doc.text(lines, this.margins.left, this.currentY, { align });
    const height = this.calculateComponentHeight(component);
    this.currentY += height;
    return height;
  }

  renderSpace(component: SpaceComponent) {
    const height = component.height || 5;
    this.currentY += height;
    return height;
  }

  renderLine(component: LineComponent) {
    const color = component.color || [0, 0, 0];
    const r = color[0] ?? 0;
    const g = color[1] ?? 0;
    const b = color[2] ?? 0;
    this.doc.setDrawColor(r, g, b);
    this.doc.setLineWidth(component.width ?? 0.5);
    this.doc.line(this.margins.left, this.currentY, this.pageWidth - this.margins.right, this.currentY);
    const height = component.spacing ?? 5;
    this.currentY += height;
    return height;
  }

  renderList(component: ListComponent) {
    const fontSize = component.fontSize || 12;
    const itemSpacing = component.itemSpacing || 3;
    const listType = component.listType || "bullet";
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(0, 0, 0);
    (component.items || []).forEach((item: string, idx: number) => {
      const prefix = listType === "number" ? `${idx + 1}. ` : "• ";
      const text = prefix + item;
      const lines = this.doc.splitTextToSize(text, this.contentWidth - 10);
      this.doc.text(lines, this.margins.left + 5, this.currentY);
      this.currentY += lines.length * fontSize * 0.5 + itemSpacing;
    });
    const spacing = component.spacing || 5;
    this.currentY += spacing;
    return this.calculateComponentHeight(component);
  }

  renderTable(component: TableComponentForPdf) {
    const startY = this.currentY;
    const headerColor: [number, number, number] = (component.headerColor as [number, number, number]) || [41, 128, 185];
    autoTable(this.doc, {
      head: component.headers ? [component.headers] : undefined,
      body: component.data || [],
      startY: this.currentY,
      theme: component.theme || "striped",
      headStyles: {
        fillColor: headerColor || [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      margin: { left: this.margins.left, right: this.margins.right }
    });
    const finalY = (this.doc as any).lastAutoTable?.finalY || this.currentY;
    this.currentY = finalY + (component.spacing || 10);
    return this.currentY - startY;
  }

  renderComponent(component: ComponentProps) {
    switch (component.type) {
      case "heading":
        return this.renderHeading(component as HeadingComponent);
      case "paragraph":
        return this.renderParagraph(component as ParagraphComponent);
      case "space":
        return this.renderSpace(component as SpaceComponent);
      case "line":
        return this.renderLine(component as LineComponent);
      case "list":
        return this.renderList(component as ListComponent);
      case "table":
        return this.renderTable(component as TableComponentForPdf);
      default:
        return 0;
    }
  }

  private parseHeadersFooters(sections: any) {
    const result: any = {};

    if (sections.firstPageHeader?.length > 0) {
      const section = sections.firstPageHeader[0];
      if (section.active) {
        const declaredMM = section.height ? this.convertToMM(section.height, section.unit || "mm") : 40;
        const parsedItems = this.parseCanvasData(section.canvasData);
        result.firstPageHeader = {
          type: "pageHeader",
          items: parsedItems,
          height: this.computeUsedHeightForSection(parsedItems, declaredMM),
          pageNumbers: [1]
        };
      }
    }

    if (sections.defaultHeader?.length > 0) {
      const section = sections.defaultHeader[0];
      const isActive =  section.active;
      if (isActive) {
        const declaredMM = section.height ? this.convertToMM(section.height, section.unit) : 30;
        const parsedItems = this.parseCanvasData(section.canvasData);
        result.defaultHeader = {
          type: "pageHeader",
          items: parsedItems,
          height: this.computeUsedHeightForSection(parsedItems, declaredMM)
        };
      }
    }

    if (sections.lastPageHeader?.length > 0) {
      const section = sections.lastPageHeader[0];
      const isActive = section.active;
      if (isActive) {
        const declaredMM = section.height ? this.convertToMM(section.height, section.unit) : 25;
        const parsedItems = this.parseCanvasData(section.canvasData);
        result.lastPageHeader = {
          type: "pageHeader",
          items: parsedItems,
          height: this.computeUsedHeightForSection(parsedItems, declaredMM),
          pageNumbers: [-1]
        };
      }
    }

    if (sections.firstPageFooter?.length > 0) {
      const section = sections.firstPageFooter[0];
      const isActive = section.active;
      if (isActive) {
        const declaredMM = section.height ? this.convertToMM(section.height, section.unit) : 35;
        const parsedItems = this.parseCanvasData(section.canvasData);
        result.firstPageFooter = {
          type: "pageFooter",
          items: parsedItems,
          height: this.computeUsedHeightForSection(parsedItems, declaredMM),
          pageNumbers: [1]
        };
      }
    }

    if (sections.defaultFooter?.length > 0) {
      const section = sections.defaultFooter[0];
      const isActive = section.active;
      if (isActive) {
        const declaredMM = section.height ? this.convertToMM(section.height, section.unit) : 20;
        const parsedItems = this.parseCanvasData(section.canvasData);
        result.defaultFooter = {
          type: "pageFooter",
          items: parsedItems,
          height: this.computeUsedHeightForSection(parsedItems, declaredMM)
        };
      }
    }

    if (sections.lastPageFooter?.length > 0) {
      const section = sections.lastPageFooter[0];
      const isActive = section.active;
      if (isActive) {
        const declaredMM = section.height ? this.convertToMM(section.height, section.unit) : 40;
        const parsedItems = this.parseCanvasData(section.canvasData);
        result.lastPageFooter = {
          type: "pageFooter",
          items: parsedItems,
          height: this.computeUsedHeightForSection(parsedItems, declaredMM),
          pageNumbers: [-1]
        };
      }
    }

    return result;
  }

  private getHeaderForPage(pageNum: number, totalPages: number, headers: any) {
    if (pageNum === 1 && headers.firstPageHeader) return headers.firstPageHeader;
    if (pageNum === totalPages && headers.lastPageHeader) return headers.lastPageHeader;
    if (headers.defaultHeader) return headers.defaultHeader;
    return null;
  }

  private getFooterForPage(pageNum: number, totalPages: number, footers: any) {
    if (pageNum === 1 && footers.firstPageFooter) return footers.firstPageFooter;
    if (pageNum === totalPages && footers.lastPageFooter) return footers.lastPageFooter;
    if (footers.defaultFooter) return footers.defaultFooter;
    return null;
  }

  private addPageNumber(pageNum: number, totalPages: number) {
   
    const y = this.pageHeight - this.margins.bottom + 4 - (this.footerHeight ?? 0);
    this.doc.setFontSize(9);
    this.doc.setTextColor(120);
    this.doc.text(`Page ${pageNum} of ${totalPages}`, this.pageWidth / 2, y, { align: "center" });
  }

  private getCertificateDataForPDF(worksheet: WorksheetStateType): ComponentProps[] {
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

  private async renderContentInPhases(
    certificateComponents: ComponentProps[],
    worksheetComponents: ComponentProps[],
    parsedHeaders: any,
    parsedFooters: any,
    options: GenerateOptions
  ) {
   
    this.updateLayoutDimensions();
    this.currentY = this.margins.top + (this.headerHeight ?? 0) + 5;

    const totalCertificateComponents = certificateComponents.length;
    const totalComponents = totalCertificateComponents + worksheetComponents.length;

    for (let i = 0; i < totalCertificateComponents; i++) {
      const component = certificateComponents[i];
      if (!component) continue;
      const requiredHeight = this.calculateComponentHeight(component);
      const willExceed = this.currentY + requiredHeight > this.usableBottom - 5;
      if (willExceed) {
        this.addNewPage(parsedHeaders, parsedFooters);
      }
      this.renderComponent(component);
      if (options.onProgress) options.onProgress(((i + 1) / totalComponents) * 100);
    }

   
    if (worksheetComponents.length > 0) {
      this.addNewPage(parsedHeaders, parsedFooters);
      for (let i = 0; i < worksheetComponents.length; i++) {
        const component = worksheetComponents[i];
         if (!component) continue;
        const requiredHeight = this.calculateComponentHeight(component);
        const willExceed = this.currentY + requiredHeight > this.usableBottom - 5;
        if (willExceed && i < worksheetComponents.length - 1) {
          this.addNewPage(parsedHeaders, parsedFooters);
        }
        this.renderComponent(component);
        if (options.onProgress) {
          const progress = ((totalCertificateComponents + i + 1) / totalComponents) * 100;
          options.onProgress(progress);
        }
      }
    }
  }
 
  private addNewPage(parsedHeaders: any, parsedFooters: any) {
    this.doc.addPage();
   
    const defaultHeader = parsedHeaders.defaultHeader;
    const defaultFooter = parsedFooters.defaultFooter;
    this.headerHeight = defaultHeader?.height ?? 0;
    this.footerHeight = defaultFooter?.height ?? 0;
    this.updateLayoutDimensions();
    this.currentY = this.margins.top + this.headerHeight;
  }

  preview() {
    const blob = this.doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  download(filename = "document.pdf") {
    this.doc.save(filename);
  }

  getBlob() {
    return this.doc.output("blob");
  }

  private getContentComponentsFromTemplate(template: TemplateType, work?: WorkType): ComponentProps[] {
    const components: ComponentProps[] = [];
    if (!template.certificateConfig?.contents) return components;
    const contents = template.certificateConfig.contents.sort((a, b) => a.order - b.order);

    for (const content of contents) {
      switch (content.componentType) {
        case "Custom Field":
          if (content.customField) {
            components.push({
              type: "heading",
              text: content.customField.fieldValue,
              level: 2,
              align: "center",
              spacing: 10
            } as any);
          }
          break;
        case "Customer and Instrument Details":
          if (content.customerAndInstrumentDetails) {
            const details = content.customerAndInstrumentDetails;
            const activeFields = Object.entries(details.fields)
              .filter(([_, field]) => field.isActive)
              .sort((a, b) => a[1].order - b[1].order);
            const tableData: any[][] = [];
            const cols = details.noOfColumns || 2;
            for (let i = 0; i < activeFields.length; i += cols) {
              const row: any[] = [];
              for (let j = 0; j < cols; j++) {
                const element = activeFields[i + j];
                if (element) {
                  const [label, field] = element;
                  row.push(label);
                  row.push(String(field.value || "N/A"));
                }
              }
              tableData.push(row);
            }
            components.push({ type: "space", height: 5 } as any);
            components.push({ type: "table", data: tableData, theme: "grid", spacing: 10 } as any);
          }
          break;
        case "Reference Instrument":
          if (content.referenceInstrument) {
            const refInst = content.referenceInstrument;
            if (refInst.title) {
              components.push({ type: "heading", text: refInst.title, level: 3, spacing: 8 } as any);
            }
            const activeFields = Object.entries(refInst.fields)
              .filter(([_, field]) => field.isActive)
              .sort((a, b) => a[1].order - b[1].order);
            const headers = activeFields.map(([key]) => key.replace(/([A-Z])/g, " $1").trim());
            const data = [activeFields.map(([_, field]) => String(field.value || "N/A"))];
            components.push({ type: "table", headers, data, theme: "striped", spacing: 10 } as any);
          }
          break;
        case "Calibration Data":
          if (content.calibrationData || work) {
            const workData = content.calibrationData || work;
            components.push({ type: "heading", text: "Calibration Data", level: 3, spacing: 8 } as any);
            if (workData?.calibrations) {
              const headers = ["Type", "Start Date", "End Date", "Status"];
              const data = workData.calibrations.map((cal: any) => [
                cal.type,
                new Date(cal.startDate).toLocaleDateString(),
                new Date(cal.endDate).toLocaleDateString(),
                cal.passed ? "Passed" : "Failed"
              ]);
              components.push({ type: "table", headers, data, theme: "striped", spacing: 10 } as any);
            }
          }
          break;
        case "Image":
          components.push({ type: "space", height: 10 } as any);
          break;
      }
    }
    return components;
  }

  async generateCertificateFromTemplate(template: TemplateType, work?: WorkType, calibration?: WorksheetStateType, options: GenerateOptions = {}) {
    if (!template.certificateConfig) throw new Error("No certificate config found in template");
    const config = template.certificateConfig;

   
    if (config.margin) {
      this.margins = {
        top: (config.margin.top ?? this.margins.top),
        right: (config.margin.right ?? this.margins.right),
        bottom: (config.margin.bottom ?? this.margins.bottom),
        left: (config.margin.left ?? this.margins.left)
      };
      this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
    }

   
    const parsedHeaders = this.parseHeadersFooters(config.headers ?? {});
    const parsedFooters = this.parseHeadersFooters(config.footers ?? {});

   
    const firstPageHeader = parsedHeaders.firstPageHeader ?? parsedHeaders.defaultHeader;
    const firstPageFooter = parsedFooters.firstPageFooter ?? parsedFooters.defaultFooter;
    this.headerHeight = firstPageHeader?.height ?? 0;
    this.footerHeight = firstPageFooter?.height ?? 0;
    this.updateLayoutDimensions();

   
    const certificateComponents = this.getContentComponentsFromTemplate(template, work);
    let worksheetComponents: ComponentProps[] = [];
    if (calibration) worksheetComponents = this.getCertificateDataForPDF(JSON.parse(JSON.stringify(calibration)));

   
    await this.renderContentInPhases(certificateComponents, worksheetComponents, parsedHeaders, parsedFooters, options);

   
    const totalPages = this.doc.getNumberOfPages();
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      this.doc.setPage(pageNum);
      const header = this.getHeaderForPage(pageNum, totalPages, parsedHeaders);
      if (header) {
       
        await this.renderPageHeader(header, pageNum, totalPages);
      }
      const footer = this.getFooterForPage(pageNum, totalPages, parsedFooters);
      if (footer) {
        await this.renderPageFooter(footer, pageNum, totalPages);
      }
      if (options.addPageNumbers === true) {
        this.addPageNumber(pageNum, totalPages);
      }
    }

    return this.doc;
  }
}
