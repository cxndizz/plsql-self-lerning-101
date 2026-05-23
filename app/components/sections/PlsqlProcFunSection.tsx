import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function PlsqlProcFunSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Procedure = block ที่ตั้งชื่อเก็บไว้ใน DB เรียกซ้ำได้ · Function = procedure ที่ คืนค่า กลับมา"
        why="logic ที่ใช้บ่อย ทำเป็น procedure → ทุก app เรียกใช้ logic เดียวกัน ไม่ duplicate"
        how="CREATE [OR REPLACE] PROCEDURE/FUNCTION name (params) AS BEGIN ... END; — params มี IN/OUT/IN OUT"
      />
      <RefList
        groups={[
          {
            title: "Procedure",
            emoji: "🛠️",
            color: "sky",
            items: [
              {
                name: "Simple procedure",
                thai: "ไม่รับ parameter — เรียก: BEGIN proc_name; END;",
                example: `CREATE OR REPLACE PROCEDURE greet AS
BEGIN
  DBMS_OUTPUT.PUT_LINE('Hello!');
END;
/

BEGIN
  greet;
END;`,
              },
              {
                name: "พร้อม parameter",
                thai: "IN = ขาเข้า (default) · OUT = ขาออก · IN OUT = ทั้งเข้า-ออก",
                example: `CREATE OR REPLACE PROCEDURE give_raise (
  p_emp_id  IN NUMBER,
  p_percent IN NUMBER DEFAULT 5
) AS
BEGIN
  UPDATE employees
  SET    salary = salary * (1 + p_percent/100)
  WHERE  emp_id = p_emp_id;
END;
/

BEGIN
  give_raise(3, 10);
END;`,
              },
              {
                name: "OUT parameter",
                thai: "คืนค่ากลับผ่าน parameter — ใช้ตอนต้องการคืนหลายค่า",
                example: `CREATE OR REPLACE PROCEDURE get_emp (
  p_id        IN  NUMBER,
  p_name      OUT VARCHAR2,
  p_salary    OUT NUMBER
) AS
BEGIN
  SELECT first_name, salary INTO p_name, p_salary
  FROM   employees
  WHERE  emp_id = p_id;
END;
/

DECLARE
  v_name VARCHAR2(50);
  v_sal  NUMBER;
BEGIN
  get_emp(1, v_name, v_sal);
  DBMS_OUTPUT.PUT_LINE(v_name || ' = ' || v_sal);
END;`,
              },
              {
                name: "Named notation",
                thai: "เรียกโดยระบุชื่อ parameter — อ่านง่าย, ส่งไม่ครบลำดับได้",
                example: `BEGIN
  give_raise(p_emp_id => 3, p_percent => 15);
END;`,
              },
            ],
          },
          {
            title: "Function",
            emoji: "🔢",
            color: "emerald",
            items: [
              {
                name: "Function ง่ายๆ",
                thai: "ต้องมี RETURN <type> ในส่วน header + RETURN value; ในส่วน body",
                example: `CREATE OR REPLACE FUNCTION calc_bonus (p_sal NUMBER)
RETURN NUMBER AS
  v_bonus NUMBER;
BEGIN
  v_bonus := p_sal * 0.1;
  RETURN v_bonus;
END;
/

-- เรียกใน SQL ได้ด้วย!
SELECT first_name, salary, calc_bonus(salary) AS bonus
FROM employees;`,
              },
              {
                name: "Function ใน WHERE",
                thai: "ใช้ function เป็น filter ได้",
                example: `CREATE OR REPLACE FUNCTION is_high_earner (p_id NUMBER)
RETURN BOOLEAN AS
  v_sal NUMBER;
BEGIN
  SELECT salary INTO v_sal FROM employees WHERE emp_id = p_id;
  RETURN v_sal > 50000;
END;
/`,
                note: "BOOLEAN ใช้ได้ใน PL/SQL — แต่ใน SQL ทั่วไปใช้ CHAR(1) แทน",
              },
              {
                name: "DETERMINISTIC",
                thai: "บอก Oracle ว่า function คืนค่าเดิมเสมอเมื่อ input เดิม → cache ได้, ใช้ใน function-based index ได้",
                example: `CREATE OR REPLACE FUNCTION upper_name (p_s VARCHAR2)
RETURN VARCHAR2 DETERMINISTIC AS
BEGIN
  RETURN UPPER(p_s);
END;`,
              },
            ],
          },
          {
            title: "Package (group ของ proc/func)",
            emoji: "📦",
            color: "violet",
            items: [
              {
                name: "Package spec + body",
                thai: "Package = รวม procedure/function/variable หลายตัวภายใต้ชื่อเดียว — modular code",
                example: `-- Specification (interface)
CREATE OR REPLACE PACKAGE emp_pkg AS
  PROCEDURE give_raise(p_id NUMBER, p_pct NUMBER);
  FUNCTION  get_salary(p_id NUMBER) RETURN NUMBER;
END emp_pkg;
/

-- Body (implementation)
CREATE OR REPLACE PACKAGE BODY emp_pkg AS
  PROCEDURE give_raise(p_id NUMBER, p_pct NUMBER) IS
  BEGIN
    UPDATE employees SET salary = salary * (1 + p_pct/100)
    WHERE emp_id = p_id;
  END give_raise;

  FUNCTION get_salary(p_id NUMBER) RETURN NUMBER IS
    v_sal NUMBER;
  BEGIN
    SELECT salary INTO v_sal FROM employees WHERE emp_id = p_id;
    RETURN v_sal;
  END get_salary;
END emp_pkg;
/

-- ใช้:
BEGIN
  emp_pkg.give_raise(3, 10);
  DBMS_OUTPUT.PUT_LINE(emp_pkg.get_salary(3));
END;`,
              },
              {
                name: "ข้อดี Package",
                thai: "Encapsulation, performance (cache ใน memory), overloading, ตัวแปร package-level (session state)",
              },
            ],
          },
          {
            title: "ดูแล",
            emoji: "🔧",
            color: "slate",
            items: [
              { name: "DROP", example: "DROP PROCEDURE give_raise;\nDROP FUNCTION calc_bonus;\nDROP PACKAGE emp_pkg;", thai: "ลบ object" },
              { name: "USER_OBJECTS", example: "SELECT object_name, object_type, status FROM user_objects\nWHERE object_type IN ('PROCEDURE', 'FUNCTION', 'PACKAGE');", thai: "ดู procedure/function/package ที่ user มี" },
              { name: "Compile errors", example: "SHOW ERRORS PROCEDURE give_raise;\n-- หรือ:\nSELECT * FROM user_errors;", thai: "ดู error ตอน compile" },
            ],
          },
        ]}
      />
    </div>
  );
}
