"use client";

import { formatType } from "@/lib/sampleData";
import { useSchema } from "@/lib/schemaStore";

export type RowFlag = "new" | "updated" | "deleted";
export type Highlight = Record<string, Record<number, RowFlag>>;

export function ServerPanel({
  tables,
  highlight,
  focusedTable,
}: {
  tables: Record<string, Record<string, unknown>[]>;
  highlight?: Highlight;
  focusedTable?: string;
}) {
  const schema = useSchema();
  return (
    <div className="server-shell">
      <div className="flex items-center gap-2 mb-3 flex-wrap relative z-10">
        <span className="server-light" />
        <span className="font-semibold text-sm">🖥️ ORCL · Virtual Database Server</span>
        <span className="ml-auto text-xs text-slate-400">localhost:1521 · {schema.length} tables</span>
      </div>

      {schema.length === 0 ? (
        <div className="text-center text-slate-500 py-10 text-sm">
          (ยังไม่มีตาราง — ไปที่ <b>CREATE TABLE</b> เพื่อสร้างใหม่)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 relative z-10">
          {schema.map((t) => {
            const rows = tables[t.name] ?? t.rows;
            const flags = highlight?.[t.name] ?? {};
            const focused = focusedTable === t.name;
            return (
              <div
                key={t.name}
                className="db-table"
                style={{ outline: focused ? "2px solid #818cf8" : "none", outlineOffset: focused ? "2px" : "0" }}
              >
                <div className="db-table-head">
                  <span>{t.emoji}</span>
                  <span className="font-mono">{t.name}</span>
                  <span className="text-xs text-slate-400 font-normal">· {t.thaiName}</span>
                  <span className="ml-auto text-xs text-slate-400">{rows.length} rows</span>
                </div>
                <div className="scroll-x">
                  <table>
                    <thead>
                      <tr>
                        {t.columns.map((c) => (
                          <th key={c.name} title={`${formatType(c)}${c.nullable ? "" : " NOT NULL"}`}>
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-1">
                                {c.name}
                                {c.pk && <span className="badge badge-pk">PK</span>}
                                {c.fk && <span className="badge badge-fk">FK</span>}
                                {!c.nullable && !c.pk && <span className="badge badge-nn">NN</span>}
                                {c.unique && !c.pk && <span className="badge badge-uq">UQ</span>}
                              </span>
                              <span className="text-[10px] opacity-60 font-normal normal-case">{formatType(c)}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan={t.columns.length} className="text-center text-slate-500 italic py-3">
                            (ว่าง)
                          </td>
                        </tr>
                      ) : (
                        rows.map((r, i) => {
                          const flag = flags[i];
                          const cls = flag === "new" ? "row-new" : flag === "updated" ? "row-updated" : flag === "deleted" ? "row-deleted" : "";
                          return (
                            <tr key={i} className={cls}>
                              {t.columns.map((c) => (
                                <td key={c.name}>
                                  {r[c.name] === null || r[c.name] === undefined ? (
                                    <span className="text-slate-500 italic">NULL</span>
                                  ) : (
                                    String(r[c.name])
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
