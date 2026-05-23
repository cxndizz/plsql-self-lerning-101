"use client";

import { useMemo, useState } from "react";
import { Block } from "./Block";
import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";
import { ResultTable } from "./ResultTable";
import { getTable, useSchema } from "@/lib/schemaStore";
import { runQuery } from "@/lib/runSql";

type JoinKind = "INNER" | "LEFT" | "RIGHT";

export function JoinSection({ onRun }: { onRun: () => void }) {
  const schema = useSchema();
  const TABLE_NAMES = schema.map((t) => t.name);
  const [leftTable, setLeftTable] = useState(TABLE_NAMES[0] ?? "");
  const [rightTable, setRightTable] = useState(TABLE_NAMES[1] ?? TABLE_NAMES[0] ?? "");
  const [kind, setKind] = useState<JoinKind>("INNER");
  const [leftCol, setLeftCol] = useState("dept_id");
  const [rightCol, setRightCol] = useState("dept_id");
  const [result, setResult] = useState<{ rows: Record<string, unknown>[] | null; error: string | null } | null>(null);

  const lt = getTable(leftTable);
  const rt = getTable(rightTable);
  if (!lt || !rt) return <p className="text-sm text-muted">ต้องมีอย่างน้อย 2 ตาราง</p>;

  const sql = useMemo(
    () =>
      `SELECT *\nFROM ${leftTable}\n${kind} JOIN ${rightTable} ON ${leftTable}.${leftCol} = ${rightTable}.${rightCol};`,
    [leftTable, rightTable, kind, leftCol, rightCol]
  );

  function run() {
    const r = runQuery(sql);
    setResult({ rows: r.rows, error: r.error });
    onRun();
  }

  return (
    <div className="space-y-5">
      <Intro
        what="JOIN คือคำสั่ง 'เชื่อม 2 ตารางเข้าด้วยกัน' ผ่านคอลัมน์ที่ค่าตรงกัน เช่น dept_id"
        why="ข้อมูลในชีวิตจริงไม่อยู่ตารางเดียว — พนักงานอยู่ตารางหนึ่ง ชื่อแผนกอยู่อีกตาราง"
        how="LEFT TABLE → เลือกชนิด JOIN → RIGHT TABLE → ON: คอลัมน์ซ้าย = คอลัมน์ขวา"
        example={`SELECT e.first_name, d.dept_name\nFROM employees e\nINNER JOIN departments d\n  ON e.dept_id = d.dept_id;`}
      />

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <div className="border-2 border-sky-300 bg-sky-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">ตาราง ซ้าย</div>
            <select className="select w-full mb-2" value={leftTable} onChange={(e) => setLeftTable(e.target.value)}>
              {TABLE_NAMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mb-1">คอลัมน์เชื่อม</div>
            <select className="select w-full" value={leftCol} onChange={(e) => setLeftCol(e.target.value)}>
              {lt.columns.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} {c.fk ? `→ ${c.fk.table}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center gap-2">
            <select className="select" value={kind} onChange={(e) => setKind(e.target.value as JoinKind)}>
              <option value="INNER">INNER JOIN</option>
              <option value="LEFT">LEFT JOIN</option>
              <option value="RIGHT">RIGHT JOIN</option>
            </select>
            <div className="text-2xl">⟷</div>
            <div className="text-xs text-slate-500 text-center max-w-[160px]">
              {kind === "INNER" && "เอาเฉพาะแถวที่ ตรงกัน ทั้งสองฝั่ง"}
              {kind === "LEFT" && "เอาทุกแถวฝั่งซ้าย ถ้าไม่เจอคู่ใส่ NULL"}
              {kind === "RIGHT" && "เอาทุกแถวฝั่งขวา ถ้าไม่เจอคู่ใส่ NULL"}
            </div>
          </div>

          <div className="border-2 border-violet-300 bg-violet-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">ตาราง ขวา</div>
            <select className="select w-full mb-2" value={rightTable} onChange={(e) => setRightTable(e.target.value)}>
              {TABLE_NAMES.filter((t) => t !== leftTable).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="text-xs text-slate-500 mb-1">คอลัมน์เชื่อม</div>
            <select className="select w-full" value={rightCol} onChange={(e) => setRightCol(e.target.value)}>
              {rt.columns.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} {c.pk ? "(PK)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
          <h3 className="font-semibold mb-2">📊 ผลลัพธ์</h3>
          {!result && <p className="text-sm text-slate-500">กด Run เพื่อดูผลลัพธ์</p>}
          {result?.error && <div className="bg-rose-50 text-rose-700 text-sm p-3 rounded-lg">❌ {result.error}</div>}
          {result?.rows && <ResultTable rows={result.rows} />}
        </div>
      </div>

      <Block title="เทียบให้เห็นภาพ" color="indigo">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <div className="font-bold mb-1">INNER JOIN</div>
            <div className="text-xs text-slate-600">
              คล้าย "∩ (intersection)" — เอาเฉพาะคู่ที่จับกันได้ พนักงานที่ <code>dept_id</code> เป็น NULL หรือไม่ตรงกับแผนกใด <b>หายไป</b>
            </div>
          </div>
          <div>
            <div className="font-bold mb-1">LEFT JOIN</div>
            <div className="text-xs text-slate-600">
              ทุกแถวฝั่งซ้ายเก็บไว้ — ถ้าฝั่งขวาไม่เจอคู่ ใส่ NULL ให้ เหมาะตอนต้องการดูว่า "ใครไม่มีแผนก"
            </div>
          </div>
          <div>
            <div className="font-bold mb-1">RIGHT JOIN</div>
            <div className="text-xs text-slate-600">
              สลับด้านกับ LEFT — ทุกแถวฝั่งขวาเก็บไว้ มักใช้น้อยกว่า เพราะสลับลำดับตารางก็ใช้ LEFT แทนได้
            </div>
          </div>
        </div>
      </Block>
    </div>
  );
}
