import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlTriggersSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Trigger = block ที่รันอัตโนมัติเมื่อเกิด event (INSERT/UPDATE/DELETE) บนตาราง"
        why="ตรวจ/แก้ค่าก่อน insert, log การเปลี่ยนแปลง, รักษา invariants, fill auto-fields"
        how="CREATE TRIGGER name {BEFORE|AFTER} {INSERT|UPDATE|DELETE} ON table [FOR EACH ROW] BEGIN ... END;"
      />
      <RefList
        groups={[
          {
            title: "ชนิดของ Trigger",
            emoji: "🎬",
            color: "sky",
            items: [
              { name: "BEFORE vs AFTER", thai: "BEFORE = ก่อน DML จริง (ดัดแปลง :NEW ได้) · AFTER = หลัง DML สำเร็จ (log)" },
              { name: "ROW vs STATEMENT", thai: "FOR EACH ROW = รันทุกแถวที่กระทบ · ไม่มี = รันครั้งเดียวต่อ statement" },
              { name: "INSTEAD OF", thai: "ใช้กับ VIEW — แทนที่ DML จริงด้วย logic ของเรา" },
              { name: "Compound trigger", thai: "Trigger เดียวที่มีหลาย timing — ดูข้อมูล mutating table ได้" },
            ],
          },
          {
            title: ":NEW / :OLD",
            emoji: "🆕",
            color: "emerald",
            items: [
              {
                name: ":NEW = ค่าใหม่",
                thai: "ค่าที่จะถูก insert/update — แก้ได้ใน BEFORE trigger เท่านั้น",
                example: `:NEW.salary := :NEW.salary * 1.05;  -- ปรับ before insert`,
              },
              {
                name: ":OLD = ค่าเดิม",
                thai: "ค่าก่อน update/delete — read-only",
                example: `IF :OLD.salary != :NEW.salary THEN
  -- มีการเปลี่ยน salary
END IF;`,
              },
              { name: "DML predicates", thai: "INSERTING / UPDATING / DELETING — เช็คใน trigger ว่าเป็น event ไหน", example: "IF INSERTING THEN ...\nELSIF UPDATING THEN ...\nELSIF DELETING THEN ... END IF;" },
            ],
          },
          {
            title: "ตัวอย่างใช้งานจริง",
            emoji: "💼",
            color: "violet",
            items: [
              {
                name: "Auto-fill ID จาก sequence",
                thai: "ก่อน 12c ใช้ trigger ดึงเลข sequence ใส่ PK อัตโนมัติ",
                example: `CREATE OR REPLACE TRIGGER emp_bi
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
  IF :NEW.emp_id IS NULL THEN
    :NEW.emp_id := emp_seq.NEXTVAL;
  END IF;
END;
/`,
              },
              {
                name: "Audit log",
                thai: "บันทึกทุกการเปลี่ยน salary ลงตาราง audit",
                example: `CREATE OR REPLACE TRIGGER emp_salary_audit
AFTER UPDATE OF salary ON employees
FOR EACH ROW
WHEN (OLD.salary != NEW.salary)
BEGIN
  INSERT INTO salary_history (emp_id, old_sal, new_sal, changed_at, changed_by)
  VALUES (:NEW.emp_id, :OLD.salary, :NEW.salary, SYSDATE, USER);
END;
/`,
              },
              {
                name: "Validation",
                thai: "กันค่าผิด — เช่นห้ามลด salary",
                example: `CREATE OR REPLACE TRIGGER no_pay_cut
BEFORE UPDATE OF salary ON employees
FOR EACH ROW
BEGIN
  IF :NEW.salary < :OLD.salary THEN
    RAISE_APPLICATION_ERROR(-20001, 'ห้ามลดเงินเดือน');
  END IF;
END;
/`,
              },
              {
                name: "Auto-timestamp",
                thai: "ใส่ updated_at อัตโนมัติทุกครั้งที่ update",
                example: `CREATE OR REPLACE TRIGGER set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
  :NEW.updated_at := SYSDATE;
END;
/`,
              },
            ],
          },
          {
            title: "ดูแล + ปัญหา",
            emoji: "⚠️",
            color: "rose",
            items: [
              { name: "ENABLE / DISABLE", example: "ALTER TRIGGER emp_bi DISABLE;\nALTER TRIGGER emp_bi ENABLE;", thai: "ปิด/เปิด trigger ชั่วคราว (เช่นตอน bulk import)" },
              { name: "DROP", example: "DROP TRIGGER emp_bi;", thai: "ลบทิ้ง" },
              { name: "Mutating table error", thai: "Row trigger เข้าถึงตารางที่กำลังเปลี่ยนแปลงไม่ได้ — ต้องใช้ compound trigger" },
              { name: "ใช้น้อยๆ", thai: "Trigger ทำให้ตามได้ยาก, debug ลำบาก — preferable: ใส่ logic ใน procedure/app layer" },
            ],
          },
        ]}
      />
    </div>
  );
}
