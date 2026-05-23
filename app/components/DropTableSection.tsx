"use client";

import { useMemo, useState } from "react";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { dropTable, updateTable, useSchema, getTable } from "@/lib/schemaStore";

type Mode = "DROP" | "TRUNCATE";

export function DropTableSection() {
  const schema = useSchema();
  const [table, setTable] = useState(schema[0]?.name ?? "");
  const [mode, setMode] = useState<Mode>("DROP");
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const sql = useMemo(() => (mode === "DROP" ? `DROP TABLE ${table};` : `TRUNCATE TABLE ${table};`), [mode, table]);

  function run() {
    if (!confirm) return setMsg({ ok: false, text: "ติ๊กยืนยันก่อนรัน" });
    if (mode === "DROP") {
      dropTable(table);
      setMsg({ ok: true, text: `ลบตาราง ${table} ออกจาก schema แล้ว` });
    } else {
      const t = getTable(table);
      if (t) updateTable(table, { rows: [] });
      setMsg({ ok: true, text: `ล้างข้อมูลในตาราง ${table} (โครงสร้างยังอยู่)` });
    }
    setConfirm(false);
  }

  return (
    <div className="space-y-5">
      <Intro
        what="DROP TABLE คือ 'ลบทั้งตาราง' — ทั้งโครงสร้างและข้อมูลหายเกลี้ยง. TRUNCATE = ล้างข้อมูล แต่ตารางยังอยู่"
        why="ใช้ตอนเลิกใช้ตารางจริงๆ, รื้อระบบใหม่, หรือล้างข้อมูลทดสอบ"
        how="DROP ลบทุกอย่าง · TRUNCATE เก็บโครงไว้ ใช้กับ session test ได้บ่อย — เร็วกว่า DELETE ไม่มี WHERE"
        example={`DROP TABLE projects;\nTRUNCATE TABLE employees;`}
      />

      <div className="card">
        <div className="flex flex-wrap gap-3 items-end mb-3">
          <label className="text-xs flex flex-col">
            <span className="text-subtle">ตาราง</span>
            <select className="select" value={table} onChange={(e) => setTable(e.target.value)}>
              {schema.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs flex flex-col">
            <span className="text-subtle">โหมด</span>
            <select className="select" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="DROP">DROP — ลบทั้งตาราง</option>
              <option value="TRUNCATE">TRUNCATE — ล้างข้อมูล</option>
            </select>
          </label>
        </div>

        <div className="bg-rose-500/10 text-rose-500 text-sm p-3 rounded-lg mb-3">
          ⚠️ <b>คำเตือน:</b> {mode === "DROP" ? "ลบตารางแล้วกู้คืนไม่ได้ (ใน Oracle จริงต้องใช้ Flashback)" : "ข้อมูลทั้งหมดจะหายทันที — Oracle ไม่ rollback TRUNCATE"}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
          เข้าใจและยืนยันว่าจะ{mode === "DROP" ? "ลบตาราง" : "ล้างข้อมูล"} "{table}"
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">📜 SQL ที่ generate</h3>
            <button onClick={run} className="btn-danger" disabled={!confirm}>
              ▶ Run {mode}
            </button>
          </div>
          <SqlBox sql={sql} />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">📣 สถานะ</h3>
          {!msg && <p className="text-sm text-subtle">ติ๊กยืนยันแล้วกดปุ่ม</p>}
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
