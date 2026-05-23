import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function NullFunctionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="NULL handling = ฟังก์ชันจัดการค่าว่าง — NVL, NVL2, COALESCE, NULLIF"
        why="NULL ทำให้คำนวณพัง (NULL+5 = NULL), เปรียบเทียบไม่ได้ตรงๆ (= NULL ไม่เคยจริง) — ต้องแปลงก่อนใช้"
        how="ส่วนใหญ่ใช้ห่อคอลัมน์ที่ nullable แล้วใส่ default value แทน NULL"
        example={`SELECT first_name, NVL(salary, 0) AS safe_salary\nFROM employees;`}
      />
      <RefList
        groups={[
          {
            title: "แทนค่า NULL",
            emoji: "🛡️",
            color: "emerald",
            items: [
              { name: "NVL", syntax: "NVL(value, default)", thai: "ถ้า value เป็น NULL คืน default มาแทน", example: "SELECT first_name, NVL(dept_id, -1) AS dept\nFROM employees;", runnable: true, note: "ใช้บ่อยที่สุด" },
              { name: "NVL2", syntax: "NVL2(value, if_not_null, if_null)", thai: "เลือกได้ทั้งสองทาง — ถ้ามีค่าใช้อันแรก, ถ้า NULL ใช้อันสอง", example: "SELECT first_name,\n  NVL2(dept_id, 'มีแผนก', 'ยังไม่ได้กำหนด') AS status\nFROM employees;", runnable: true },
              { name: "COALESCE", syntax: "COALESCE(v1, v2, v3, ...)", thai: "คืนค่าแรกที่ไม่เป็น NULL — รับหลาย argument", example: "SELECT COALESCE(NULL, NULL, 'first', 'second') FROM dual;", result: "first" },
              { name: "NULLIF", syntax: "NULLIF(a, b)", thai: "ถ้า a = b คืน NULL ถ้าไม่เท่าคืน a — ใช้ป้องกัน divide-by-zero", example: "SELECT 100 / NULLIF(0, 0) FROM dual;", result: "NULL (ไม่ error)" },
            ],
          },
          {
            title: "ตรวจ NULL",
            emoji: "🔍",
            color: "amber",
            items: [
              { name: "IS NULL", syntax: "col IS NULL", thai: "เช็คว่าคอลัมน์เป็น NULL — ห้ามใช้ = NULL", example: "SELECT * FROM employees WHERE dept_id IS NULL;", runnable: true },
              { name: "IS NOT NULL", syntax: "col IS NOT NULL", thai: "ตรงข้าม — เอาเฉพาะแถวที่มีค่า", example: "SELECT COUNT(*) AS with_dept FROM employees\nWHERE dept_id IS NOT NULL;", runnable: true },
            ],
          },
          {
            title: "⚠️ กับดักของ NULL",
            emoji: "💀",
            color: "rose",
            items: [
              { name: "NULL = NULL", thai: "เป็น UNKNOWN ไม่ใช่ TRUE — เลย return ไม่มีแถว", example: "SELECT * FROM employees WHERE dept_id = NULL;\n-- 0 rows (แม้จะมีแถวที่ dept_id เป็น NULL)" },
              { name: "NULL + 5", thai: "ผลลัพธ์เป็น NULL ทั้งหมด — ใช้ NVL ห่อก่อนคำนวณ", example: "SELECT salary + NVL(bonus, 0) FROM employees;" },
              { name: "COUNT(*) vs COUNT(col)", thai: "COUNT(*) นับทุกแถว, COUNT(col) ข้าม NULL", example: "SELECT COUNT(*) AS total, COUNT(dept_id) AS with_dept\nFROM employees;", runnable: true },
            ],
          },
        ]}
      />
    </div>
  );
}
