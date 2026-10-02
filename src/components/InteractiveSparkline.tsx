import React, { useState } from 'react';
import { PricePoint } from '../actions';

interface InteractiveSparklineProps {
  data: PricePoint[];
  currency?: string;
  isPositive?: boolean;
  height?: number;
}

export function InteractiveSparkline({
  data,
  currency = '€',
  isPositive = true,
  height = 160
}: InteractiveSparklineProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length < 2) return null;

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const width = 500;
  const paddingY = 24;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = paddingY + chartHeight - ((d.price - minPrice) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX},${prev.y} ${cpX},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const strokeColor = isPositive ? '#1f6b4f' : '#a4332f';
  const gradientId = `sparkline-gradient-light-${isPositive ? 'pos' : 'neg'}`;

  return (
    <div className="relative w-full select-none" style={{ height }}>
      {/* Active price tooltip overlay */}
      <div className="absolute top-1 left-2 flex items-baseline gap-2 z-10 pointer-events-none">
        <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
          {activePoint.price.toFixed(2)} {currency}
        </span>
        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-none">
          {activePoint.date}
        </span>
      </div>

      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
          const idx = Math.round((relX / rect.width) * (data.length - 1));
          setHoverIndex(idx);
        }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.16} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Gradient fill area */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Stroke line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vertical cursor guide line */}
        {hoverIndex !== null && (
          <line
            x1={activePoint.x}
            y1={0}
            x2={activePoint.x}
            y2={height}
            stroke="#cbd5e1"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />
        )}

        {/* Dot on active point */}
        <circle
          cx={activePoint.x}
          cy={activePoint.y}
          r="5"
          fill={strokeColor}
          stroke="#ffffff"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}
