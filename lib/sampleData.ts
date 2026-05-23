export type OracleType =
  | "VARCHAR2"
  | "CHAR"
  | "NUMBER"
  | "INTEGER"
  | "DATE"
  | "TIMESTAMP"
  | "CLOB"
  | "BLOB"
  | "BOOLEAN";

export type ColumnDef = {
  name: string;
  type: OracleType;
  length?: number | null;
  precision?: number | null;
  scale?: number | null;
  nullable: boolean;
  pk?: boolean;
  unique?: boolean;
  defaultValue?: string | null;
  fk?: { table: string; column: string } | null;
  thaiDesc?: string;
};

export type TableSchema = {
  name: string;
  thaiName: string;
  emoji: string;
  columns: ColumnDef[];
  rows: Record<string, unknown>[];
};

export const SEED_TABLES: TableSchema[] = [
  {
    name: "employees",
    thaiName: "พนักงาน",
    emoji: "👤",
    columns: [
      { name: "emp_id", type: "NUMBER", precision: 6, nullable: false, pk: true, thaiDesc: "รหัสพนักงาน" },
      { name: "first_name", type: "VARCHAR2", length: 50, nullable: false, thaiDesc: "ชื่อ" },
      { name: "last_name", type: "VARCHAR2", length: 50, nullable: true, thaiDesc: "นามสกุล" },
      { name: "dept_id", type: "NUMBER", precision: 4, nullable: true, fk: { table: "departments", column: "dept_id" }, thaiDesc: "รหัสแผนก" },
      { name: "salary", type: "NUMBER", precision: 10, scale: 2, nullable: true, defaultValue: "0", thaiDesc: "เงินเดือน" },
      { name: "hire_date", type: "DATE", nullable: false, defaultValue: "SYSDATE", thaiDesc: "วันที่เริ่มงาน" },
    ],
    rows: [
      { emp_id: 1, first_name: "สมชาย", last_name: "ใจดี", dept_id: 10, salary: 35000, hire_date: "2020-01-15" },
      { emp_id: 2, first_name: "สุดา", last_name: "วงศ์ไทย", dept_id: 20, salary: 52000, hire_date: "2019-06-01" },
      { emp_id: 3, first_name: "ภาคิน", last_name: "ศรีสุข", dept_id: 10, salary: 28000, hire_date: "2022-03-10" },
      { emp_id: 4, first_name: "พิมพ์", last_name: "ทองดี", dept_id: 30, salary: 75000, hire_date: "2018-11-20" },
      { emp_id: 5, first_name: "ธนา", last_name: "ก้องเกียรติ", dept_id: 20, salary: 48000, hire_date: "2021-08-05" },
      { emp_id: 6, first_name: "อรอนงค์", last_name: "ฉัตรชัย", dept_id: 30, salary: 62000, hire_date: "2020-09-12" },
      { emp_id: 7, first_name: "ภูมิ", last_name: "สว่างวงศ์", dept_id: null, salary: 30000, hire_date: "2023-02-01" },
    ],
  },
  {
    name: "departments",
    thaiName: "แผนก",
    emoji: "🏢",
    columns: [
      { name: "dept_id", type: "NUMBER", precision: 4, nullable: false, pk: true, thaiDesc: "รหัสแผนก" },
      { name: "dept_name", type: "VARCHAR2", length: 30, nullable: false, unique: true, thaiDesc: "ชื่อแผนก" },
      { name: "location", type: "VARCHAR2", length: 50, nullable: true, thaiDesc: "ที่ตั้ง" },
    ],
    rows: [
      { dept_id: 10, dept_name: "IT", location: "กรุงเทพ" },
      { dept_id: 20, dept_name: "Sales", location: "เชียงใหม่" },
      { dept_id: 30, dept_name: "HR", location: "กรุงเทพ" },
      { dept_id: 40, dept_name: "Finance", location: "ขอนแก่น" },
    ],
  },
  {
    name: "projects",
    thaiName: "โครงการ",
    emoji: "📋",
    columns: [
      { name: "project_id", type: "NUMBER", precision: 6, nullable: false, pk: true, thaiDesc: "รหัสโครงการ" },
      { name: "project_name", type: "VARCHAR2", length: 100, nullable: false, thaiDesc: "ชื่อโครงการ" },
      { name: "dept_id", type: "NUMBER", precision: 4, nullable: true, fk: { table: "departments", column: "dept_id" }, thaiDesc: "แผนกที่รับผิดชอบ" },
      { name: "budget", type: "NUMBER", precision: 12, scale: 2, nullable: true, defaultValue: "0", thaiDesc: "งบประมาณ" },
    ],
    rows: [
      { project_id: 101, project_name: "ระบบ ERP", dept_id: 10, budget: 1500000 },
      { project_id: 102, project_name: "Campaign Q1", dept_id: 20, budget: 800000 },
      { project_id: 103, project_name: "อบรมพนักงานใหม่", dept_id: 30, budget: 250000 },
    ],
  },
];

export function formatType(c: ColumnDef): string {
  switch (c.type) {
    case "VARCHAR2":
    case "CHAR":
      return `${c.type}(${c.length ?? 50})`;
    case "NUMBER":
      if (c.precision && c.scale) return `NUMBER(${c.precision},${c.scale})`;
      if (c.precision) return `NUMBER(${c.precision})`;
      return "NUMBER";
    default:
      return c.type;
  }
}

/** Convert Oracle type → alasql-compatible storage hint */
export function toAlasqlType(c: ColumnDef): string {
  switch (c.type) {
    case "VARCHAR2":
    case "CHAR":
    case "CLOB":
      return "VARCHAR";
    case "NUMBER":
    case "INTEGER":
      return "NUMBER";
    case "DATE":
    case "TIMESTAMP":
      return "DATE";
    case "BOOLEAN":
      return "INT";
    case "BLOB":
      return "VARCHAR";
    default:
      return "VARCHAR";
  }
}
