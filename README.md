# เรียน SQL แบบเห็นภาพ (Visual SQL Learner)

สื่อการสอน SQL / PL-SQL พื้นฐานแบบ **block-based** — เลือกบล็อกของ clause แล้วเห็น SQL + คำอธิบาย + ผลลัพธ์จริงๆ ในหน้าเดียว

## รันบนเครื่อง

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## Deploy ขึ้น Vercel

```bash
npm i -g vercel
vercel
```

หรือ push ขึ้น GitHub แล้ว import ใน vercel.com — ไม่ต้อง config อะไรเพิ่ม

## โครงสร้าง

- `app/page.tsx` — UI หลัก (block builder + ผลลัพธ์)
- `lib/sampleData.ts` — ตารางตัวอย่าง (employees, departments)
- `lib/queryBuilder.ts` — สร้าง SQL string + คำอธิบายภาษาไทย
- `lib/runSql.ts` — รัน SQL ใน browser ด้วย alasql

## ข้อจำกัด

- รัน SQL ใน browser ด้วย [alasql](https://github.com/AlaSQL/alasql) — รองรับ SELECT/WHERE/JOIN/ORDER BY/GROUP BY
- **PL/SQL block จริงๆ (DECLARE/BEGIN/END, cursor, procedure) รันไม่ได้** เพราะต้องใช้ Oracle engine — มีแค่ section แสดงตัวอย่างพร้อมคำอธิบาย

## ไอเดียต่อยอด

- Drag-and-drop จริงๆ ด้วย dnd-kit
- เพิ่ม GROUP BY / HAVING / Aggregate functions เป็นบล็อก
- โหมด "challenge" — โจทย์ + เฉลย
- Visualize JOIN ด้วย Venn diagram
- รัน PL/SQL จริงผ่าน backend (Oracle XE ใน Docker)
