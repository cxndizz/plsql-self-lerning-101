import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function ViewSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="VIEW = 'ตารางเสมือน' — เป็นชื่อตั้งไว้ให้ SELECT ใช้ซ้ำได้ ไม่เก็บข้อมูลจริง (เก็บแค่ definition)"
        why="ซ่อน complexity, รวม logic, จำกัดสิทธิ์เห็นบางคอลัมน์, แชร์ query มาตรฐานทั่วบริษัท"
        how="CREATE VIEW name AS SELECT ... — ใช้เหมือนตารางได้เลย"
        example={`CREATE VIEW high_earners AS\nSELECT first_name, salary FROM employees WHERE salary > 50000;\n\nSELECT * FROM high_earners;`}
      />
      <RefList
        groups={[
          {
            title: "สร้าง / แก้ / ลบ",
            emoji: "🏗️",
            color: "sky",
            items: [
              {
                name: "CREATE VIEW",
                syntax: "CREATE VIEW name AS SELECT ...",
                thai: "สร้าง view ใหม่",
                example: `CREATE VIEW emp_with_dept AS
SELECT e.emp_id, e.first_name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;`,
              },
              {
                name: "CREATE OR REPLACE",
                thai: "สร้าง หรือทับของเดิม — ใช้บ่อยตอน update definition",
                example: `CREATE OR REPLACE VIEW emp_with_dept AS
SELECT e.*, d.dept_name, d.location
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;`,
              },
              {
                name: "DROP VIEW",
                thai: "ลบ view (ข้อมูลในตารางจริงไม่กระทบ)",
                example: "DROP VIEW emp_with_dept;",
              },
            ],
          },
          {
            title: "Updatable vs Read-only",
            emoji: "✏️",
            color: "emerald",
            items: [
              {
                name: "View อย่างง่าย",
                thai: "ถ้าเป็น SELECT ตรงๆ จาก 1 ตาราง + ไม่มี aggregate/group/distinct → INSERT/UPDATE/DELETE ผ่าน view ได้",
                example: `CREATE VIEW active_emps AS
SELECT * FROM employees WHERE status = 'A';

UPDATE active_emps SET salary = salary * 1.1;  -- ⬅ ทำได้`,
              },
              {
                name: "Read-only view",
                thai: "View ที่มี JOIN, aggregate, GROUP BY, DISTINCT → INSERT/UPDATE/DELETE ไม่ได้",
                example: `CREATE VIEW dept_summary AS
SELECT dept_id, COUNT(*) AS n
FROM employees
GROUP BY dept_id;
-- read-only แน่นอน เพราะมี GROUP BY`,
              },
              {
                name: "WITH READ ONLY",
                thai: "บังคับ read-only ด้วย clause นี้",
                example: `CREATE VIEW report_v AS
SELECT * FROM employees
WITH READ ONLY;`,
              },
              {
                name: "WITH CHECK OPTION",
                thai: "INSERT/UPDATE ผ่าน view ต้องไม่ทำให้แถวหลุดจาก WHERE ของ view",
                example: `CREATE VIEW high_paid AS
SELECT * FROM employees WHERE salary > 50000
WITH CHECK OPTION;
-- UPDATE high_paid SET salary = 30000  → ❌ error`,
              },
            ],
          },
          {
            title: "Materialized View",
            emoji: "💾",
            color: "violet",
            items: [
              {
                name: "MATERIALIZED VIEW",
                thai: "เก็บผลลัพธ์จริง (cache) — ดึงเร็วกว่า view ปกติ แต่ต้อง refresh เมื่อข้อมูลเปลี่ยน",
                example: `CREATE MATERIALIZED VIEW dept_summary
REFRESH ON COMMIT
AS
SELECT dept_id, COUNT(*) AS n, SUM(salary) AS total
FROM employees
GROUP BY dept_id;`,
                note: "เหมาะกับ report ที่ใช้บ่อยและข้อมูลไม่ค่อยเปลี่ยน",
              },
              {
                name: "REFRESH",
                thai: "ON COMMIT = update ทันทีหลัง commit · ON DEMAND = ต้องเรียก DBMS_MVIEW.REFRESH() เอง",
                example: `EXEC DBMS_MVIEW.REFRESH('dept_summary');`,
              },
            ],
          },
          {
            title: "💡 ใช้ในการณ์ไหน",
            emoji: "🎯",
            color: "amber",
            items: [
              { name: "Hide columns", thai: "ปกปิดคอลัมน์ลับ เช่นเงินเดือน — ให้ user เห็นเฉพาะคอลัมน์ที่อนุญาต" },
              { name: "ลด duplication", thai: "JOIN ซับซ้อนใช้บ่อย → ทำเป็น view ใช้ซ้ำได้" },
              { name: "Abstraction", thai: "ถ้าตารางจริงเปลี่ยนชื่อ/structure → แก้ view อย่างเดียว app ไม่เปลี่ยน" },
              { name: "Security", thai: "GRANT SELECT บน view โดยไม่ให้สิทธิ์ตารางจริง" },
            ],
          },
        ]}
      />
    </div>
  );
}
