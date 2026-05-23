import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function SubquerySection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Subquery = SELECT ซ้อนใน SELECT, WHERE, FROM — ใช้ผลของ query หนึ่งเป็น input อีก query"
        why="คำถามซับซ้อนแบบ 'หาคนที่เงินเดือนเกินค่าเฉลี่ย' ต้องคำนวณค่าเฉลี่ยก่อน แล้วเอามาเปรียบเทียบ"
        how="ใส่ในวงเล็บ ( ... ) แล้ววางในตำแหน่งที่รับค่า — scalar (1 ค่า), row (1 แถว), table (หลายแถว)"
        example={`SELECT first_name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);`}
      />
      <RefList
        groups={[
          {
            title: "Scalar Subquery — คืน 1 ค่า",
            emoji: "🎯",
            color: "sky",
            items: [
              {
                name: "ใน WHERE",
                thai: "เปรียบเทียบกับค่าเดียวที่คำนวณจาก subquery",
                example: `SELECT first_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);`,
                runnable: true,
                note: "หาพนักงานที่เงินเดือนสูงกว่าค่าเฉลี่ย",
              },
              {
                name: "ใน SELECT",
                thai: "เอาค่าจาก subquery มาเป็นคอลัมน์",
                example: `SELECT first_name, salary,
  (SELECT AVG(salary) FROM employees) AS company_avg,
  salary - (SELECT AVG(salary) FROM employees) AS diff
FROM employees;`,
                runnable: true,
              },
            ],
          },
          {
            title: "Multi-row Subquery (IN / ANY / ALL)",
            emoji: "📋",
            color: "emerald",
            items: [
              {
                name: "IN",
                syntax: "col IN (SELECT ...)",
                thai: "ในชุดของหลายค่า",
                example: `SELECT first_name
FROM employees
WHERE dept_id IN (
  SELECT dept_id FROM departments WHERE location = 'กรุงเทพ'
);`,
                runnable: true,
              },
              {
                name: "NOT IN",
                thai: "ไม่อยู่ในชุด — ⚠️ ถ้า subquery มี NULL จะไม่ return เลย",
                example: `SELECT * FROM departments
WHERE dept_id NOT IN (SELECT dept_id FROM employees WHERE dept_id IS NOT NULL);`,
                runnable: true,
                note: "หาแผนกที่ไม่มีพนักงานเลย",
              },
              {
                name: "ANY / ALL",
                syntax: "> ANY(...) / > ALL(...)",
                thai: "ANY = ผ่านอย่างน้อย 1 ค่า · ALL = ผ่านทุกค่า",
                example: `SELECT first_name, salary
FROM employees
WHERE salary > ALL (
  SELECT salary FROM employees WHERE dept_id = 10
);`,
                note: "เงินเดือนมากกว่าทุกคนในแผนก IT",
              },
            ],
          },
          {
            title: "EXISTS / NOT EXISTS",
            emoji: "❓",
            color: "violet",
            items: [
              {
                name: "EXISTS",
                syntax: "WHERE EXISTS (SELECT ...)",
                thai: "ถ้า subquery มีแถว = TRUE — มักเร็วกว่า IN ในข้อมูลใหญ่",
                example: `SELECT d.*
FROM departments d
WHERE EXISTS (
  SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id
);`,
                runnable: true,
                note: "แผนกที่มีพนักงานอย่างน้อย 1 คน — correlated subquery",
              },
              {
                name: "NOT EXISTS",
                thai: "ตรงข้าม — ไม่มีแถวเลย",
                example: `SELECT d.*
FROM departments d
WHERE NOT EXISTS (
  SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id
);`,
                runnable: true,
                note: "แผนกที่ไม่มีพนักงานเลย — รับมือ NULL ดีกว่า NOT IN",
              },
            ],
          },
          {
            title: "Inline View (FROM subquery)",
            emoji: "🗂️",
            color: "amber",
            items: [
              {
                name: "FROM (SELECT ...)",
                thai: "ใช้ผลของ subquery เป็นตารางชั่วคราว — มี alias",
                example: `SELECT dept_id, max_sal
FROM (
  SELECT dept_id, MAX(salary) AS max_sal
  FROM employees
  GROUP BY dept_id
) ranking
WHERE max_sal > 50000;`,
                runnable: true,
              },
              {
                name: "WITH (Common Table Expression)",
                syntax: "WITH name AS (SELECT ...) SELECT ...",
                thai: "ตั้งชื่อ subquery ไว้ก่อน อ่านง่ายกว่า nested — ใช้ซ้ำได้ในเดียวกัน",
                example: `WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept_id
)
SELECT e.first_name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d ON e.dept_id = d.dept_id;`,
                runnable: true,
                note: "เรียก CTE — สะอาดมาก เหมาะ query ซับซ้อน",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
