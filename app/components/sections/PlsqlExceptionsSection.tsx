import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlExceptionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Exception handling = จัดการ error ที่เกิดใน PL/SQL — เหมือน try/catch ในภาษาอื่น"
        why="แทนที่ block จะ crash ทั้งหมด → ดักจับ error เฉพาะ, log, แจ้งผู้ใช้, ทำ rollback ที่เหมาะสม"
        how="ส่วน EXCEPTION ต่อท้าย BEGIN — WHEN <exception_name> THEN <handler>;"
      />
      <RefList
        groups={[
          {
            title: "โครงสร้าง",
            emoji: "🧱",
            color: "sky",
            items: [
              {
                name: "Anatomy ของ block",
                thai: "DECLARE → BEGIN → EXCEPTION → END;",
                example: `DECLARE
  -- ประกาศตัวแปร
BEGIN
  -- โค้ดหลัก
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('ไม่เจอ');
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;`,
              },
            ],
          },
          {
            title: "Predefined exceptions",
            emoji: "📋",
            color: "emerald",
            items: [
              {
                name: "NO_DATA_FOUND",
                thai: "SELECT INTO ไม่เจอแถว",
                example: `BEGIN
  SELECT salary INTO v_sal FROM employees WHERE emp_id = 999;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    v_sal := 0;
END;`,
              },
              {
                name: "TOO_MANY_ROWS",
                thai: "SELECT INTO เจอ > 1 แถว",
                example: `EXCEPTION
  WHEN TOO_MANY_ROWS THEN
    DBMS_OUTPUT.PUT_LINE('เจอหลายแถว — ระบุ WHERE ให้ชัดกว่านี้');`,
              },
              {
                name: "ZERO_DIVIDE",
                thai: "หารด้วยศูนย์",
                example: `EXCEPTION
  WHEN ZERO_DIVIDE THEN
    v_result := NULL;`,
              },
              {
                name: "VALUE_ERROR",
                thai: "type ไม่เข้ากัน (เช่น ใส่ string ลง NUMBER)",
                example: `EXCEPTION
  WHEN VALUE_ERROR THEN
    DBMS_OUTPUT.PUT_LINE('Type ผิด');`,
              },
              { name: "DUP_VAL_ON_INDEX", thai: "INSERT/UPDATE ทำให้ unique constraint แตก" },
              { name: "INVALID_NUMBER", thai: "แปลง string เป็น number ไม่ได้ใน SQL" },
              { name: "OTHERS", thai: "Catch ทุกอย่างที่เหลือ — ใส่ท้ายสุด" },
            ],
          },
          {
            title: "User-defined exception",
            emoji: "✨",
            color: "violet",
            items: [
              {
                name: "ประกาศ + RAISE",
                thai: "สร้าง exception ของเราเอง",
                example: `DECLARE
  invalid_salary EXCEPTION;
  v_sal NUMBER := -100;
BEGIN
  IF v_sal < 0 THEN
    RAISE invalid_salary;
  END IF;
EXCEPTION
  WHEN invalid_salary THEN
    DBMS_OUTPUT.PUT_LINE('เงินเดือนติดลบไม่ได้');
END;`,
              },
              {
                name: "RAISE_APPLICATION_ERROR",
                syntax: "RAISE_APPLICATION_ERROR(code, msg)",
                thai: "ส่ง error กลับ caller — code อยู่ระหว่าง -20000 ถึง -20999",
                example: `IF v_sal < 0 THEN
  RAISE_APPLICATION_ERROR(-20001, 'เงินเดือนต้อง > 0');
END IF;`,
                note: "Caller จะเห็น ORA-20001 — ใช้ในใน trigger / proc บ่อย",
              },
              {
                name: "PRAGMA EXCEPTION_INIT",
                thai: "แมป exception ของเรากับ Oracle error code",
                example: `DECLARE
  child_record_found EXCEPTION;
  PRAGMA EXCEPTION_INIT(child_record_found, -2292);
BEGIN
  DELETE FROM departments WHERE dept_id = 10;
EXCEPTION
  WHEN child_record_found THEN
    DBMS_OUTPUT.PUT_LINE('มีพนักงานใช้แผนกนี้อยู่');
END;`,
              },
            ],
          },
          {
            title: "Inspect error",
            emoji: "🔍",
            color: "amber",
            items: [
              {
                name: "SQLCODE / SQLERRM",
                thai: "ใน WHEN OTHERS ดู code และ message ของ error ล่าสุด",
                example: `EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Code: ' || SQLCODE);
    DBMS_OUTPUT.PUT_LINE('Msg : ' || SQLERRM);`,
              },
              {
                name: "DBMS_UTILITY.FORMAT_ERROR_STACK",
                thai: "Stack trace แบบเต็ม — ช่วย debug",
                example: `WHEN OTHERS THEN
  DBMS_OUTPUT.PUT_LINE(DBMS_UTILITY.FORMAT_ERROR_BACKTRACE);`,
              },
              {
                name: "Re-raise",
                thai: "ดักไว้ทำอะไรซักหน่อย แล้ว raise ต่อให้ caller จัดการ",
                example: `EXCEPTION
  WHEN OTHERS THEN
    log_error(SQLCODE, SQLERRM);
    RAISE;  -- ส่งต่อ`,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
