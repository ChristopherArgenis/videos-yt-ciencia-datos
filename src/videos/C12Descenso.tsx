import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { Cierre, leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import {
  COL,
  Cuidado,
  Curva,
  Flecha,
  Formula,
  Mapa,
  Nota,
  Objetivo,
  Paso,
  Plano,
  Recuerda,
  RetoResumen,
  SerieCalculo,
  TEMAS_CALCULO,
  type Ejes,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c12-descenso.json";

// Cálculo Diferencial #12 · Descenso de gradiente (final del curso). Énfasis matemático; la Ciencia de Datos es un plus.

const L = (w: number) => (w - 3) ** 2;
const dL = (w: number) => 2 * (w - 3);

/** Posiciones del descenso de gradiente: w₀, w₁, …, wₙ. */
const pasos = (df: (w: number) => number, w0: number, eta: number, n: number) => {
  const ws = [w0];
  for (let i = 0; i < n; i++) ws.push(ws[i] - eta * df(ws[i]));
  return ws;
};

/** Rastro del descenso sobre la curva: muestra los primeros k pasos (k puede ser fraccionario). */
const Rastro: React.FC<{ e: Ejes; f: (w: number) => number; ws: number[]; k: number; color?: string; r?: number }> = ({ e, f, ws, k, color = C.green, r = 15 }) => {
  const n = Math.min(ws.length - 1, Math.floor(k));
  const fr = Math.min(1, k - n);
  const a = ws[n];
  const b = ws[Math.min(ws.length - 1, n + 1)];
  const w = n >= ws.length - 1 ? a : a + (b - a) * fr;
  const yy = n >= ws.length - 1 ? f(a) : f(a) + (f(b) - f(a)) * fr;
  return (
    <>
      {ws.slice(0, n + 1).map((v, i) =>
        i < n ? (
          <line key={`l${i}`} x1={e.X(v)} y1={e.Y(f(v))} x2={e.X(ws[i + 1])} y2={e.Y(f(ws[i + 1]))} stroke={color} strokeWidth={4} strokeDasharray="8 7" />
        ) : null,
      )}
      {ws.slice(0, n + 1).map((v, i) => (
        <circle key={`c${i}`} cx={e.X(v)} cy={e.Y(f(v))} r={6} fill={color} />
      ))}
      <circle cx={e.X(w)} cy={e.Y(yy)} r={r} fill={C.ink} stroke={C.bg} strokeWidth={5} />
    </>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3] = lineas;
  const frame = useCurrentFrame();
  const monte = (x: number) => 0.55 * (x - 3) ** 2 + 0.35 * Math.sin(2.2 * x) + 1;
  const dMonte = (x: number) => 1.1 * (x - 3) + 0.77 * Math.cos(2.2 * x);
  const ws = pasos(dMonte, -0.9, 0.28, 14);
  const k = 14 * useP(g2.at + 20, g3.at + g3.frames * 0.5, false);
  const n = Math.min(ws.length - 1, Math.floor(k));
  const w = ws[n] + (ws[Math.min(ws.length - 1, n + 1)] - ws[n]) * Math.min(1, k - n);
  const niebla = 1 - useP(g3.at + g3.frames * 0.4, g3.at + g3.frames * 0.4 + 40) * 0.75;
  return (
    <Stage gap={20}>
      <Words text="Bajar *sin ver* el fondo" size={64} accent={C.yellow} delay={g1.at} />
      <div style={{ position: "relative" }}>
        <Plano w={1300} h={500} x={[-1.4, 7]} y={[0, 11]} paso={1} pasoY={2} etiquetaX="" etiquetaY="">
          {(e) => (
            <>
              <defs>
                <mask id="hueco">
                  <rect x={-50} y={-50} width={1400} height={700} fill="white" />
                  <circle cx={e.X(w)} cy={e.Y(monte(w))} r={95} fill="black" />
                </mask>
              </defs>
              <polygon
                points={`${e.X(-1.4)},${e.Y(0)} ${Array.from({ length: 120 }, (_, i) => {
                  const x = -1.4 + (8.4 * i) / 119;
                  return `${e.X(x)},${e.Y(Math.min(11, monte(x)))}`;
                }).join(" ")} ${e.X(7)},${e.Y(0)}`}
                fill={`${C.green}22`}
              />
              <Curva e={e} f={monte} x={[-1.4, 7]} color={C.green} ancho={7} />
              <Rastro e={e} f={monte} ws={ws} k={k} color={C.yellow} r={16} />
              {frame >= g2.at && frame < g3.at + g3.frames * 0.4 && (
                <Flecha e={e} x0={w} y0={monte(w) + 0.9} x1={w + 0.7 * Math.sign(-dMonte(w))} y1={monte(w) + 0.9} color={C.yellow} ancho={7} />
              )}
              <rect x={-50} y={-50} width={1400} height={700} fill="#8f9bbd" opacity={0.93 * niebla} mask="url(#hueco)" />
            </>
          )}
        </Plano>
      </div>
      <Nota>Ilustración</Nota>
    </Stage>
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>El gradiente apunta hacia donde la función sube más rápido</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"f = \\ent{x}^2 + \\sal{y}^2 \\;\\Rightarrow\\; \\nabla f = (2\\ent{x},\\, 2\\sal{y})"} size={58} />
          <Formula tex={"\\nabla f(1, 1) = (\\der{2},\\, \\der{2})"} size={58} />
        </div>
      }
    />
  );
};

const ObjetivoEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [o1] = lineas;
  const t = o1.frames / 3;
  return (
    <Objetivo
      at={0}
      metas={[
        { at: o1.at + 10, t: "Escribir la regla del descenso de gradiente" },
        { at: o1.at + t, t: "Hacer los pasos a mano" },
        { at: o1.at + 2 * t, t: "Elegir una buena tasa de aprendizaje" },
      ]}
    />
  );
};

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3] = lineas;
  const frame = useCurrentFrame();
  const lado = frame < q2.at + q2.frames * 0.5 ? 5 : 1;
  const m = dL(lado);
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Words text="La regla: un paso *cuesta abajo*" size={60} align="left" accent={C.yellow} delay={q1.at} />
          <Aparece at={q2.at}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>
              {lado === 5 ? (
                <>
                  pendiente <span style={{ color: C.coral }}>positiva</span> → el valle está a la <b>izquierda</b>
                </>
              ) : (
                <>
                  pendiente <span style={{ color: C.coral }}>negativa</span> → el valle está a la <b>derecha</b>
                </>
              )}
            </div>
          </Aparece>
          <Aparece at={q3.at}>
            <Card accent={C.yellow} style={{ padding: "18px 30px" }}>
              <Formula tex={"\\ent{w}_{\\text{nuevo}} = \\ent{w} - \\reg{\\eta} \\cdot \\der{L'(\\ent{w})}"} size={64} />
            </Card>
          </Aparece>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Aparece at={q3.at + q3.frames * 0.35}>
              <Chip bg={C.yellow} size={28}>
                η (eta): tamaño del paso
              </Chip>
            </Aparece>
            <Aparece at={q3.at + q3.frames * 0.75}>
              <Chip bg={C.coral} color={C.ink} size={28}>
                el signo menos: bajar
              </Chip>
            </Aparece>
          </div>
        </>
      }
      right={
        <Plano w={620} h={480} x={[-0.5, 6.5]} y={[0, 12]} paso={1} pasoY={2} etiquetaX="w" etiquetaY="error L(w)">
          {(e) => (
            <>
              <Curva e={e} f={L} x={[-0.4, 6.4]} color={C.green} ancho={7} />
              {frame >= q2.at && (
                <>
                  <line x1={e.X(lado - 0.8)} y1={e.Y(L(lado) - 0.8 * m)} x2={e.X(lado + 0.8)} y2={e.Y(L(lado) + 0.8 * m)} stroke={C.coral} strokeWidth={6} strokeLinecap="round" />
                  <Flecha e={e} x0={lado} y0={L(lado) + 2} x1={lado - Math.sign(m) * 1.1} y1={L(lado) + 2} color={C.yellow} ancho={8} />
                  <circle cx={e.X(lado)} cy={e.Y(L(lado))} r={15} fill={C.ink} stroke={C.bg} strokeWidth={5} />
                </>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const Calcula: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4, c5] = lineas;
  const frame = useCurrentFrame();
  const ws = pasos(dL, 0, 0.1, 20);
  const k = frame < c3.at ? 0 : frame < c4.at ? useP0(frame, c3.at + c3.frames * 0.5, 30) : frame < c5.at ? 1 + 2 * useP0(frame, c4.at + 20, c4.frames * 0.8) : 3 + 17 * useP0(frame, c5.at + 20, c5.frames * 0.7);
  return (
    <Split
      ratio={0.52}
      left={
        <>
          <Aparece at={c1.at}>
            <Formula tex={"L(\\ent{w}) = (\\ent{w} - 3)^2"} size={60} />
          </Aparece>
          <Aparece at={c2.at}>
            <Formula tex={"L'(\\ent{w}) = \\der{2(\\ent{w} - 3)} \\qquad \\ent{w}_0 = 0,\\;\\; \\reg{\\eta} = 0.1"} size={46} />
          </Aparece>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Paso at={c3.at} n={1} tex={"0 - 0.1 \\cdot (\\der{-6}) = \\sal{0.6}"} on={frame < c4.at} ancho={640} size={46} />
            <Paso at={c4.at} n={2} tex={"0.6 - 0.1 \\cdot (\\der{-4.8}) = \\sal{1.08}"} on={frame >= c4.at && frame < c4.at + c4.frames * 0.7} ancho={640} size={46} />
            <Paso at={c4.at + c4.frames * 0.7} n={3} tex={"1.08 - 0.1 \\cdot (\\der{-3.84}) = \\sal{1.464}"} on={frame >= c4.at + c4.frames * 0.7 && frame < c5.at} ancho={640} size={46} />
            <Paso at={c5.at + c5.frames * 0.55} n={20} tex={"\\ent{w}_{20} \\approx \\sal{2.97}"} on={frame >= c5.at + c5.frames * 0.55} ancho={640} size={46} />
          </div>
        </>
      }
      right={
        <Plano w={600} h={500} x={[-0.5, 4.5]} y={[0, 12]} paso={1} pasoY={2} etiquetaX="w" etiquetaY="L(w)">
          {(e) => (
            <>
              <Curva e={e} f={L} x={[-0.45, 4.4]} color={C.green} ancho={7} />
              <Rastro e={e} f={L} ws={ws} k={k} color={C.yellow} />
              {frame >= c5.at && (
                <text x={e.X(3)} y={e.Y(0) - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.green}>
                  mínimo: 3
                </text>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

/** Progreso lineal sin hook (para usar dentro de expresiones). */
function useP0(frame: number, a: number, dur: number) {
  return Math.max(0, Math.min(1, (frame - a) / Math.max(1, dur)));
}

const Varias: React.FC<EscenaProps> = ({ lineas }) => {
  const [v1, v2] = lineas;
  const frame = useCurrentFrame();
  const F = (x: number, y: number) => x * x + y * y;
  const pts: [number, number][] = [
    [1, 1],
    [0.5, 0.5],
    [0.25, 0.25],
    [0.125, 0.125],
    [0.0625, 0.0625],
  ];
  const k = 4 * useP(v2.at + v2.frames * 0.35, v2.at + v2.frames * 0.95, false);
  const pG = useP(v1.at + v1.frames * 0.5, v1.at + v1.frames * 0.5 + 30);
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Words text="Con *varias* variables" size={64} align="left" accent={C.yellow} delay={v1.at} />
          <Aparece at={v1.at + 30}>
            <Formula tex={"(\\ent{x}, \\sal{y}) \\leftarrow (\\ent{x}, \\sal{y}) - \\reg{\\eta}\\, \\der{\\nabla f}"} size={56} />
          </Aparece>
          <Aparece at={v1.at + v1.frames * 0.5}>
            <Formula tex={"\\nabla f(1, 1) = (2, 2)"} size={50} color={C.dim} />
          </Aparece>
          <Aparece at={v2.at}>
            <Formula tex={"(1, 1) - 0.25\\,(2, 2) = \\sal{(0.5,\\, 0.5)}"} size={48} />
          </Aparece>
          <Aparece at={v2.at + v2.frames * 0.55}>
            <Formula tex={"\\to\\; \\sal{(0.25,\\, 0.25)} \\;\\to\\; \\cdots \\;\\to\\; (0, 0)"} size={48} />
          </Aparece>
        </>
      }
      right={
        <Mapa w={580} h={580} x={[-1.4, 1.4]} y={[-1.4, 1.4]} f={F} nivel={0.25}>
          {(e) => (
            <>
              <Flecha e={e} x0={1} y0={1} x1={1.3} y1={1.3} color={C.dim} ancho={8} p={pG} />
              {frame >= v2.at && <Flecha e={e} x0={1} y0={1} x1={0.62} y1={0.62} color={C.green} ancho={9} p={useP0(frame, v2.at, 30)} />}
              {pts.slice(0, Math.floor(k) + 1).map(([a, b], i) => (
                <circle key={i} cx={e.X(a)} cy={e.Y(b)} r={i === 0 ? 15 : 11} fill={i === 0 ? C.ink : C.yellow} stroke={C.bg} strokeWidth={4} />
              ))}
              <circle cx={e.X(0)} cy={e.Y(0)} r={9} fill={C.green} />
              {frame >= v1.at + v1.frames * 0.5 && (
                <text x={e.X(1) - 24} y={e.Y(1) - 20} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.dim}>
                  ∇f: sube
                </text>
              )}
            </>
          )}
        </Mapa>
      }
    />
  );
};

const Tasa: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2, t3] = lineas;
  const frame = useCurrentFrame();
  const panel = (at: number, dur: number, eta: number, n: number, titulo: string, color: string, rotulo: string) => {
    const ws = pasos(dL, 0, eta, n);
    const k = n * useP0(frame, at + 20, dur);
    return (
      <Aparece at={at}>
        <Card accent={color} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: frame >= at ? 1 : 0 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color }}>{titulo}</div>
          <Formula tex={`\\eta = ${eta}`} size={40} />
          <Plano w={380} h={300} x={[-2.5, 9]} y={[0, 40]} paso={3} pasoY={10} etiquetaX="w" etiquetaY="">
            {(e) => (
              <>
                <Curva e={e} f={L} x={[-2.3, 9]} color={C.green} ancho={5} />
                <Rastro e={e} f={(w) => Math.min(40, L(w))} ws={ws} k={k} color={color} r={12} />
              </>
            )}
          </Plano>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color }}>{rotulo}</div>
        </Card>
      </Aparece>
    );
  };
  return (
    <Stage gap={26}>
      <Words text="La tasa de *aprendizaje*" size={64} accent={C.yellow} delay={t1.at} />
      <div style={{ display: "flex", gap: 22 }}>
        {panel(t1.at, t1.frames * 0.8, 0.01, 10, "MUY CHICA", C.blue, "tarda una eternidad")}
        {panel(t2.at, 40, 0.5, 1, "JUSTA", C.green, "llega en 1 paso")}
        {panel(t3.at, t3.frames * 0.6, 1.1, 3, "MUY GRANDE", C.coral, "6.6 → −1.32 → 8.18: diverge")}
      </div>
    </Stage>
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  return (
    <Stage gap={30}>
      <Words text="¿Para qué se *usa*?" size={68} accent={C.blue} delay={u1.at} />
      <Aparece at={u1.at + 30}>
        <Card accent={C.blue} style={{ padding: "16px 36px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.ink }}>Optimizar casi cualquier cosa que tenga derivada</div>
        </Card>
      </Aparece>
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={u1.at + u1.frames * 0.5}>
          <Card accent={C.dim} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 640 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.dim }}>EPISODIO 9: DESPEJAR</div>
            <Formula tex={"f'(x) = 0 \\;\\Rightarrow\\; x = \\;?"} size={50} />
          </Card>
        </Aparece>
        <Aparece at={u2.at}>
          <Card accent={C.green} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 640 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: C.green }}>DESCENSO: SOLO BAJAR</div>
            <Formula tex={"x \\leftarrow x - \\eta\\, f'(x)"} size={50} />
          </Card>
        </Aparece>
      </div>
      <Aparece at={u2.at + u2.frames * 0.45}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Formula tex={"f'(x) = x + e^{x} = 0"} size={44} />
          <Chip bg={C.yellow} size={28}>
            no se despeja · el descenso da x ≈ −0.567
          </Chip>
        </div>
      </Aparece>
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3] = lineas;
  const frame = useCurrentFrame();
  const datos: [number, number][] = [
    [1, 3],
    [2, 5],
    [3, 5],
  ];
  const ws = pasos((w) => 28 * w - 56, 0, 0.02, 10);
  const k = 10 * useP(p2.at + 10, p2.at + p2.frames * 0.9, false);
  const n = Math.min(ws.length - 1, Math.floor(k));
  const w = ws[n] + (ws[Math.min(ws.length - 1, n + 1)] - ws[n]) * Math.min(1, k - n);
  return (
    <Stage gap={22}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: esto es entrenar un modelo" size={56} accent={C.purple} delay={p1.at} />
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <Aparece at={p1.at + 20}>
          <Plano w={560} h={400} x={[0, 4]} y={[0, 8]} paso={1} pasoY={2} etiquetaY="y">
            {(e) => (
              <>
                <line x1={e.X(0)} y1={e.Y(0)} x2={e.X(4)} y2={e.Y(Math.min(8, 4 * w))} stroke={C.yellow} strokeWidth={7} strokeLinecap="round" />
                {datos.map(([a, b]) => (
                  <circle key={a} cx={e.X(a)} cy={e.Y(b)} r={13} fill={C.blue} stroke={C.bg} strokeWidth={4} />
                ))}
              </>
            )}
          </Plano>
        </Aparece>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 600 }}>
          <Aparece at={p1.at + p1.frames * 0.5}>
            <Formula tex={"y = \\reg{w}\\,x \\qquad L'(\\reg{w}) = \\der{28\\reg{w} - 56}"} size={44} />
          </Aparece>
          <Aparece at={p2.at}>
            <Formula tex={"\\reg{\\eta} = 0.02"} size={44} />
          </Aparece>
          {frame >= p2.at && (
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 52, color: C.yellow }}>
              w = {w.toFixed(2)}
              {k >= 9.9 ? <span style={{ color: C.green }}> ≈ 2 ✓</span> : null}
            </div>
          )}
          <Aparece at={p3.at}>
            <Chip bg={C.purple} color={C.bg} size={26}>
              igual: regresión logística (Fútbol con Datos #2) y redes neuronales
            </Chip>
          </Aparece>
        </div>
      </div>
      <Nota>Ejemplo simplificado</Nota>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1240, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python</span>
        </div>
        <Codigo at={y1.at} texto="w, lr = 0, 0.1" dur={16} />
        <Codigo at={y2.at} texto="for _ in range(100): w -= lr * 2 * (w - 3)" dur={30} />
        <Codigo at={y3.at} texto="print(round(w, 4))" dur={18} />
        <Aparece at={y3.at + 26}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>3.0</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  const bien = (t: number) => 9 * 0.64 ** t;
  const mal = (t: number) => 9 * 1.44 ** t;
  const noConv = (x: number) => 0.18 * x ** 4 - 1.3 * x * x + 0.3 * x + 3;
  const pC = useP(x1.at + 20, x1.at + 80, false);
  return (
    <Split
      ratio={0.46}
      left={
        <>
          <div style={{ alignSelf: "flex-start" }}>
            <Sticker bg={C.coral} color={C.ink} size={48}>
              ¡CUIDADO!
            </Sticker>
          </div>
          <Cuidado at={x1.at + 10}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink }}>Si el error sube en vez de bajar…</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.yellow }}>…baja la tasa η</div>
          </Cuidado>
          <Aparece at={x2.at}>
            <Chip bg={C.purple} color={C.bg} size={28}>
              y si no es convexo: un valle que no es el más profundo
            </Chip>
          </Aparece>
        </>
      }
      right={
        frame < x2.at ? (
          <Plano w={600} h={460} x={[0, 8]} y={[0, 40]} paso={1} pasoY={10} etiquetaX="paso" etiquetaY="error">
            {(e) => (
              <>
                <Curva e={e} f={bien} x={[0, 8]} p={pC} color={C.green} />
                <Curva e={e} f={(t) => Math.min(40, mal(t))} x={[0, 4.1]} p={pC} color={C.coral} />
                {pC > 0.9 && (
                  <>
                    <text x={e.X(5)} y={e.Y(4)} fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.green}>
                      η = 0.1: baja
                    </text>
                    <text x={e.X(4.2)} y={e.Y(36)} fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.coral}>
                      η = 1.1: se dispara
                    </text>
                  </>
                )}
              </>
            )}
          </Plano>
        ) : (
          <Plano w={600} h={420} x={[-3, 3]} y={[0, 5]} paso={1} pasoY={1} etiquetaX="w" etiquetaY="error">
            {(e) => (
              <>
                <Curva e={e} f={noConv} x={[-3, 3]} color={C.coral} />
                <circle cx={e.X(1.98)} cy={e.Y(noConv(1.98))} r={15} fill={C.ink} stroke={C.bg} strokeWidth={5} />
                <text x={e.X(1.98)} y={e.Y(noConv(1.98)) + 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.ink}>
                  atorado aquí
                </text>
                <text x={e.X(-2.1)} y={e.Y(noConv(-2.1)) + 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.green}>
                  el más profundo
                </text>
              </>
            )}
          </Plano>
        )
      }
    />
  );
};

const Reto: React.FC<EscenaProps> = ({ lineas }) => {
  const [w1, w2] = lineas;
  return (
    <RetoResumen
      atReto={w1.at}
      atResumen={w2.at}
      durResumen={w2.frames - 20}
      reto={
        <Card accent={C.yellow} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, padding: "30px 60px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.yellow }}>RETO FINAL</div>
          <Formula tex={"L(\\ent{w}) = (\\ent{w} - 3)^2,\\quad \\ent{w}_0 = 0,\\quad \\reg{\\eta} = 0.25"} size={64} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.yellow }}>¿Cuánto vale w después de 2 pasos?</div>
        </Card>
      }
      ideas={["w nuevo = w − η·L'(w)", "η chica: lento · muy grande: diverge", "Repetido muchas veces: así aprende un modelo"]}
    />
  );
};

const MapaCurso: React.FC<EscenaProps> = ({ lineas }) => {
  const [m1, m2, m3] = lineas;
  const frame = useCurrentFrame();
  const t0 = m1.at + 10;
  const dur = m2.at + m2.frames - t0;
  const encendidos = Math.floor(12 * useP0(frame, t0, dur)) + (frame >= m2.at + m2.frames ? 1 : 0);
  return (
    <Stage gap={40}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 220px)", gap: "26px 34px" }}>
        {TEMAS_CALCULO.map((t, i) => {
          const on = i < encendidos;
          return (
            <div
              key={t}
              style={{
                position: "relative",
                height: 110,
                borderRadius: 18,
                background: on ? (i === 11 ? C.green : C.blue) : `${C.bg2}dd`,
                border: `3px solid ${on ? (i === 11 ? C.green : C.blue) : C.dim + "44"}`,
                color: on ? C.ink : C.dim,
                fontFamily: FONT,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: on ? `0 0 30px ${i === 11 ? C.green : C.blue}66` : "none",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700 }}>#{i + 1}</span>
              <span style={{ fontSize: 32, fontWeight: 900 }}>{t}</span>
              {i % 6 !== 5 && (
                <span style={{ position: "absolute", right: -30, top: 34, fontSize: 32, fontWeight: 900, color: on ? C.yellow : `${C.dim}66` }}>›</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ height: 120 }}>
        <Sequence from={m3.at} layout="none">
          <Words text="Ya sabes cómo *aprende* un modelo" size={76} accent={C.green} />
        </Sequence>
      </div>
    </Stage>
  );
};

const CierreFinal: React.FC<EscenaProps> = (props) => {
  const [, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={C.green} color={C.bg}>
              CURSO COMPLETO · 12 EPISODIOS
            </Chip>
          </Aparece>
          <Words text="Cálculo *Diferencial*" size={110} align="left" accent={C.blue} delay={6} />
          <Words text="La lista completa del curso está en el canal" size={52} weight={700} color={C.dim} align="left" delay={20} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};

export const C12 = leerGuion(guion);

export const C12Descenso: React.FC = () => (
  <VideoLargo
    guion={C12}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={12} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      calcula: Calcula,
      varias: Varias,
      tasa: Tasa,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      mapa: MapaCurso,
      cierre: CierreFinal,
    }}
  />
);
