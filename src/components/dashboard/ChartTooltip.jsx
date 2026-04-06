export default function ChartTooltip({ active, payload, label, prefix = "", suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface2 border border-border rounded-lg px-3.5 py-2.5 shadow-md text-[13px]">
      <p className="font-semibold text-tx mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-semibold text-tx tabnum">
            {prefix}{(p.value || 0).toLocaleString("en-IN")}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
}