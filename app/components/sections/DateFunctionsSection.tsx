import { Intro } from "../Intro";
import { RefList } from "../RefList";

export function DateFunctionsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Date functions = ฟังก์ชันจัดการวันที่/เวลาของ Oracle"
        why="ระบบใดๆ มี timestamp / due date / report by month — เลี่ยงไม่ได้"
        how="ส่วนใหญ่รับ DATE/TIMESTAMP คืน DATE หรือ NUMBER (จำนวนวัน)"
      />
      <RefList
        groups={[
          {
            title: "เวลาปัจจุบัน",
            emoji: "⏱️",
            color: "amber",
            items: [
              { name: "SYSDATE", syntax: "SYSDATE", thai: "วัน-เวลา ปัจจุบันของเครื่อง server (DATE)", example: "SELECT SYSDATE FROM dual;", note: "ไม่มี timezone — ใช้ใน DEFAULT ของคอลัมน์บ่อย" },
              { name: "CURRENT_DATE", syntax: "CURRENT_DATE", thai: "วันปัจจุบันใน session timezone", example: "SELECT CURRENT_DATE FROM dual;" },
              { name: "SYSTIMESTAMP", syntax: "SYSTIMESTAMP", thai: "TIMESTAMP WITH TIME ZONE ของ server", example: "SELECT SYSTIMESTAMP FROM dual;" },
            ],
          },
          {
            title: "บวก/ลบ/คำนวณ",
            emoji: "📅",
            color: "emerald",
            items: [
              { name: "ADD_MONTHS", syntax: "ADD_MONTHS(d, n)", thai: "บวก n เดือนเข้ากับวันที่ (n ติดลบ = ลบ)", example: "SELECT ADD_MONTHS(SYSDATE, 6) FROM dual;", note: "วันสิ้นเดือนจะคงสิ้นเดือนต่อไป" },
              { name: "MONTHS_BETWEEN", syntax: "MONTHS_BETWEEN(d1, d2)", thai: "ห่างกี่เดือน (d1-d2) — ทศนิยมได้", example: "SELECT MONTHS_BETWEEN(SYSDATE, hire_date) AS m\nFROM employees;", runnable: true },
              { name: "LAST_DAY", syntax: "LAST_DAY(d)", thai: "วันสุดท้ายของเดือนนั้น", example: "SELECT LAST_DAY(SYSDATE) FROM dual;" },
              { name: "NEXT_DAY", syntax: "NEXT_DAY(d, dayname)", thai: "วันถัดไปที่ตรงกับชื่อวัน เช่น 'Friday'", example: "SELECT NEXT_DAY(SYSDATE, 'FRIDAY') FROM dual;" },
              { name: "Arithmetic", syntax: "date + n", thai: "บวกตรงๆ ได้ — n คือจำนวนวัน", example: "SELECT SYSDATE + 7 FROM dual;", note: "1 = 1 วัน, 1/24 = 1 ชั่วโมง" },
            ],
          },
          {
            title: "แปลง / format",
            emoji: "🔄",
            color: "violet",
            items: [
              { name: "TO_DATE", syntax: "TO_DATE(s, fmt)", thai: "แปลง string → DATE ตาม format", example: "SELECT TO_DATE('15-01-2024', 'DD-MM-YYYY') FROM dual;", note: "fmt: YYYY MM DD HH24 MI SS" },
              { name: "TO_CHAR (date)", syntax: "TO_CHAR(d, fmt)", thai: "แปลง DATE → string", example: "SELECT TO_CHAR(SYSDATE, 'DD-MON-YYYY HH24:MI') FROM dual;", result: "23-MAY-2026 14:30" },
              { name: "EXTRACT", syntax: "EXTRACT(part FROM d)", thai: "ดึงเฉพาะส่วน — YEAR/MONTH/DAY/HOUR", example: "SELECT EXTRACT(YEAR FROM hire_date) AS y\nFROM employees;", runnable: true },
              { name: "TRUNC (date)", syntax: "TRUNC(d [, fmt])", thai: "ตัดทิ้งส่วนเล็กกว่า — TRUNC(d,'MM') = วันที่ 1 ของเดือน", example: "SELECT TRUNC(SYSDATE, 'MM') FROM dual;" },
            ],
          },
        ]}
      />
    </div>
  );
}
