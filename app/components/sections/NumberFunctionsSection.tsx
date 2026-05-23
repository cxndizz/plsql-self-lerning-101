import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function NumberFunctionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Number functions = ฟังก์ชันคำนวณตัวเลข — ปัดเศษ, ตัดเศษ, mod, abs"
        why="เงิน-เปอร์เซ็นต์-สถิติทุกอย่างต้องใช้ — เช่นปัดเงินเดือนเป็น 2 ตำแหน่ง, mod เช็คเลขคู่/คี่"
        how="ใช้ใน SELECT projection หรือ WHERE คำนวณก่อนกรอง"
      />
      <RefList
        groups={[
          {
            title: "ปัดเศษ / ตัดเศษ",
            emoji: "🔢",
            color: "emerald",
            items: [
              { name: "ROUND", syntax: "ROUND(n [, d])", thai: "ปัดเศษ — d คือจำนวนหลังจุด (default 0)", example: "SELECT ROUND(3.7) AS r1, ROUND(3.456, 2) AS r2 FROM dual;", result: "4 | 3.46" },
              { name: "TRUNC", syntax: "TRUNC(n [, d])", thai: "ตัดเศษทิ้ง ไม่ปัด", example: "SELECT TRUNC(3.7) AS t1, TRUNC(3.456, 2) AS t2 FROM dual;", result: "3 | 3.45" },
              { name: "CEIL", syntax: "CEIL(n)", thai: "ปัดขึ้นเป็นจำนวนเต็มเสมอ", example: "SELECT CEIL(3.1) FROM dual;", result: "4" },
              { name: "FLOOR", syntax: "FLOOR(n)", thai: "ปัดลงเป็นจำนวนเต็มเสมอ", example: "SELECT FLOOR(3.9) FROM dual;", result: "3" },
            ],
          },
          {
            title: "คำนวณ",
            emoji: "➕",
            color: "sky",
            items: [
              { name: "MOD", syntax: "MOD(a, b)", thai: "เศษจากการหาร a/b — ใช้เช็คคู่/คี่: MOD(n,2)=0 คือคู่", example: "SELECT MOD(10,3) FROM dual;", result: "1" },
              { name: "ABS", syntax: "ABS(n)", thai: "ค่าสัมบูรณ์ (เลขไม่ติดลบ)", example: "SELECT ABS(-7) FROM dual;", result: "7" },
              { name: "POWER", syntax: "POWER(base, exp)", thai: "ยกกำลัง", example: "SELECT POWER(2, 10) FROM dual;", result: "1024" },
              { name: "SQRT", syntax: "SQRT(n)", thai: "Square root", example: "SELECT SQRT(16) FROM dual;", result: "4" },
              { name: "SIGN", syntax: "SIGN(n)", thai: "คืน -1 ถ้าติดลบ, 0 ถ้าศูนย์, 1 ถ้าบวก", example: "SELECT SIGN(-5), SIGN(0), SIGN(3) FROM dual;", result: "-1 | 0 | 1" },
            ],
          },
          {
            title: "ใช้กับข้อมูลจริง",
            emoji: "💼",
            color: "amber",
            items: [
              { name: "Salary band", thai: "ปัดเงินเดือนเป็นพันบาท เพื่อจัด band", example: "SELECT first_name, salary, ROUND(salary/1000)*1000 AS band\nFROM employees;", runnable: true },
              { name: "Even/Odd ID", thai: "ใช้ MOD แยกพนักงาน emp_id เลขคู่", example: "SELECT * FROM employees WHERE MOD(emp_id, 2) = 0;", runnable: true },
            ],
          },
        ]}
      />
    </div>
  );
}
