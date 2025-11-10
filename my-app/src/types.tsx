// types.ts

// --------------------------------------------------
// 🧩 Base component properties shared across all types
// --------------------------------------------------


declare module "jspdf" {
  interface jsPDF {
    getNumberOfPages(): number;
  }
}
export interface BaseComponent {
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  spacing?: number;
  height?: number;
  color?: number[];
  width?: number;
  theme?: string;
  headerColor?: number[];
}

// --------------------------------------------------
// 📘 Specialized component extensions
// --------------------------------------------------

// 🔹 Title Component
export interface TitleComponent extends BaseComponent {
  type: 'title';
  text: string; 
}

// 🔹 Heading Component
export interface HeadingComponent extends BaseComponent {
  type: 'heading';
  text: string;
  level?: 1 | 2 | 3 | 4;
}

// 🔹 Paragraph Component
export interface ParagraphComponent extends BaseComponent {
  type: 'paragraph';
  text: string;
}

// 🔹 Space Component
export interface SpaceComponent extends BaseComponent {
  type: 'space';
  height?: number;
}

// 🔹 Line Component
export interface LineComponent extends BaseComponent {
  type: 'line';
  width?: number;
  color?: number[];
}

// 🔹 List Component
export interface ListComponent extends BaseComponent {
  type: 'list';
  listType?: 'bullet' | 'number';
  items?: string[];
  itemSpacing?: number;
}

// 🔹 Table Component
export interface TableComponentForPdf extends BaseComponent {
  type: 'table';
  headers?: string[];
  data?: any[][];
  theme?: 'striped' | 'grid' | 'plain';
}
export interface HeaderOrFooterContent {
  type: "text" | "image" | "line";
  text?: string;
  src?: string;           // image URL/base64
  x?: number;             // x position (optional)
  y?: number;             // y position (optional)
  width?: number;
  height?: number;
  fontSize?: number;
  bold?: boolean;
  align?: "left" | "center" | "right";
}

export interface PageHeaderOrFooterComponent extends BaseComponent {
  type: "pageHeader" | "pageFooter";
  items: HeaderOrFooterContent[];     // array of header elements
  height?: number;         // default height for header band
  yOffset?: number;
  pageNumber?: number;
  pageNumbers?: number[];
  backgroundColor?: [number, number, number];
}
// --------------------------------------------------
// 🔗 Unified Type (Discriminated Union)
// --------------------------------------------------
export type ComponentProps =
  | TitleComponent
  | HeadingComponent
  | ParagraphComponent
  | SpaceComponent
  | LineComponent
  | ListComponent
  | TableComponentForPdf
  |PageHeaderOrFooterComponent;
  // Img type need to be added
  // text type need to be added

// --------------------------------------------------
// Generator Option Types
// --------------------------------------------------
export interface GenerateOptions {
  addPageNumbers?: boolean;
  onProgress?: (progress: number) => void;
}


export interface TableRow {
  key: string;
  [columnId: string]: any;
}
export interface SectionData {
  [componentId: string]: any | TableRow[];
}

export interface DataStore {
  [sectionId: string]: SectionData;
}

export type TableColumnTypeEnum = "Input" | "Select";

export interface TableColumn {
  columnType: TableColumnTypeEnum;
  tableId: string;
  columnId: string;
  columnName: string;
  defaultValue: any;
  isRequired: boolean;
  certificateVisibilityBasedonExpression: boolean;
  certificateVisibilityExpression: string;
  showInCertificate: boolean;
  isComponentDisabledOnExpression: boolean;
  disableExpression: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  order: number;
  isExpressionEnabled: boolean;
  valueExpression: string;
  isValidationEnabled: boolean;
  validationExpression?: string;
  validationMessage?: string;
  isInvalid: boolean;
  isRepeatColumn: boolean;
  repeatExpression?: string;
  baseColumnId?: string;
  inputComponent?: InputComponent;
  selectComponent?: SelectComponent;
}

export interface Section {
  sectionName: string;
  sectionId: string;
  order: number;
  worksheetId: string;
}
export interface WorksheetStateType  {
  worksheetName: string;
  assetType: string;
  type: string;
  sections: any[];
  sectionIds: string[];
  components: Component[];
  componentIds: string[];
  expressions: any;
  valueDependents: any;
  disableDependents: any;
  certificateVisibilityDependents: any;
  validationDependents: any;
  tableRowDependents: any;
  repeatDependents: any;
  data: DataStore;
  currentActiveElements: {
    section: Section | null;
    component: Component | null;
    column: TableColumn | null;
  };
  referenceWorksheets: any;
  referenceInstruments: any;
}

export type TextComponentTypeEnum = "Heading" | "Paragraph";

export const TEXT_COMPONENT_TYPE_ENUM_VALUES = [
  "Heading",
  "Paragraph",
] as const;

export type ComponentTypeEnum = "Input" | "Select" | "Table" | "Text" | "Graph";

export const COMPONENT_TYPE_ENUM_VALUES = [
  "Input",
  "Select",
  "Table",
  "Text",
  "Graph",
] as const;

export type InputComponentTypeEnum = "Text" | "Number";

export const INPUT_COMPONENT_TYPE_ENUM_VALUES = ["Text", "Number"] as const;

export interface InputComponent {
  type: InputComponentTypeEnum;
  roundingDigits: number;
}
export type SelectComponentTypeEnum =
  | "Yes or No"
  | "Reference Asset"
  | "Custom";

export const SELECT_COMPONENT_TYPE_ENUM_VALUES = [
  "Yes or No",
  "Reference Asset",
  "Custom",
] as const;
export type SelectItem = {
  key: string;
  value: string;
}

export interface SelectComponent {
  type: SelectComponentTypeEnum;
  referenceWorksheetId?: string;
  values: SelectItem[];
}
export interface TextComponent {
  type: TextComponentTypeEnum;
  heading?: string;
}
export const GRAPH_TYPE_ENUM_VALUES = ["line", "bar", "area"] as const;
export type GraphTypeEnum = (typeof GRAPH_TYPE_ENUM_VALUES)[number];
export const GRAPH_ORIENTATION_ENUM_VALUES = [
  "horizontal",
  "vertical",
] as const;
export type GraphOrientationEnum =
  (typeof GRAPH_ORIENTATION_ENUM_VALUES)[number];


export interface GraphComponent {
  graphName: string;
  graphType: GraphTypeEnum;
  orientation: GraphOrientationEnum;
  sourceTableId: string;
  xAxisColumnId: string;
  yAxisColumnId: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  useLogScaleX: boolean;
  useLogScaleY: boolean;
}
export interface ColumnGroup {
  groupId: string;
  name: string;
  columnIds: string[];
  order: number;
}
export interface TableComponent {
  tableName: string;
  showTableNameInWorksheet: boolean;
  columns: TableColumn[];
  isTableRowExpressionEnabled: boolean;
  tableRowExpression: string;
  columnGroups: ColumnGroup[];
}
export interface Component {
  sectionId: string;
  componentType: ComponentTypeEnum;
  componentId: string;
  certificateVisibilityBasedonExpression: boolean;
  certificateVisibilityExpression: string;
  showInCertificate: boolean;
  isRequired: boolean;
  defaultValue?: string;
  isComponentDisabledOnExpression: boolean;
  disableExpression: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  order: number;
  isValidationEnabled: boolean;
  validationExpression?: string;
  validationMessage?: string;
  isInvalid: boolean;
  label: string;
  isExpressionEnabled: boolean;
  valueExpression: string;
  inputComponent?: InputComponent;
  selectComponent?: SelectComponent;
  tableComponent?: TableComponent;
  textComponent?: TextComponent;
  graphComponent?: GraphComponent;
}