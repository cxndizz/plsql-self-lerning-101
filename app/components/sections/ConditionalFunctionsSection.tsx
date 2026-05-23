import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function ConditionalFunctionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Conditional = แสดงค่าตามเงื่อนไข เช่น IF-THEN-ELSE ในผลลัพธ์ SQL — ใช้ CASE หรือ DECODE"
        why="แปลค่าให้อ่านง่ายใน report (10→'IT', 20→'Sales'), จัด band ของเงินเดือน, ทำ pivot ง่ายๆ"
        how="ใส่ใน SELECT projection, WHERE, ORDER BY, GROUP BY ได้ทั้งหมด"
      />
      <RefList
        groups={[
          {
            title: "CASE (ตามมาตรฐาน SQL)",
            emoji: "🎚️",
            color: "indigo",
            items: [
              {
                name: "Simple CASE",
                syntax: "CASE col WHEN v1 THEN ... ELSE ... END",
                thai: "เทียบค่าตรงๆ — เหมือน switch ในภาษาโปรแกรม",
                example: `SELECT first_name,
  CASE dept_id
    WHEN 10 THEN 'IT'
    WHEN 20 THEN 'Sales'
    WHEN 30 THEN 'HR'
    ELSE 'ไม่มีแผนก'
  END AS dept
FROM employees;`,
                runnable: true,
              },
              {
                name: "Searched CASE",
                syntax: "CASE WHEN cond THEN ... ELSE ... END",
                thai: "เงื่อนไขซับซ้อนได้ — เปรียบเทียบไม่ใช่ค่าเดียว",
                example: `SELECT first_name, salary,
  CASE
    WHEN salary >= 60000 THEN 'High'
    WHEN salary >= 40000 THEN 'Medium'
    ELSE 'Low'
  END AS band
FROM employees;`,
                runnable: true,
              },
              {
                name: "CASE ใน WHERE",
                thai: "ใช้กรองข้อมูลตามเงื่อนไขซับซ้อน",
                example: `SELECT * FROM employees
WHERE CASE WHEN dept_id IS NULL THEN 0 ELSE 1 END = 1;`,
                runnable: true,
              },
            ],
          },
          {
            title: "DECODE (Oracle เฉพาะ)",
            emoji: "🔀",
            color: "violet",
            items: [
              {
                name: "DECODE",
                syntax: "DECODE(expr, v1, r1, v2, r2, ..., default)",
                thai: "เหมือน Simple CASE แต่สั้นกว่า — เฉพาะ Oracle",
                example: `SELECT first_name,
  DECODE(dept_id, 10, 'IT', 20, 'Sales', 30, 'HR', 'อื่นๆ') AS dept
FROM employees;`,
                runnable: false,
                note: "Oracle เท่านั้น — alasql รันไม่ได้ ใช้ CASE แทน",
              },
              {
                name: "DECODE กับ NULL",
                thai: "DECODE ถือว่า NULL = NULL (ต่างจาก = ปกติ) — ใช้ค้น NULL ได้",
                example: `SELECT DECODE(dept_id, NULL, 'ไม่มีแผนก', 'มีแผนก') FROM employees;`,
              },
            ],
          },
          {
            title: "Use cases",
            emoji: "💡",
            color: "emerald",
            items: [
              {
                name: "Pivot อย่างง่าย",
                thai: "นับจำนวนพนักงานแต่ละแผนกแบบแนวนอน",
                example: `SELECT
  SUM(CASE WHEN dept_id = 10 THEN 1 ELSE 0 END) AS it_count,
  SUM(CASE WHEN dept_id = 20 THEN 1 ELSE 0 END) AS sales_count,
  SUM(CASE WHEN dept_id = 30 THEN 1 ELSE 0 END) AS hr_count
FROM employees;`,
                runnable: true,
              },
              {
                name: "Custom sort",
                thai: "เรียงให้ผู้จัดการ (พิมพ์) ขึ้นก่อน",
                example: `SELECT first_name, salary
FROM employees
ORDER BY
  CASE WHEN first_name = 'พิมพ์' THEN 0 ELSE 1 END,
  salary DESC;`,
                runnable: true,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
