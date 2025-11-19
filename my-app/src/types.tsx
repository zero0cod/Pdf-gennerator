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
  type: "text" | "image" | "line" | "rect" | "circle" | "path";
  text?: string;
  src?: string;           // image URL/base64
  x?: number;             // x position (optional)
  y?: number;             // y position (optional)
  width?: number;
  height?: number;
  fontSize?: number;
  bold?: boolean;
  align?: "left" | "center" | "right";
  color?: [number, number, number];
  fill?: [number, number, number];
  stroke?: [number, number, number];
  x1?: number;            // for line
  y1?: number;            // for line
  x2?: number;            // for line
  y2?: number;            // for line
  strokeWidth?: number;  // for line
  radius?: number;       // for circle
  path?: string;         // for custom shapes
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


export interface ProcedureType {
  procedureName: string;
  procedureNo: string;
  paperProcedureNo?: string;
  isActive: boolean;
  issueNo?: string;
  issueDate?: string;
  temperature?: string;
  humidity?: string;
  internationalStandardsUsed?: string;
  preparedBy?: string;
  approvedBy?: string;
  ammendmentNo?: string;
  amendmentDate?: string;
  approvedDate?: string;
  revisionRemark?: string;
  attachments?: string[];
  certificateApprovers: string[];
  assignedTo?: string[];
  worksheetData: WorksheetStateType[];
}

export interface CalibrationType {
  type: "As Found" | "As Left";
  procedure: ProcedureType;
  startDate: string;
  endDate: string;
  calibrationTime: string;
  passed: boolean;
  showInCertificate: boolean;
  status: "To Do" | "In Progress" | "Done";
}

export type CertificateTypeEnum = "Supplementary" | "Superseding" | "Revision";
export type WorkTypeEnum =
  | "At Lab"
  | "Sub Con"
  | "Customer Place"
  | "On Site"
  | "In House";

export interface WorkType {
  customer: string;
  asset: string;
  procedure: string;

  startDate?: string;
  finishDate?: string;
  dueDate?: string;

  isSalesOrderNoAvailable: boolean;
  orderNo?: string;
  workNo: string;
  workType: WorkTypeEnum;
  accreditation: any;
  workStatus: "To Do" | "In Progress" | "Done";
  remarks?: string;
  comments?: string[];
  certificate?: {
    certificateIssuedTo: string;
    certificateType: CertificateTypeEnum;
    certificateAddress: string;
    certificateTemplate: string;
    certificateUrl: string;
    certificateNo: string;
  };
  calibrations?: CalibrationType[];
  attachments?: string[];
}

export type AssetType = CustomerAsset | ReferenceAsset;
export interface BaseAssetType {
  assetName: string;
  make: string;
  model: string;
  range: string;
  assetType: string;
  isReference: boolean;
  serialNo: string;
  tagNo?: string;
  assetImages?: string[];
  assetRemarks: string;
  calibrationFrequency: string;
  lastCalibratedDate?: string;
  calibrationDueDate?: string;
}
export interface CustomerAsset extends BaseAssetType {
  customerId: string;
  customer?: CustomerType;
  assetStatus?: string;
  lastReceivedDate?: string;
  lastDeliveredDate?: string;
}

export interface ReferenceAsset extends BaseAssetType {
  referenceWorksheetId?: string;
  referenceWorksheet?: WorksheetStateType | null;
  verificationDueDate?: string;
  certificateUrl?: string;
  isActive?: boolean;
  certificateNo?: string;
  traceability?: string;
  certificateAgency?: string;
}


export interface CustomerType {
  customerName: string;
  customerEmail: string;
  displayName?: string;
  contactPersonNumber?: string;
  additionalDetails?: string;
  customerSpecificRequirement?: string;
  primaryAddress?: string;
  parentCompany?: string;
  childCompanies?: string;
  contactPersonName?: string;
  customerCurrency?: string;
  website?: string;
  attachments?: any[];
  addresses: any[];
  availableWorkspaces: string[];
}

export type TemplateTypeEnum = "Sticker" | "Certificate";
export type certificateDimensionUnit = "in" | "mm" | "cm" | "px";

export interface HeaderSection {
  height: number;
  unit: certificateDimensionUnit;
  pageType:  | "firstPage"
  | "lastPage"
  | "default";
  canvasData: string;
  active: boolean;
}


export interface CertificateConfig {
  format: "A4" | "Custom" | "A5";
  dimensions: {
    width: number;
    height: number;
    unit: "in" | "mm" | "cm" | "px";
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isTemplateBilingual: boolean;
  work?: WorkType;

  headers: {
    firstPageHeader: HeaderSection[];
    lastPageHeader: HeaderSection[];
    defaultHeader: HeaderSection[];
  };
  footers: {
    firstPageFooter: FooterSection[];
    lastPageFooter: FooterSection[];
    defaultFooter: FooterSection[];
  };
  contents: CertificateContent[];
}

export type CertificateContentComponentType =
  | "Custom Field"
  | "Reference Instrument"
  | "Calibration Data"
  | "Customer and Instrument Details"
  | "Image";

export interface CustomField {
  id: string;
  fieldLabel: string;
  fieldValue: string;
}

export type ReferenceInstrumentColumn =
  | "equipmentName"
  | "serialNumber"
  | "traceability"
  | "certificateNumber"
  | "calibrationDueOn"
  | "companyName"
  | "recommendedDue"
  | "companyEmail";

export interface ReferenceInstrument {
  title?: string;
  nextLevelOfmasterInstrument?: boolean;
  fields: Record<
    ReferenceInstrumentColumn,
    {
      isActive: boolean;
      order: number;
      value?: string | number | Date | null;
    }
  >;
}
export interface CertificateContent {
  order: number;
  componentType: CertificateContentComponentType;
  calibrationData?: WorkType;
  customField?: CustomField;
  referenceInstrument?: ReferenceInstrument;
  customerAndInstrumentDetails?: CustomerAndInstrumentDetails;
}
export type CustomerAndInstrumentDetailsColumn =
  | "Customer name and Address"
  | "Received Date"
  | "Calibrated Date"
  | "Calibration Due On"
  | "Location"
  | "Data Type"
  | "As Found Condition"
  | "As Left Condition"
  | "Temperature"
  | "Date of Issue"
  | "Instrument Type"
  | "Instrument Manufacturer"
  | "Instrument Model Number"
  | "Instrument Serial Number"
  | "Instrument Tag Number"
  | "Humidity";
export interface CustomerAndInstrumentDetails {
  noOfColumns: number;
  fields: Record<
    CustomerAndInstrumentDetailsColumn,
    {
      isActive: boolean;
      order: number;
      value?: string | number | Date | null;
    }
  >;
}
export interface FooterSection {
  height: number;
  unit: certificateDimensionUnit;
  pageType:   | "firstPage"
  | "lastPage"
  | "default";
  canvasData: string;
  active: boolean;
}

export interface TemplateType {
  name: string;
  templateType: TemplateTypeEnum;
  stickerConfig?: any;
  certificateConfig?: CertificateConfig;
}