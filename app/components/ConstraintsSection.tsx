import { Intro } from "./Intro";
import { SqlBox } from "./SqlBox";

const ITEMS = [
  {
    badge: "PK",
    cls: "badge-pk",
    name: "PRIMARY KEY",
    what: "ค่าที่ห้ามซ้ำ + ห้ามเป็น NULL ใช้ระบุตัวตนของแถว",
    when: "ทุกตารางควรมี 1 อัน — โดยทั่วไปคือ id ของตาราง",
    example: `CREATE TABLE employees (\n  emp_id   NUMBER(6) PRIMARY KEY,\n  name     VARCHAR2(50)\n);`,
  },
  {
    badge: "FK",
    cls: "badge-fk",
    name: "FOREIGN KEY",
    what: "ค่าต้องตรงกับ PK ของอีกตาราง — ใช้เชื่อมข้อมูล",
    when: "เมื่อต้องอ้างอิงตารางอื่น เช่น พนักงาน → แผนก",
    example: `CREATE TABLE employees (\n  emp_id   NUMBER(6) PRIMARY KEY,\n  dept_id  NUMBER(4) REFERENCES departments(dept_id)\n);`,
  },
  {
    badge: "NN",
    cls: "badge-nn",
    name: "NOT NULL",
    what: "คอลัมน์นี้ต้องมีค่า — ห้ามเว้นว่าง",
    when: "กับข้อมูลที่ขาดไม่ได้ เช่น ชื่อ, email",
    example: `first_name VARCHAR2(50) NOT NULL`,
  },
  {
    badge: "UQ",
    cls: "badge-uq",
    name: "UNIQUE",
    what: "ค่าห้ามซ้ำ — แต่ NULL ได้ (และ NULL ซ้ำกันได้)",
    when: "กับ email, username, รหัสบัตรประชาชน",
    example: `email VARCHAR2(100) UNIQUE`,
  },
  {
    badge: "CHK",
    cls: "badge-default",
    name: "CHECK",
    what: "เงื่อนไขที่ค่าต้องผ่าน — Oracle ตรวจให้อัตโนมัติ",
    when: "เช่น salary > 0, age ระหว่าง 18-65, status เป็น 'A'/'I' เท่านั้น",
    example: `salary NUMBER(10,2) CHECK (salary > 0)`,
  },
  {
    badge: "DFL",
    cls: "badge-default",
    name: "DEFAULT",
    what: "ค่าเริ่มต้น — ถ้า INSERT ไม่ระบุ จะใช้ค่านี้",
    when: "วันที่สร้างเอกสาร (SYSDATE), สถานะเริ่มต้น, จำนวนเริ่มต้น = 0",
    example: `created_at DATE DEFAULT SYSDATE`,
  },
];

export function ConstraintsSection() {
  return (
    <div className="space-y-5">
      <Intro
        what="Constraint คือ 'กติกา' ที่บอกว่าค่าในคอลัมน์ต้องเป็นยังไง — Oracle จะคอยตรวจให้"
        why="ป้องกันข้อมูลผิดเข้าระบบ เช่น email ซ้ำ, ลูกค้าไม่มีชื่อ, สั่งของจำนวนติดลบ"
        how="ใส่หลัง data type ใน CREATE TABLE หรือใช้ ADD CONSTRAINT ใน ALTER TABLE"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ITEMS.map((it) => (
          <div key={it.badge} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${it.cls}`}>{it.badge}</span>
              <span className="font-bold">{it.name}</span>
            </div>
            <p className="text-sm text-muted mb-2">{it.what}</p>
            <p className="text-xs text-subtle mb-3">
              <b>ใช้เมื่อ:</b> {it.when}
            </p>
            <SqlBox sql={it.example} />
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">📚 ตัวอย่างใช้พร้อมกัน</h3>
        <SqlBox
          sql={`CREATE TABLE employees (
  emp_id      NUMBER(6)     PRIMARY KEY,
  first_name  VARCHAR2(50)  NOT NULL,
  email       VARCHAR2(100) NOT NULL UNIQUE,
  salary      NUMBER(10,2)  DEFAULT 0  CHECK (salary >= 0),
  dept_id     NUMBER(4)     REFERENCES departments(dept_id),
  hire_date   DATE          DEFAULT SYSDATE
);`}
        />
      </div>
    </div>
  );
}
