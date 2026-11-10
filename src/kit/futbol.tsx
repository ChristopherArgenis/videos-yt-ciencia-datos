import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Stage, useIn, Words } from "./kit";
import { Cierre, type EscenaProps } from "./largo";
import { C, FONT, MONO } from "./theme";

// Piezas compartidas de la serie "Fútbol con Datos".
export const ARG = "#7cc6f2";
export const FRA = C.coral;

export const COLOR_TIPO: Record<string, string> = {
  Pass: C.green,
  Carry: C.blue,
  Pressure: C.coral,
  "Ball Receipt*": "#a3abd6",
  Shot: C.yellow,
};
export const NOMBRE_TIPO: Record<string, string> = {
  Pass: "Pase",
  "Ball Receipt*": "Recepción",
  Carry: "Conducción",
  Pressure: "Presión",
  "Foul Committed": "Falta",
  "Foul Won": "Falta recibida",
  Shot: "Tiro",
};

/** 0 → 1 entre los frames a y b. */
export const useP = (a: number, b: number, ease = true) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.out(Easing.cubic) : undefined,
  });
};

export const fmt = (n: number, dec = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Número que cuenta con separador de miles. */
export const Num: React.FC<{ to: number; start: number; dur?: number; dec?: number; style?: React.CSSProperties }> = ({
  to,
  start,
  dur = 30,
  dec = 0,
  style,
}) => {
  const p = useP(start, start + dur);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(to * p, dec)}</span>;
};

/** Aparece (opacidad + subida) en el frame `at`. */
export const Aparece: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const p = useIn(at);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number }> = ({
  children,
  color = C.bg,
  bg = C.green,
  size = 28,
}) => (
  <span
    style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      background: bg,
      color,
      borderRadius: 12,
      padding: "6px 16px",
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

export const fin = (l: { at: number; frames: number }) => l.at + l.frames;

export const EPISODIOS = ["Datos", "xG", "Tiros", "Pases", "Presión", "Calor", "xA", "Radares", "Scouting", "La final"];

/** Sello de la serie con los 10 episodios; se ilumina el episodio `n`. */
export const SerieFutbol: React.FC<{ n: number }> = ({ n }) => (
  <Stage gap={50}>
    <Words text="FÚTBOL CON *DATOS*" size={120} accent={C.green} />
    <div style={{ display: "flex", gap: 18 }}>
      {EPISODIOS.map((e, i) => (
        <Aparece key={e} at={12 + i * 3}>
          <div
            style={{
              width: 140,
              height: 120,
              borderRadius: 18,
              background: i === n - 1 ? C.green : `${C.bg2}dd`,
              border: `3px solid ${i === n - 1 ? C.green : C.dim + "44"}`,
              color: i === n - 1 ? C.bg : C.ink,
              fontFamily: FONT,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              scale: i === n - 1 ? "1.12" : "1",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 24, opacity: 0.8 }}>#{i + 1}</span>
            <span style={{ fontWeight: 800, fontSize: 24 }}>{e}</span>
          </div>
        </Aparece>
      ))}
    </div>
  </Stage>
);

export const Fila: React.FC<{ at: number; k: string; v: string; color?: string }> = ({ at, k, v, color = C.ink }) => (
  <Aparece at={at}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 30,
        fontFamily: MONO,
        fontSize: 30,
        padding: "6px 0",
        borderBottom: `1px solid ${C.dim}22`,
      }}
    >
      <span style={{ color: C.dim }}>{k}</span>
      <span style={{ color, fontWeight: 700 }}>{v}</span>
    </div>
  </Aparece>
);

/** Línea de código que se escribe letra por letra. */
export const Codigo: React.FC<{ at: number; texto: string; dur?: number; resaltar?: string; resaltarDesde?: number }> = ({
  at,
  texto,
  dur = 30,
  resaltar,
  resaltarDesde = 1e9,
}) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [at, at + dur], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (frame < at) return <div style={{ height: 50 }} />;
  const vis = texto.slice(0, n);
  const i = resaltar ? vis.indexOf(resaltar) : -1;
  const on = frame >= resaltarDesde && i >= 0;
  return (
    <div style={{ fontFamily: MONO, fontSize: 32, color: C.ink, height: 50, whiteSpace: "pre" }}>
      <span style={{ color: C.dim }}>&gt;&gt;&gt; </span>
      {on ? (
        <>
          {vis.slice(0, i)}
          <span style={{ background: C.yellow, color: C.bg, borderRadius: 6, padding: "0 4px" }}>{resaltar}</span>
          {vis.slice(i + resaltar!.length)}
        </>
      ) : (
        vis
      )}
      {n < texto.length && <span style={{ color: C.green }}>▍</span>}
    </div>
  );
};

/** Cierre de episodio: "Próximo episodio" mientras habla de él, luego el cierre del canal. */
export const CierreFutbol: React.FC<EscenaProps & { n: number; titulo: string; sub: string }> = ({ n, titulo, sub, ...props }) => {
  const [, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={C.yellow}>PRÓXIMO EPISODIO · #{n}</Chip>
          </Aparece>
          <Words text={titulo} size={110} align="left" accent={C.green} delay={6} />
          <Words text={sub} size={52} weight={700} color={C.dim} align="left" delay={20} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};
