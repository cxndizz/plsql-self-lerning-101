export function ResultTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (rows.length === 0) return <p className="text-sm text-slate-500">(ไม่มีแถวที่ตรงเงื่อนไข)</p>;
  const cols = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            {cols.map((c) => (
              <th key={c} className="text-left px-3 py-2 font-mono text-xs">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2">
                  {r[c] === null || r[c] === undefined ? (
                    <span className="text-slate-400 italic">NULL</span>
                  ) : (
                    String(r[c])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-2">{rows.length} แถว</p>
    </div>
  );
}
