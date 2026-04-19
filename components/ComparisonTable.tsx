const rows = [
  { label: "Generation", pre: "Whole clip at once", auto: "Frame by frame, sequential" },
  { label: "Latency profile", pre: "Render then stream", auto: "Stream as it generates" },
  { label: "Idle behavior", pre: "Looped animation", auto: "Emergent, scene-conditioned" },
  {
    label: "Response to interruption",
    pre: "Finish or restart",
    auto: "Pivot mid-frame",
  },
  {
    label: "Novel action execution",
    pre: "Limited to trained animations",
    auto: "Generated on demand",
  },
];

export function ComparisonTable() {
  return (
    <div className="my-10 overflow-x-auto">
      <table className="w-full border-collapse font-sans text-[0.95rem]">
        <thead>
          <tr className="border-b border-rule text-left">
            <th scope="col" className="py-3 pr-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-mute">
              {/* spacer */}
            </th>
            <th scope="col" className="py-3 pr-4 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-mute">
              Pre-rendered / diffusion
            </th>
            <th
              scope="col"
              className="py-3 pl-4 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-accent"
            >
              Autoregressive (GWM-1)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-rule/70 align-top">
              <th
                scope="row"
                className="py-4 pr-4 text-left font-sans text-[0.95rem] font-semibold text-ink"
              >
                {r.label}
              </th>
              <td className="py-4 pr-4 text-mute">{r.pre}</td>
              <td className="border-l-2 border-accent bg-accent/[0.06] py-4 pl-4 text-ink">
                {r.auto}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
