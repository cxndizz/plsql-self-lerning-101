import { ReactNode } from "react";

type Color = "amber" | "sky" | "violet" | "rose" | "emerald" | "slate" | "indigo";

export function Block({
  title,
  subtitle,
  color,
  children,
}: {
  title: string;
  subtitle?: string;
  color: Color;
  children: ReactNode;
}) {
  return (
    <div className={`block block-${color}`}>
      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
        <span className={`block-head bh-${color}`}>{title}</span>
        {subtitle && <span className="text-xs text-slate-600">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}
