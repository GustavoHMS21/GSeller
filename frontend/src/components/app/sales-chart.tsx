"use client";

import { useId, useState } from "react";
import { formatBRL, formatInt } from "@/lib/format";
import type { SalesPoint } from "@/lib/types";

const W = 640;
const H = 220;
const PAD = { top: 12, right: 12, bottom: 24, left: 56 };
const compactBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Topo do eixo Y arredondado (1, 2 ou 5 × potência de 10). */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((m) => m * power >= value) ?? 10;
  return step * power;
}

/**
 * Valor de vendas no tempo: uma série, área clara com linha de 2px, cruz e tooltip pelo
 * mouse ou pelas setas do teclado, e a mesma informação em tabela (skill dataviz).
 */
export function SalesChart({ points, title }: { points: SalesPoint[]; title: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const tableId = useId();
  const max = niceMax(Math.max(...points.map((p) => p.revenue)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length > 1 ? (i * innerW) / (points.length - 1) : 0);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.revenue)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, max / 2, max];
  const xLabels = points
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => i % Math.ceil(points.length / 6) === 0 || i === points.length - 1);
  const active = hover === null ? null : points[hover];

  function pick(clientX: number, rect: DOMRect) {
    const svgX = ((clientX - rect.left) / rect.width) * W;
    const i = Math.round(((svgX - PAD.left) / innerW) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  }

  return (
    <figure className="relative">
      {/* As setas percorrem os pontos como um controle deslizante; a tabela traz tudo. */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={title}
        aria-describedby={tableId}
        aria-valuemin={0}
        aria-valuemax={points.length - 1}
        aria-valuenow={hover ?? 0}
        aria-valuetext={
          active
            ? `${active.label}: ${formatBRL(active.revenue)}, ${formatInt(active.orders)} pedidos`
            : "Use as setas para ver cada ponto"
        }
        className="touch-none rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          const step = e.key === "ArrowRight" ? 1 : -1;
          setHover((h) => Math.max(0, Math.min(points.length - 1, (h ?? -step) + step)));
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                className="stroke-line"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-fg-muted text-[11px]"
              >
                {compactBRL.format(t)}
              </text>
            </g>
          ))}
          {xLabels.map(({ p, i }) => (
            <text
              key={p.label}
              x={x(i)}
              y={H - 6}
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
              className="fill-fg-muted text-[11px]"
            >
              {p.label}
            </text>
          ))}
          <path d={area} className="fill-chart-1" fillOpacity="0.1" />
          <path
            d={line}
            fill="none"
            className="stroke-chart-1"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {hover !== null && active && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={y(0)}
                className="stroke-fg-muted"
                strokeWidth="1"
              />
              <circle
                cx={x(hover)}
                cy={y(active.revenue)}
                r="4"
                className="fill-chart-1 stroke-surface"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>
      {active && hover !== null && (
        <div
          className="pointer-events-none absolute top-2 rounded-md border border-line bg-surface px-3 py-2 text-sm shadow-md"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform: `translateX(${hover > points.length / 2 ? "-105%" : "5%"})`,
          }}
        >
          <p className="font-semibold tabular-nums">{formatBRL(active.revenue)}</p>
          <p className="text-fg-muted">
            {active.label} · {formatInt(active.orders)} pedidos
          </p>
        </div>
      )}
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-primary">Ver tabela</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table id={tableId} className="w-full">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted">
                <th scope="col" className="py-1 pr-4 font-medium">
                  Período
                </th>
                <th scope="col" className="py-1 pr-4 text-right font-medium">
                  Valor de vendas
                </th>
                <th scope="col" className="py-1 text-right font-medium">
                  Pedidos
                </th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.label} className="border-b border-line last:border-0">
                  <th scope="row" className="py-1 pr-4 text-left font-normal">
                    {p.label}
                  </th>
                  <td className="py-1 pr-4 text-right tabular-nums">{formatBRL(p.revenue)}</td>
                  <td className="py-1 text-right tabular-nums">{formatInt(p.orders)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
