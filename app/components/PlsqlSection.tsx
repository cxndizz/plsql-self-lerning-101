"use client";

import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";

const EXAMPLES: { title: string; code: string; explain: { line: string; thai: string }[]; output: string }[] = [
  {
    title: "1️⃣ Anonymous Block: ทักทาย",
    code: `DECLARE
  v_name VARCHAR2(50) := 'สมชาย';
BEGIN
  DBMS_OUTPUT.PUT_LINE('สวัสดี ' || v_name);
END;`,
    explain: [
      { line: "DECLARE", thai: "ส่วนประกาศตัวแปร (เลือกใส่หรือไม่ก็ได้)" },
      { line: "v_name VARCHAR2(50) := 'สมชาย'", thai: "สร้างตัวแปร v_name เก็บข้อความ ความยาวสูงสุด 50 ตัว ตั้งค่าเริ่มต้น" },
      { line: "BEGIN ... END", thai: "เปิด-ปิดบล็อกที่จะรันจริง" },
      { line: "DBMS_OUTPUT.PUT_LINE(...)", thai: "พิมพ์ออกหน้าจอ (เหมือน console.log) — ใช้ || ต่อข้อความ" },
    ],
    output: "สวัสดี สมชาย",
  },
  {
    title: "2️⃣ IF / ELSIF / ELSE",
    code: `DECLARE
  v_salary NUMBER := 45000;
BEGIN
  IF v_salary > 60000 THEN
    DBMS_OUTPUT.PUT_LINE('เงินเดือนสูงมาก');
  ELSIF v_salary > 40000 THEN
    DBMS_OUTPUT.PUT_LINE('เงินเดือนปานกลาง');
  ELSE
    DBMS_OUTPUT.PUT_LINE('เงินเดือนต่ำ');
  END IF;
END;`,
    explain: [
      { line: "IF condition THEN", thai: "ถ้าเงื่อนไขเป็นจริง จะรันบรรทัดถัดไป" },
      { line: "ELSIF condition THEN", thai: "ตรวจเงื่อนไขเพิ่มเติม (สังเกตสะกด ELSIF ไม่ใช่ ELSEIF)" },
      { line: "ELSE", thai: "ถ้าไม่ตรงกับ IF/ELSIF ใดเลย" },
      { line: "END IF;", thai: "ปิด IF — ต้องมีเสมอ" },
    ],
    output: "เงินเดือนปานกลาง",
  },
  {
    title: "3️⃣ Numeric FOR LOOP",
    code: `BEGIN
  FOR i IN 1..5 LOOP
    DBMS_OUTPUT.PUT_LINE('รอบที่ ' || i);
  END LOOP;
END;`,
    explain: [
      { line: "FOR i IN 1..5 LOOP", thai: "วน i จาก 1 ถึง 5 (ครบทั้งสองค่า) — ไม่ต้องประกาศ i ก่อน" },
      { line: "END LOOP;", thai: "ปิดลูป" },
    ],
    output: "รอบที่ 1\nรอบที่ 2\nรอบที่ 3\nรอบที่ 4\nรอบที่ 5",
  },
  {
    title: "4️⃣ Cursor FOR LOOP (วน SELECT)",
    code: `BEGIN
  FOR emp IN (
    SELECT first_name, salary FROM employees WHERE salary > 40000
  ) LOOP
    DBMS_OUTPUT.PUT_LINE(emp.first_name || ' = ' || emp.salary);
  END LOOP;
END;`,
    explain: [
      { line: "FOR emp IN ( SELECT ... )", thai: "implicit cursor — วนทุกแถวจาก SELECT โดยไม่ต้องเปิด/ปิด cursor เอง" },
      { line: "emp.first_name", thai: "เข้าถึงคอลัมน์ของแถวปัจจุบันผ่านชื่อ record" },
    ],
    output: "สุดา = 52000\nพิมพ์ = 75000\nธนา = 48000\nอรอนงค์ = 62000",
  },
  {
    title: "5️⃣ Procedure (เก็บไว้เรียกซ้ำ)",
    code: `CREATE OR REPLACE PROCEDURE give_raise (
  p_emp_id  IN NUMBER,
  p_percent IN NUMBER
) AS
BEGIN
  UPDATE employees
  SET    salary = salary * (1 + p_percent / 100)
  WHERE  emp_id = p_emp_id;
END;
/

-- เรียกใช้:
BEGIN
  give_raise(3, 10);  -- ขึ้นเงินเดือนพนักงาน id=3 อีก 10%
END;`,
    explain: [
      { line: "CREATE OR REPLACE PROCEDURE name (...)", thai: "สร้าง stored procedure เก็บไว้ใน DB เรียกใช้ได้ภายหลัง" },
      { line: "p_emp_id IN NUMBER", thai: "พารามิเตอร์ขาเข้า (IN) — มี OUT และ IN OUT ด้วย" },
      { line: "/", thai: "เครื่องหมายปิด PL/SQL block ใน SQL*Plus / SQL Developer" },
    ],
    output: "(ไม่มีข้อความออก แต่ salary ในตาราง employees ถูกอัปเดต)",
  },
  {
    title: "6️⃣ EXCEPTION (จัดการ error)",
    code: `DECLARE
  v_salary NUMBER;
BEGIN
  SELECT salary INTO v_salary
  FROM   employees
  WHERE  emp_id = 999;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('ไม่พบพนักงานคนนี้');
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;`,
    explain: [
      { line: "SELECT ... INTO v_salary", thai: "ดึงค่าจาก SQL มาเก็บในตัวแปร — ถ้าไม่เจอจะเกิด NO_DATA_FOUND" },
      { line: "EXCEPTION WHEN ... THEN", thai: "ดักจับ error เฉพาะแบบ" },
      { line: "WHEN OTHERS THEN", thai: "ดักทุก error ที่เหลือ — ใส่ไว้ท้ายสุด" },
      { line: "SQLERRM", thai: "ข้อความ error ของ Oracle" },
    ],
    output: "ไม่พบพนักงานคนนี้",
  },
];

export function PlsqlSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="PL/SQL = Procedural Language / SQL ของ Oracle — เพิ่มตัวแปร, IF, LOOP, Procedure, Function มาคลุม SQL"
        why="SQL อย่างเดียวคุยกับข้อมูลเป็นชุด แต่บางงานต้องตรวจเงื่อนไข วน loop หรือเก็บ logic ไว้ฝั่ง DB — PL/SQL ตอบโจทย์"
        how="เขียนในรูปแบบ block: [DECLARE] → BEGIN → ... → [EXCEPTION] → END; รันใน SQL*Plus, SQL Developer, หรือ tool อื่น"
        example={`DECLARE\n  v_x NUMBER := 10;\nBEGIN\n  IF v_x > 5 THEN\n    DBMS_OUTPUT.PUT_LINE('big');\n  END IF;\nEND;`}
      />

      <div className="card bg-amber-50 border-amber-200">
        <p className="text-sm text-amber-800">
          ⚠️ <b>หมายเหตุ:</b> ตัวอย่างด้านล่างเป็น PL/SQL จริงของ Oracle <b>รันใน browser ไม่ได้</b> —
          เพราะ alasql ในหน้านี้รองรับแค่ SQL พื้นฐาน (SELECT/INSERT/UPDATE/DELETE/JOIN) ถ้าอยากลองจริงต้องใช้ Oracle DB + SQL Developer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {EXAMPLES.map((ex) => (
          <div key={ex.title} className="card">
            <h3 className="font-bold text-base mb-3">{ex.title}</h3>
            <SqlBox sql={ex.code} />
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-500 mb-1">อธิบายทีละบรรทัด</div>
              <ul className="space-y-1.5">
                {ex.explain.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs">
                    <code className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">{p.line}</code>
                    <span className="text-slate-700">{p.thai}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-500 mb-1">📺 Output</div>
              <pre className="bg-slate-900 text-emerald-200 text-xs p-2 rounded whitespace-pre-wrap">{ex.output}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
