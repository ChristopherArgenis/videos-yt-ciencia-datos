import React from "react";
import { Img, staticFile } from "remotion";
import { C, MONO } from "./theme";

// Cancha de fútbol en coordenadas de StatsBomb: 120 × 80 yardas, (0,0) arriba a la izquierda.
// Todo lo que va dentro de <Cancha> se dibuja en esas coordenadas.

export const LARGO = 120;
export const ANCHO = 80;

export const PASTO = "#0f3d2a";
export const LINEA = "#ffffffb0";

export const Cancha: React.FC<{
  width: number;
  children?: React.ReactNode;
  /** Opacidad de las líneas (0–1). */
  lineas?: number;
  /** Solo la mitad de ataque (x de 60 a 120), con la portería a la derecha. */
  mitad?: boolean;
  style?: React.CSSProperties;
}> = ({ width, children, lineas = 1, mitad = false, style }) => {
  const m = 3; // margen alrededor de la cancha
  const x0 = mitad ? 58 : -m;
  const w = mitad ? LARGO + m - x0 : LARGO + 2 * m;
  return (
    <svg
      width={width}
      height={(width * (ANCHO + 2 * m)) / w}
      viewBox={`${x0} ${-m} ${w} ${ANCHO + 2 * m}`}
      style={{ overflow: mitad ? "hidden" : "visible", ...style }}
    >
      <rect x={-m} y={-m} width={LARGO + 2 * m} height={ANCHO + 2 * m} rx={2} fill={PASTO} />
      {Array.from({ length: 12 }).map((_, i) =>
        i % 2 ? <rect key={i} x={i * 10} y={0} width={10} height={ANCHO} fill="#ffffff07" /> : null,
      )}
      <g fill="none" stroke={LINEA} strokeWidth={0.45} opacity={lineas}>
        <rect x={0} y={0} width={LARGO} height={ANCHO} />
        <line x1={60} y1={0} x2={60} y2={ANCHO} />
        <circle cx={60} cy={40} r={10} />
        <rect x={0} y={18} width={18} height={44} />
        <rect x={102} y={18} width={18} height={44} />
        <rect x={0} y={30} width={6} height={20} />
        <rect x={114} y={30} width={6} height={20} />
        <rect x={-2} y={36} width={2} height={8} />
        <rect x={120} y={36} width={2} height={8} />
        <path d="M 18 32 A 10 10 0 0 1 18 48" />
        <path d="M 102 32 A 10 10 0 0 0 102 48" />
      </g>
      <g fill={LINEA} opacity={lineas}>
        <circle cx={60} cy={40} r={0.5} />
        <circle cx={12} cy={40} r={0.5} />
        <circle cx={108} cy={40} r={0.5} />
      </g>
      {children}
    </svg>
  );
};

/** Flecha de pase de (x1,y1) a (x2,y2); `p` de 0 a 1 la dibuja poco a poco. */
export const Flecha: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p?: number;
  color?: string;
}> = ({ x1, y1, x2, y2, p = 1, color = C.yellow }) => {
  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const t = 2.2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={0.9} strokeLinecap="round" />
      {p > 0.95 && (
        <polygon
          points={`${x2},${y2} ${x2 - t * Math.cos(ang - 0.45)},${y2 - t * Math.sin(ang - 0.45)} ${x2 - t * Math.cos(ang + 0.45)},${y2 - t * Math.sin(ang + 0.45)}`}
          fill={color}
        />
      )}
      <circle cx={x1} cy={y1} r={1.3} fill={color} />
    </g>
  );
};

/** Crédito obligatorio de StatsBomb (cláusula 1.4 de su acuerdo): logo + texto. */
export const CreditoStatsBomb: React.FC<{ grande?: boolean }> = ({ grande = false }) => (
  <div
    style={{
      position: "absolute",
      left: grande ? undefined : 64,
      bottom: grande ? undefined : 172,
      display: "flex",
      alignItems: "center",
      gap: grande ? 22 : 14,
      fontFamily: MONO,
      fontSize: grande ? 28 : 20,
      color: C.dim,
      opacity: grande ? 1 : 0.9,
      ...(grande ? { position: "relative" as const } : {}),
    }}
  >
    <span>Datos:</span>
    <Img src={staticFile("logos/statsbomb.svg")} style={{ height: grande ? 44 : 24 }} />
    <span>Open Data</span>
  </div>
);
