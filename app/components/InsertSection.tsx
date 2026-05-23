"use client";

import { useMemo, useState } from "react";
import { Block } from "./Block";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { buildInsert, InsertState } from "@/lib/queryBuilder";
import { getTable, useSchema } from "@/lib/schemaStore";
import { runQuery } from "@/lib/runSql";

export function InsertSection({ onRun, onFocus }: { onRun: () => void; onFocus: (t: string) => void }) {
  const schema = useSchema();
  const TABLE_NAMES = schema.map((t) => t.name);
  const [q, setQ] = useState<InsertState>({ table: TABLE_NAMES[0] ?? "", values: {} });
  const sql = useMemo(() => buildInsert(q), [q]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const tbl = getTable(q.table);
  if (!tbl) return <p className="text-sm text-muted">ไม่พบตาราง — ไปสร้างที่ CREATE TABLE</p>;

  function run() {
    const r = runQuery(sql);
    if (r.error) setMsg({ ok: false, text: r.error });
    else setMsg({ ok: true, text: `เพิ่ม ${r.affected ?? 1} แถวสำเร็จ — ดูแถวสีเขียวใน Server ด้านบน` });
    onRun();
  }

  return (
    <div className="space-y-5">
      <Intro
        what="INSERT คือคำสั่ง 'เพิ่มแถวใหม่' เข้าตาราง — เหมือนเพิ่มเอกสารใหม่เข้าตู้"
        why="ใช้ตอนรับสมัครพนักงานใหม่, ลูกค้าสั่งซื้อ, บันทึก log — ทุกครั้งที่มีข้อมูลใหม่"
        how="ระบุ INTO ตารางไหน → ระบุคอลัมน์ → VALUES ค่าของแต่ละคอลัมน์ (เรียงให้ตรงกัน)"
        example={`INSERT INTO employees (emp_id, first_name, salary)\nVALUES (99, 'นภดล', 40000);`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <Block title="INTO" subtitle="เลือกตารางที่จะเพิ่มแถว" color="amber">
            <select
              className="select w-full"
              value={q.table}
              onChange={(e) => {
                const t = e.target.value;
                setQ({ table: t, values: {} });
                onFocus(t);
              }}
            >
              {TABLE_NAMES.map((t) => (
                <option key={t} value={t}>
                  {t} ({getTable(t)?.thaiName})
                </option>
              ))}
            </select>
          </Block>

          <Block title="VALUES" subtitle="กรอกค่าแต่ละคอลัมน์ (เว้นว่าง = NULL)" color="emerald">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tbl.columns.map((c) => (
                <label key={c.name} className="text-xs flex flex-col gap-1">
                  <span className="font-mono flex items-center gap-1">
                    {c.name}
                    {c.pk && <span className="badge badge-pk">PK</span>}
                    {c.fk && <span className="badge badge-fk">FK</span>}
                    <span className="text-slate-400 font-sans">· {c.thaiDesc}</span>
                  </span>
                  <input
                    className="input"
                    placeholder={c.type}
                    value={q.values[c.name] ?? ""}
                    onChange={(e) => setQ((s) => ({ ...s, values: { ...s.values, [c.name]: e.target.value } }))}
                  />
                </label>
              ))}
            </div>
          </Block>
        </div>

        <div className="space-y-3">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">📜 SQL ที่ generate</h3>
              <button onClick={run} className="btn-success">
                ▶ Run INSERT
              </button>
            </div>
            <SqlBox sql={sql} />
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📣 สถานะ</h3>
            {!msg && <p className="text-sm text-slate-500">กรอกค่าแล้วกด Run</p>}
            {msg && (
              <div
                className={`text-sm p-3 rounded-lg ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
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
