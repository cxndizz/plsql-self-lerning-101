"use client";

import { useMemo, useState } from "react";
import { Block } from "./Block";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { buildDelete, DeleteState, initialDelete, Operator, OPERATORS } from "@/lib/queryBuilder";
import { getTable, useSchema } from "@/lib/schemaStore";
import { runQuery } from "@/lib/runSql";

export function DeleteSection({ onRun, onFocus }: { onRun: () => void; onFocus: (t: string) => void }) {
  const schema = useSchema();
  const TABLE_NAMES = schema.map((t) => t.name);
  const [q, setQ] = useState<DeleteState>(initialDelete);
  const sql = useMemo(() => buildDelete(q), [q]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const tbl = getTable(q.table);
  if (!tbl) return <p className="text-sm text-muted">ไม่พบตาราง</p>;
  const colNames = tbl.columns.map((c) => c.name);

  function run() {
    const r = runQuery(sql);
    if (r.error) setMsg({ ok: false, text: r.error });
    else setMsg({ ok: true, text: `ลบ ${r.affected ?? 0} แถวสำเร็จ` });
    onRun();
  }

  return (
    <div className="space-y-5">
      <Intro
        what="DELETE คือคำสั่ง 'ลบแถว' ออกจากตาราง — ลบแล้วหายเลย กู้คืนไม่ได้"
        why="ใช้ตอนลูกค้ายกเลิกออเดอร์, ลบบัญชีที่ไม่ใช้, เคลียร์ข้อมูลเก่า"
        how="ระบุ FROM ตาราง → WHERE เงื่อนไข ⚠️ ลืม WHERE = ลบทุกแถว! เป็นบัคคลาสสิค"
        example={`DELETE FROM employees\nWHERE emp_id = 7;`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <Block title="DELETE FROM" subtitle="เลือกตาราง" color="amber">
            <select
              className="select w-full"
              value={q.table}
              onChange={(e) => {
                const t = e.target.value;
                setQ({ table: t, where: [] });
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

          <Block title="WHERE" subtitle="⚠️ จำเป็น — ระบุแถวที่จะลบ" color="rose">
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
              {q.where.length === 0 && (
                <p className="text-xs text-rose-600 font-semibold">
                  ⚠️ ไม่มี WHERE — รันแล้วจะลบทุกแถว!
                </p>
              )}
            </div>
          </Block>
        </div>

        <div className="space-y-3">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">📜 SQL ที่ generate</h3>
              <button onClick={run} className="btn-danger">
                ▶ Run DELETE
              </button>
            </div>
            <SqlBox sql={sql} />
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">📣 สถานะ</h3>
            {!msg && <p className="text-sm text-slate-500">กด Run เพื่อลบ</p>}
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
