import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function MergeSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="MERGE (UPSERT) = รวม INSERT + UPDATE + DELETE ในคำสั่งเดียว — จับคู่ตามเงื่อนไข แล้วทำตามที่กำหนด"
        why="ตอน sync ข้อมูลจาก source เข้า target — แถวเก่าให้ update, แถวใหม่ให้ insert, ในคำสั่งเดียว"
        how="MERGE INTO target USING source ON (...) WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ..."
      />
      <div className="card bg-amber-500/10 border-amber-500/30">
        <p className="text-sm text-amber-500">
          ⚠️ <b>หมายเหตุ:</b> alasql รองรับ MERGE ไม่เต็มที่ — ตัวอย่างด้านล่างเป็น syntax ของ Oracle ของจริง
          ใช้ใน Oracle DB / SQL Developer
        </p>
      </div>
      <RefList
        groups={[
          {
            title: "MERGE พื้นฐาน",
            emoji: "🔄",
            color: "violet",
            items: [
              {
                name: "UPSERT — INSERT หรือ UPDATE",
                thai: "ถ้ามีอยู่แล้ว → UPDATE, ถ้ายังไม่มี → INSERT",
                example: `MERGE INTO employees t
USING (SELECT 99 AS emp_id, 'นภา' AS fn, 50000 AS sal FROM dual) s
ON (t.emp_id = s.emp_id)
WHEN MATCHED THEN
  UPDATE SET t.first_name = s.fn, t.salary = s.sal
WHEN NOT MATCHED THEN
  INSERT (emp_id, first_name, salary, hire_date)
  VALUES (s.emp_id, s.fn, s.sal, SYSDATE);`,
              },
              {
                name: "MERGE จากตารางอื่น",
                thai: "Sync ราคาจากตาราง price_updates เข้า products",
                example: `MERGE INTO products p
USING price_updates u
ON (p.product_id = u.product_id)
WHEN MATCHED THEN UPDATE SET p.price = u.new_price
WHEN NOT MATCHED THEN INSERT (product_id, price)
                     VALUES (u.product_id, u.new_price);`,
              },
              {
                name: "MERGE + DELETE",
                thai: "ลบเฉพาะแถวที่ match + ผ่านเงื่อนไขเพิ่ม",
                example: `MERGE INTO employees t
USING terminations s
ON (t.emp_id = s.emp_id)
WHEN MATCHED THEN
  UPDATE SET t.status = 'TERMINATED'
  DELETE WHERE t.status = 'TERMINATED';`,
                note: "DELETE เฉพาะหลัง UPDATE สำเร็จและผ่าน WHERE",
              },
            ],
          },
          {
            title: "ทำไมต้อง MERGE?",
            emoji: "💡",
            color: "indigo",
            items: [
              {
                name: "ทางอื่นที่ไม่ใช้ MERGE",
                thai: "ปกติจะต้องเขียน 2 คำสั่ง: UPDATE ก่อน, ดู count, ถ้า 0 ก็ INSERT — ช้าและ race condition",
                example: `-- approach 2 ขั้น (ไม่ atomic):
UPDATE employees SET salary = 50000 WHERE emp_id = 99;
-- ถ้า 0 rows affected:
INSERT INTO employees (emp_id, salary) VALUES (99, 50000);`,
              },
              { name: "ข้อดี MERGE", thai: "ทำใน 1 statement, atomic, อ่าน source ครั้งเดียว → ประสิทธิภาพดีกว่า" },
            ],
          },
        ]}
      />
    </div>
  );
}
