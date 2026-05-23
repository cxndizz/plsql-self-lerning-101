"use client";

import { ReactNode } from "react";

const KW = /\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT|RIGHT|INNER|ON|ORDER\s+BY|GROUP\s+BY|HAVING|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|IS|NOT|NULL|LIKE|ASC|DESC|DECLARE|BEGIN|END|IF|THEN|ELSIF|ELSE|LOOP|FOR|IN|WHILE|RETURN|CURSOR|EXCEPTION|WHEN|OTHERS|RAISE|EXIT|VARCHAR2|NUMBER|DATE|BOOLEAN|PROCEDURE|FUNCTION|CREATE|REPLACE|AS|TYPE|RECORD|TABLE|OF)\b/gi;
const STR = /'([^']|'')*'/g;
const NUM = /\b\d+(\.\d+)?\b/g;

function highlight(sql: string): ReactNode[] {
  const tokens: { type: string; text: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  const ranges: { start: number; end: number; type: string }[] = [];

  STR.lastIndex = 0;
  while ((m = STR.exec(sql))) ranges.push({ start: m.index, end: m.index + m[0].length, type: "str" });
  NUM.lastIndex = 0;
  while ((m = NUM.exec(sql))) {
    const overlap = ranges.some((r) => m!.index >= r.start && m!.index < r.end);
    if (!overlap) ranges.push({ start: m.index, end: m.index + m[0].length, type: "num" });
  }
  KW.lastIndex = 0;
  while ((m = KW.exec(sql))) {
    const overlap = ranges.some((r) => m!.index >= r.start && m!.index < r.end);
    if (!overlap) ranges.push({ start: m.index, end: m.index + m[0].length, type: "kw" });
  }
  ranges.sort((a, b) => a.start - b.start);

  const out: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((r, idx) => {
    if (cursor < r.start) out.push(sql.slice(cursor, r.start));
    out.push(
      <span key={idx} className={r.type}>
        {sql.slice(r.start, r.end)}
      </span>
    );
    cursor = r.end;
  });
  if (cursor < sql.length) out.push(sql.slice(cursor));
  tokens.length;
  return out;
}

export function SqlBox({ sql }: { sql: string }) {
  return <pre className="sql-pre">{highlight(sql)}</pre>;
}
