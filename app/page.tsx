"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar, SectionKey, NAV } from "./components/Sidebar";
import { ServerPanel } from "./components/ServerPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { BeginnerSection } from "./components/BeginnerSection";
import { DataTypesSection } from "./components/DataTypesSection";
import { ConstraintsSection } from "./components/ConstraintsSection";
import { CreateTableSection } from "./components/CreateTableSection";
import { AlterTableSection } from "./components/AlterTableSection";
import { DropTableSection } from "./components/DropTableSection";
import { SelectSection } from "./components/SelectSection";
import { InsertSection } from "./components/InsertSection";
import { UpdateSection } from "./components/UpdateSection";
import { DeleteSection } from "./components/DeleteSection";
import { JoinSection } from "./components/JoinSection";
import { PlsqlSection } from "./components/PlsqlSection";
import { StringFunctionsSection } from "./components/sections/StringFunctionsSection";
import { NumberFunctionsSection } from "./components/sections/NumberFunctionsSection";
import { DateFunctionsSection } from "./components/sections/DateFunctionsSection";
import { NullFunctionsSection } from "./components/sections/NullFunctionsSection";
import { ConditionalFunctionsSection } from "./components/sections/ConditionalFunctionsSection";
import { AggregateSection } from "./components/sections/AggregateSection";
import { GroupBySection } from "./components/sections/GroupBySection";
import { SubquerySection } from "./components/sections/SubquerySection";
import { SetOpsSection } from "./components/sections/SetOpsSection";
import { MergeSection } from "./components/sections/MergeSection";
import { AnalyticSection } from "./components/sections/AnalyticSection";
import { TransactionsSection } from "./components/sections/TransactionsSection";
import { ViewSection } from "./components/sections/ViewSection";
import { IndexSection } from "./components/sections/IndexSection";
import { SequenceSection } from "./components/sections/SequenceSection";
import { PlsqlVariablesSection } from "./components/sections/PlsqlVariablesSection";
import { PlsqlControlSection } from "./components/sections/PlsqlControlSection";
import { PlsqlCursorsSection } from "./components/sections/PlsqlCursorsSection";
import { PlsqlProcFunSection } from "./components/sections/PlsqlProcFunSection";
import { PlsqlTriggersSection } from "./components/sections/PlsqlTriggersSection";
import { PlsqlExceptionsSection } from "./components/sections/PlsqlExceptionsSection";
import { PlsqlCollectionsSection } from "./components/sections/PlsqlCollectionsSection";
import { snapshotAll } from "@/lib/runSql";
import { resetSchema, useSchema } from "@/lib/schemaStore";

function currentSectionMeta(k: SectionKey): { icon: string; label: string; group: string } {
  for (const g of NAV) {
    const it = g.items.find((i) => i.key === k);
    if (it) return { icon: it.icon, label: it.label, group: g.title };
  }
  return { icon: "", label: "", group: "" };
}

export default function Home() {
  const [section, setSection] = useState<SectionKey>("intro");
  const [tables, setTables] = useState<Record<string, Record<string, unknown>[]>>({});
  const [focused, setFocused] = useState<string | undefined>(undefined);
  const [tick, setTick] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const schema = useSchema();

  useEffect(() => {
    setTables(snapshotAll());
  }, [tick, schema]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  function doReset() {
    if (confirm("รีเซ็ตข้อมูลทั้งหมด (ตารางและแถว) เป็นค่าเริ่มต้น?")) {
      resetSchema();
      refresh();
    }
  }

  const meta = currentSectionMeta(section);

  return (
    <div className="app-shell">
      <Sidebar active={section} onSelect={setSection} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        <div className="topbar">
          <button className="icon-btn lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="open menu">
            ☰
          </button>
          <div className="min-w-0">
            <div className="text-xs text-subtle truncate">{meta.group}</div>
            <h1 className="text-base md:text-lg font-bold truncate">
              {meta.icon} {meta.label}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={doReset} className="icon-btn" title="รีเซ็ตข้อมูลเป็นค่าเริ่มต้น">
              ↺
            </button>
            <ThemeToggle />
          </div>
        </div>

        <section className="mb-5">
          <ServerPanel tables={tables} focusedTable={focused} />
        </section>

        <section>
          {section === "intro" && <BeginnerSection onGo={(k) => setSection(k as SectionKey)} />}
          {section === "datatypes" && <DataTypesSection />}
          {section === "constraints" && <ConstraintsSection />}
          {section === "create-table" && <CreateTableSection />}
          {section === "alter-table" && <AlterTableSection />}
          {section === "drop-table" && <DropTableSection />}
          {section === "select" && <SelectSection onRun={refresh} onFocus={setFocused} />}
          {section === "insert" && <InsertSection onRun={refresh} onFocus={setFocused} />}
          {section === "update" && <UpdateSection onRun={refresh} onFocus={setFocused} />}
          {section === "delete" && <DeleteSection onRun={refresh} onFocus={setFocused} />}
          {section === "join" && <JoinSection onRun={refresh} />}

          {section === "fn-string" && <StringFunctionsSection />}
          {section === "fn-number" && <NumberFunctionsSection />}
          {section === "fn-date" && <DateFunctionsSection />}
          {section === "fn-null" && <NullFunctionsSection />}
          {section === "fn-conditional" && <ConditionalFunctionsSection />}

          {section === "aggregate" && <AggregateSection />}
          {section === "group-by" && <GroupBySection />}

          {section === "subquery" && <SubquerySection />}
          {section === "set-ops" && <SetOpsSection />}
          {section === "merge" && <MergeSection />}
          {section === "analytic" && <AnalyticSection />}

          {section === "transactions" && <TransactionsSection />}
          {section === "view" && <ViewSection />}
          {section === "index" && <IndexSection />}
          {section === "sequence" && <SequenceSection />}

          {section === "plsql" && <PlsqlSection />}
          {section === "plsql-variables" && <PlsqlVariablesSection />}
          {section === "plsql-control" && <PlsqlControlSection />}
          {section === "plsql-cursors" && <PlsqlCursorsSection />}
          {section === "plsql-procfun" && <PlsqlProcFunSection />}
          {section === "plsql-triggers" && <PlsqlTriggersSection />}
          {section === "plsql-exceptions" && <PlsqlExceptionsSection />}
          {section === "plsql-collections" && <PlsqlCollectionsSection />}
        </section>

        <footer className="mt-10 text-center text-xs text-subtle">
          Built with Next.js + alasql · เรียน SQL / PL-SQL ของ Oracle
        </footer>
      </main>
    </div>
  );
}
