"use client";

import { formatType } from "@/lib/sampleData";
import { useSchema } from "@/lib/schemaStore";

export function BeginnerSection({ onGo }: { onGo: (k: string) => void }) {
  const schema = useSchema();
  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="text-xl font-bold mb-2">👋 ยินดีต้อนรับ</h2>
        <p className="text-sm text-muted leading-relaxed">
          ที่นี่คุณจะได้เรียน SQL + PL/SQL ของ Oracle แบบเห็นภาพ —
          เมนูซ้ายแบ่งเป็น <b>พื้นฐาน → DDL (ออกแบบตาราง) → DML (ใช้ข้อมูล) → ขั้นสูง</b>{" "}
          ทุกการเปลี่ยนแปลงจะเห็นใน Virtual Database Server ด้านบนทันที
        </p>
      </div>

      <div className="intro-grid">
        <div className="intro-card">
          <h4>🗄️ Database คืออะไร?</h4>
          <p>
            ที่เก็บข้อมูลแบบมีโครงสร้าง คล้าย Excel หลายชีต — แต่ละชีตเรียกว่า{" "}
            <b>ตาราง (table)</b> เก็บ <b>แถว (row)</b> และ <b>คอลัมน์ (column)</b>
          </p>
        </div>
        <div className="intro-card">
          <h4>📜 SQL vs PL/SQL?</h4>
          <p>
            <b>SQL</b> คำสั่งคุยกับข้อมูล (SELECT, INSERT, ...){" "}
            <b>PL/SQL</b> เพิ่มตัวแปร/IF/LOOP ห่อ SQL อีกชั้น (เฉพาะ Oracle)
          </p>
        </div>
        <div className="intro-card">
          <h4>🔑 PK / FK / NN / UQ?</h4>
          <p>
            <span className="badge badge-pk">PK</span> ห้ามซ้ำ +ห้าม NULL ·{" "}
            <span className="badge badge-fk">FK</span> อ้างอิงตารางอื่น ·{" "}
            <span className="badge badge-nn">NN</span> ห้ามว่าง ·{" "}
            <span className="badge badge-uq">UQ</span> ห้ามซ้ำ
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">🗂 ตารางในระบบตอนนี้ ({schema.length})</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {schema.map((t) => (
            <div key={t.name} className="card-muted">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.emoji}</span>
                <span className="font-mono font-bold text-indigo-500">{t.name}</span>
                <span className="text-xs text-subtle">· {t.thaiName}</span>
              </div>
              <ul className="text-xs space-y-1">
                {t.columns.map((c) => (
                  <li key={c.name} className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono">{c.name}</span>
                    <span className="text-subtle text-[10px]">{formatType(c)}</span>
                    {c.pk && <span className="badge badge-pk">PK</span>}
                    {c.fk && <span className="badge badge-fk">FK</span>}
                    {!c.nullable && !c.pk && <span className="badge badge-nn">NN</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">🧭 เริ่มยังไง?</h3>
        <ol className="text-sm space-y-2 text-muted">
          <li>
            <span className="step-num">1</span>อ่าน <button className="btn-ghost" onClick={() => onGo("datatypes")}>Data Types</button>
            และ <button className="btn-ghost" onClick={() => onGo("constraints")}>Constraints</button> ก่อน
          </li>
          <li>
            <span className="step-num">2</span>ลอง <button className="btn-ghost" onClick={() => onGo("create-table")}>CREATE TABLE</button> ออกแบบตารางใหม่
          </li>
          <li>
            <span className="step-num">3</span><button className="btn-ghost" onClick={() => onGo("insert")}>INSERT</button> เพิ่มข้อมูล →
            <button className="btn-ghost" onClick={() => onGo("select")}>SELECT</button> ลองอ่าน
          </li>
          <li>
            <span className="step-num">4</span>ลอง <button className="btn-ghost" onClick={() => onGo("update")}>UPDATE</button> /
            <button className="btn-ghost" onClick={() => onGo("delete")}>DELETE</button> /
            <button className="btn-ghost" onClick={() => onGo("join")}>JOIN</button>
          </li>
          <li>
            <span className="step-num">5</span>สุดท้าย <button className="btn-ghost" onClick={() => onGo("plsql")}>PL/SQL</button>
          </li>
        </ol>
      </div>
    </div>
  );
}
