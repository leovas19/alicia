type ProgressBarProps = {
  label: string;
  value: number;
  tone?: "rose" | "gold";
  hint?: string;
};

export function ProgressBar({ label, value, tone = "rose", hint }: ProgressBarProps) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,251,247,0.82)] p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="title-font text-xl">{label}</p>
          {hint ? <p className="text-sm text-[var(--muted)]">{hint}</p> : null}
        </div>
        <span className="pill">{value}%</span>
      </div>
      <div className="h-4 rounded-full bg-[rgba(77,49,43,0.08)] p-1">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background:
              tone === "gold"
                ? "linear-gradient(90deg, #c6a46c 0%, #ebd0a2 100%)"
                : "linear-gradient(90deg, #8f544f 0%, #d1a29a 100%)"
          }}
        />
      </div>
    </div>
  );
}
