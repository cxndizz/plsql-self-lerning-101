"use client";

import { useMemo, useState } from "react";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { ColumnDef, OracleType, formatType } from "@/lib/sampleData";
import { getTable, updateTable, useSchema } from "@/lib/schemaStore";

const TYPES: OracleType[] = ["VARCHAR2", "CHAR", "NUMBER", "INTEGER", "DATE", "TIMESTAMP", "CLOB", "BLOB", "BOOLEAN"];

type Mode = "ADD" | "DROP" | "MODIFY" | "RENAME";

export function AlterTableSection() {
  const schema = useSchema();
  const [table, setTable] = useState(schema[0]?.name ?? "");
  const [mode, setMode] = useState<Mode>("ADD");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // ADD
  const [newCol, setNewCol] = useState<ColumnDef>({ name: "phone", type: "VARCHAR2", length: 20, nullable: true });
  // DROP
  const [dropCol, setDropCol] = useState("");
  // MODIFY
  const [modCol, setModCol] = useState("");
  const [modType, setModType] = useState<OracleType>("VARCHAR2");
  const [modLength, setModLength] = useState<number>(100);
  // RENAME
  const [renameFrom, setRenameFrom] = useState("");
  const [renameTo, setRenameTo] = useState("");

  const tbl = getTable(table);

  const sql = useMemo(() => {
    if (!tbl) return "-- เลือกตารางก่อน";
    if (mode === "ADD") {
      const parts: string[] = [newCol.name || "?", formatType(newCol)];
      if (!newCol.nullable) parts.push("NOT NULL");
      if (newCol.defaultValue) parts.push(`DEFAULT ${newCol.defaultValue}`);
      return `ALTER TABLE ${table} ADD ${parts.join(" ")};`;
    }
    if (mode === "DROP") return `ALTER TABLE ${table} DROP COLUMN ${dropCol || "?"};`;
    if (mode === "MODIFY") {
      const lengthPart = modType === "VARCHAR2" || modType === "CHAR" ? `(${modLength})` : "";
      return `ALTER TABLE ${table} MODIFY ${modCol || "?"} ${modType}${lengthPart};`;
    }
    if (mode === "RENAME") return `ALTER TABLE ${table} RENAME COLUMN ${renameFrom || "?"} TO ${renameTo || "?"};`;
    return "";
  }, [mode, table, tbl, newCol, dropCol, modCol, modType, modLength, renameFrom, renameTo]);

  function apply() {
    if (!tbl) return setMsg({ ok: false, text: "เลือกตารางก่อน" });

    if (mode === "ADD") {
      if (!newCol.name.trim()) return setMsg({ ok: false, text: "ตั้งชื่อคอลัมน์" });
      if (tbl.columns.some((c) => c.name === newCol.name)) return setMsg({ ok: false, text: "คอลัมน์นี้มีอยู่แล้ว" });
      const newCols = [...tbl.columns, newCol];
      const newRows = tbl.rows.map((r) => ({ ...r, [newCol.name]: newCol.defaultValue && !["SYSDATE", "CURRENT_DATE"].includes(newCol.defaultValue) ? newCol.defaultValue : null }));
      updateTable(table, { columns: newCols, rows: newRows });
      return setMsg({ ok: true, text: `เพิ่มคอลัมน์ ${newCol.name} แล้ว` });
    }
    if (mode === "DROP") {
      if (!dropCol) return setMsg({ ok: false, text: "เลือกคอลัมน์ที่จะลบ" });
      const newCols = tbl.columns.filter((c) => c.name !== dropCol);
      const newRows = tbl.rows.map((r) => {
        const { [dropCol]: _, ...rest } = r;
        return rest;
      });
      updateTable(table, { columns: newCols, rows: newRows });
      return setMsg({ ok: true, text: `ลบคอลัมน์ ${dropCol} แล้ว` });
    }
    if (mode === "MODIFY") {
      if (!modCol) return setMsg({ ok: false, text: "เลือกคอลัมน์ที่จะแก้" });
      const newCols = tbl.columns.map((c) => (c.name === modCol ? { ...c, type: modType, length: modLength } : c));
      updateTable(table, { columns: newCols });
      return setMsg({ ok: true, text: `แก้ type ของ ${modCol} แล้ว` });
    }
    if (mode === "RENAME") {
      if (!renameFrom || !renameTo) return setMsg({ ok: false, text: "เลือก/กรอกชื่อให้ครบ" });
      const newCols = tbl.columns.map((c) => (c.name === renameFrom ? { ...c, name: renameTo } : c));
      const newRows = tbl.rows.map((r) => {
        const { [renameFrom]: v, ...rest } = r;
        return { ...rest, [renameTo]: v };
      });
      updateTable(table, { columns: newCols, rows: newRows });
      return setMsg({ ok: true, text: `เปลี่ยนชื่อจาก ${renameFrom} เป็น ${renameTo}` });
    }
  }

  return (
    <div className="space-y-5">
      <Intro
        what="ALTER TABLE คือคำสั่ง 'แก้โครงตารางที่มีอยู่' — เพิ่ม/ลบ/แก้/เปลี่ยนชื่อคอลัมน์"
        why="ระบบจริงโครงสร้างต้องเปลี่ยน เช่น ลูกค้าต้องเพิ่ม email, salary ต้องเปลี่ยน type ให้รองรับทศนิยม"
        how="ALTER TABLE <ชื่อตาราง> ADD | DROP COLUMN | MODIFY | RENAME COLUMN ..."
        example={`ALTER TABLE employees ADD phone VARCHAR2(20);`}
      />

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <label className="text-sm flex flex-col gap-1">
            <span className="text-subtle text-xs">ตาราง</span>
            <select className="select" value={table} onChange={(e) => setTable(e.target.value)}>
              {schema.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            <span className="text-subtle text-xs">โหมด</span>
            <select className="select" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="ADD">ADD — เพิ่มคอลัมน์</option>
              <option value="DROP">DROP — ลบคอลัมน์</option>
              <option value="MODIFY">MODIFY — แก้ type</option>
              <option value="RENAME">RENAME — เปลี่ยนชื่อ</option>
            </select>
          </label>
        </div>

        <div className="divider" />

        {mode === "ADD" && (
          <div className="flex flex-wrap items-end gap-2 text-xs">
            <label className="flex flex-col">
              <span className="text-subtle">ชื่อ</span>
              <input
                className="input input-sm w-32 font-mono"
                value={newCol.name}
                onChange={(e) => setNewCol((c) => ({ ...c, name: e.target.value.toLowerCase() }))}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-subtle">type</span>
              <select
                className="select input-sm"
                value={newCol.type}
                onChange={(e) => setNewCol((c) => ({ ...c, type: e.target.value as OracleType }))}
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            {(newCol.type === "VARCHAR2" || newCol.type === "CHAR") && (
              <label className="flex flex-col">
                <span className="text-subtle">length</span>
                <input
                  type="number"
                  className="input input-sm w-20"
                  value={newCol.length ?? 50}
                  onChange={(e) => setNewCol((c) => ({ ...c, length: Number(e.target.value) }))}
                />
              </label>
            )}
            <label className="flex items-center gap-1.5 cursor-pointer mt-3">
              <input
                type="checkbox"
                className="checkbox"
                checked={!newCol.nullable}
                onChange={(e) => setNewCol((c) => ({ ...c, nullable: !e.target.checked }))}
              />
              NOT NULL
            </label>
            <label className="flex flex-col">
              <span className="text-subtle">DEFAULT</span>
              <input
                className="input input-sm w-28"
                placeholder="(none)"
                value={newCol.defaultValue ?? ""}
                onChange={(e) => setNewCol((c) => ({ ...c, defaultValue: e.target.value || null }))}
              />
            </label>
          </div>
        )}

        {mode === "DROP" && (
          <select className="select" value={dropCol} onChange={(e) => setDropCol(e.target.value)}>
            <option value="">— เลือกคอลัมน์ —</option>
            {tbl?.columns.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        )}

        {mode === "MODIFY" && (
          <div className="flex flex-wrap gap-2 text-xs items-end">
            <label className="flex flex-col">
              <span className="text-subtle">คอลัมน์</span>
              <select className="select input-sm" value={modCol} onChange={(e) => setModCol(e.target.value)}>
                <option value="">—</option>
                {tbl?.columns.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col">
              <span className="text-subtle">type ใหม่</span>
              <select className="select input-sm" value={modType} onChange={(e) => setModType(e.target.value as OracleType)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            {(modType === "VARCHAR2" || modType === "CHAR") && (
              <label className="flex flex-col">
                <span className="text-subtle">length</span>
                <input
                  type="number"
                  className="input input-sm w-20"
                  value={modLength}
                  onChange={(e) => setModLength(Number(e.target.value))}
                />
              </label>
            )}
          </div>
        )}

        {mode === "RENAME" && (
          <div className="flex flex-wrap gap-2 items-end text-xs">
            <label className="flex flex-col">
              <span className="text-subtle">จาก</span>
              <select className="select input-sm" value={renameFrom} onChange={(e) => setRenameFrom(e.target.value)}>
                <option value="">—</option>
                {tbl?.columns.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col">
              <span className="text-subtle">เป็น</span>
              <input
                className="input input-sm w-32 font-mono"
                value={renameTo}
                onChange={(e) => setRenameTo(e.target.value.toLowerCase())}
              />
            </label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">📜 SQL ที่ generate</h3>
            <button onClick={apply} className="btn-primary">
              ▶ Apply
            </button>
          </div>
          <SqlBox sql={sql} />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">📣 สถานะ</h3>
          {!msg && <p className="text-sm text-subtle">เลือกโหมดและคอลัมน์แล้วกด Apply</p>}
          {msg && (
            <div className={`text-sm p-3 rounded-lg ${msg.ok ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
              {msg.ok ? "✅ " : "❌ "}
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
