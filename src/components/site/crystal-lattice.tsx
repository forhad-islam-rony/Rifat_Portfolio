/**
 * Decorative animated crystal-lattice / perovskite unit-cell motif.
 * Pure SVG + CSS so it renders on the server and stays lightweight.
 */
export function CrystalLattice({ className = "" }: { className?: string }) {
  const nodes = [
    { cx: 60, cy: 60 },
    { cx: 200, cy: 60 },
    { cx: 340, cy: 60 },
    { cx: 60, cy: 200 },
    { cx: 200, cy: 200 },
    { cx: 340, cy: 200 },
    { cx: 60, cy: 340 },
    { cx: 200, cy: 340 },
    { cx: 340, cy: 340 },
  ];
  const edges = [
    [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
    [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8],
    [0, 4], [4, 8], [2, 4], [4, 6],
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <g className="lattice-spin" style={{ transformOrigin: "200px 200px" }}>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="url(#edgeGrad)"
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r={i === 4 ? 16 : 9}
            fill={i === 4 ? "#f59e0b" : "url(#nodeGrad)"}
            className="lattice-node"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </g>

      <style>{`
        .lattice-spin { animation: latticeSpin 40s linear infinite; }
        .lattice-node { animation: nodePulse 3.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes latticeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes nodePulse { 0%,100% { opacity: 0.85; } 50% { opacity: 1; r: 11; } }
        @media (prefers-reduced-motion: reduce) {
          .lattice-spin, .lattice-node { animation: none; }
        }
      `}</style>
    </svg>
  );
}
