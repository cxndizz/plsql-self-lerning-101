export type IntroProps = {
  what: string;
  why: string;
  how: string;
  example?: string;
};

export function Intro({ what, why, how, example }: IntroProps) {
  return (
    <div className="intro-grid">
      <div className="intro-card">
        <h4>🎯 นี่คืออะไร?</h4>
        <p>{what}</p>
      </div>
      <div className="intro-card">
        <h4>💡 ทำไมต้องใช้?</h4>
        <p>{why}</p>
      </div>
      <div className="intro-card">
        <h4>🛠️ ใช้ยังไง?</h4>
        <p>{how}</p>
        {example && (
          <pre className="mt-2 bg-slate-900 text-amber-200 text-xs p-2 rounded overflow-x-auto whitespace-pre-wrap">
            {example}
          </pre>
        )}
      </div>
    </div>
  );
}
