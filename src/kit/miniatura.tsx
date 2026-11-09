import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, HANDLE, MONO } from "./theme";

// Piezas para miniaturas de YouTube 1280×720.
// Reglas: máximo 3–4 palabras, distintas al título, un solo foco visual,
// alto contraste y legible al tamaño del feed (unos 360 px de ancho).
// La esquina inferior derecha la tapa la duración del video: no poner nada ahí.

export const MINI_W = 1280;
export const MINI_H = 720;

export const FondoMini: React.FC<{
  accent?: string;
  children: React.ReactNode;
  /** Mostrar el nombre del canal (arriba a la izquierda, pequeño). */
  handle?: boolean;
}> = ({ accent = C.blue, children, handle = false }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 800px 520px at 65% 50%, ${accent}66, transparent 70%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${C.dim}30 2px, transparent 2px)`,
        backgroundSize: "40px 40px",
        opacity: 0.6,
      }}
    />
    {children}
    {handle && (
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 40,
          fontFamily: MONO,
          fontSize: 24,
          color: C.dim,
        }}
      >
        {HANDLE}
      </div>
    )}
  </AbsoluteFill>
);

/** Texto grande con contorno para que se lea en pequeño. */
export const Grande: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  rotate?: number;
  align?: "left" | "center";
}> = ({ children, size = 150, color = C.ink, rotate = 0, align = "left" }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 0.95,
      color,
      textAlign: align,
      letterSpacing: -3,
      rotate: `${rotate}deg`,
      textShadow: "0 8px 0 rgba(0,0,0,0.35), 0 0 50px rgba(0,0,0,0.6)",
      WebkitTextStroke: "5px #0b1020",
      paintOrder: "stroke fill",
    }}
  >
    {children}
  </div>
);

/** Etiqueta de color (por ejemplo "PYTHON" o "PARTE 1"). */
export const ChipMini: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  rotate?: number;
}> = ({ children, bg = C.yellow, color = C.bg, rotate = -3 }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: 46,
      background: bg,
      color,
      padding: "8px 26px",
      borderRadius: 16,
      rotate: `${rotate}deg`,
      boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
    }}
  >
    {children}
  </div>
);

/** Diseño típico: texto a la izquierda, visual a la derecha. */
export const MiniSplit: React.FC<{
  texto: React.ReactNode;
  visual: React.ReactNode;
}> = ({ texto, visual }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "row", padding: "70px 60px 90px 70px" }}>
    <div style={{ flex: 0.55, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
      {texto}
    </div>
    <div style={{ flex: 0.45, display: "flex", alignItems: "center", justifyContent: "center" }}>{visual}</div>
  </AbsoluteFill>
);
