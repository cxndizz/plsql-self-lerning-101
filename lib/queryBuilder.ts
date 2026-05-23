import { getTable, getTableNames } from "./schemaStore";

export type Operator = "=" | "<>" | ">" | "<" | ">=" | "<=" | "LIKE" | "IS NULL" | "IS NOT NULL";

export const OPERATORS: Operator[] = ["=", "<>", ">", "<", ">=", "<=", "LIKE", "IS NULL", "IS NOT NULL"];

export type WhereCond = {
  column: string;
  op: Operator;
  value: string;
};

export type JoinSpec = {
  table: string;
  leftCol: string;
  rightCol: string;
  kind: "INNER" | "LEFT";
};

export type SelectState = {
  fromTable: string;
  columns: string[];
  join: JoinSpec | null;
  where: WhereCond[];
  orderBy: { column: string; dir: "ASC" | "DESC" } | null;
  limit: number | null;
};

export type InsertState = {
  table: string;
  values: Record<string, string>;
};

export type UpdateState = {
  table: string;
  sets: { column: string; value: string }[];
  where: WhereCond[];
};

export type DeleteState = {
  table: string;
  where: WhereCond[];
};

export const initialUpdate: UpdateState = {
  table: "employees",
  sets: [{ column: "salary", value: "50000" }],
  where: [{ column: "emp_id", op: "=", value: "1" }],
};

export const initialDelete: DeleteState = {
  table: "employees",
  where: [{ column: "emp_id", op: "=", value: "7" }],
};

export const initialSelect = (table = "employees"): SelectState => ({
  fromTable: table,
  columns: [],
  join: null,
  where: [],
  orderBy: null,
  limit: null,
});

function quoteValue(v: string, op: Operator): string {
  if (op === "IS NULL" || op === "IS NOT NULL") return "";
  const isNumeric = !isNaN(Number(v)) && v.trim() !== "";
  if (isNumeric && op !== "LIKE") return v;
  return `'${v.replace(/'/g, "''")}'`;
}

function buildWhere(where: WhereCond[]): string {
  if (where.length === 0) return "";
  const parts = where.map((w) => {
    if (w.op === "IS NULL" || w.op === "IS NOT NULL") return `${w.column} ${w.op}`;
    return `${w.column} ${w.op} ${quoteValue(w.value, w.op)}`;
  });
  return `\nWHERE ${parts.join("\n  AND ")}`;
}

export function buildSelect(q: SelectState): string {
  const cols = q.columns.length === 0 ? "*" : q.columns.join(", ");
  let sql = `SELECT ${cols}\nFROM ${q.fromTable}`;
  if (q.join) {
    sql += `\n${q.join.kind} JOIN ${q.join.table} ON ${q.join.leftCol} = ${q.join.rightCol}`;
  }
  sql += buildWhere(q.where);
  if (q.orderBy) sql += `\nORDER BY ${q.orderBy.column} ${q.orderBy.dir}`;
  if (q.limit && q.limit > 0) sql += `\nLIMIT ${q.limit}`;
  return sql + ";";
}

export function buildInsert(q: InsertState): string {
  const tbl = getTable(q.table);
  if (!tbl) return "";
  const cols = tbl.columns.map((c) => c.name);
  const vals = cols.map((c) => {
    const raw = q.values[c] ?? "";
    if (raw === "" || raw.toUpperCase() === "NULL") return "NULL";
    const isNumeric = !isNaN(Number(raw)) && raw.trim() !== "";
    return isNumeric ? raw : `'${raw.replace(/'/g, "''")}'`;
  });
  return `INSERT INTO ${q.table} (${cols.join(", ")})\nVALUES (${vals.join(", ")});`;
}

export function buildUpdate(q: UpdateState): string {
  const sets = q.sets
    .filter((s) => s.column)
    .map((s) => {
      const v = s.value;
      if (v === "" || v.toUpperCase() === "NULL") return `${s.column} = NULL`;
      const isNumeric = !isNaN(Number(v)) && v.trim() !== "";
      return `${s.column} = ${isNumeric ? v : `'${v.replace(/'/g, "''")}'`}`;
    });
  let sql = `UPDATE ${q.table}\nSET ${sets.join(", ")}`;
  sql += buildWhere(q.where);
  return sql + ";";
}

export function buildDelete(q: DeleteState): string {
  let sql = `DELETE FROM ${q.table}`;
  sql += buildWhere(q.where);
  return sql + ";";
}

export type ExplainPart = { clause: string; thai: string };

export function explainSelect(q: SelectState): ExplainPart[] {
  const out: ExplainPart[] = [];
  const tbl = getTable(q.fromTable);
  if (q.columns.length === 0) out.push({ clause: "SELECT *", thai: "เลือก ทุกคอลัมน์" });
  else out.push({ clause: `SELECT ${q.columns.join(", ")}`, thai: `เลือก: ${q.columns.join(", ")}` });
  out.push({ clause: `FROM ${q.fromTable}`, thai: `จาก "${tbl?.thaiName ?? q.fromTable}"` });
  if (q.join) {
    out.push({
      clause: `${q.join.kind} JOIN ${q.join.table}`,
      thai: `${q.join.kind === "LEFT" ? "เอาฝั่งซ้ายทั้งหมด ไม่เจอใส่ NULL" : "เอาเฉพาะที่จับคู่ได้"} ON ${q.join.leftCol} = ${q.join.rightCol}`,
    });
  }
  if (q.where.length > 0) {
    const txt = q.where
      .map((w) => {
        if (w.op === "IS NULL") return `${w.column} เป็น NULL`;
        if (w.op === "IS NOT NULL") return `${w.column} ไม่เป็น NULL`;
        if (w.op === "LIKE") return `${w.column} คล้าย "${w.value}"`;
        return `${w.column} ${w.op} ${w.value}`;
      })
      .join(" และ ");
    out.push({ clause: "WHERE ...", thai: `กรอง: ${txt}` });
  }
  if (q.orderBy)
    out.push({
      clause: `ORDER BY ${q.orderBy.column} ${q.orderBy.dir}`,
      thai: `เรียง ${q.orderBy.column} ${q.orderBy.dir === "ASC" ? "น้อย→มาก" : "มาก→น้อย"}`,
    });
  if (q.limit) out.push({ clause: `LIMIT ${q.limit}`, thai: `เอาแค่ ${q.limit} แถวแรก` });
  return out;
}

export function availableColumns(q: SelectState): string[] {
  const cols: string[] = [];
  const main = getTable(q.fromTable);
  main?.columns.forEach((c) => cols.push(c.name));
  if (q.join) {
    const j = getTable(q.join.table);
    j?.columns.forEach((c) => cols.push(c.name));
  }
  return Array.from(new Set(cols));
}

export { getTableNames };
