import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT, HANDLE, MONO } from "./theme";

// Kit visual para videos largos 16:9 (1920×1080).
// Mismas piezas que el kit de los Shorts, con tamaños y márgenes horizontales.

/** Spring de entrada (0 → 1) que arranca en `delay` frames. */
export const useIn = (delay = 0, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, mass: 0.6, stiffness: 160 },
  });
};

/** Fondo: degradado con rejilla de puntos que se desplaza lento. */
export const Bg: React.FC<{ accent?: string }> = ({ accent = C.blue }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1300px 800px at 50% 45%, ${accent}33, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.dim}30 2.5px, transparent 2.5px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${(frame * 0.4) % 54}px ${(frame * 0.25) % 54}px`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

/** Nombre del canal, discreto, arriba a la derecha. */
export const Handle: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 44,
      right: 64,
      fontFamily: MONO,
      fontSize: 26,
      color: C.dim,
      letterSpacing: 1,
      opacity: 0.85,
    }}
  >
    {HANDLE}
  </div>
);

/**
 * Texto que entra palabra por palabra. Las palabras entre *asteriscos* se
 * resaltan con el color de acento.
 */
export const Words: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  color?: string;
  accent?: string;
  weight?: number;
  align?: "center" | "left";
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  stagger = 3,
  size = 84,
  color = C.ink,
  accent = C.yellow,
  weight = 900,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.12,
        color,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.26,
        letterSpacing: -1,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const hl = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 12, mass: 0.5, stiffness: 180 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: hl ? accent : undefined,
              opacity: interpolate(p, [0, 0.3], [0, 1], {
                extrapolateRight: "clamp",
              }),
              scale: interpolate(p, [0, 1], [0.55, 1]),
              translate: `0px ${interpolate(p, [0, 1], [40, 0])}px`,
            }}
          >
            {clean}
          </span>
        );
      })}
    </div>
  );
};

/** Número que cuenta de `from` a `to`. */
export const Counter: React.FC<{
  from?: number;
  to: number;
  start?: number;
  dur?: number;
  decimals?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({
  from = 0,
  to,
  start = 0,
  dur = 30,
  decimals = 0,
  suffix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {v.toFixed(decimals).replace(".", ",")}
      {suffix}
    </span>
  );
};

/** Efecto de sonido en un frame dado (archivos en public/sfx). */
export const Sfx: React.FC<{ src: string; at: number; volume?: number }> = ({
  src,
  at,
  volume = 0.5,
}) => (
  <Sequence from={at} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
  </Sequence>
);

/**
 * Área de contenido con márgenes seguros para 16:9: deja libre la franja de
 * arriba (capítulo y canal) y la de abajo (subtítulos).
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  gap?: number;
  direction?: "column" | "row";
  style?: React.CSSProperties;
}> = ({ children, gap = 36, direction = "column", style }) => (
  <AbsoluteFill
    style={{
      padding: "150px 140px 210px 140px",
      display: "flex",
      flexDirection: direction,
      alignItems: "center",
      justifyContent: "center",
      gap,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Dos columnas: típico de video largo (texto a un lado, gráfica al otro). */
export const Split: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number;
}> = ({ left, right, ratio = 0.45 }) => (
  <Stage direction="row" gap={80}>
    <div
      style={{
        flex: ratio,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        justifyContent: "center",
      }}
    >
      {left}
    </div>
    <div
      style={{
        flex: 1 - ratio,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {right}
    </div>
  </Stage>
);

/** Etiqueta tipo "sticker" que entra con rebote. */
export const Sticker: React.FC<{
  children: React.ReactNode;
  delay?: number;
  bg?: string;
  color?: string;
  rotate?: number;
  size?: number;
}> = ({
  children,
  delay = 0,
  bg = C.yellow,
  color = C.bg,
  rotate = -3,
  size = 44,
}) => {
  const p = useIn(delay, 9);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        background: bg,
        color,
        padding: "12px 30px",
        borderRadius: 20,
        rotate: `${rotate}deg`,
        opacity: interpolate(p, [0, 0.2], [0, 1], {
          extrapolateRight: "clamp",
        }),
        scale: interpolate(p, [0, 1], [0.3, 1]),
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/** Nota pequeña abajo a la izquierda: fuente de los datos o "Ejemplo simplificado". */
export const Fuente: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 64,
      bottom: 170,
      fontFamily: MONO,
      fontSize: 22,
      color: C.dim,
      opacity: 0.9,
    }}
  >
    {children}
  </div>
);

/** Tarjeta con borde suave para agrupar contenido. */
export const Card: React.FC<{
  children: React.ReactNode;
  delay?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, accent = C.blue, style }) => {
  const p = useIn(delay);
  return (
    <div
      style={{
        background: `${C.bg2}cc`,
        border: `3px solid ${accent}66`,
        borderRadius: 28,
        padding: "32px 40px",
        opacity: interpolate(p, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        translate: `0px ${interpolate(p, [0, 1], [30, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
