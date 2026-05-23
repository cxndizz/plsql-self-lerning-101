import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function StringFunctionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="String functions = คำสั่งจัดการข้อความ — แปลง case, ตัด, ต่อ, แทนที่"
        why="ข้อมูลข้อความในระบบจริงต้อง normalize, search, format ก่อนใช้งานเสมอ"
        how="ใช้ใน SELECT, WHERE, ORDER BY, UPDATE ... SET ได้ทุกที่ที่รับ string"
      />
      <RefList
        groups={[
          {
            title: "เปลี่ยน case",
            emoji: "🔤",
            color: "sky",
            items: [
              { name: "UPPER", syntax: "UPPER(s)", thai: "แปลงเป็นตัวพิมพ์ใหญ่ทั้งหมด", example: "SELECT UPPER('hello') AS up FROM employees LIMIT 1;", runnable: true },
              { name: "LOWER", syntax: "LOWER(s)", thai: "แปลงเป็นตัวพิมพ์เล็ก", example: "SELECT LOWER('HELLO') AS lo FROM employees LIMIT 1;", runnable: true },
              { name: "INITCAP", syntax: "INITCAP(s)", thai: "ขึ้นต้นแต่ละคำเป็นตัวใหญ่ ที่เหลือเป็นเล็ก", example: "SELECT INITCAP('hello world') FROM dual;", result: "Hello World", note: "alasql รันไม่ได้ — Oracle มี" },
            ],
          },
          {
            title: "ตัด / ค้นหา",
            emoji: "✂️",
            color: "emerald",
            items: [
              { name: "SUBSTR", syntax: "SUBSTR(s, start [, length])", thai: "ตัดสตริง — start นับจาก 1, ติดลบ = นับจากท้าย", example: "SELECT SUBSTR(first_name, 1, 2) AS prefix FROM employees;", runnable: true },
              { name: "INSTR", syntax: "INSTR(s, find [, start])", thai: "หาตำแหน่งของ find ใน s — ถ้าไม่เจอคืน 0", example: "SELECT INSTR('abcdef','cd') FROM dual;", result: "3" },
              { name: "LENGTH", syntax: "LENGTH(s)", thai: "นับจำนวนตัวอักษร", example: "SELECT first_name, LENGTH(first_name) AS len FROM employees;", runnable: true },
              { name: "TRIM / LTRIM / RTRIM", syntax: "TRIM(s)", thai: "ตัด space หัวท้าย — LTRIM ตัดซ้าย RTRIM ตัดขวา", example: "SELECT TRIM('  hello  ') AS t FROM dual;", result: "hello" },
            ],
          },
          {
            title: "ต่อ / แทนที่ / pad",
            emoji: "🔗",
            color: "violet",
            items: [
              { name: "||", syntax: "s1 || s2", thai: "ต่อสตริง (concatenation) — เทียบเท่า CONCAT()", example: "SELECT first_name || ' ' || last_name AS full FROM employees;", runnable: true },
              { name: "CONCAT", syntax: "CONCAT(s1, s2)", thai: "ต่อ 2 สตริง — รับได้แค่ 2 ตัว ไม่เหมือน || ที่ต่อกี่ตัวก็ได้", example: "SELECT CONCAT('Hello, ', first_name) FROM employees;", runnable: true },
              { name: "REPLACE", syntax: "REPLACE(s, from, to)", thai: "แทนที่ทุก occurrence", example: "SELECT REPLACE('aaa-bbb','-','/') FROM dual;", result: "aaa/bbb" },
              { name: "LPAD / RPAD", syntax: "LPAD(s, n, pad)", thai: "เติม pad ให้ครบ n ตัว — L=ซ้าย R=ขวา", example: "SELECT LPAD('5', 4, '0') FROM dual;", result: "0005", note: "นิยมใช้กับรหัสที่ต้องมีจำนวนหลักคงที่" },
            ],
          },
        ]}
      />
    </div>
  );
}
