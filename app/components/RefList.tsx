"use client";

import { useState } from "react";
import { SqlBox } from "./SqlBox";
import { ResultTable } from "./ResultTable";
import { runQuery, RunResult } from "@/lib/runSql";

export type RefItem = {
  name: string;
  syntax?: string;
  thai: string;
  example?: string;
  runnable?: boolean;
  result?: string;
  note?: string;
  badge?: string;
};

export type RefGroup = {
  title: string;
  desc?: string;
  emoji?: string;
  color?: "amber" | "sky" | "violet" | "rose" | "emerald" | "slate" | "indigo";
  items: RefItem[];
};

export function RefList({ groups }: { groups: RefGroup[] }) {
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.title} className={g.color ? `block block-${g.color}` : "card"}>
          <div className="flex items-baseline gap-2 mb-3">
            {g.emoji && <span className="text-lg">{g.emoji}</span>}
            <h3 className="font-bold">{g.title}</h3>
            {g.desc && <span className="text-xs text-subtle">{g.desc}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {g.items.map((it, i) => (
              <RefCard key={`${g.title}-${i}`} item={it} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RefCard({ item }: { item: RefItem }) {
  return (
    <div className="card-muted">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="font-mono font-bold text-indigo-500">{item.name}</span>
        {item.badge && <span className="badge badge-default">{item.badge}</span>}
      </div>
      {item.syntax && (
        <div className="text-xs font-mono text-subtle mb-2 bg-black/10 dark:bg-black/30 px-2 py-1 rounded inline-block">
          {item.syntax}
        </div>
      )}
      <p className="text-sm text-muted mb-2">{item.thai}</p>
      {item.example && (
        item.runnable ? (
          <RunBox sql={item.example} />
        ) : (
          <SqlBox sql={item.example} />
        )
      )}
      {item.result && !item.runnable && (
        <div className="mt-2">
          <div className="text-xs text-subtle mb-1">📺 ผลลัพธ์:</div>
          <pre className="bg-slate-900 text-emerald-200 text-xs p-2 rounded whitespace-pre-wrap">{item.result}</pre>
        </div>
      )}
      {item.note && <p className="text-xs text-subtle mt-2">💡 {item.note}</p>}
    </div>
  );
}

export function RunBox({ sql, label = "▶ Run" }: { sql: string; label?: string }) {
  const [r, setR] = useState<RunResult | null>(null);
  return (
    <div>
      <SqlBox sql={sql} />
      <div className="flex items-center gap-2 mt-2">
        <button className="btn-primary" onClick={() => setR(runQuery(sql))}>
          {label}
        </button>
        {r?.affected != null && (
          <span className="text-xs text-muted">
            ✓ {r.affected} แถวได้รับผลกระทบ
          </span>
        )}
      </div>
      {r?.error && (
        <div className="mt-2 text-xs bg-rose-500/10 text-rose-500 p-2 rounded">
          ❌ {r.error}
        </div>
      )}
      {r?.rows && r.rows.length > 0 && (
        <div className="mt-2 overflow-x-auto">
          <ResultTable rows={r.rows} />
        </div>
      )}
      {r?.rows && r.rows.length === 0 && (
        <div className="mt-2 text-xs text-subtle">(ไม่มีแถว)</div>
      )}
    </div>
  );
}
