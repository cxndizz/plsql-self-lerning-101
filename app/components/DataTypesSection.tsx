import { Intro } from "./Intro";

type Row = {
  type: string;
  thai: string;
  example: string;
  note: string;
  group: "string" | "number" | "date" | "lob" | "other";
};

const ROWS: Row[] = [
  { type: "VARCHAR2(n)", thai: "สตริงความยาวไม่คงที่ สูงสุด n ไบต์", example: "first_name VARCHAR2(50)", note: "นิยมที่สุดสำหรับข้อความ — ขนาดเก็บเท่าที่ใช้จริง", group: "string" },
  { type: "CHAR(n)", thai: "สตริงความยาวคงที่ — เติม space ให้ครบ n", example: "country_code CHAR(2)", note: "ใช้กับข้อมูลที่ความยาวคงที่จริงๆ เช่นรหัสประเทศ", group: "string" },
  { type: "NCHAR / NVARCHAR2", thai: "เก็บ Unicode (รองรับหลายภาษา)", example: "name NVARCHAR2(50)", note: "สำหรับภาษาที่ต้องใช้ multi-byte", group: "string" },
  { type: "CLOB", thai: "Character Large Object — ข้อความขนาดใหญ่ถึง 128TB", example: "article CLOB", note: "ใช้กับเนื้อหายาวๆ เช่น บทความ", group: "lob" },
  { type: "NUMBER(p,s)", thai: "ตัวเลข precision p หลัก, ทศนิยม s หลัก", example: "salary NUMBER(10,2)", note: "p คือทั้งหมด, s คือหลังจุด — เก็บได้แม่นยำ", group: "number" },
  { type: "NUMBER(p)", thai: "จำนวนเต็มสูงสุด p หลัก", example: "emp_id NUMBER(6)", note: "ไม่มีทศนิยม", group: "number" },
  { type: "NUMBER", thai: "ตัวเลขทศนิยมขนาดใดก็ได้ (สูงสุด 38 หลัก)", example: "amount NUMBER", note: "ไม่ระบุ precision = ใช้ขนาดเต็ม", group: "number" },
  { type: "INTEGER", thai: "alias ของ NUMBER(38) — จำนวนเต็ม", example: "qty INTEGER", note: "เท่ากับ NUMBER(38,0)", group: "number" },
  { type: "FLOAT(p)", thai: "เลขทศนิยมแบบ floating point", example: "ratio FLOAT(10)", note: "ใช้น้อยกว่า NUMBER ใน Oracle", group: "number" },
  { type: "DATE", thai: "วัน-เดือน-ปี + เวลา (ความละเอียดวินาที)", example: "hire_date DATE", note: "default คือ DD-MON-YY — ใช้ TO_DATE() แปลง", group: "date" },
  { type: "TIMESTAMP", thai: "DATE + เศษเสี้ยววินาที + timezone", example: "created_at TIMESTAMP", note: "ละเอียดกว่า DATE — มี TIMESTAMP WITH TIME ZONE ด้วย", group: "date" },
  { type: "INTERVAL", thai: "ช่วงเวลา เช่น 3 เดือน, 2 ชั่วโมง", example: "duration INTERVAL DAY TO SECOND", note: "ใช้คำนวณช่วงเวลา", group: "date" },
  { type: "BLOB", thai: "Binary Large Object — เก็บไฟล์รูป/วิดีโอ", example: "photo BLOB", note: "สูงสุด 128TB เหมือน CLOB แต่เก็บเป็น binary", group: "lob" },
  { type: "RAW(n)", thai: "ข้อมูล binary ความยาว n ไบต์ (สูงสุด 2000)", example: "uuid RAW(16)", note: "เหมาะกับ UUID, hash", group: "other" },
  { type: "BOOLEAN", thai: "TRUE / FALSE / NULL", example: "is_active BOOLEAN", note: "ใน column ของตารางจริงๆ ใช้ได้ตั้งแต่ Oracle 23ai — ก่อนหน้านั้นใช้ CHAR(1) Y/N", group: "other" },
  { type: "JSON", thai: "เก็บ JSON document (Oracle 21c+)", example: "metadata JSON", note: "query ด้วย JSON functions ได้", group: "other" },
];

const GROUPS: { key: Row["group"]; label: string; color: string }[] = [
  { key: "string", label: "📝 ข้อความ (String)", color: "block-sky" },
  { key: "number", label: "🔢 ตัวเลข (Number)", color: "block-emerald" },
  { key: "date", label: "📅 วันเวลา (Date/Time)", color: "block-amber" },
  { key: "lob", label: "📦 ข้อมูลขนาดใหญ่ (LOB)", color: "block-violet" },
  { key: "other", label: "✨ อื่นๆ", color: "block-slate" },
];

export function DataTypesSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Data Type คือ 'ชนิดของข้อมูล' ที่คอลัมน์เก็บได้ — เช่นข้อความ, ตัวเลข, วันที่"
        why="กำหนดให้ถูกต้องช่วยประหยัดพื้นที่, ป้องกันข้อมูลผิดประเภท, และทำให้คำนวณ/เรียงได้ถูกต้อง"
        how="กำหนดตอน CREATE TABLE หลังชื่อคอลัมน์ เช่น first_name VARCHAR2(50)"
      />

      {GROUPS.map((g) => (
        <div key={g.key} className={`block ${g.color}`}>
          <h3 className="font-bold mb-3">{g.label}</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>คำอธิบาย</th>
                  <th>ตัวอย่าง</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.filter((r) => r.group === g.key).map((r) => (
                  <tr key={r.type}>
                    <td className="font-mono font-semibold whitespace-nowrap">{r.type}</td>
                    <td>{r.thai}</td>
                    <td>
                      <code className="text-xs">{r.example}</code>
                    </td>
                    <td className="text-xs">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="card">
        <h3 className="font-semibold mb-2">💡 เลือก type ยังไงดี?</h3>
        <ul className="text-sm space-y-1.5 text-muted">
          <li>• <b>ชื่อ, ที่อยู่, email</b> → <code>VARCHAR2(n)</code></li>
          <li>• <b>เงิน, จำนวน, ราคา</b> → <code>NUMBER(p,s)</code> (ระบุทศนิยมเสมอถ้าเป็นเงิน เช่น 2)</li>
          <li>• <b>รหัส auto-increment</b> → <code>NUMBER(p)</code> + Sequence</li>
          <li>• <b>วันเริ่มงาน, วันเกิด</b> → <code>DATE</code></li>
          <li>• <b>timestamp ของ log</b> → <code>TIMESTAMP</code></li>
          <li>• <b>รูปโปรไฟล์, ไฟล์</b> → <code>BLOB</code></li>
          <li>• <b>true/false (เก่า)</b> → <code>CHAR(1)</code> 'Y'/'N' (Oracle &lt; 23ai)</li>
        </ul>
      </div>
    </div>
  );
}
