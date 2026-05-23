import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function AggregateSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Aggregate functions = ฟังก์ชันสรุปข้อมูล — บีบหลายแถวเป็นค่าเดียว"
        why="รายงานต้องการ 'จำนวนพนักงาน', 'เงินเดือนรวม', 'เฉลี่ย' — ทุกแบบใช้ aggregate"
        how="ใส่ใน SELECT — ถ้าไม่ใช้ GROUP BY จะรวมทุกแถวเป็น 1 แถวผลลัพธ์"
        example={`SELECT COUNT(*) AS num_emp, AVG(salary) AS avg_sal\nFROM employees;`}
      />
      <RefList
        groups={[
          {
            title: "Aggregate ทั่วไป",
            emoji: "📊",
            color: "emerald",
            items: [
              { name: "COUNT(*)", syntax: "COUNT(*)", thai: "นับจำนวนแถวทั้งหมด — รวม NULL ด้วย", example: "SELECT COUNT(*) AS num_emp FROM employees;", runnable: true },
              { name: "COUNT(col)", syntax: "COUNT(col)", thai: "นับเฉพาะแถวที่ col ไม่เป็น NULL", example: "SELECT COUNT(dept_id) AS with_dept FROM employees;", runnable: true },
              { name: "COUNT(DISTINCT col)", syntax: "COUNT(DISTINCT col)", thai: "นับค่าที่ไม่ซ้ำ", example: "SELECT COUNT(DISTINCT dept_id) AS num_depts FROM employees;", runnable: true },
              { name: "SUM", syntax: "SUM(col)", thai: "ผลรวม (ข้าม NULL)", example: "SELECT SUM(salary) AS total_payroll FROM employees;", runnable: true },
              { name: "AVG", syntax: "AVG(col)", thai: "ค่าเฉลี่ย — ข้าม NULL", example: "SELECT AVG(salary) AS avg_sal FROM employees;", runnable: true },
              { name: "MIN / MAX", syntax: "MIN(col) / MAX(col)", thai: "ค่าต่ำสุด/สูงสุด — ใช้ได้กับตัวเลข, วันที่, string", example: "SELECT MIN(salary), MAX(salary) FROM employees;", runnable: true },
            ],
          },
          {
            title: "ผสมกับ DISTINCT",
            emoji: "🎯",
            color: "sky",
            items: [
              { name: "SUM(DISTINCT)", thai: "ผลรวมของค่าที่ไม่ซ้ำเท่านั้น", example: "SELECT SUM(DISTINCT salary) FROM employees;", runnable: true },
              { name: "หลายอันใน SELECT", thai: "ใส่หลาย aggregate ในแถวเดียวได้", example: "SELECT\n  COUNT(*) AS n,\n  MIN(salary) AS lo,\n  MAX(salary) AS hi,\n  ROUND(AVG(salary),0) AS avg_sal\nFROM employees;", runnable: true },
            ],
          },
          {
            title: "ระวัง!",
            emoji: "⚠️",
            color: "rose",
            items: [
              { name: "NULL ถูกข้าม", thai: "AVG, SUM, MIN, MAX, COUNT(col) ข้าม NULL หมด — ระวังตอนตีความ", example: "-- ถ้า salary มี 3 ค่า: 100, 200, NULL\n-- AVG = (100+200)/2 = 150 (ไม่ใช่ 100)" },
              { name: "ผสมคอลัมน์ดิบ ไม่ได้", thai: "ถ้ามี aggregate ใน SELECT ต้องไม่ใส่คอลัมน์อื่นที่ไม่อยู่ใน GROUP BY", example: "-- ผิด:\nSELECT first_name, COUNT(*) FROM employees;\n-- ถูก:\nSELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id;" },
            ],
          },
        ]}
      />
    </div>
  );
}
