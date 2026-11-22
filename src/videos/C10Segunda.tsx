import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { CierreCurso, COL, Cuidado, Curva, Formula, Nota, Objetivo, Paso, Plano, Recuerda, RetoResumen, SerieCalculo, type Ejes } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c10-segunda.json";

// Cálculo Diferencial #10 · Segunda derivada y concavidad. Énfasis matemático; la Ciencia de Datos es un plus.

/** Recta que pasa por (x0, y0) con pendiente m, entre xa y xb. */
const Recta: React.FC<{ e: Ejes; x0: number; y0: number; m: number; xa: number; xb: number; color: string; ancho?: number }> = ({
  e,
  x0,
  y0,
  m,
  xa,
  xb,
  color,
  ancho = 5,
}) => <line x1={e.X(xa)} y1={e.Y(y0 + m * (xa - x0))} x2={e.X(xb)} y2={e.Y(y0 + m * (xb - x0))} stroke={color} strokeWidth={ancho} strokeLinecap="round" />;

// Curva en S ilustrativa (logística): casos acumulados, sin datos reales.
const S = (t: number) => 100 / (1 + Math.exp(-(t - 30) / 6));
const dS = (t: number) => (S(t) * (1 - S(t) / 100)) / 6;

/** Carita (sonrisa o tristeza). */
const Carita: React.FC<{ feliz: boolean; size?: number }> = ({ feliz, size = 90 }) => {
  const c = feliz ? C.green : C.coral;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill="none" stroke={c} strokeWidth={7} />
      <circle cx={35} cy={40} r={6} fill={c} />
      <circle cx={65} cy={40} r={6} fill={c} />
      <path d={feliz ? "M 28 60 Q 50 82 72 60" : "M 28 74 Q 50 52 72 74"} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const pC = useP(g1.at, g2.at + g2.frames * 0.7, false);
  const tMax = 8 + 50 * pC;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Aparece at={g1.at}>
            <div
              style={{
                background: "#f5f0e1",
                color: "#1b1b1b",
                borderRadius: 14,
                padding: "14px 26px",
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 40,
                rotate: "-2deg",
                boxShadow: "0 18px 40px #0008",
              }}
            >
              «SE ESTÁ APLANANDO LA CURVA»
            </div>
          </Aparece>
          <Aparece at={g2.at}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.ink }}>
              casos: <span style={{ color: C.coral }}>{Math.round(S(tMax) * 1000).toLocaleString("en-US")}</span> ↗
            </div>
          </Aparece>
          <Sequence from={g3.at} layout="none">
            <Words text="Si sigue subiendo, ¿qué *bajó*?" size={56} align="left" accent={C.yellow} />
          </Sequence>
          <Sequence from={g4.at} layout="none">
            <Sticker bg={C.yellow} size={36}>
              La segunda derivada
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <>
          <Plano w={680} h={500} x={[0, 60]} y={[0, 110]} paso={10} pasoY={25} etiquetaX="días" etiquetaY="casos">
            {(e) => <Curva e={e} f={S} x={[0, tMax]} color={C.coral} ancho={7} />}
          </Plano>
          <Nota>Ejemplo simplificado (curva ilustrativa)</Nota>
        </>
      }
    />
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>Máximos y mínimos: donde f'(x) = 0</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"f'(\\ent{x}) = 2\\ent{x} - 4 = 0 \\;\\Rightarrow\\; \\ent{x} = 2"} size={62} />
          <Formula tex={"f(\\ent{2}) = 4 - 8 = \\der{-4} \\;\\; \\text{(mínimo)}"} size={62} />
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
        { at: o1.at + 10, t: "Calcular la segunda derivada" },
        { at: o1.at + t, t: "Leer la concavidad de una curva" },
        { at: o1.at + 2 * t, t: "Clasificar máx y mín sin tabla de signos" },
      ]}
    />
  );
};

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3, q4] = lineas;
  const tarjeta = (at: number, titulo: string, tex: string, color: string) => (
    <Aparece at={at}>
      <Card accent={color} style={{ width: 440, textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color }}>{titulo}</div>
        <Formula tex={tex} size={58} />
      </Card>
    </Aparece>
  );
  const flecha = (at: number) => (
    <Aparece at={at}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 24, color: C.yellow }}>derivar</span>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: C.yellow }}>→</span>
      </div>
    </Aparece>
  );
  return (
    <Stage gap={34}>
      <Words text="La derivada de la *derivada*" size={70} accent={C.yellow} delay={q1.at} />
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        {tarjeta(q2.at, "POSICIÓN", "s(t) = 4.9\\,t^2", C.blue)}
        {flecha(q2.at + q2.frames * 0.5)}
        {tarjeta(q2.at + q2.frames * 0.5, "VELOCIDAD", "s'(t) = 9.8\\,t", C.green)}
        {flecha(q3.at)}
        {tarjeta(q3.at, "ACELERACIÓN", "s''(t) = \\der{9.8}", C.coral)}
      </div>
      <Aparece at={q4.at}>
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          <Formula tex={"f''(\\ent{x}) = \\dfrac{d^2y}{d\\ent{x}^2}"} size={66} />
          <Sticker bg={C.yellow} size={32}>
            mide cómo cambia la pendiente
          </Sticker>
        </div>
      </Aparece>
    </Stage>
  );
};

const PANEL_W = 520;

const Concavidad: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3] = lineas;
  const frame = useCurrentFrame();
  const pA = useP(c1.at + 10, c1.at + c1.frames, false);
  const pB = useP(c3.at + 10, c3.at + c3.frames, false);
  const panel = (feliz: boolean, p: number, on: boolean, at: number) => {
    const f = (x: number) => (feliz ? x * x : -x * x);
    const df = (x: number) => (feliz ? 2 * x : -2 * x);
    const x = -1.6 + 3.2 * p;
    return (
      <Aparece at={at}>
        <Card accent={feliz ? C.green : C.coral} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: on ? 1 : 0.4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Carita feliz={feliz} size={70} />
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: feliz ? C.green : C.coral }}>
              {feliz ? "CÓNCAVA HACIA ARRIBA" : "CÓNCAVA HACIA ABAJO"}
            </span>
          </div>
          <Plano w={PANEL_W} h={300} x={[-2, 2]} y={feliz ? [-0.5, 3] : [-3, 0.5]} paso={1} etiquetaY="">
            {(e) => (
              <>
                <Curva e={e} f={f} x={[-1.75, 1.75]} />
                <Recta e={e} x0={x} y0={f(x)} m={df(x)} xa={x - 0.45} xb={x + 0.45} color={C.ink} ancho={6} />
                <circle cx={e.X(x)} cy={e.Y(f(x))} r={11} fill={C.ink} stroke={C.bg} strokeWidth={4} />
              </>
            )}
          </Plano>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.ink }}>
            pendiente: <span style={{ color: feliz ? C.green : C.coral }}>{df(x).toFixed(1)}</span> {feliz ? "↗ crece" : "↘ baja"}
          </div>
          <Formula tex={feliz ? "f'' > 0" : "f'' < 0"} size={56} color={feliz ? C.green : C.coral} />
        </Card>
      </Aparece>
    );
  };
  return (
    <Stage direction="row" gap={50}>
      {panel(true, pA, frame < c3.at, c1.at)}
      {panel(false, pB, frame >= c3.at, c3.at)}
      {frame >= c2.at && frame < c3.at && null}
    </Stage>
  );
};

const g = (x: number) => x ** 3 - 3 * x;

const Criterio: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2, k3, k4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Aparece at={k1.at}>
            <Formula tex={"f(\\ent{x}) = \\ent{x}^3 - 3\\ent{x}"} size={66} />
          </Aparece>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Paso at={k2.at} n={1} tex={"f'(\\ent{x}) = 3\\ent{x}^2 - 3"} on={frame < k2.at + k2.frames * 0.5} ancho={560} size={52} />
            <Paso at={k2.at + k2.frames * 0.5} n={2} tex={"f''(\\ent{x}) = \\der{6\\ent{x}}"} on={frame >= k2.at + k2.frames * 0.5 && frame < k3.at} ancho={560} size={52} />
            <Paso at={k3.at} n={3} tex={"f''(\\ent{1}) = 6 > 0 \\;\\to\\; \\text{mínimo}"} on={frame >= k3.at} ancho={560} size={46} />
            <Paso at={k3.at + k3.frames * 0.55} n={4} tex={"f''(\\ent{-1}) = -6 < 0 \\;\\to\\; \\text{máximo}"} on={frame >= k3.at + k3.frames * 0.55} ancho={560} size={46} />
          </div>
          <Sequence from={k4.at} layout="none">
            <Sticker bg={C.green} size={30}>
              Sin tabla de signos: en un paso
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <div style={{ position: "relative" }}>
          <Plano w={600} h={520} x={[-2.3, 2.3]} y={[-3.5, 3.5]} paso={1} etiquetaY="y">
            {(e) => (
              <>
                <Curva e={e} f={g} x={[-2.2, 2.2]} />
                {frame >= k3.at && <circle cx={e.X(1)} cy={e.Y(-2)} r={14} fill={C.green} stroke={C.bg} strokeWidth={4} />}
                {frame >= k3.at + k3.frames * 0.55 && <circle cx={e.X(-1)} cy={e.Y(2)} r={14} fill={C.coral} stroke={C.bg} strokeWidth={4} />}
              </>
            )}
          </Plano>
          {frame >= k3.at && (
            <div style={{ position: "absolute", left: 400, top: 420 }}>
              <Carita feliz size={70} />
            </div>
          )}
          {frame >= k3.at + k3.frames * 0.55 && (
            <div style={{ position: "absolute", left: 110, top: 20 }}>
              <Carita feliz={false} size={70} />
            </div>
          )}
        </div>
      }
    />
  );
};

const Inflexion: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2] = lineas;
  const frame = useCurrentFrame();
  if (frame >= f2.at) {
    const ti = 30;
    return (
      <Split
        ratio={0.42}
        left={
          <>
            <Words text="La respuesta del *inicio*" size={60} align="left" accent={C.yellow} />
            <Aparece at={f2.at + 20}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
                Antes de la inflexión: crecía cada vez <b style={{ color: C.coral }}>más rápido</b> (f'' &gt; 0)
              </div>
            </Aparece>
            <Aparece at={f2.at + f2.frames * 0.4}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
                Después: seguía creciendo, pero <b style={{ color: C.green }}>más despacio</b> (f'' &lt; 0)
              </div>
            </Aparece>
          </>
        }
        right={
          <>
            <Plano w={660} h={480} x={[0, 60]} y={[0, 110]} paso={10} pasoY={25} etiquetaX="días" etiquetaY="casos">
              {(e) => (
                <>
                  <rect x={e.X(0)} y={e.Y(110)} width={e.X(ti) - e.X(0)} height={e.Y(0) - e.Y(110)} fill={`${C.coral}14`} />
                  <rect x={e.X(ti)} y={e.Y(110)} width={e.X(60) - e.X(ti)} height={e.Y(0) - e.Y(110)} fill={`${C.green}14`} />
                  <Curva e={e} f={S} x={[0, 60]} color={C.coral} ancho={7} />
                  <Recta e={e} x0={ti} y0={S(ti)} m={dS(ti)} xa={ti - 9} xb={ti + 9} color={C.yellow} ancho={5} />
                  <circle cx={e.X(ti)} cy={e.Y(S(ti))} r={15} fill={C.yellow} stroke={C.bg} strokeWidth={4} />
                  <text x={e.X(ti) + 22} y={e.Y(S(ti)) + 44} fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.yellow}>
                    inflexión: «se aplana»
                  </text>
                </>
              )}
            </Plano>
            <Nota>Ejemplo simplificado (curva ilustrativa)</Nota>
          </>
        }
      />
    );
  }
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Punto de *inflexión*" size={66} align="left" accent={C.yellow} delay={f1.at} />
          <Aparece at={f1.at + 30}>
            <Formula tex={"f''(\\ent{x}) = 6\\ent{x} = 0 \\;\\Rightarrow\\; \\ent{x} = 0"} size={54} />
          </Aparece>
          <Aparece at={f1.at + f1.frames * 0.5}>
            <Card accent={C.yellow} style={{ padding: "12px 26px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
                f'' = 0 <b>y cambia de signo</b>: de tristeza a sonrisa
              </div>
            </Card>
          </Aparece>
        </>
      }
      right={
        <Plano w={620} h={520} x={[-2.3, 2.3]} y={[-3.5, 3.5]} paso={1} etiquetaY="y">
          {(e) => (
            <>
              <rect x={e.X(-2.3)} y={e.Y(3.5)} width={e.X(0) - e.X(-2.3)} height={e.Y(-3.5) - e.Y(3.5)} fill={`${C.coral}14`} />
              <rect x={e.X(0)} y={e.Y(3.5)} width={e.X(2.3) - e.X(0)} height={e.Y(-3.5) - e.Y(3.5)} fill={`${C.green}14`} />
              <text x={e.X(-1.5)} y={e.Y(-3)} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.coral}>
                f'' &lt; 0
              </text>
              <text x={e.X(1.5)} y={e.Y(3)} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.green}>
                f'' &gt; 0
              </text>
              <Curva e={e} f={g} x={[-2.2, 2.2]} />
              <circle cx={e.X(0)} cy={e.Y(0)} r={15} fill={C.yellow} stroke={C.bg} strokeWidth={4} />
            </>
          )}
        </Plano>
      }
    />
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  const frame = useCurrentFrame();
  const nota = (h: number) => 100 * (1 - Math.exp(-h / 2));
  const pN = useP(u2.at, u2.at + 60);
  return (
    <Split
      ratio={0.46}
      left={
        <>
          <Words text="¿Para qué se *usa*?" size={68} align="left" accent={C.blue} delay={u1.at} />
          <Aparece at={u1.at + 30}>
            <Chip bg={C.coral} color={C.ink} size={30}>
              física: la aceleración
            </Chip>
          </Aparece>
          <Aparece at={u1.at + u1.frames * 0.55}>
            <Chip bg={C.yellow} size={30}>
              economía: rendimientos decrecientes
            </Chip>
          </Aparece>
          <Aparece at={u2.at + u2.frames * 0.5}>
            <Formula tex={"f' > 0, \\quad f'' < 0"} size={60} color={C.yellow} />
          </Aparece>
        </>
      }
      right={
        <>
          <Plano w={600} h={440} x={[0, 6]} y={[0, 110]} paso={1} pasoY={25} etiquetaX="horas" etiquetaY="nota">
            {(e) => (
              <>
                <Curva e={e} f={nota} x={[0, 6]} p={pN} color={C.green} />
                {frame >= u2.at + 40 &&
                  [1, 2, 3, 4, 5].map((h) => (
                    <g key={h}>
                      <line x1={e.X(h)} y1={e.Y(nota(h - 1))} x2={e.X(h)} y2={e.Y(nota(h))} stroke={C.yellow} strokeWidth={6} />
                      <text x={e.X(h) + 8} y={e.Y((nota(h) + nota(h - 1)) / 2) + 8} fontFamily={MONO} fontSize={22} fill={C.yellow}>
                        +{Math.round(nota(h) - nota(h - 1))}
                      </text>
                    </g>
                  ))}
              </>
            )}
          </Plano>
          <Nota>Ejemplo simplificado</Nota>
        </>
      }
    />
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const conv = (x: number) => 0.5 * x * x;
  const noConv = (x: number) => 0.18 * x ** 4 - 1.3 * x * x + 0.3 * x + 3;
  return (
    <Stage gap={26}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: errores convexos" size={60} accent={C.purple} delay={p1.at} />
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={p1.at + 30}>
          <Card accent={C.green} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.green }}>CONVEXA · un solo valle</div>
            <Plano w={480} h={240} x={[-3, 3]} y={[0, 5]} paso={1} pasoY={2} etiquetaX="w" etiquetaY="error">
              {(e) => (
                <>
                  <Curva e={e} f={conv} x={[-3, 3]} color={C.green} />
                  <circle cx={e.X(0)} cy={e.Y(0)} r={11} fill={C.yellow} stroke={C.bg} strokeWidth={4} />
                </>
              )}
            </Plano>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.ink }}>regresión lineal y logística</div>
          </Card>
        </Aparece>
        <Aparece at={p2.at + p2.frames * 0.4}>
          <Card accent={C.coral} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.coral }}>NO CONVEXA · varios valles</div>
            <Plano w={480} h={240} x={[-3, 3]} y={[0, 5]} paso={1} pasoY={2} etiquetaX="w" etiquetaY="error">
              {(e) => (
                <>
                  <Curva e={e} f={noConv} x={[-3, 3]} color={C.coral} />
                </>
              )}
            </Plano>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.ink }}>redes neuronales: mínimos locales</div>
          </Card>
        </Aparece>
      </div>
      <Aparece at={p1.at + p1.frames * 0.6}>
        <Formula tex={"E(c) = \\sum (x_i - c)^2 \\;\\Rightarrow\\; E''(c) = 2n > 0"} size={44} />
      </Aparece>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1200, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · sympy</span>
        </div>
        <Codigo at={y1.at} texto="d2 = sp.diff(x**3 - 3*x, x, 2)" dur={24} />
        <Aparece at={y2.at}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>6*x</div>
        </Aparece>
        <Codigo at={y3.at} texto="[d2.subs(x, v) for v in (-1, 1)]" dur={24} />
        <Aparece at={y3.at + 32}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>[-6, 6]</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
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
            <Formula tex={"f(x) = x^4: \\quad f''(0) = 0"} size={54} />
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.ink }}>…pero NO es inflexión</div>
          </Cuidado>
          <Aparece at={x2.at}>
            <Formula tex={"f''(-1) = 12 > 0 \\qquad f''(1) = 12 > 0"} size={44} color={C.green} />
          </Aparece>
          <Sequence from={x2.at + x2.frames * 0.55} layout="none">
            <Chip bg={C.yellow} size={28}>
              Tiene que cambiar de signo
            </Chip>
          </Sequence>
        </>
      }
      right={
        <div style={{ position: "relative" }}>
          <Plano w={560} h={460} x={[-1.6, 1.6]} y={[-0.5, 4]} paso={1} etiquetaY="y">
            {(e) => (
              <>
                <Curva e={e} f={(x) => x ** 4} x={[-1.4, 1.4]} />
                <circle cx={e.X(0)} cy={e.Y(0)} r={13} fill={C.green} stroke={C.bg} strokeWidth={4} />
                <text x={e.X(0) + 22} y={e.Y(0) + 40} textAnchor="start" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.green}>
                  mínimo
                </text>
              </>
            )}
          </Plano>
          <div style={{ position: "absolute", right: 30, top: 10 }}>
            <Carita feliz size={80} />
          </div>
        </div>
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
          <Formula tex={"f(\\ent{x}) = \\ent{x}^3 - 6\\ent{x}^2"} size={90} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.yellow }}>¿Dónde está su punto de inflexión?</div>
        </Card>
      }
      ideas={["f'' mide cómo cambia la pendiente", "f'' > 0 sonrisa (mín) · f'' < 0 tristeza (máx)", "Inflexión: f'' cambia de signo"]}
    />
  );
};

export const C10 = leerGuion(guion);

export const C10Segunda: React.FC = () => (
  <VideoLargo
    guion={C10}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={10} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      concavidad: Concavidad,
      criterio: Criterio,
      inflexion: Inflexion,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={11} titulo="Parciales y *gradiente*" sub="Derivar con varias variables" />,
    }}
  />
);
