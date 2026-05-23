import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function AnalyticSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Analytic / Window functions = คำนวณค่าข้าม 'หน้าต่าง' ของแถว โดยไม่ต้อง GROUP BY"
        why="ต้องการลำดับ, รวมสะสม, เปรียบเทียบกับแถวก่อน/หลัง โดยยังเห็นทุกแถว — ไม่บีบเป็น 1 แถวเหมือน aggregate"
        how="<func>() OVER (PARTITION BY ... ORDER BY ...) — PARTITION = แบ่งกลุ่ม, ORDER = ลำดับใน partition"
        example={`SELECT first_name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank\nFROM employees;`}
      />
      <div className="card bg-amber-500/10 border-amber-500/30">
        <p className="text-sm text-amber-500">
          ⚠️ alasql รองรับ window functions แบบจำกัด — ตัวอย่างต่อไปนี้ใช้ syntax ของ Oracle / ANSI SQL จริง
        </p>
      </div>
      <RefList
        groups={[
          {
            title: "Ranking",
            emoji: "🏆",
            color: "amber",
            items: [
              {
                name: "ROW_NUMBER",
                syntax: "ROW_NUMBER() OVER (ORDER BY col)",
                thai: "ลำดับต่อเนื่อง 1, 2, 3, ... ไม่ซ้ำแม้ค่าเท่ากัน",
                example: `SELECT first_name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
FROM employees;`,
                note: "ใช้แบ่งเพจ (pagination) บ่อย",
              },
              {
                name: "RANK",
                syntax: "RANK() OVER (ORDER BY col)",
                thai: "ลำดับ — ค่าเท่ากันได้ลำดับเดียวกัน แล้วเว้นช่วง",
                example: `SELECT first_name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rk
FROM employees;`,
                result: "ถ้ามี 2 คนเงิน 75000: ได้ลำดับ 1, 1, แล้วลำดับ 3 (ข้าม 2)",
              },
              {
                name: "DENSE_RANK",
                syntax: "DENSE_RANK() OVER (ORDER BY col)",
                thai: "เหมือน RANK แต่ไม่เว้นช่วง — 1, 1, 2",
                example: `SELECT first_name, salary,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
FROM employees;`,
              },
              {
                name: "NTILE(n)",
                syntax: "NTILE(4) OVER (...)",
                thai: "แบ่งเป็น n กลุ่มเท่ากัน — เช่น NTILE(4) = quartile",
                example: `SELECT first_name, salary,
  NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;`,
              },
            ],
          },
          {
            title: "PARTITION BY",
            emoji: "📊",
            color: "emerald",
            items: [
              {
                name: "Rank ภายในกลุ่ม",
                thai: "ลำดับเงินเดือนใน แต่ละแผนก แยกกัน",
                example: `SELECT first_name, dept_id, salary,
  RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rank_in_dept
FROM employees;`,
              },
              {
                name: "Top N per group",
                thai: "ดึง top-2 ของแต่ละแผนก (ใช้ใน subquery)",
                example: `SELECT * FROM (
  SELECT e.*,
    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
  FROM employees e
)
WHERE rn <= 2;`,
              },
            ],
          },
          {
            title: "Aggregate window",
            emoji: "🧮",
            color: "sky",
            items: [
              {
                name: "Running total",
                thai: "ผลรวมสะสม — ORDER BY แล้วใส่ window frame",
                example: `SELECT first_name, salary,
  SUM(salary) OVER (ORDER BY emp_id) AS running_total
FROM employees;`,
              },
              {
                name: "% of total",
                thai: "เงินเดือนคิดเป็นกี่ % ของรวมในแผนก",
                example: `SELECT first_name, salary,
  ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY dept_id), 1) AS pct_in_dept
FROM employees;`,
              },
            ],
          },
          {
            title: "LAG / LEAD",
            emoji: "↔️",
            color: "violet",
            items: [
              {
                name: "LAG",
                syntax: "LAG(col, offset, default) OVER (...)",
                thai: "ค่าของคอลัมน์ในแถวก่อนหน้า (offset แถว)",
                example: `SELECT first_name, salary,
  LAG(salary, 1, 0) OVER (ORDER BY hire_date) AS prev_salary
FROM employees;`,
              },
              {
                name: "LEAD",
                syntax: "LEAD(col, offset, default) OVER (...)",
                thai: "ค่าของคอลัมน์ในแถวถัดไป",
                example: `SELECT first_name, hire_date,
  LEAD(hire_date) OVER (ORDER BY hire_date) AS next_hire
FROM employees;`,
              },
              {
                name: "FIRST_VALUE / LAST_VALUE",
                thai: "ค่าแรก/ค่าสุดท้ายใน window",
                example: `SELECT first_name, salary,
  FIRST_VALUE(salary) OVER (PARTITION BY dept_id ORDER BY salary DESC) AS top_in_dept
FROM employees;`,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
