"use client";

import { useMemo, useState } from "react";
import { Block } from "./Block";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { buildUpdate, UpdateState, initialUpdate, Operator, OPERATORS } from "@/lib/queryBuilder";
import { getTable, useSchema } from "@/lib/schemaStore";
import { runQuery } from "@/lib/runSql";

export function UpdateSection({ onRun, onFocus }: { onRun: () => void; onFocus: (t: string) => void }) {
  const schema = useSchema();
  const TABLE_NAMES = schema.map((t) => t.name);
  const [q, setQ] = useState<UpdateState>(initialUpdate);
  const sql = useMemo(() => buildUpdate(q), [q]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const tbl = getTable(q.table);
  if (!tbl) return <p className="text-sm text-muted">ไม่พบตาราง</p>;
  const colNames = tbl.columns.map((c) => c.name);

  function run() {
    const r = runQuery(sql);
    if (r.error) setMsg({ ok: false, text: r.error });
    else setMsg({ ok: true, text: `แก้ไข ${r.affected ?? 0} แถว — สังเกตสีเหลืองใน Server` });
    onRun();
  }

  return (
    <div className="space-y-5">
      <Intro
        what="UPDATE คือคำสั่ง 'แก้ค่าในแถวที่มีอยู่แล้ว' — เหมือนเอาปากกาแก้เอกสารเดิม"
        why="ใช้ตอนปรับเงินเดือน, เปลี่ยนที่อยู่ลูกค้า, อัปเดตสถานะออเดอร์"
        how="ระบุตาราง → SET คอลัมน์=ค่าใหม่ → WHERE กรองว่าจะแก้แถวไหน ⚠️ ลืม WHERE = แก้ทุกแถว!"
        example={`UPDATE employees\nSET salary = 60000\nWHERE emp_id = 3;`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <Block title="UPDATE" subtitle="เลือกตาราง" color="amber">
            <select
              className="select w-full"
              value={q.table}
              onChange={(e) => {
                const t = e.target.value;
                const other = getTable(t)!;
                setQ({ table: t, sets: [{ column: other.columns[0].name, value: "" }], where: [] });
                onFocus(t);
              }}
            >
              {TABLE_NAMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Block>

          <Block title="SET" subtitle="คอลัมน์ที่จะเปลี่ยน" color="emerald">
            <div className="space-y-2">
              {q.sets.map((s, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <select
                    className="select"
                    value={s.column}
                    onChange={(e) =>
                      setQ((st) => ({ ...st, sets: st.sets.map((x, j) => (j === i ? { ...x, column: e.target.value } : x)) }))
                    }
                  >
                    {colNames.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <span className="text-slate-500">=</span>
                  <input
                    className="input flex-1 min-w-[120px]"
                    value={s.value}
                    placeholder="ค่าใหม่"
                    onChange={(e) =>
                      setQ((st) => ({ ...st, sets: st.sets.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) }))
                    }
                  />
                  <button
                    className="text-rose-500 px-2"
                    onClick={() => setQ((st) => ({ ...st, sets: st.sets.filter((_, j) => j !== i) }))}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                className="btn-ghost"
                onClick={() => setQ((s) => ({ ...s, sets: [...s.sets, { column: colNames[0], value: "" }] }))}
              >
                + เพิ่ม SET
              </button>
            </div>
          </Block>

          <Block title="WHERE" subtitle="⚠️ จำเป็น — ระบุแถวที่จะแก้" color="rose">
            <div className="space-y-2">
              {q.where.map((w, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <select
                    className="select"
                    value={w.column}
                    onChange={(e) =>
                      setQ((st) => ({ ...st, where: st.where.map((x, j) => (j === i ? { ...x, column: e.target.value } : x)) }))
                    }
                  >
                    {colNames.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    className="select"
                    value={w.op}
                    onChange={(e) =>
                      setQ((st) => ({
                        ...st,
                        where: st.where.map((x, j) => (j === i ? { ...x, op: e.target.value as Operator } : x)),
                      }))
                    }
                  >
                    {OPERATORS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  {w.op !== "IS NULL" && w.op !== "IS NOT NULL" && (
                    <input
                      className="input flex-1 min-w-[100px]"
                      value={w.value}
                      onChange={(e) =>
                        setQ((st) => ({
                          ...st,
                          where: st.where.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)),
                        }))
                      }
                    />
                  )}
                  <button
                    className="text-rose-500 px-2"
                    onClick={() => setQ((st) => ({ ...st, where: st.where.filter((_, j) => j !== i) }))}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                className="btn-ghost"
                onClick={() =>
                  setQ((s) => ({ ...s, where: [...s.where, { column: colNames[0], op: "=", value: "" }] }))
                }
              >
                + เพิ่มเงื่อนไข
              </button>
            </div>
          </Block>
        </div>

        <div className="space-y-3">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">📜 SQL ที่ generate</h3>
              <button onClick={run} className="btn-primary">
                ▶ Run UPDATE
              </button>
            </div>
            <SqlBox sql={sql} />
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📣 สถานะ</h3>
            {!msg && <p className="text-sm text-slate-500">กด Run เพื่ออัปเดต</p>}
            {msg && (
              <div
                className={`text-sm p-3 rounded-lg ${msg.ok ? "bg-amber-50 text-amber-800" : "bg-rose-50 text-rose-700"}`}
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
