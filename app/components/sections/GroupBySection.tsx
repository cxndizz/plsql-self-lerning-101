import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function GroupBySection() {
  return (
    <div className="space-y-5">
      <Intro
        what="GROUP BY = จัดกลุ่มแถวตามค่าของคอลัมน์ แล้วใช้ aggregate กับแต่ละกลุ่ม"
        why="เช่น 'เงินเดือนเฉลี่ยของแต่ละแผนก', 'ยอดขายต่อเดือน' — งานรายงานทั้งหมด"
        how="SELECT col1, agg(col2) FROM ... GROUP BY col1 → 1 แถวต่อ 1 กลุ่ม"
        example={`SELECT dept_id, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY dept_id;`}
      />
      <RefList
        groups={[
          {
            title: "GROUP BY พื้นฐาน",
            emoji: "📦",
            color: "emerald",
            items: [
              {
                name: "Group by 1 คอลัมน์",
                thai: "นับพนักงานในแต่ละแผนก",
                example: `SELECT dept_id, COUNT(*) AS num_emp
FROM employees
GROUP BY dept_id;`,
                runnable: true,
              },
              {
                name: "Group by หลายคอลัมน์",
                thai: "ทุก combination ของคอลัมน์เป็น 1 กลุ่ม",
                example: `SELECT dept_id, EXTRACT(YEAR FROM hire_date) AS yr, COUNT(*)
FROM employees
GROUP BY dept_id, EXTRACT(YEAR FROM hire_date);`,
                runnable: true,
              },
              {
                name: "Aggregate หลายตัว",
                thai: "ดู count + sum + avg ในผลเดียวกัน",
                example: `SELECT dept_id,
  COUNT(*) AS n,
  SUM(salary) AS total,
  ROUND(AVG(salary),0) AS avg_sal,
  MIN(salary) AS min_sal,
  MAX(salary) AS max_sal
FROM employees
GROUP BY dept_id;`,
                runnable: true,
              },
            ],
          },
          {
            title: "HAVING (กรองกลุ่ม)",
            emoji: "🎯",
            color: "amber",
            items: [
              {
                name: "HAVING",
                syntax: "GROUP BY ... HAVING <cond>",
                thai: "กรองเฉพาะกลุ่มที่ผ่านเงื่อนไข — ต่างจาก WHERE ตรงที่ WHERE กรองก่อน group, HAVING กรองหลัง",
                example: `SELECT dept_id, COUNT(*) AS n
FROM employees
GROUP BY dept_id
HAVING COUNT(*) >= 2;`,
                runnable: true,
                note: "เอาเฉพาะแผนกที่มีพนักงาน ≥ 2 คน",
              },
              {
                name: "WHERE vs HAVING",
                thai: "ใช้พร้อมกันได้ — WHERE กรองแถวดิบ, HAVING กรองหลัง aggregate",
                example: `SELECT dept_id, AVG(salary) AS avg_sal
FROM employees
WHERE salary IS NOT NULL          -- กรองก่อน group
GROUP BY dept_id
HAVING AVG(salary) > 40000;       -- กรองหลัง group`,
                runnable: true,
              },
            ],
          },
          {
            title: "💡 Tips",
            emoji: "🧠",
            color: "indigo",
            items: [
              { name: "ลำดับ clause", thai: "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY", example: "SELECT col, agg(...)\nFROM t\nWHERE ...     -- กรองก่อน\nGROUP BY col\nHAVING agg(...) -- กรองหลัง\nORDER BY ...;" },
              { name: "SELECT คอลัมน์ใน GROUP BY เท่านั้น", thai: "ในมาตรฐาน SQL คอลัมน์ใน SELECT ต้องอยู่ใน GROUP BY หรือเป็น aggregate" },
              { name: "Group by expression", thai: "ใช้ expression เป็น key ได้ เช่น GROUP BY TRUNC(hire_date, 'YYYY')", example: "SELECT TRUNC(hire_date, 'YYYY') AS year, COUNT(*)\nFROM employees\nGROUP BY TRUNC(hire_date, 'YYYY');" },
            ],
          },
        ]}
      />
    </div>
  );
}
