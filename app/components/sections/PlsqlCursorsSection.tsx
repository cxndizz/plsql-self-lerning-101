import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlCursorsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Cursor = ตัวชี้แถวผลลัพธ์ของ SELECT — ใช้วนทีละแถวใน PL/SQL"
        why="SELECT คืนหลายแถว — ใน PL/SQL ต้องเปิด cursor เพื่อวน fetch ทีละแถวมาประมวลผล"
        how="2 แบบ: Implicit (SELECT INTO, cursor FOR loop) · Explicit (DECLARE CURSOR ... OPEN/FETCH/CLOSE)"
      />
      <RefList
        groups={[
          {
            title: "Implicit cursor (ใช้ง่าย)",
            emoji: "✨",
            color: "emerald",
            items: [
              {
                name: "SELECT INTO",
                thai: "สำหรับ 1 แถว — ถ้าไม่เจอ → NO_DATA_FOUND, ถ้าเจอ > 1 → TOO_MANY_ROWS",
                example: `DECLARE
  v_name employees.first_name%TYPE;
BEGIN
  SELECT first_name INTO v_name
  FROM   employees
  WHERE  emp_id = 1;

  DBMS_OUTPUT.PUT_LINE(v_name);
END;`,
              },
              {
                name: "Cursor FOR LOOP",
                thai: "วนทุกแถวของ SELECT — Oracle จัดการ OPEN/FETCH/CLOSE ให้",
                example: `BEGIN
  FOR rec IN (SELECT first_name, salary FROM employees WHERE salary > 40000)
  LOOP
    DBMS_OUTPUT.PUT_LINE(rec.first_name || ' = ' || rec.salary);
  END LOOP;
END;`,
                note: "วิธีที่นิยมที่สุด — สะอาดและปลอดภัย",
              },
              {
                name: "SQL%attributes",
                thai: "ดูข้อมูลของ SQL ล่าสุด — ROWCOUNT, FOUND, NOTFOUND",
                example: `BEGIN
  UPDATE employees SET salary = salary * 1.1 WHERE dept_id = 10;
  DBMS_OUTPUT.PUT_LINE('อัปเดต ' || SQL%ROWCOUNT || ' แถว');
END;`,
              },
            ],
          },
          {
            title: "Explicit cursor (ควบคุมเอง)",
            emoji: "🎛️",
            color: "violet",
            items: [
              {
                name: "DECLARE + OPEN + FETCH + CLOSE",
                thai: "ขั้นตอนแบบ manual — ใช้เมื่อต้องการ control ลึก เช่น fetch บางส่วน",
                example: `DECLARE
  CURSOR c_emp IS
    SELECT first_name, salary FROM employees ORDER BY salary DESC;
  v_name employees.first_name%TYPE;
  v_sal  employees.salary%TYPE;
BEGIN
  OPEN c_emp;
  LOOP
    FETCH c_emp INTO v_name, v_sal;
    EXIT WHEN c_emp%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(v_name || ': ' || v_sal);
  END LOOP;
  CLOSE c_emp;
END;`,
              },
              {
                name: "Cursor attributes",
                thai: "%FOUND %NOTFOUND %ROWCOUNT %ISOPEN — ตรวจสถานะ cursor",
                example: `IF c_emp%ISOPEN THEN ... END IF;
EXIT WHEN c_emp%NOTFOUND;
DBMS_OUTPUT.PUT_LINE('row ' || c_emp%ROWCOUNT);`,
              },
              {
                name: "Parameterized cursor",
                thai: "Cursor รับ parameter — เปิดใหม่ได้ด้วยค่าต่างกัน",
                example: `DECLARE
  CURSOR c_by_dept (p_dept NUMBER) IS
    SELECT first_name FROM employees WHERE dept_id = p_dept;
BEGIN
  FOR rec IN c_by_dept(10) LOOP
    DBMS_OUTPUT.PUT_LINE(rec.first_name);
  END LOOP;
END;`,
              },
            ],
          },
          {
            title: "FOR UPDATE / WHERE CURRENT OF",
            emoji: "🔒",
            color: "rose",
            items: [
              {
                name: "FOR UPDATE",
                thai: "Lock แถวที่ cursor ดึงมา — กันคนอื่นแก้ระหว่างนี้",
                example: `DECLARE
  CURSOR c IS
    SELECT * FROM employees WHERE dept_id = 10
    FOR UPDATE;
BEGIN
  FOR rec IN c LOOP
    UPDATE employees SET salary = salary * 1.05
    WHERE CURRENT OF c;
  END LOOP;
  COMMIT;
END;`,
                note: "WHERE CURRENT OF c = แถวล่าสุดที่ FETCH",
              },
            ],
          },
          {
            title: "BULK COLLECT (ประสิทธิภาพ)",
            emoji: "⚡",
            color: "amber",
            items: [
              {
                name: "BULK COLLECT INTO",
                thai: "ดึงทุกแถวเข้า collection ทีเดียว — เร็วกว่า loop ทีละแถวมาก",
                example: `DECLARE
  TYPE name_list IS TABLE OF VARCHAR2(50);
  v_names name_list;
BEGIN
  SELECT first_name BULK COLLECT INTO v_names
  FROM   employees;

  FOR i IN 1..v_names.COUNT LOOP
    DBMS_OUTPUT.PUT_LINE(v_names(i));
  END LOOP;
END;`,
              },
              {
                name: "LIMIT clause",
                thai: "ป้องกัน memory พังถ้าตารางใหญ่ — ดึงทีละ batch",
                example: `OPEN c_emp;
LOOP
  FETCH c_emp BULK COLLECT INTO v_emps LIMIT 100;
  EXIT WHEN v_emps.COUNT = 0;
  -- ประมวลผล v_emps (100 แถว)
END LOOP;
CLOSE c_emp;`,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
