import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlControlSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Control flow ใน PL/SQL = IF/CASE/LOOP สำหรับตัดสินใจและวนซ้ำ"
        why="logic ซับซ้อนที่ SQL อย่างเดียวเขียนไม่ได้ — ตรวจเงื่อนไข, วนซ้ำ, exit ตามสถานการณ์"
        how="IF/CASE สำหรับเลือกทาง, LOOP/FOR/WHILE สำหรับวนซ้ำ — ต้องมี END IF / END LOOP ปิดเสมอ"
      />
      <RefList
        groups={[
          {
            title: "IF / ELSIF / ELSE",
            emoji: "🔀",
            color: "sky",
            items: [
              {
                name: "IF เดี่ยว",
                example: `IF v_salary > 50000 THEN
  DBMS_OUTPUT.PUT_LINE('High');
END IF;`,
                thai: "เงื่อนไขเดียว",
              },
              {
                name: "IF-ELSE",
                example: `IF v_salary > 50000 THEN
  DBMS_OUTPUT.PUT_LINE('High');
ELSE
  DBMS_OUTPUT.PUT_LINE('Normal');
END IF;`,
                thai: "2 ทาง",
              },
              {
                name: "IF-ELSIF-ELSE",
                example: `IF v_sal > 60000 THEN
  v_band := 'A';
ELSIF v_sal > 40000 THEN
  v_band := 'B';
ELSE
  v_band := 'C';
END IF;`,
                thai: "หลายทาง — สังเกตสะกด ELSIF (ไม่ใช่ ELSEIF)",
              },
            ],
          },
          {
            title: "CASE statement",
            emoji: "🎚️",
            color: "violet",
            items: [
              {
                name: "Simple CASE",
                thai: "เทียบค่าเดียว — เหมือน switch",
                example: `CASE v_dept_id
  WHEN 10 THEN v_name := 'IT';
  WHEN 20 THEN v_name := 'Sales';
  ELSE v_name := 'อื่นๆ';
END CASE;`,
              },
              {
                name: "Searched CASE",
                thai: "เงื่อนไขซับซ้อนได้",
                example: `CASE
  WHEN v_sal IS NULL THEN v_msg := 'No salary';
  WHEN v_sal > 60000 THEN v_msg := 'High';
  ELSE v_msg := 'Normal';
END CASE;`,
              },
              {
                name: "CASE expression",
                thai: "ใช้เป็น expression — กำหนดค่าให้ตัวแปรตรงๆ",
                example: `v_band := CASE
  WHEN v_sal > 60000 THEN 'A'
  WHEN v_sal > 40000 THEN 'B'
  ELSE 'C'
END;`,
              },
            ],
          },
          {
            title: "Loops",
            emoji: "🔁",
            color: "emerald",
            items: [
              {
                name: "Basic LOOP",
                thai: "ลูปไม่มีเงื่อนไข — ต้อง EXIT เอง",
                example: `DECLARE
  v_i NUMBER := 0;
BEGIN
  LOOP
    v_i := v_i + 1;
    EXIT WHEN v_i > 5;
    DBMS_OUTPUT.PUT_LINE(v_i);
  END LOOP;
END;`,
              },
              {
                name: "WHILE LOOP",
                thai: "วนตราบเท่าที่เงื่อนไขยังจริง",
                example: `DECLARE
  v_i NUMBER := 0;
BEGIN
  WHILE v_i < 5 LOOP
    v_i := v_i + 1;
    DBMS_OUTPUT.PUT_LINE(v_i);
  END LOOP;
END;`,
              },
              {
                name: "Numeric FOR LOOP",
                syntax: "FOR i IN start..end LOOP",
                thai: "วนจาก start ถึง end (ครบทั้งสองด้าน) — ไม่ต้องประกาศ i",
                example: `BEGIN
  FOR i IN 1..10 LOOP
    DBMS_OUTPUT.PUT_LINE('Round ' || i);
  END LOOP;
END;`,
              },
              {
                name: "REVERSE",
                thai: "วนกลับ — end ลงไป start",
                example: `FOR i IN REVERSE 1..5 LOOP
  DBMS_OUTPUT.PUT_LINE(i);  -- 5,4,3,2,1
END LOOP;`,
              },
            ],
          },
          {
            title: "EXIT / CONTINUE / GOTO",
            emoji: "🚪",
            color: "amber",
            items: [
              {
                name: "EXIT",
                thai: "ออกจาก loop ทันที",
                example: `LOOP
  EXIT WHEN cond;  -- หรือใช้ IF cond THEN EXIT;
END LOOP;`,
              },
              {
                name: "CONTINUE",
                thai: "ข้ามไปรอบถัดไปของ loop — เพิ่มใน Oracle 11g",
                example: `FOR i IN 1..10 LOOP
  CONTINUE WHEN MOD(i, 2) = 0;  -- ข้ามเลขคู่
  DBMS_OUTPUT.PUT_LINE(i);
END LOOP;`,
              },
              {
                name: "Nested loop + label",
                thai: "ใช้ label เพื่อ EXIT หลายชั้น",
                example: `<<outer>>
FOR i IN 1..3 LOOP
  FOR j IN 1..3 LOOP
    IF i = 2 AND j = 2 THEN
      EXIT outer;
    END IF;
  END LOOP;
END LOOP outer;`,
              },
            ],
          },
        ]}
      />
    </div>
  );
}
