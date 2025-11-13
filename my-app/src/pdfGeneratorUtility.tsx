// ============================================
// PDF GENERATOR UTILITY CLASS
// ============================================

import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

import type { ComponentProps, ParagraphComponent ,LineComponent,TableComponentForPdf, ListComponent, GenerateOptions, SpaceComponent, PageHeaderOrFooterComponent, HeadingComponent } from "./types";


export class PDFGenerator {
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
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margins = { top: 20, right: 20, bottom: 20, left: 20 };
    this.contentWidth = this.pageWidth - this.margins.left - this.margins.right;
    this.contentHeight =
      this.pageHeight - this.margins.top - this.margins.bottom;
    this.currentY = this.margins.top;
    this.headerHeight = 40;
    this.footerHeight = 40;
    this.usableBottom =  this.pageHeight - this.margins.bottom - (this.footerHeight ?? 0);
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

  needsNewPage(requiredHeight: number) {
    return this.currentY + requiredHeight > this.pageHeight - this.margins.bottom;
  }

  addNewPage() {
    this.doc.addPage();
    this.currentY = this.margins.top;
  }


  /** Robust async image loader that accepts dataURLs or remote URLs.
 *  - loads remote images with crossOrigin='Anonymous' and draws to a canvas
 *  - converts to dataURL and calls doc.addImage
 *  - never throws — falls back to drawing a placeholder
 */

  async addImage(src: string, x: number, y: number, w: number, h: number) {
  // small helper to draw a visible placeholder rectangle + centered text
  const drawPlaceholder = () => {
    // stroke rect
    this.doc.setDrawColor(150);
    this.doc.setLineWidth(0.6);
    this.doc.rect(x, y, w, h); // stroke by default

    // label
    const label = "No Image";
    const fontSize = 8;
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", "normal");
    // compute a Y offset because some jspdf builds ignore baseline: 'middle'
    // approximate vertical centering by adding ~0.35 * fontSize
    const textY = y + h / 2 + fontSize * 0.35;
    this.doc.text(label, x + w / 2, textY, { align: "center" });
  };

  if (!src) {
    drawPlaceholder();
    return;
  }

  // If already a data URL — try to add directly and fall back on failure
  if (src.startsWith("data:")) {
    try {
      this.doc.addImage(src, "PNG", x, y, w, h);
      return;
    } catch (err) {
      console.warn("addImage(dataURL) failed:", err);
      drawPlaceholder();
      return;
    }
  }

  // For remote URLs: attempt to load and convert to dataURL
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // attempt CORS — server must allow it

    const onError = (ev?: any) => {
      console.warn("Image load failed:", src, ev);
      drawPlaceholder();
      resolve();
    };

    img.onload = () => {
      try {
        // create offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 1;
        canvas.height = img.naturalHeight || img.height || 1;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D context unavailable");
        ctx.drawImage(img, 0, 0);

        // convert to dataURL (may throw if canvas is tainted by CORS)
        const dataUrl = canvas.toDataURL("image/png");
        try {
          this.doc.addImage(dataUrl, "PNG", x, y, w, h);
        } catch (err) {
          console.warn("doc.addImage failed with dataUrl, drawing placeholder:", err);
          drawPlaceholder();
        }
        resolve();
      } catch (err) {
        console.warn("Error converting image to dataURL:", err);
        drawPlaceholder();
        resolve();
      }
    };

    img.onerror = onError;

    // start load (cache may make it complete immediately)
    img.src = src;

    // handle cached-complete case
    if (img.complete && img.naturalWidth) {
      // allow onload to proceed
      setTimeout(() => {
        if (img.naturalWidth) img.onload?.(new Event("load") as any);
        else onError();
      }, 0);
    }

    // Safety timeout: if neither onload nor onerror fires (rare), draw placeholder after 5s
    setTimeout(() => {
      // If neither loaded nor errored in 5s, give up
      if (!img.complete) {
        console.warn("Image load timed out:", src);
        drawPlaceholder();
        resolve();
      }
    }, 5000);
  });
}


  renderComponent(component: ComponentProps) {
    switch (component.type) {
      case "heading":
        return this.renderHeading(component);
      case "paragraph":
        return this.renderParagraph(component);
      case "space":
        return this.renderSpace(component);
      case "line":
        return this.renderLine(component);
      case "list":
        return this.renderList(component);
      case "table":
        return this.renderTable(component);
      case "pageHeader":break;
      default:
        console.warn("Unknown component type:", component);
        return 0;
    }
  }
  
  renderHeading(component: HeadingComponent) {
    const fontSizes = { 1: 20, 2: 16, 3: 14, 4: 12 };
    const fontSize = component.fontSize || fontSizes[(component.level as 1 | 2 | 3 | 4) || 2];
    
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    
    this.doc.text(component.text, this.margins.left, this.currentY);
    
    const height = this.calculateComponentHeight(component);
    this.currentY += height;
    return height;
  }

  private replacePlaceholders(text: string, pageNumber?: number, totalPages?: number) {
  return String(text || "")
    .replace(/{{\s*page\s*}}/gi, pageNumber != null ? String(pageNumber) : "{{page}}")
    .replace(/{{\s*total\s*}}/gi, totalPages != null ? String(totalPages) : (totalPages === 0 ? "0" : (totalPages ?? "{{total}}")));
  }
  
/**
 * Draw text block (wrapping + align + optional vertical centering in a container)
 * Returns { height, yStart } so caller can update currentY or compute layout.
 *
 * opts:
 *  - x?: explicit x coordinate (if omitted, will be computed from align and margins)
 *  - y?: explicit y coordinate (used as start Y if container not provided)
 *  - container?: { y: number, height: number, centerVertical?: boolean }  // use this for centering
 *  - width?: number  // wrapping width; defaults to this.contentWidth - 10
 *  - fontSize?: number
 *  - bold?: boolean
 *  - align?: 'left'|'center'|'right'
 *  - lineHeightFactor?: number  // default 0.6
 *  - pageNumber?: number
 *  - totalPages?: number
 */
  addText(
    text: string,
    opts: {
      x?: number;
      y?: number;
      container?: { y: number; height: number; centerVertical?: boolean };
      width?: number;
      fontSize?: number;
      bold?: boolean;
      align?: "left" | "center" | "right";
      lineHeightFactor?: number;
      pageNumber?: number;
      totalPages?: number;
    } = {}
  ) {
    const {
      x: explicitX,
      y: explicitY,
      container,
      width = Math.max(10, this.contentWidth - 10),
      fontSize = 11,
      bold = false,
      align = "left",
      lineHeightFactor = 0.6,
      pageNumber,
      totalPages,
    } = opts;

    const raw = this.replacePlaceholders(text, pageNumber, totalPages);
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", bold ? "bold" : "normal");
    this.doc.setTextColor(0, 0, 0);

    // Split lines respecting explicit newlines and wrapping
    const explicitLines = String(raw).split("\n");
    const wrappedLines: string[] = [];
    explicitLines.forEach((l) => {
      const pieces = this.doc.splitTextToSize(String(l || ""), width) as string[];
      if (Array.isArray(pieces)) wrappedLines.push(...pieces);
      else wrappedLines.push(String(pieces));
    });

    const lines = wrappedLines;
    const lineHeight = fontSize * lineHeightFactor;
    const blockHeight = lines.length * lineHeight;

    // Decide X coordinate
    let x: number;
    if (typeof explicitX === "number") {
      x = explicitX;
    } else {
      if (align === "center") x = this.pageWidth / 2;
      else if (align === "right") x = this.pageWidth - this.margins.right;
      else x = this.margins.left;
    }

    // Decide Y start
    let yStart: number;
    if (container) {
      if (container.centerVertical) {
        const targetCenter = container.y + container.height / 2;
        yStart = targetCenter - blockHeight / 2 + lineHeight / 2;
      } else {
        // start at container.y (top)
        yStart = container.y + lineHeight / 2;
      }
    } else if (typeof explicitY === "number") {
      yStart = explicitY;
    } else {
      // default: use currentY
      yStart = this.currentY;
    }

    // Draw each line. Use baseline 'middle' to keep vertical centering consistent
    for (let i = 0; i < lines.length; i++) {
      const lineY = yStart + i * lineHeight;
      this.doc.text(String(lines[i]), x, lineY, { align: align as any, baseline: "middle" });
    }

    return { height: blockHeight, yStart };
  }
  
 // Make renderPageHeader async and return Promise<number>
async renderPageHeader(component: PageHeaderOrFooterComponent, pageNumber: number, totalPages: number): Promise<number> {
  if (!this.doc) return this.margins.top;

  const headerY = this.margins.top;
  // you can increase this default if you need more room
  this.headerHeight = component.height ?? 40; 

  // draw header background if required
  if (component.backgroundColor) {
    const [r, g, b] = component.backgroundColor;
    this.doc.setFillColor(r, g, b);
    this.doc.rect(0, headerY - 2, this.pageWidth, this.headerHeight + 4, "F");
  }

  // track maximum Y used by header items to compute where content should start
  let maxUsedY = headerY;

  // Helper for placeholder alignment decision: if item.x is number and align is 'center' we still want center behavior for text
  const computeExplicitXForText = (item: any) => {
    if (typeof item.x === "number") return Number(item.x);
    // if no explicit x, let addText decide based on align
    return undefined;
  };

  for (const item of component.items ?? []) {
    if (item.type === "image") {
      const x = Number(item.x ?? this.margins.left);
      const y = Number(item.y ?? headerY + 5);
      const w = Number(item.width ?? 30);
      const h = Number(item.height ?? Math.max(10, this.headerHeight - 10));
      const src = item.src ?? "";

      // await image loading (addImage is async)
      await this.addImage(src, x, y, w, h);

      // extend used Y
      maxUsedY = Math.max(maxUsedY, y + h);
    } else if (item.type === "text" && item.text) {
      // If the item explicitly specifies y, use that exact Y.
      // Otherwise, use the header container and center vertically.
      const explicitY = (typeof item.y === "number") ? Number(item.y) : undefined;
      const explicitX = computeExplicitXForText(item);

      const fontSize = (item as any).fontSizePerPage?.[pageNumber] ?? item.fontSize ?? 12;
      const bold = (item as any).boldPerPage?.[pageNumber] ?? item.bold ?? false;
      const align = (item as any).align ?? "left";
      const width = (item as any).width ?? undefined;
      const lineHeightFactor = (item as any).lineHeight ?? 0.5;

      // If explicitY is provided, pass y to addText so it starts exactly there.
      // If explicitY is not provided, pass container to center vertically inside header.
      const addTextOpts: any = {
        x: explicitX,
        fontSize,
        bold,
        align,
        width,
        pageNumber,
        totalPages,
        lineHeightFactor,
      };

      if (typeof explicitY === "number") {
        addTextOpts.y = explicitY;
        // draw the text at explicit Y
        const res = this.addText(item.text, addTextOpts);
        // res.height/res.yStart may be used to update maxUsedY
        maxUsedY = Math.max(maxUsedY, (res.yStart ?? explicitY) + (res.height ?? fontSize * 0.6));
      } else {
        // center vertically within header
        addTextOpts.container = { y: headerY, height: this.headerHeight, centerVertical: true };
        const res = this.addText(item.text, addTextOpts);
        maxUsedY = Math.max(maxUsedY, (res.yStart ?? headerY) + (res.height ?? fontSize * 0.6));
      }
    }
  }

  // Ensure header bottom is at least headerY + headerHeight, but also below the lowest item we drew
  const headerBottom = Math.max(headerY + this.headerHeight, maxUsedY + 2);

  return headerBottom;
}

async renderPageFooter(
  component: PageHeaderOrFooterComponent,
  pageNumber: number,
  totalPages: number
): Promise<number> {
  if (!this.doc) return this.pageHeight - this.margins.bottom;

  // default footer height if not set
  const footerHeight = component.height ?? 40;
  const footerY = this.pageHeight - footerHeight - this.margins.bottom;

  // draw footer background if provided
  if (component.backgroundColor) {
    const [r, g, b] = component.backgroundColor;
    this.doc.setFillColor(r, g, b);
    this.doc.rect(
      0, 
      footerY - 2,
      this.pageWidth,
      footerHeight + 4,
      "F"
    );
  }

  let maxUsedY = footerY;

  const computeExplicitXForText = (item: any) => {
    if (typeof item.x === "number") return Number(item.x);
    return undefined; // allow alignment to position
  };

  for (const item of component.items ?? []) {
    if (item.type === "image") {
      const x = Number(item.x ?? this.margins.left);
      const w = Number(item.width ?? 30);
      const h = Number(item.height ?? Math.max(10, footerHeight - 10));
      const y = Number(item.y ?? footerY + (footerHeight - h) / 2);
      const src = item.src ?? "";

      await this.addImage(src, x, y, w, h);
      maxUsedY = Math.max(maxUsedY, y + h);
    }

    else if (item.type === "line") {
    const y = Number(item.y ?? (footerY + 2));
      this.doc.setLineWidth(item.width ?? 0.5);
      this.doc.line(
        this.margins.left,
        y,
        this.pageWidth - this.margins.right,
        y
      );
      maxUsedY = Math.max(maxUsedY, y + 2);
    }

    else if (item.type === "text" && item.text) {
      const explicitY = typeof item.y === "number" ? Number(item.y) : undefined;
      const explicitX = computeExplicitXForText(item);

      const fontSize = (item as any).fontSizePerPage?.[pageNumber] ?? item.fontSize ?? 10;
      const bold = (item as any).boldPerPage?.[pageNumber] ?? item.bold ?? false;
      const align = item.align ?? "center";
      const width = item.width ?? (this.contentWidth - 10);
      const lineHeightFactor = item.width ?? 0.5;

      let txt = item.text
        .replace("{pageNumber}", String(pageNumber))
        .replace("{totalPages}", String(totalPages));

      const opts: any = {
        x: explicitX,
        fontSize,
        bold,
        align,
        width,
        pageNumber,
        totalPages,
        lineHeightFactor
      };

      if (typeof explicitY === "number") {
        opts.y = explicitY;
        const res = this.addText(txt, opts);
        maxUsedY = Math.max(maxUsedY, (res.yStart ?? explicitY) + (res.height ?? fontSize * 0.6));
      } else {
        opts.container = { y: footerY, height: footerHeight, centerVertical: true };
        const res = this.addText(txt, opts);
        maxUsedY = Math.max(maxUsedY, (res.yStart ?? footerY) + (res.height ?? fontSize * 0.6));
      }
    }
  }

  const footerBottom = Math.max(footerY + footerHeight, maxUsedY + 2);
  return footerBottom;
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

  renderSpace(component:  SpaceComponent) {
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

    // ✅ Use the standalone function, passing the jsPDF instance
    autoTable(this.doc, {
      head: component.headers ? [component.headers] : undefined,
      body: component.data || [],
      startY: this.currentY,
      theme: component.theme || "striped",
      headStyles: {
        fillColor: headerColor || [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { left: this.margins.left, right: this.margins.right },
    });

    const finalY = (this.doc as any).lastAutoTable?.finalY || this.currentY;
    this.currentY = finalY + (component.spacing || 10);

    return this.currentY - startY;
  }
  updateLayoutDimensions() {
      this.contentHeight =
        this.pageHeight -
        this.margins.top -
        this.margins.bottom -
        (this.headerHeight ?? 0) -
        (this.footerHeight ?? 0);

      this.usableBottom =
        this.pageHeight - this.margins.bottom - (this.footerHeight ?? 0);
    }

  async generate(components: ComponentProps[], options: GenerateOptions) {
    const totalComponents = components.length;
    this.currentY = this.margins.top;

    const pageHeaders = components.filter(c => c.type === "pageHeader") as PageHeaderOrFooterComponent[];
    const pageFooters = components.filter(c => c.type === "pageFooter") as PageHeaderOrFooterComponent[];
    const contentComponents = components.filter(
        c => c.type !== "pageHeader" && c.type !== "pageFooter"
      );

    const totalPagesEstimate = Math.ceil(contentComponents.length / 10); // arbitrary estimate
    let currentPage = 1;

    // Render header on first page (before anything else)
    if (pageHeaders.length > 0) {
      const header = pageHeaders[0]; // assume one header type for now
      const headerBottom = await this.renderPageHeader(header, 1, totalPagesEstimate);
      this.currentY = headerBottom + 2; // start content below header
      this.headerHeight = header.height ?? (headerBottom - this.margins.top);
      this.currentY = headerBottom + 2;

    }
    if (pageFooters.length > 0) {
      const footer = pageFooters[0];
      this.footerHeight = footer.height ?? 40;
    }
    this.updateLayoutDimensions();
    // Render content
    for (let i = 0; i < contentComponents.length; i++) {
      const component = contentComponents[i];
      const requiredHeight = this.calculateComponentHeight(component);
      const willExceed = this.currentY + requiredHeight > this.usableBottom - 5;

      // check if new page is needed
      if (willExceed && i < contentComponents.length - 1) {
        this.addNewPage();
        currentPage++;

        // draw header again for new page
        if (pageHeaders.length > 0) {
          const header = pageHeaders[0];
          const headerBottom = await this.renderPageHeader(header, currentPage, totalPagesEstimate);
          this.currentY = headerBottom + 2;
        }
       
        this.updateLayoutDimensions();
        this.currentY = this.margins.top + this.headerHeight + 2;
      }

      this.renderComponent(component);

      if (options.onProgress) {
        options.onProgress(((i + 1) / totalComponents) * 100);
      }
    }

      const totalPages = (this.doc.internal as any).getNumberOfPages();

  if (options.addPageNumbers !== false) {
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      // draw footer again to ensure correct page numbers
      if (pageFooters.length > 0) {
        const footer = pageFooters[0];
        await this.renderPageFooter(footer, i, totalPages);
      }

      // add page numbering text
      this.doc.setFontSize(9);
      this.doc.setTextColor(120);
      this.doc.text(
        `Page ${i} of ${totalPages}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: "center" }
      );
    }
  }

    return this.doc;
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
}
