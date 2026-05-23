import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function IndexSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Index = โครงสร้างข้อมูลช่วยค้นหา — เหมือนสารบัญหนังสือ ช่วยให้เปิดหาเร็วขึ้น"
        why="ตารางใหญ่ๆ การค้นหาแบบ full scan ช้ามาก — index ตัดเวลาจาก O(n) เป็น O(log n)"
        how="CREATE INDEX name ON table(col) — Oracle ใช้ index อัตโนมัติเมื่อ WHERE/JOIN ใช้คอลัมน์นั้น"
      />
      <RefList
        groups={[
          {
            title: "สร้าง / ลบ",
            emoji: "🏗️",
            color: "sky",
            items: [
              {
                name: "CREATE INDEX",
                syntax: "CREATE INDEX idx_name ON tbl(col1 [, col2]);",
                thai: "สร้าง B-tree index (ค่า default)",
                example: "CREATE INDEX idx_emp_lastname ON employees(last_name);",
              },
              {
                name: "Composite index",
                thai: "Index บนหลายคอลัมน์ — Oracle ใช้เฉพาะเมื่อ WHERE ใช้คอลัมน์ตามลำดับ (leftmost prefix)",
                example: "CREATE INDEX idx_emp_dept_sal ON employees(dept_id, salary);",
                note: "ใช้ได้กับ WHERE dept_id = ? และ WHERE dept_id = ? AND salary = ? · ไม่ค่อย work กับ WHERE salary = ? เดี่ยว",
              },
              {
                name: "UNIQUE INDEX",
                thai: "บังคับให้ค่าไม่ซ้ำ + ใช้ค้นหา",
                example: "CREATE UNIQUE INDEX idx_email ON employees(email);",
              },
              {
                name: "DROP INDEX",
                thai: "ลบ index ที่ไม่ใช้",
                example: "DROP INDEX idx_emp_lastname;",
              },
            ],
          },
          {
            title: "ชนิดของ Index (Oracle)",
            emoji: "🌳",
            color: "emerald",
            items: [
              { name: "B-tree (default)", thai: "Balanced tree — เหมาะกับคอลัมน์ที่มีค่าหลากหลาย (high cardinality) เช่น email, id" },
              { name: "Bitmap", thai: "เหมาะกับคอลัมน์ที่ค่าซ้ำเยอะ (low cardinality) เช่น gender, status — แต่ไม่เหมาะ OLTP", example: "CREATE BITMAP INDEX idx_status ON orders(status);" },
              { name: "Function-based", thai: "Index บน expression — ใช้กับ query ที่เขียน WHERE UPPER(name) = ...", example: "CREATE INDEX idx_email_lower ON users(LOWER(email));" },
              { name: "Reverse key", thai: "เก็บค่ากลับด้าน — กระจาย hot block ในระบบ sequence ที่ insert ไวมาก", example: "CREATE INDEX idx_id_rev ON orders(order_id) REVERSE;" },
            ],
          },
          {
            title: "ดูแล + ตรวจสอบ",
            emoji: "🔧",
            color: "violet",
            items: [
              { name: "REBUILD", thai: "สร้างใหม่ — ใช้เมื่อ index เริ่มเสื่อม (fragmented)", example: "ALTER INDEX idx_emp_lastname REBUILD;" },
              { name: "USER_INDEXES", thai: "ดู index ที่ user มี — data dictionary view", example: "SELECT * FROM user_indexes WHERE table_name = 'EMPLOYEES';" },
              { name: "EXPLAIN PLAN", thai: "ตรวจว่า query ใช้ index หรือ full scan", example: "EXPLAIN PLAN FOR\nSELECT * FROM employees WHERE last_name = 'ใจดี';\n\nSELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);" },
            ],
          },
          {
            title: "⚠️ ข้อแลกเปลี่ยน",
            emoji: "⚖️",
            color: "rose",
            items: [
              { name: "INSERT/UPDATE ช้าลง", thai: "ทุกครั้งที่เปลี่ยนข้อมูล Oracle ต้อง update index ด้วย — ตารางที่เขียนบ่อยควรมี index น้อย" },
              { name: "ใช้พื้นที่", thai: "Index ก็เก็บ data — ตารางใหญ่ index อาจใหญ่ใกล้ตารางจริง" },
              { name: "ไม่ใช่ทุกคอลัมน์ควรมี", thai: "เฉพาะคอลัมน์ที่ใช้ใน WHERE/JOIN บ่อย + cardinality สูง · ตารางเล็กไม่ต้อง" },
              { name: "Function ปิด index", thai: "WHERE UPPER(name) = ? ไม่ใช้ index บน name — ต้องเป็น function-based index", example: "-- ผิด: ไม่ใช้ index\nWHERE UPPER(last_name) = 'จันทร์'\n\n-- ถูก: เก็บ uppercase ตั้งแต่ insert หรือ function-based index" },
            ],
          },
        ]}
      />
    </div>
  );
}
