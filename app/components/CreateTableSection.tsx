"use client";

import { useMemo, useState } from "react";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { ColumnDef, OracleType, TableSchema, formatType } from "@/lib/sampleData";
import { addTable, getTable, useSchema } from "@/lib/schemaStore";

const TYPES: OracleType[] = ["VARCHAR2", "CHAR", "NUMBER", "INTEGER", "DATE", "TIMESTAMP", "CLOB", "BLOB", "BOOLEAN"];

function newCol(): ColumnDef {
  return { name: "", type: "VARCHAR2", length: 50, nullable: true };
}

function buildSql(table: string, emoji: string, thai: string, cols: ColumnDef[]): string {
  if (!table || cols.length === 0) return "-- กรอกชื่อตารางและเพิ่มคอลัมน์อย่างน้อย 1 อัน";
  const lines = cols.map((c) => {
    const parts: string[] = [c.name || "?", formatType(c)];
    if (!c.nullable) parts.push("NOT NULL");
    if (c.unique) parts.push("UNIQUE");
    if (c.defaultValue) parts.push(`DEFAULT ${c.defaultValue}`);
    if (c.fk) parts.push(`REFERENCES ${c.fk.table}(${c.fk.column})`);
    return "  " + parts.join(" ");
  });
  const pkCols = cols.filter((c) => c.pk).map((c) => c.name).filter(Boolean);
  if (pkCols.length > 0) lines.push(`  CONSTRAINT pk_${table} PRIMARY KEY (${pkCols.join(", ")})`);
  return `CREATE TABLE ${table} (\n${lines.join(",\n")}\n);`;
}

export function CreateTableSection() {
  const schema = useSchema();
  const [name, setName] = useState("customers");
  const [thai, setThai] = useState("ลูกค้า");
  const [emoji, setEmoji] = useState("🧑");
  const [cols, setCols] = useState<ColumnDef[]>([
    { name: "customer_id", type: "NUMBER", precision: 6, nullable: false, pk: true },
    { name: "full_name", type: "VARCHAR2", length: 100, nullable: false },
    { name: "email", type: "VARCHAR2", length: 100, nullable: true, unique: true },
    { name: "created_at", type: "DATE", nullable: false, defaultValue: "SYSDATE" },
  ]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const sql = useMemo(() => buildSql(name, emoji, thai, cols), [name, emoji, thai, cols]);

  function update(i: number, patch: Partial<ColumnDef>) {
    setCols((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  }

  function create() {
    if (!name.trim()) return setMsg({ ok: false, text: "กรอกชื่อตารางก่อน" });
    if (getTable(name)) return setMsg({ ok: false, text: `ตาราง "${name}" มีอยู่แล้ว — ลองชื่ออื่น หรือ DROP TABLE ก่อน` });
    if (cols.some((c) => !c.name.trim())) return setMsg({ ok: false, text: "มีคอลัมน์ที่ยังไม่ได้ตั้งชื่อ" });

    const t: TableSchema = { name: name.trim(), thaiName: thai || name, emoji: emoji || "📊", columns: cols, rows: [] };
    addTable(t);
    setMsg({ ok: true, text: `สร้างตาราง ${name} สำเร็จ — ดูใน Server ด้านบนได้เลย` });
  }

  return (
    <div className="space-y-5">
      <Intro
        what="CREATE TABLE คือคำสั่ง 'ออกแบบโครงตาราง' — กำหนดว่าจะมีคอลัมน์อะไรบ้าง type ไหน, กติกาอะไรบ้าง"
        why="ก่อนจะ INSERT ข้อมูลได้ ต้องมีโครงสร้างตารางก่อน — เหมือนสร้าง spreadsheet เปล่า + กำหนดหัวคอลัมน์"
        how="ระบุชื่อตาราง → list คอลัมน์ (ชื่อ + type + constraints) ทีละบรรทัด → จบด้วย ;"
        example={`CREATE TABLE customers (\n  customer_id NUMBER(6) PRIMARY KEY,\n  full_name   VARCHAR2(100) NOT NULL,\n  email       VARCHAR2(100) UNIQUE\n);`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="card">
            <h3 className="font-semibold mb-3">📐 ออกแบบตาราง</h3>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_3fr] gap-2 mb-3">
              <label className="text-xs">
                <span className="text-subtle">Emoji</span>
                <input className="input w-full" value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2} />
              </label>
              <label className="text-xs">
                <span className="text-subtle">ชื่อตาราง (ภาษาอังกฤษ)</span>
                <input
                  className="input w-full font-mono"
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                />
              </label>
              <label className="text-xs">
                <span className="text-subtle">ชื่อภาษาไทย (แสดงผล)</span>
                <input className="input w-full" value={thai} onChange={(e) => setThai(e.target.value)} />
              </label>
            </div>

            <div className="divider" />

            <div className="space-y-2">
              {cols.map((c, i) => (
                <ColumnEditor key={i} col={c} idx={i} schema={schema} onChange={(p) => update(i, p)} onRemove={() => setCols(cs => cs.filter((_, j) => j !== i))} />
              ))}
              <button className="btn-ghost" onClick={() => setCols((cs) => [...cs, newCol()])}>
                + เพิ่มคอลัมน์
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">📜 SQL ที่ generate</h3>
              <button onClick={create} className="btn-success">
                ▶ สร้างตาราง
              </button>
            </div>
            <SqlBox sql={sql} />
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">📣 สถานะ</h3>
            {!msg && <p className="text-sm text-subtle">ออกแบบเสร็จแล้วกด "สร้างตาราง"</p>}
            {msg && (
              <div
                className={`text-sm p-3 rounded-lg ${msg.ok ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
              >
                {msg.ok ? "✅ " : "❌ "}
                {msg.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnEditor({
  col,
  idx,
  schema,
  onChange,
  onRemove,
}: {
  col: ColumnDef;
  idx: number;
  schema: TableSchema[];
  onChange: (patch: Partial<ColumnDef>) => void;
  onRemove: () => void;
}) {
  const needsLength = col.type === "VARCHAR2" || col.type === "CHAR";
  const isNumber = col.type === "NUMBER";

  return (
    <div className="card-muted">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-subtle">#{idx + 1}</span>
        <input
          className="input input-sm flex-1 min-w-[100px] font-mono"
          placeholder="ชื่อคอลัมน์"
          value={col.name}
          onChange={(e) => onChange({ name: e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() })}
        />
        <select className="select input-sm" value={col.type} onChange={(e) => onChange({ type: e.target.value as OracleType })}>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <button onClick={onRemove} className="text-rose-500 px-2" title="ลบคอลัมน์">
          ✕
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap text-xs">
        {needsLength && (
          <label className="flex items-center gap-1">
            <span className="text-subtle">length</span>
            <input
              type="number"
              min={1}
              max={4000}
              className="input input-sm w-20"
              value={col.length ?? 50}
              onChange={(e) => onChange({ length: Number(e.target.value) })}
            />
          </label>
        )}
        {isNumber && (
          <>
            <label className="flex items-center gap-1">
              <span className="text-subtle">precision</span>
              <input
                type="number"
                min={1}
                max={38}
                className="input input-sm w-16"
                value={col.precision ?? ""}
                onChange={(e) => onChange({ precision: e.target.value ? Number(e.target.value) : null })}
              />
            </label>
            <label className="flex items-center gap-1">
              <span className="text-subtle">scale</span>
              <input
                type="number"
                min={0}
                className="input input-sm w-14"
                value={col.scale ?? ""}
                onChange={(e) => onChange({ scale: e.target.value ? Number(e.target.value) : null })}
              />
            </label>
          </>
        )}

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox"
            checked={!col.nullable}
            onChange={(e) => onChange({ nullable: !e.target.checked })}
          />
          <span>NOT NULL</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" className="checkbox" checked={!!col.pk} onChange={(e) => onChange({ pk: e.target.checked, nullable: e.target.checked ? false : col.nullable })} />
          <span>PK</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" className="checkbox" checked={!!col.unique} onChange={(e) => onChange({ unique: e.target.checked })} />
          <span>UNIQUE</span>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-subtle">DEFAULT</span>
          <input
            className="input input-sm w-28"
            placeholder="(none)"
            value={col.defaultValue ?? ""}
            onChange={(e) => onChange({ defaultValue: e.target.value || null })}
          />
        </label>

        <label className="flex items-center gap-1">
          <span className="text-subtle">FK→</span>
          <select
            className="select input-sm"
            value={col.fk ? `${col.fk.table}.${col.fk.column}` : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return onChange({ fk: null });
              const [t, c] = v.split(".");
              onChange({ fk: { table: t, column: c } });
            }}
          >
            <option value="">(none)</option>
            {schema.flatMap((t) =>
              t.columns.filter((c) => c.pk || c.unique).map((c) => (
                <option key={`${t.name}.${c.name}`} value={`${t.name}.${c.name}`}>
                  {t.name}.{c.name}
                </option>
              ))
            )}
          </select>
        </label>
      </div>
    </div>
  );
}
