import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlVariablesSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Variables ใน PL/SQL = ตัวเก็บค่าชั่วคราวระหว่างรัน block — ประกาศในส่วน DECLARE"
        why="ดึงค่าจาก SELECT มาเก็บ, คำนวณก่อนใช้, ส่งระหว่าง procedure"
        how="ชื่อ ชนิด [:= ค่าเริ่มต้น]; — ใช้ %TYPE อ้างอิง type ของคอลัมน์ได้"
        example={`DECLARE\n  v_name  VARCHAR2(50) := 'สมชาย';\n  v_sal   NUMBER       := 50000;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(v_name || ' ' || v_sal);\nEND;`}
      />
      <RefList
        groups={[
          {
            title: "ประกาศตัวแปร",
            emoji: "📝",
            color: "sky",
            items: [
              {
                name: "Scalar variable",
                syntax: "v_name TYPE [DEFAULT value | := value];",
                thai: "ตัวแปรเก็บค่าเดียว — scalar types เหมือนใน CREATE TABLE",
                example: `DECLARE
  v_count    NUMBER       := 0;
  v_name     VARCHAR2(50) := 'Default';
  v_today    DATE         := SYSDATE;
  v_active   BOOLEAN      := TRUE;
BEGIN
  NULL;  -- placeholder
END;`,
              },
              {
                name: "Constant",
                syntax: "v_pi CONSTANT NUMBER := 3.14;",
                thai: "ค่าคงที่ — เปลี่ยนใน block ไม่ได้",
                example: `DECLARE
  c_tax CONSTANT NUMBER := 0.07;
BEGIN
  DBMS_OUTPUT.PUT_LINE(100 * c_tax);
END;`,
              },
              {
                name: "NOT NULL",
                thai: "บังคับให้มีค่าเสมอ — ต้องตั้งค่าเริ่มต้นด้วย",
                example: `DECLARE
  v_status VARCHAR2(1) NOT NULL := 'A';
BEGIN
  -- v_status := NULL;  ❌ error
  NULL;
END;`,
              },
            ],
          },
          {
            title: "%TYPE / %ROWTYPE (อ้างอิง type จากตาราง)",
            emoji: "🔗",
            color: "emerald",
            items: [
              {
                name: "%TYPE",
                syntax: "v_sal employees.salary%TYPE;",
                thai: "ประกาศตัวแปรให้มี type ตรงกับคอลัมน์ — ถ้า column เปลี่ยน type ตัวแปรปรับตาม",
                example: `DECLARE
  v_emp_id    employees.emp_id%TYPE;
  v_salary    employees.salary%TYPE;
BEGIN
  SELECT emp_id, salary
  INTO   v_emp_id, v_salary
  FROM   employees
  WHERE  first_name = 'สมชาย';
END;`,
                note: "ลดการ maintain — ไม่ต้องตามแก้ทุกที่ที่ใช้",
              },
              {
                name: "%ROWTYPE",
                syntax: "v_emp employees%ROWTYPE;",
                thai: "ประกาศตัวแปรเก็บทั้งแถว — เข้าถึงผ่าน .column_name",
                example: `DECLARE
  v_emp employees%ROWTYPE;
BEGIN
  SELECT * INTO v_emp
  FROM   employees
  WHERE  emp_id = 1;

  DBMS_OUTPUT.PUT_LINE(v_emp.first_name || ' ' || v_emp.salary);
END;`,
              },
            ],
          },
          {
            title: "Scope",
            emoji: "🎯",
            color: "violet",
            items: [
              {
                name: "Nested block",
                thai: "ตัวแปรใน block ใน เห็นตัวแปร block นอก — แต่ไม่ตรงกันข้าม",
                example: `DECLARE
  v_x NUMBER := 1;
BEGIN
  DECLARE
    v_y NUMBER := 2;
  BEGIN
    DBMS_OUTPUT.PUT_LINE(v_x + v_y);  -- 3 (เห็นทั้งคู่)
  END;
  -- v_y ใช้ไม่ได้ตรงนี้
END;`,
              },
              {
                name: "Shadowing",
                thai: "ถ้าประกาศชื่อซ้ำใน block ลึก จะ shadow ตัวนอก — เข้าถึงตัวนอกด้วย label",
                example: `<<outer>>
DECLARE
  v_x NUMBER := 1;
BEGIN
  DECLARE
    v_x NUMBER := 99;
  BEGIN
    DBMS_OUTPUT.PUT_LINE(v_x);          -- 99
    DBMS_OUTPUT.PUT_LINE(outer.v_x);    -- 1
  END;
END;`,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
