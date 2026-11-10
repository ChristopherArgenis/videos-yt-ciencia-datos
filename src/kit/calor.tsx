import React from "react";
import { Cancha } from "./cancha";

// Mapa de calor sobre la cancha. `grid` es una rejilla nx × ny (0–1) de scripts/futbol/comun.py:densidad.

/** Frío → caliente: transparente, amarillo, naranja, rojo. */
export const colorCalor = (v: number) => {
  const t = Math.max(0, Math.min(1, v));
  const mezcla = (a: number[], b: number[], k: number) => a.map((x, i) => Math.round(x + (b[i] - x) * k));
  const amarillo = [255, 230, 110];
  const naranja = [255, 150, 40];
  const rojo = [235, 40, 40];
  const c = t < 0.5 ? mezcla(amarillo, naranja, t / 0.5) : mezcla(naranja, rojo, (t - 0.5) / 0.5);
  return `rgb(${c.join(",")})`;
};

export const CapaCalor: React.FC<{ grid: number[][]; p?: number; minimo?: number }> = ({ grid, p = 1, minimo = 0.06 }) => {
  const nx = grid.length;
  const ny = grid[0].length;
  const w = 120 / nx;
  const h = 80 / ny;
  return (
    <g opacity={p}>
      {grid.map((col, i) =>
        col.map((v, j) =>
          v < minimo ? null : (
            <rect
              key={`${i}-${j}`}
              x={i * w}
              y={j * h}
              width={w + 0.05}
              height={h + 0.05}
              fill={colorCalor(v)}
              opacity={Math.min(0.88, 0.15 + v * 0.9)}
            />
          ),
        ),
      )}
    </g>
  );
};

/** Cancha completa con un mapa de calor encima. */
export const Calor: React.FC<{ grid: number[][]; width: number; p?: number; children?: React.ReactNode }> = ({
  grid,
  width,
  p = 1,
  children,
}) => (
  <Cancha width={width} lineas={0.9}>
    <CapaCalor grid={grid} p={p} />
    {children}
  </Cancha>
);
