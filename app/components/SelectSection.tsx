"use client";

import { useMemo, useState } from "react";
import { Block } from "./Block";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { ResultTable } from "./ResultTable";
import {
  SelectState,
  initialSelect,
  buildSelect,
  explainSelect,
  availableColumns,
  Operator,
  OPERATORS,
} from "@/lib/queryBuilder";
import { getTable, useSchema } from "@/lib/schemaStore";
import { runQuery } from "@/lib/runSql";

export function SelectSection({ onRun, onFocus }: { onRun: () => void; onFocus: (t: string) => void }) {
  const schema = useSchema();
  const TABLE_NAMES = schema.map((t) => t.name);
  const [q, setQ] = useState<SelectState>(initialSelect(TABLE_NAMES[0]));
  const sql = useMemo(() => buildSelect(q), [q]);
  const explain = useMemo(() => explainSelect(q), [q]);
  const cols = useMemo(() => availableColumns(q), [q]);
  const [result, setResult] = useState<{ rows: Record<string, unknown>[] | null; error: string | null } | null>(null);
  const fromTbl = getTable(q.fromTable);
  const joinTbl = q.join ? getTable(q.join.table) : null;
  if (!fromTbl) return <p className="text-sm text-muted">ไม่พบตาราง — ไปสร้างที่ CREATE TABLE ก่อน</p>;

  function toggleCol(c: string) {
    setQ((s) => ({ ...s, columns: s.columns.includes(c) ? s.columns.filter((x) => x !== c) : [...s.columns, c] }));
  }
  function addWhere() {
    setQ((s) => ({ ...s, where: [...s.where, { column: cols[0] ?? "", op: "=", value: "" }] }));
  }
  function updateWhere(i: number, patch: Partial<{ column: string; op: Operator; value: string }>) {
    setQ((s) => ({ ...s, where: s.where.map((w, idx) => (idx === i ? { ...w, ...patch } : w)) }));
  }
  function removeWhere(i: number) {
    setQ((s) => ({ ...s, where: s.where.filter((_, idx) => idx !== i) }));
  }

  function run() {
    const r = runQuery(sql);
    setResult({ rows: r.rows, error: r.error });
    onRun();
  }

  return (
    <div className="space-y-5">
      <Intro
        what="SELECT คือคำสั่ง 'อ่านข้อมูล' ออกจากตาราง — เหมือนค้นหาในตู้เก็บเอกสาร"
        why="ใช้บ่อยที่สุดในการดึงข้อมูลมาแสดงในรายงาน, หน้าจอ, หรือ dashboard"
        how="ระบุ คอลัมน์ที่อยากได้ → FROM ตารางไหน → WHERE กรอง → ORDER BY เรียง → LIMIT จำกัด"
        example={`SELECT first_name, salary\nFROM employees\nWHERE salary > 40000\nORDER BY salary DESC;`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <Block title="FROM" subtitle="เลือกตารางหลัก" color="amber">
            <select
              className="select w-full"
              value={q.fromTable}
              onChange={(e) => {
                const v = e.target.value;
                setQ(initialSelect(v));
                onFocus(v);
              }}
            >
              {TABLE_NAMES.map((t) => (
                <option key={t} value={t}>
                  {t} ({getTable(t)?.thaiName})
                </option>
              ))}
            </select>
          </Block>

          <Block title="SELECT" subtitle="เลือกคอลัมน์ (ไม่เลือก = ทั้งหมด)" color="sky">
            <div className="flex flex-wrap gap-2">
              {fromTbl.columns.map((c) => (
                <button
                  key={c.name}
                  onClick={() => toggleCol(c.name)}
                  title={c.thaiDesc}
                  className={`chip ${q.columns.includes(c.name) ? "chip-active" : ""}`}
                >
                  {c.name}
                </button>
              ))}
              {joinTbl?.columns.map((c) => (
                <button
                  key={`${joinTbl.name}.${c.name}`}
                  onClick={() => toggleCol(`${joinTbl.name}.${c.name}`)}
                  title={c.thaiDesc}
                  className={`chip ${q.columns.includes(`${joinTbl.name}.${c.name}`) ? "chip-active" : ""}`}
                >
                  {joinTbl.name}.{c.name}
                </button>
              ))}
            </div>
          </Block>

          <Block title="JOIN" subtitle="เชื่อมอีกตาราง (ไม่บังคับ)" color="violet">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  className="select"
                  value={q.join?.kind ?? "INNER"}
                  onChange={(e) =>
                    setQ((s) => (s.join ? { ...s, join: { ...s.join, kind: e.target.value as "INNER" | "LEFT" } } : s))
                  }
                  disabled={!q.join}
                >
                  <option value="INNER">INNER JOIN</option>
                  <option value="LEFT">LEFT JOIN</option>
                </select>
                <select
                  className="select"
                  value={q.join?.table ?? ""}
                  onChange={(e) => {
                    const t = e.target.value;
                    if (!t) return setQ((s) => ({ ...s, join: null }));
                    const other = getTable(t);
                    const main = getTable(q.fromTable);
                    const lc = main?.columns.find((c) => c.fk?.table === t)?.name
                      ?? main?.columns.find((c) => other?.columns.some((oc) => oc.name === c.name))?.name
                      ?? main?.columns[0]?.name ?? "";
                    const rc = other?.columns.find((c) => c.pk)?.name ?? other?.columns[0]?.name ?? "";
                    setQ((s) => ({
                      ...s,
                      join: { kind: "INNER", table: t, leftCol: `${q.fromTable}.${lc}`, rightCol: `${t}.${rc}` },
                    }));
                  }}
                >
                  <option value="">— ไม่ join —</option>
                  {TABLE_NAMES.filter((t) => t !== q.fromTable).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {q.join && joinTbl && (
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span className="text-slate-500">ON</span>
                  <select
                    className="select"
                    value={q.join.leftCol}
                    onChange={(e) => setQ((s) => ({ ...s, join: { ...s.join!, leftCol: e.target.value } }))}
                  >
                    {fromTbl.columns.map((c) => (
                      <option key={c.name} value={`${q.fromTable}.${c.name}`}>
                        {q.fromTable}.{c.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-500">=</span>
                  <select
                    className="select"
                    value={q.join.rightCol}
                    onChange={(e) => setQ((s) => ({ ...s, join: { ...s.join!, rightCol: e.target.value } }))}
                  >
                    {joinTbl.columns.map((c) => (
                      <option key={c.name} value={`${joinTbl.name}.${c.name}`}>
                        {joinTbl.name}.{c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <p className="text-xs text-slate-500">
                💡 INNER = เอาเฉพาะที่จับคู่ได้ · LEFT = เอาแถวซ้ายทั้งหมด ถ้าไม่เจอคู่ใส่ NULL
              </p>
            </div>
          </Block>

          <Block title="WHERE" subtitle="กรองแถว" color="rose">
            <div className="space-y-2">
              {q.where.map((w, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <select className="select" value={w.column} onChange={(e) => updateWhere(i, { column: e.target.value })}>
                    {cols.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select className="select" value={w.op} onChange={(e) => updateWhere(i, { op: e.target.value as Operator })}>
                    {OPERATORS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  {w.op !== "IS NULL" && w.op !== "IS NOT NULL" && (
                    <input
                      className="input flex-1 min-w-[120px]"
                      placeholder="ค่า"
                      value={w.value}
                      onChange={(e) => updateWhere(i, { value: e.target.value })}
                    />
                  )}
                  <button className="text-rose-500 px-2" onClick={() => removeWhere(i)}>
                    ✕
                  </button>
                </div>
              ))}
              <button className="btn-ghost" onClick={addWhere}>
                + เพิ่มเงื่อนไข
              </button>
            </div>
          </Block>

          <Block title="ORDER BY / LIMIT" color="emerald">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                className="select"
                value={q.orderBy?.column ?? ""}
                onChange={(e) => {
                  const c = e.target.value;
                  if (!c) return setQ((s) => ({ ...s, orderBy: null }));
                  setQ((s) => ({ ...s, orderBy: { column: c, dir: s.orderBy?.dir ?? "ASC" } }));
                }}
              >
                <option value="">— ไม่เรียง —</option>
                {cols.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {q.orderBy && (
                <select
                  className="select"
                  value={q.orderBy.dir}
                  onChange={(e) => setQ((s) => ({ ...s, orderBy: { ...s.orderBy!, dir: e.target.value as "ASC" | "DESC" } }))}
                >
                  <option value="ASC">ASC ↑</option>
                  <option value="DESC">DESC ↓</option>
                </select>
              )}
              <input
                type="number"
                min={0}
                className="input w-28"
                value={q.limit ?? ""}
                placeholder="LIMIT"
                onChange={(e) => setQ((s) => ({ ...s, limit: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
          </Block>
        </div>

        <div className="space-y-3">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">📜 SQL ที่ generate</h3>
              <button onClick={run} className="btn-primary">
                ▶ Run
              </button>
            </div>
            <SqlBox sql={sql} />
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">💡 อ่านยังไง</h3>
            <ul className="space-y-2">
              {explain.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <code className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded whitespace-nowrap font-mono">
                    {p.clause}
                  </code>
                  <span className="text-sm text-slate-700">{p.thai}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">📊 ผลลัพธ์</h3>
            {!result && <p className="text-sm text-slate-500">กด Run เพื่อดูผลลัพธ์</p>}
            {result?.error && <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-lg">❌ {result.error}</div>}
            {result?.rows && <ResultTable rows={result.rows} />}
          </div>
        </div>
      </div>
    </div>
  );
}
