import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function TransactionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Transaction = ชุดของคำสั่งที่ต้องสำเร็จทั้งหมด หรือล้มเหลวทั้งหมด (atomic)"
        why="โอนเงิน A → B: ลบจาก A สำเร็จแต่เพิ่มที่ B พัง → เงินหาย ต้อง rollback ทั้งคู่ ถึงจะปลอดภัย"
        how="คำสั่ง DML (INSERT/UPDATE/DELETE) ทุกตัวอยู่ใน transaction โดยอัตโนมัติ — ต้อง COMMIT ถึงจะ persist"
      />
      <div className="card bg-amber-500/10 border-amber-500/30">
        <p className="text-sm text-amber-500">
          ⚠️ <b>หมายเหตุ:</b> alasql ไม่รองรับ transaction จริง — ตัวอย่างใช้ syntax ของ Oracle DB
        </p>
      </div>
      <RefList
        groups={[
          {
            title: "ACID properties",
            emoji: "💎",
            color: "indigo",
            items: [
              { name: "A — Atomicity", thai: "All-or-nothing — สำเร็จทั้งหมด หรือไม่ทำเลย" },
              { name: "C — Consistency", thai: "ข้อมูลคง constraint หลัง commit เสมอ" },
              { name: "I — Isolation", thai: "transaction พร้อมกันไม่กวนกัน (ขึ้นกับ isolation level)" },
              { name: "D — Durability", thai: "หลัง commit แล้วต่อให้ระบบดับ ข้อมูลยังอยู่" },
            ],
          },
          {
            title: "คำสั่งหลัก",
            emoji: "🔑",
            color: "emerald",
            items: [
              {
                name: "COMMIT",
                syntax: "COMMIT;",
                thai: "ยืนยันบันทึกถาวร — หลังนี้ rollback ไม่ได้แล้ว",
                example: `UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- ทั้งคู่ถูกบันทึก`,
              },
              {
                name: "ROLLBACK",
                syntax: "ROLLBACK;",
                thai: "ยกเลิกการเปลี่ยนแปลงตั้งแต่ commit/savepoint ล่าสุด",
                example: `UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- เกิดบางอย่างผิด:
ROLLBACK;  -- balance กลับเป็นเดิม`,
              },
              {
                name: "SAVEPOINT",
                syntax: "SAVEPOINT name;",
                thai: "วาง 'จุดบันทึก' กลางทาง — rollback กลับมาจุดนี้ได้โดยไม่ต้อง rollback ทั้ง transaction",
                example: `UPDATE t SET col = 1 WHERE id = 1;
SAVEPOINT after_step1;

UPDATE t SET col = 2 WHERE id = 2;
-- ผิดพลาด → กลับมาจุด savepoint
ROLLBACK TO after_step1;

UPDATE t SET col = 3 WHERE id = 2;  -- ลองใหม่
COMMIT;`,
              },
            ],
          },
          {
            title: "Auto-commit",
            emoji: "⚙️",
            color: "sky",
            items: [
              { name: "DDL = auto-commit", thai: "CREATE/ALTER/DROP/TRUNCATE จะ commit อัตโนมัติ — rollback ไม่ได้" },
              { name: "DML = ต้อง commit เอง", thai: "INSERT/UPDATE/DELETE ไม่ commit อัตโนมัติ (ยกเว้น tool บางตัวเปิด autocommit)" },
              { name: "DISCONNECT", thai: "ถ้าตัดการเชื่อมต่อโดยไม่ commit → Oracle จะ rollback ให้อัตโนมัติ" },
            ],
          },
          {
            title: "Isolation Levels (Oracle)",
            emoji: "🔒",
            color: "violet",
            items: [
              { name: "READ COMMITTED (default)", thai: "อ่านได้เฉพาะข้อมูลที่ commit แล้ว — แต่ละ query ดูเป็น snapshot ขณะนั้น" },
              { name: "SERIALIZABLE", thai: "transaction ดูเหมือนถูกทำตามลำดับ — ไม่มี phantom reads" },
              { name: "READ ONLY", thai: "transaction อ่านอย่างเดียว — ใช้ทำ report จาก snapshot คงที่", example: "SET TRANSACTION READ ONLY;" },
            ],
          },
          {
            title: "Locking",
            emoji: "🚧",
            color: "rose",
            items: [
              { name: "Row lock", thai: "UPDATE/DELETE lock เฉพาะแถวที่กระทบ — ไม่ block อ่านปกติ" },
              { name: "SELECT FOR UPDATE", syntax: "SELECT ... FOR UPDATE", thai: "Lock แถวที่อ่าน เพื่อกันคนอื่นแก้ไประหว่างนี้", example: "SELECT * FROM accounts WHERE id = 1 FOR UPDATE;" },
              { name: "Deadlock", thai: "2 transactions ถือ lock + รอกัน → Oracle detect และ rollback ฝ่ายหนึ่ง" },
            ],
          },
        ]}
      />
    </div>
  );
}
