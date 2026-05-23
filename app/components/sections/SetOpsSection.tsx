import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function SetOpsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Set operations = รวม/ตัด/ลบผลของ 2 SELECT — UNION, INTERSECT, MINUS"
        why="ผลลัพธ์มาจากหลาย source ต้องรวม, ต้องหาว่า A∩B หรือ A−B — เร็วกว่าใช้ JOIN+CASE"
        how="SELECT ... <op> SELECT ... → จำนวน/ชนิดคอลัมน์ต้องตรงกันทั้งสอง"
        example={`SELECT first_name FROM employees\nUNION\nSELECT dept_name FROM departments;`}
      />
      <RefList
        groups={[
          {
            title: "ตัวกระทำการ set",
            emoji: "🔀",
            color: "violet",
            items: [
              {
                name: "UNION",
                syntax: "q1 UNION q2",
                thai: "รวม 2 ผลลัพธ์ + ตัดซ้าย — ผลที่ออกซ้ำกันจะเหลือแถวเดียว",
                example: `SELECT dept_id FROM employees
UNION
SELECT dept_id FROM projects;`,
                runnable: true,
                note: "ได้ dept_id ทั้งหมดที่ปรากฏในตารางใดตารางหนึ่ง (ไม่ซ้ำ)",
              },
              {
                name: "UNION ALL",
                syntax: "q1 UNION ALL q2",
                thai: "รวม 2 ผลลัพธ์ — เก็บแถวซ้ำไว้ด้วย เร็วกว่า UNION เพราะไม่ต้อง sort",
                example: `SELECT 'IT' AS src, COUNT(*) AS n FROM employees WHERE dept_id = 10
UNION ALL
SELECT 'Sales', COUNT(*) FROM employees WHERE dept_id = 20;`,
                runnable: true,
              },
              {
                name: "INTERSECT",
                syntax: "q1 INTERSECT q2",
                thai: "เอาเฉพาะที่อยู่ในทั้งสอง",
                example: `SELECT dept_id FROM employees
INTERSECT
SELECT dept_id FROM projects;`,
                runnable: true,
                note: "แผนกที่ทั้งมีพนักงาน + มีโครงการ",
              },
              {
                name: "MINUS",
                syntax: "q1 MINUS q2",
                thai: "เอาที่อยู่ใน q1 แต่ไม่อยู่ใน q2 — Oracle เฉพาะ (SQL standard = EXCEPT)",
                example: `SELECT dept_id FROM departments
MINUS
SELECT dept_id FROM employees;`,
                note: "แผนกที่ยังไม่มีพนักงาน",
              },
            ],
          },
          {
            title: "ข้อควรระวัง",
            emoji: "⚠️",
            color: "rose",
            items: [
              { name: "จำนวนคอลัมน์ต้องเท่ากัน", thai: "ทั้ง 2 ฝั่งต้องมีจำนวนคอลัมน์เท่ากัน และ type compatible" },
              { name: "ชื่อคอลัมน์ใช้จากฝั่งซ้าย", thai: "ผลลัพธ์รวมจะใช้ชื่อ alias/คอลัมน์จาก query แรก" },
              { name: "ORDER BY ใส่ท้ายสุดเท่านั้น", thai: "วาง ORDER BY ใน query ย่อยไม่ได้ — ต้องอยู่หลัง union", example: "SELECT a FROM t1\nUNION\nSELECT b FROM t2\nORDER BY 1;" },
            ],
          },
        ]}
      />
    </div>
  );
}
