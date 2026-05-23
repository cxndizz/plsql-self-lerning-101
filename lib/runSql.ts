"use client";

import alasql from "alasql";
import { toAlasqlType } from "./sampleData";
import { getSchema, syncRowsFromAlasql } from "./schemaStore";

let lastSchemaSig = "";

function schemaSignature(): string {
  return getSchema()
    .map((t) => `${t.name}:${t.columns.map((c) => `${c.name}-${c.type}`).join(",")}`)
    .join("|");
}

function ensureInit() {
  const sig = schemaSignature();
  if (sig === lastSchemaSig) return;
  lastSchemaSig = sig;

  for (const t of getSchema()) {
    try {
      alasql(`DROP TABLE IF EXISTS ${t.name}`);
    } catch {}
    const colDefs = t.columns.map((c) => `${c.name} ${toAlasqlType(c)}`).join(", ");
    alasql(`CREATE TABLE ${t.name} (${colDefs})`);
    alasql.tables[t.name].data = t.rows.map((r) => ({ ...r }));
  }
}

export type RunResult = {
  rows: Record<string, unknown>[] | null;
  error: string | null;
  affected: number | null;
  kind: "select" | "insert" | "update" | "delete" | "ddl" | "unknown";
};

export function runQuery(sql: string): RunResult {
  try {
    ensureInit();
    const cleaned = sql.trim().replace(/;$/, "");
    const verb = cleaned.split(/\s+/)[0]?.toUpperCase();
    const res = alasql(cleaned);

    let kind: RunResult["kind"] = "unknown";
    if (verb === "SELECT") kind = "select";
    else if (verb === "INSERT") kind = "insert";
    else if (verb === "UPDATE") kind = "update";
    else if (verb === "DELETE") kind = "delete";
    else if (["CREATE", "ALTER", "DROP", "TRUNCATE"].includes(verb ?? "")) kind = "ddl";

    if (kind === "select")
      return { rows: Array.isArray(res) ? (res as Record<string, unknown>[]) : [], error: null, affected: null, kind };

    if (kind === "insert" || kind === "update" || kind === "delete") {
      const all = snapshotAllInternal();
      syncRowsFromAlasql(all);
      return { rows: null, error: null, affected: typeof res === "number" ? res : 0, kind };
    }

    return { rows: Array.isArray(res) ? (res as Record<string, unknown>[]) : [], error: null, affected: null, kind };
  } catch (e: unknown) {
    return { rows: null, error: e instanceof Error ? e.message : String(e), affected: null, kind: "unknown" };
  }
}

function snapshotAllInternal(): Record<string, Record<string, unknown>[]> {
  const out: Record<string, Record<string, unknown>[]> = {};
  for (const t of getSchema()) {
    try {
      const r = alasql(`SELECT * FROM ${t.name}`);
      out[t.name] = Array.isArray(r) ? (r as Record<string, unknown>[]) : [];
    } catch {
      out[t.name] = [];
    }
  }
  return out;
}

export function snapshotAll(): Record<string, Record<string, unknown>[]> {
  ensureInit();
  return snapshotAllInternal();
}

export function resetAll() {
  lastSchemaSig = "";
}
