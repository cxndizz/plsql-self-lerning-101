"use client";

import { useSyncExternalStore } from "react";
import { SEED_TABLES, TableSchema } from "./sampleData";

const STORAGE_KEY = "sql-learn-schema-v1";

type Listener = () => void;
const listeners = new Set<Listener>();

let schema: TableSchema[] = clone(SEED_TABLES);
let loaded = false;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function loadFromStorage() {
  if (typeof window === "undefined" || loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) schema = parsed;
    }
  } catch {}
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
}

export function getSchema(): TableSchema[] {
  loadFromStorage();
  return schema;
}

export function setSchema(next: TableSchema[]) {
  schema = next;
  saveToStorage();
  emit();
}

export function getTable(name: string): TableSchema | undefined {
  return getSchema().find((t) => t.name === name);
}

export function getTableNames(): string[] {
  return getSchema().map((t) => t.name);
}

export function addTable(t: TableSchema) {
  setSchema([...getSchema(), t]);
}

export function dropTable(name: string) {
  setSchema(getSchema().filter((t) => t.name !== name));
}

export function updateTable(name: string, patch: Partial<TableSchema>) {
  setSchema(getSchema().map((t) => (t.name === name ? { ...t, ...patch } : t)));
}

export function resetSchema() {
  setSchema(clone(SEED_TABLES));
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useSchema(): TableSchema[] {
  return useSyncExternalStore(subscribe, getSchema, () => SEED_TABLES);
}

/** Notify after data mutation (INSERT/UPDATE/DELETE in alasql) — re-snapshot rows into schema for visual persistence. */
export function syncRowsFromAlasql(snapshot: Record<string, Record<string, unknown>[]>) {
  const current = getSchema();
  const next = current.map((t) => (snapshot[t.name] ? { ...t, rows: snapshot[t.name] } : t));
  setSchema(next);
}
