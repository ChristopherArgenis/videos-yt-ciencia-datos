import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stage, Sticker, Words } from "./kit";
import { Cierre, type EscenaProps } from "./largo";
import { Aparece, Chip, useP } from "./futbol";
import { C, FONT, MONO } from "./theme";

// Piezas del curso "Cálculo Diferencial": fórmulas (KaTeX), código de colores fijo, máquina de funciones,
// plano cartesiano y tarjetas de la plantilla pedagógica (objetivo, plus, error común, reto, resumen).

// Fuentes de KaTeX desde public/ (MIT), para que el render no dependa de internet.
for (const f of ["Main-Regular", "Main-Bold", "Math-Italic", "Size1-Regular", "Size2-Regular", "AMS-Regular"]) {
  const [fam, estilo] = f.split("-");
  loadFont({
    family: `KaTeX_${fam}`,
    url: staticFile(`fonts/katex/KaTeX_${f}.woff2`),
    weight: estilo === "Bold" ? "700" : "400",
    style: estilo === "Italic" ? "italic" : "normal",
  });
}

/** Código de colores del curso (igual en todos los episodios). */
export const COL = {
  entrada: C.blue,
  salida: C.green,
  cambio: C.yellow,
  derivada: C.coral,
  error: C.purple,
};

// Macros: \ent{x} entrada, \sal{f(x)} salida, \reg{2x+3} regla/cambio, \der{} derivada, \err{} error.
const MACROS = {
  "\\ent": `\\textcolor{#${COL.entrada}}{#1}`,
  "\\sal": `\\textcolor{#${COL.salida}}{#1}`,
  "\\reg": `\\textcolor{#${COL.cambio}}{#1}`,
  "\\der": `\\textcolor{#${COL.derivada}}{#1}`,
  "\\err": `\\textcolor{#${COL.error}}{#1}`,
};

/** Fórmula con KaTeX. `size` en px. */
export const Formula: React.FC<{ tex: string; size?: number; color?: string; style?: React.CSSProperties }> = ({
  tex,
  size = 72,
  color = C.ink,
  style,
}) => (
  <span
    style={{ fontSize: size, color, lineHeight: 1.2, whiteSpace: "nowrap", ...style }}
    dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: true, macros: { ...MACROS } }) }}
  />
);

export const TEMAS_CALCULO = [
  "Función",
  "Límites",
  "Continuidad",
  "Derivada",
  "Reglas",
  "Exp y log",
  "Producto",
  "Cadena",
  "Máx y mín",
  "2.ª derivada",
  "Gradiente",
  "Descenso",
];

/** Sello del curso con el mapa de los 12 temas; se ilumina el `n`. */
export const SerieCalculo: React.FC<{ n: number }> = ({ n }) => (
  <Stage gap={46}>
    <Words text="CÁLCULO *DIFERENCIAL*" size={110} accent={C.blue} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 200px)", gap: 16 }}>
      {TEMAS_CALCULO.map((t, i) => (
        <Aparece key={t} at={10 + i * 3}>
          <div
            style={{
              height: 96,
              borderRadius: 16,
              background: i === n - 1 ? C.blue : `${C.bg2}dd`,
              border: `3px solid ${i === n - 1 ? C.blue : C.dim + "44"}`,
              color: C.ink,
              fontFamily: FONT,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              scale: i === n - 1 ? "1.1" : "1",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 22, opacity: 0.8 }}>#{i + 1}</span>
            <span style={{ fontWeight: 800, fontSize: 26 }}>{t}</span>
          </div>
        </Aparece>
      ))}
    </div>
    <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>curso desde cero · solo necesitas álgebra básica</div>
  </Stage>
);

/** Tarjeta "Al final de este video vas a poder…" con casillas que se marcan. */
export const Objetivo: React.FC<{ metas: { at: number; t: string }[]; at: number }> = ({ metas, at }) => {
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Aparece at={at}>
        <Chip bg={C.blue} color={C.ink} size={30}>
          OBJETIVO
        </Chip>
      </Aparece>
      <Words text="Al final de este video *vas a poder*:" size={68} accent={C.blue} delay={at} />
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {metas.map((m, i) => {
          const on = frame >= m.at + 20;
          return (
            <Aparece key={i} at={m.at}>
              <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.ink }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    border: `4px solid ${on ? C.green : C.dim}`,
                    background: on ? C.green : "transparent",
                    color: C.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                  }}
                >
                  {on ? "✓" : ""}
                </div>
                {i + 1}. {m.t}
              </div>
            </Aparece>
          );
        })}
      </div>
    </Stage>
  );
};

/** Máquina de funciones: entra un valor (azul), sale uno o varios (verde). */
export const Maquina: React.FC<{
  entrada: React.ReactNode;
  salidas: React.ReactNode[];
  regla?: React.ReactNode;
  at: number;
  /** Frames que tarda el valor en atravesar la máquina. */
  dur?: number;
  ancho?: number;
  mala?: boolean;
}> = ({ entrada, salidas, regla, at, dur = 40, ancho = 460, mala = false }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caja = mala ? C.coral : C.blue;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div
        style={{
          minWidth: 150,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 88,
          color: COL.entrada,
          opacity: interpolate(p, [0, 0.1, 0.4, 0.5], [0, 1, 1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: `${interpolate(p, [0, 0.45], [-40, 0], { extrapolateRight: "clamp" })}px 0`,
        }}
      >
        {entrada}
      </div>
      <div style={{ fontSize: 60, color: C.dim }}>→</div>
      <div
        style={{
          width: ancho,
          height: 220,
          borderRadius: 32,
          background: `${C.bg2}ee`,
          border: `6px solid ${caja}`,
          boxShadow: `0 0 ${30 + 30 * Math.sin(p * Math.PI)}px ${caja}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -26, left: 30, display: "flex", gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: frame >= at + i * 6 && p < 1 ? C.yellow : C.dim, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: COL.cambio }}>{regla ?? "f"}</div>
      </div>
      <div style={{ fontSize: 60, color: C.dim }}>→</div>
      <div style={{ minWidth: 150, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        {salidas.map((s, i) => (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: salidas.length > 1 ? 72 : 88,
              color: mala ? C.coral : COL.salida,
              opacity: interpolate(p, [0.6, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: `${interpolate(p, [0.6, 1], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px 0`,
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Plano cartesiano en coordenadas matemáticas. Los hijos reciben `X` y `Y` para convertir. */
export type Ejes = { X: (x: number) => number; Y: (y: number) => number };
export const Plano: React.FC<{
  w: number;
  h: number;
  x: [number, number];
  y: [number, number];
  paso?: number;
  etiquetaX?: string;
  etiquetaY?: string;
  children?: (e: Ejes) => React.ReactNode;
}> = ({ w, h, x, y, paso = 1, etiquetaX = "x", etiquetaY = "f(x)", children }) => {
  const X = (v: number) => ((v - x[0]) / (x[1] - x[0])) * w;
  const Y = (v: number) => h - ((v - y[0]) / (y[1] - y[0])) * h;
  const marcas = (a: number, b: number) => {
    const r: number[] = [];
    for (let v = Math.ceil(a / paso) * paso; v <= b + 1e-9; v += paso) r.push(Math.round(v * 1000) / 1000);
    return r;
  };
  return (
    <svg width={w + 120} height={h + 90} viewBox={`-70 -40 ${w + 120} ${h + 90}`} style={{ overflow: "visible" }}>
      {marcas(x[0], x[1]).map((v) => (
        <line key={`gx${v}`} x1={X(v)} y1={0} x2={X(v)} y2={h} stroke={`${C.dim}1f`} strokeWidth={2} />
      ))}
      {marcas(y[0], y[1]).map((v) => (
        <line key={`gy${v}`} x1={0} y1={Y(v)} x2={w} y2={Y(v)} stroke={`${C.dim}1f`} strokeWidth={2} />
      ))}
      <line x1={0} y1={Y(Math.max(y[0], Math.min(0, y[1])))} x2={w} y2={Y(Math.max(y[0], Math.min(0, y[1])))} stroke={COL.entrada} strokeWidth={4} />
      <line x1={X(Math.max(x[0], Math.min(0, x[1])))} y1={0} x2={X(Math.max(x[0], Math.min(0, x[1])))} y2={h} stroke={COL.salida} strokeWidth={4} />
      {marcas(x[0], x[1])
        .filter((v) => v !== 0)
        .map((v) => (
          <text key={`tx${v}`} x={X(v)} y={Y(Math.max(y[0], Math.min(0, y[1]))) + 34} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.dim}>
            {v}
          </text>
        ))}
      {marcas(y[0], y[1])
        .filter((v) => v !== 0)
        .map((v) => (
          <text key={`ty${v}`} x={X(Math.max(x[0], Math.min(0, x[1]))) - 14} y={Y(v) + 8} textAnchor="end" fontFamily={MONO} fontSize={24} fill={C.dim}>
            {v}
          </text>
        ))}
      <text x={w + 16} y={Y(Math.max(y[0], Math.min(0, y[1]))) + 8} fontFamily={FONT} fontWeight={800} fontSize={34} fill={COL.entrada}>
        {etiquetaX}
      </text>
      <text x={X(Math.max(x[0], Math.min(0, x[1]))) + 12} y={-12} fontFamily={FONT} fontWeight={800} fontSize={34} fill={COL.salida}>
        {etiquetaY}
      </text>
      {children?.({ X, Y })}
    </svg>
  );
};

/** Curva de una función en el plano; `p` (0–1) la dibuja de izquierda a derecha. */
export const Curva: React.FC<{
  e: Ejes;
  f: (x: number) => number;
  x: [number, number];
  p?: number;
  color?: string;
  ancho?: number;
  n?: number;
}> = ({ e, f, x, p = 1, color = COL.cambio, ancho = 6, n = 200 }) => {
  const hasta = x[0] + (x[1] - x[0]) * p;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const v = x[0] + ((hasta - x[0]) * i) / n;
    const fv = f(v);
    if (Number.isFinite(fv)) pts.push(`${e.X(v)},${e.Y(fv)}`);
  }
  return p > 0 ? <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={ancho} strokeLinejoin="round" strokeLinecap="round" /> : null;
};

/** Chip fijo de la parte "Plus: Ciencia de Datos". */
export const PlusDatos: React.FC = () => (
  <div style={{ position: "absolute", top: 150, right: 140 }}>
    <Chip bg={C.purple} color={C.bg} size={28}>
      PLUS · CIENCIA DE DATOS
    </Chip>
  </div>
);

/** Tarjeta de error común. */
export const Cuidado: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Aparece at={at}>
    <div
      style={{
        background: `${C.coral}22`,
        border: `4px solid ${C.coral}`,
        borderRadius: 24,
        padding: "22px 34px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {children}
    </div>
  </Aparece>
);

/** Reto para comentarios + resumen en tarjetas. */
export const RetoResumen: React.FC<{ reto: React.ReactNode; ideas: string[]; atReto: number; atResumen: number; durResumen: number }> = ({
  reto,
  ideas,
  atReto,
  atResumen,
  durResumen,
}) => {
  const frame = useCurrentFrame();
  if (frame < atResumen) {
    return (
      <Stage gap={34}>
        <Aparece at={atReto}>
          <Chip bg={C.yellow} size={34}>
            RETO
          </Chip>
        </Aparece>
        <Aparece at={atReto + 10}>{reto}</Aparece>
        <Sequence from={atReto + 60} layout="none">
          <Sticker bg={C.blue} color={C.ink} size={32}>
            Déjalo en los comentarios · respuesta en el próximo video
          </Sticker>
        </Sequence>
      </Stage>
    );
  }
  const paso = durResumen / ideas.length;
  return (
    <Stage gap={26}>
      <Words text="En *resumen*" size={76} accent={C.green} />
      <div style={{ display: "flex", gap: 26 }}>
        {ideas.map((t, i) => (
          <Aparece key={i} at={atResumen + i * paso}>
            <div
              style={{
                width: 470,
                minHeight: 260,
                background: `${C.bg2}dd`,
                border: `3px solid ${C.green}66`,
                borderRadius: 24,
                padding: "26px 28px",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 36,
                color: C.ink,
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 30, color: C.green, marginBottom: 10 }}>{i + 1}</div>
              {t}
            </div>
          </Aparece>
        ))}
      </div>
    </Stage>
  );
};

/** Cierre del episodio: próximo tema mientras habla de él; luego el cierre del canal. */
export const CierreCurso: React.FC<EscenaProps & { n: number; titulo: string; sub: string }> = ({ n, titulo, sub, ...props }) => {
  const [, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={C.blue} color={C.ink}>
              PRÓXIMO EPISODIO · #{n}
            </Chip>
          </Aparece>
          <Words text={titulo} size={110} align="left" accent={C.blue} delay={6} />
          <Words text={sub} size={52} weight={700} color={C.dim} align="left" delay={20} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};

/** Nota abajo a la izquierda ("Ejemplo simplificado"). */
export const Nota: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 64, bottom: 172, fontFamily: MONO, fontSize: 22, color: C.dim }}>{children}</div>
);

export { useP };
