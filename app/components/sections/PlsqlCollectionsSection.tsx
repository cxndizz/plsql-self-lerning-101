import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlCollectionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Collections = array-like data structures ใน PL/SQL — RECORD, TABLE OF, VARRAY"
        why="เก็บข้อมูลหลายค่าใน 1 ตัวแปร, BULK COLLECT, ส่งระหว่าง procedure"
        how="ประกาศ TYPE ก่อน แล้วใช้สร้าง instance"
      />
      <RefList
        groups={[
          {
            title: "RECORD",
            emoji: "📄",
            color: "sky",
            items: [
              {
                name: "User-defined record",
                thai: "Struct ของ field หลายชนิด — คล้าย object ในภาษาอื่น",
                example: `DECLARE
  TYPE emp_rec IS RECORD (
    id    NUMBER,
    name  VARCHAR2(50),
    sal   NUMBER
  );
  v_emp emp_rec;
BEGIN
  v_emp.id   := 1;
  v_emp.name := 'สมชาย';
  v_emp.sal  := 50000;
  DBMS_OUTPUT.PUT_LINE(v_emp.name);
END;`,
              },
              {
                name: "%ROWTYPE (record อัตโนมัติ)",
                thai: "เร็วและ maintain ง่ายกว่า — Oracle สร้าง type ให้ตามตาราง",
                example: `DECLARE
  v_emp employees%ROWTYPE;
BEGIN
  SELECT * INTO v_emp FROM employees WHERE emp_id = 1;
  v_emp.salary := v_emp.salary * 1.1;
END;`,
              },
            ],
          },
          {
            title: "Associative Array (TABLE OF .. INDEX BY)",
            emoji: "🗂️",
            color: "emerald",
            items: [
              {
                name: "INDEX BY PLS_INTEGER",
                thai: "Array ที่ index ด้วยเลข — สร้าง element ตามต้องการ ไม่ต้อง EXTEND",
                example: `DECLARE
  TYPE num_array IS TABLE OF NUMBER INDEX BY PLS_INTEGER;
  v_arr num_array;
BEGIN
  v_arr(1) := 100;
  v_arr(5) := 500;
  DBMS_OUTPUT.PUT_LINE(v_arr(1) + v_arr(5));

  -- วน
  FOR i IN v_arr.FIRST..v_arr.LAST LOOP
    IF v_arr.EXISTS(i) THEN
      DBMS_OUTPUT.PUT_LINE(i || ' = ' || v_arr(i));
    END IF;
  END LOOP;
END;`,
              },
              {
                name: "INDEX BY VARCHAR2 (hashmap)",
                thai: "key เป็น string — เหมือน dictionary / hashmap",
                example: `DECLARE
  TYPE dept_map IS TABLE OF VARCHAR2(50) INDEX BY VARCHAR2(20);
  v_depts dept_map;
BEGIN
  v_depts('IT')    := 'กรุงเทพ';
  v_depts('Sales') := 'เชียงใหม่';
  DBMS_OUTPUT.PUT_LINE(v_depts('IT'));
END;`,
              },
            ],
          },
          {
            title: "Nested Table",
            emoji: "📚",
            color: "violet",
            items: [
              {
                name: "TABLE OF (ไม่มี INDEX BY)",
                thai: "ใช้เป็น column type ในตารางได้ — ต้อง EXTEND ก่อนเพิ่ม element",
                example: `DECLARE
  TYPE name_list IS TABLE OF VARCHAR2(50);
  v_names name_list := name_list();
BEGIN
  v_names.EXTEND(3);
  v_names(1) := 'A';
  v_names(2) := 'B';
  v_names(3) := 'C';
END;`,
              },
              {
                name: "BULK COLLECT",
                thai: "วิธีที่ใช้บ่อยที่สุด — เก็บผล SELECT เข้า collection",
                example: `DECLARE
  TYPE emp_list IS TABLE OF employees%ROWTYPE;
  v_emps emp_list;
BEGIN
  SELECT * BULK COLLECT INTO v_emps
  FROM employees
  WHERE dept_id = 10;

  DBMS_OUTPUT.PUT_LINE('Got ' || v_emps.COUNT || ' rows');
END;`,
              },
            ],
          },
          {
            title: "VARRAY",
            emoji: "📐",
            color: "amber",
            items: [
              {
                name: "VARRAY (ขนาดจำกัด)",
                thai: "Array ขนาดสูงสุดคงที่ — เก็บเรียงตามลำดับเหมือน array จริง",
                example: `DECLARE
  TYPE rgb IS VARRAY(3) OF VARCHAR2(10);
  v_color rgb := rgb('red', 'green', 'blue');
BEGIN
  FOR i IN 1..v_color.COUNT LOOP
    DBMS_OUTPUT.PUT_LINE(v_color(i));
  END LOOP;
END;`,
              },
            ],
          },
          {
            title: "Methods ของ Collection",
            emoji: "🛠️",
            color: "slate",
            items: [
              { name: ".COUNT", thai: "จำนวน element" },
              { name: ".FIRST / .LAST", thai: "index แรก/สุดท้าย" },
              { name: ".NEXT(i) / .PRIOR(i)", thai: "index ถัดไป/ก่อนหน้า" },
              { name: ".EXISTS(i)", thai: "มี element ที่ index i ไหม" },
              { name: ".EXTEND(n)", thai: "ขยาย n ช่อง (nested table / varray)" },
              { name: ".DELETE / .DELETE(i)", thai: "ลบทั้งหมด / ลบเฉพาะ index" },
              { name: ".TRIM(n)", thai: "ตัดจากท้าย n ช่อง" },
            ],
          },
          {
            title: "FORALL (bulk DML)",
            emoji: "⚡",
            color: "indigo",
            items: [
              {
                name: "FORALL",
                thai: "INSERT/UPDATE/DELETE หลายแถวจาก collection ในรอบเดียว — เร็วกว่า loop มาก",
                example: `DECLARE
  TYPE id_list IS TABLE OF NUMBER;
  v_ids id_list := id_list(1, 3, 5, 7);
BEGIN
  FORALL i IN 1..v_ids.COUNT
    UPDATE employees SET salary = salary * 1.1
    WHERE  emp_id = v_ids(i);

  COMMIT;
END;`,
                note: "ลด context switch ระหว่าง PL/SQL engine กับ SQL engine — performance ดีขึ้นมาก",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
