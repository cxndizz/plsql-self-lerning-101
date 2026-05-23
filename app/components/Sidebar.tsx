"use client";

import { useEffect, useState } from "react";

export type SectionKey =
  | "intro"
  | "datatypes"
  | "constraints"
  | "create-table"
  | "alter-table"
  | "drop-table"
  | "select"
  | "insert"
  | "update"
  | "delete"
  | "join"
  | "fn-string"
  | "fn-number"
  | "fn-date"
  | "fn-null"
  | "fn-conditional"
  | "aggregate"
  | "group-by"
  | "subquery"
  | "set-ops"
  | "merge"
  | "analytic"
  | "transactions"
  | "view"
  | "index"
  | "sequence"
  | "plsql"
  | "plsql-variables"
  | "plsql-control"
  | "plsql-cursors"
  | "plsql-procfun"
  | "plsql-triggers"
  | "plsql-exceptions"
  | "plsql-collections";

type NavItem = { key: SectionKey; icon: string; label: string; badge?: string };
type NavGroup = { id: string; title: string; defaultOpen?: boolean; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    id: "basics",
    title: "พื้นฐาน",
    defaultOpen: true,
    items: [
      { key: "intro", icon: "👋", label: "เริ่มต้นที่นี่" },
      { key: "datatypes", icon: "🔤", label: "Data Types" },
      { key: "constraints", icon: "🔒", label: "Constraints" },
    ],
  },
  {
    id: "ddl",
    title: "DDL · ออกแบบ",
    defaultOpen: true,
    items: [
      { key: "create-table", icon: "🏗️", label: "CREATE TABLE", badge: "DDL" },
      { key: "alter-table", icon: "🔧", label: "ALTER TABLE", badge: "DDL" },
      { key: "drop-table", icon: "💣", label: "DROP / TRUNCATE", badge: "DDL" },
    ],
  },
  {
    id: "dml",
    title: "DML · ใช้ข้อมูล",
    defaultOpen: true,
    items: [
      { key: "select", icon: "🔎", label: "SELECT", badge: "DML" },
      { key: "insert", icon: "➕", label: "INSERT", badge: "DML" },
      { key: "update", icon: "✏️", label: "UPDATE", badge: "DML" },
      { key: "delete", icon: "🗑️", label: "DELETE", badge: "DML" },
      { key: "join", icon: "🔗", label: "JOIN" },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    defaultOpen: false,
    items: [
      { key: "fn-string", icon: "🔤", label: "String" },
      { key: "fn-number", icon: "🔢", label: "Number" },
      { key: "fn-date", icon: "📅", label: "Date" },
      { key: "fn-null", icon: "🛡️", label: "NULL handling" },
      { key: "fn-conditional", icon: "🎚️", label: "CASE / DECODE" },
    ],
  },
  {
    id: "aggregate",
    title: "สรุปข้อมูล",
    defaultOpen: false,
    items: [
      { key: "aggregate", icon: "📊", label: "Aggregate" },
      { key: "group-by", icon: "📦", label: "GROUP BY / HAVING" },
    ],
  },
  {
    id: "advanced",
    title: "Query ขั้นสูง",
    defaultOpen: false,
    items: [
      { key: "subquery", icon: "🎯", label: "Subquery / EXISTS" },
      { key: "set-ops", icon: "🔀", label: "UNION / INTERSECT" },
      { key: "merge", icon: "🔄", label: "MERGE (UPSERT)" },
      { key: "analytic", icon: "🏆", label: "Analytic / Window" },
    ],
  },
  {
    id: "trx",
    title: "Transactions",
    defaultOpen: false,
    items: [{ key: "transactions", icon: "💎", label: "COMMIT / ROLLBACK" }],
  },
  {
    id: "objects",
    title: "Database Objects",
    defaultOpen: false,
    items: [
      { key: "view", icon: "👁️", label: "VIEW" },
      { key: "index", icon: "🌳", label: "INDEX" },
      { key: "sequence", icon: "🔢", label: "SEQUENCE" },
    ],
  },
  {
    id: "plsql",
    title: "PL/SQL Programming",
    defaultOpen: false,
    items: [
      { key: "plsql", icon: "🧪", label: "Overview", badge: "PL/SQL" },
      { key: "plsql-variables", icon: "📝", label: "Variables / %TYPE" },
      { key: "plsql-control", icon: "🔀", label: "IF / LOOP / CASE" },
      { key: "plsql-cursors", icon: "🎛️", label: "Cursors" },
      { key: "plsql-procfun", icon: "🛠️", label: "Procedures + Functions" },
      { key: "plsql-triggers", icon: "🎬", label: "Triggers" },
      { key: "plsql-exceptions", icon: "🚨", label: "Exceptions" },
      { key: "plsql-collections", icon: "📚", label: "Collections" },
    ],
  },
];

export function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: SectionKey;
  onSelect: (k: SectionKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV.forEach((g) => (init[g.id] = !!g.defaultOpen));
    return init;
  });

  useEffect(() => {
    // auto-open group of active section
    const owner = NAV.find((g) => g.items.some((i) => i.key === active));
    if (owner) setOpenGroups((s) => ({ ...s, [owner.id]: true }));
  }, [active]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function toggle(id: string) {
    setOpenGroups((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <>
      {open && <div className="sidebar-overlay lg:hidden" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="text-xl">🧱</span>
          <div>
            <div className="font-bold text-sm">เรียน SQL / PL-SQL</div>
            <div className="text-xs text-slate-400">Oracle Edition</div>
          </div>
        </div>

        {NAV.map((group) => {
          const isOpen = openGroups[group.id];
          return (
            <div key={group.id} className="mb-1">
              <button
                onClick={() => toggle(group.id)}
                className="nav-group-title w-full flex items-center justify-between hover:text-white transition-colors"
                style={{ background: "transparent", border: 0, cursor: "pointer" }}
              >
                <span>{group.title}</span>
                <span className="text-xs opacity-60">{isOpen ? "▾" : "▸"}</span>
              </button>
              {isOpen &&
                group.items.map((it) => (
                  <button
                    key={it.key}
                    onClick={() => {
                      onSelect(it.key);
                      onClose();
                    }}
                    className={`nav-item ${active === it.key ? "active" : ""}`}
                  >
                    <span className="nav-icon">{it.icon}</span>
                    <span className="truncate">{it.label}</span>
                    {it.badge && <span className="nav-badge">{it.badge}</span>}
                  </button>
                ))}
            </div>
          );
        })}

        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-500 px-1 leading-relaxed">
          💡 รันใน browser ผ่าน alasql · PL/SQL ของจริงต้องใช้ Oracle DB
        </div>
      </aside>
    </>
  );
}
