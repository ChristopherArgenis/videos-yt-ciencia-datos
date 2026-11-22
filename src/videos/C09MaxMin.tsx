import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { CierreCurso, COL, Cuidado, Curva, Formula, Nota, Objetivo, Paso, Plano, Recuerda, RetoResumen, SerieCalculo, type Ejes } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c09-maxmin.json";

// Cálculo Diferencial #9 · Máximos y mínimos. Énfasis matemático; la Ciencia de Datos es un plus.

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

/** Rectángulo del corral (lados a y 40/2 − a), escalado. */
const Corral: React.FC<{ a: number; color?: string; s?: number }> = ({ a, color = C.yellow, s = 26 }) => {
  const b = 20 - a;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: a * s, height: b * s, border: `8px dashed ${color}`, borderRadius: 10, background: `${color}1f`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.ink, whiteSpace: "nowrap" }}>{a * b} m²</span>
      </div>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.dim }}>
        {a} × {b}
      </span>
    </div>
  );
};

const OPCIONES = [5, 8, 10, 12];

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const t = g2.frames / 4;
  return (
    <Stage gap={26}>
      <Aparece at={g1.at}>
        <Card accent={C.yellow} style={{ padding: "12px 34px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink }}>
            <span style={{ color: C.yellow }}>40 m</span> de cerca · corral rectangular · ¿área máxima?
          </div>
        </Card>
      </Aparece>
      <div style={{ display: "flex", gap: 46, alignItems: "flex-end", height: 470 }}>
        {OPCIONES.map((a, i) => (
          <Aparece key={a} at={g2.at + i * t}>
            <Corral a={a} color={a === 10 && frame >= g3.at ? C.green : C.yellow} />
          </Aparece>
        ))}
      </div>
      <div style={{ height: 80 }}>
        {frame >= g3.at && frame < g4.at && (
          <Aparece at={g3.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink }}>
              ¿Seguro que <span style={{ color: C.green }}>100</span> es el máximo?
            </div>
          </Aparece>
        )}
        <Sequence from={g4.at} layout="none">
          <Sticker bg={C.blue} color={C.ink} size={38}>
            Con derivadas se demuestra en una línea
          </Sticker>
        </Sequence>
      </div>
      <Nota>Ejemplo simplificado</Nota>
    </Stage>
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>Regla de la cadena: derivada de afuera × derivada de adentro</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"(2\\ent{x} + 1)^3 \\to 3(2\\ent{x} + 1)^2 \\cdot \\reg{2} = \\der{6(2\\ent{x} + 1)^2}"} size={58} />
          <Formula tex={"f'(\\ent{0}) = 6 \\cdot 1 = \\der{6}"} size={62} />
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
        { at: o1.at + 10, t: "Encontrar los puntos críticos" },
        { at: o1.at + t, t: "Saber si son máximo o mínimo" },
        { at: o1.at + 2 * t, t: "Resolver un problema de optimización" },
      ]}
    />
  );
};

// Curva con una cima y un valle: f(x) = x³ − 3x.
const g = (x: number) => x ** 3 - 3 * x;
const dg = (x: number) => 3 * x * x - 3;

const Idea: React.FC<EscenaProps> = ({ lineas }) => {
  const [i1, i2, i3] = lineas;
  const frame = useCurrentFrame();
  const p = useP(i1.at + 10, i2.at + i2.frames, false);
  const x = -2.1 + 4.2 * p;
  const m = dg(x);
  const col = Math.abs(m) < 0.5 ? C.yellow : m > 0 ? C.green : C.coral;
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="La tangente *horizontal*" size={66} align="left" accent={C.yellow} delay={i1.at} />
          <Aparece at={i1.at + 30}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: FONT, fontWeight: 800, fontSize: 34 }}>
              <span style={{ color: C.green }}>sube → pendiente +</span>
              <span style={{ color: C.coral }}>baja → pendiente −</span>
              <span style={{ color: C.yellow }}>cima o fondo → pendiente 0</span>
            </div>
          </Aparece>
          <Aparece at={i3.at}>
            <Card accent={C.yellow} style={{ padding: "12px 30px" }}>
              <Formula tex={"f'(\\ent{x}) = 0 \\;\\Rightarrow\\; \\text{puntos críticos}"} size={52} />
            </Card>
          </Aparece>
        </>
      }
      right={
        <Plano w={680} h={540} x={[-2.3, 2.3]} y={[-3.5, 3.5]} paso={1} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={g} x={[-2.2, 2.2]} />
              {frame >= i2.at && (
                <>
                  <text x={e.X(-1)} y={e.Y(2) - 30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.yellow}>
                    máximo
                  </text>
                  <text x={e.X(1)} y={e.Y(-2) + 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.yellow}>
                    mínimo
                  </text>
                </>
              )}
              {frame >= i1.at + 10 && (
                <>
                  <Recta e={e} x0={x} y0={g(x)} m={m} xa={x - 0.55} xb={x + 0.55} color={col} ancho={7} />
                  <circle cx={e.X(x)} cy={e.Y(g(x))} r={13} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                </>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

/** Recta numérica de signos de f'. */
const Signos: React.FC<{ marcas: number[]; etiquetas?: string[]; tramos: { x: number; v: string; sube: boolean }[]; at: number; dur: number }> = ({ marcas, etiquetas, tramos, at, dur }) => {
  const frame = useCurrentFrame();
  const W = 900;
  const xs = (v: number) => ((v + 3) / 6) * W;
  return (
    <svg width={W + 40} height={150} viewBox={`-20 -60 ${W + 40} 150`} style={{ overflow: "visible" }}>
      <line x1={0} y1={0} x2={W} y2={0} stroke={C.dim} strokeWidth={4} />
      {marcas.map((m, i) => (
        <g key={m}>
          <line x1={xs(m)} y1={-16} x2={xs(m)} y2={16} stroke={C.yellow} strokeWidth={5} />
          <text x={xs(m)} y={52} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill={C.yellow}>
            {etiquetas ? etiquetas[i] : m}
          </text>
        </g>
      ))}
      {tramos.map((t, i) =>
        frame >= at + (i * dur) / tramos.length ? (
          <g key={i}>
            <text x={xs(t.x)} y={-26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={t.sube ? C.green : C.coral}>
              {t.v} {t.sube ? "↗" : "↘"}
            </text>
          </g>
        ) : null,
      )}
    </svg>
  );
};

const Calcula: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4, c5] = lineas;
  const frame = useCurrentFrame();
  const f = (x: number) => x * x - 6 * x + 5;
  if (frame >= c4.at) {
    return (
      <Split
        ratio={0.5}
        left={
          <>
            <Words text="¿Máximo o *mínimo*?" size={62} align="left" accent={C.yellow} />
            <Signos marcas={[0]} etiquetas={["x = 3"]} tramos={[{ x: -1.5, v: "f'(2) = −2", sube: false }, { x: 1.5, v: "f'(4) = +2", sube: true }]} at={c4.at + 10} dur={c4.frames * 0.7} />
            <Sequence from={c5.at} layout="none">
              <Sticker bg={C.green} size={36}>
                Baja y luego sube: MÍNIMO
              </Sticker>
            </Sequence>
          </>
        }
        right={
          <Plano w={600} h={480} x={[0, 6]} y={[-5, 6]} paso={1} pasoY={2} etiquetaY="y">
            {(e) => (
              <>
                <Curva e={e} f={f} x={[0, 6]} />
                <circle cx={e.X(3)} cy={e.Y(-4)} r={14} fill={C.green} stroke={C.bg} strokeWidth={4} />
                <text x={e.X(3) + 20} y={e.Y(-4) + 8} fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.green}>
                  (3, −4)
                </text>
              </>
            )}
          </Plano>
        }
      />
    );
  }
  return (
    <Stage gap={28}>
      <Aparece at={c1.at}>
        <Formula tex={"f(\\ent{x}) = \\ent{x}^2 - 6\\ent{x} + 5"} size={90} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Paso at={c1.at + c1.frames * 0.5} n={1} tex={"f'(\\ent{x}) = \\der{2\\ent{x} - 6}"} nota="derivar" on={frame < c2.at} ancho={760} size={62} />
        <Paso at={c2.at} n={2} tex={"2\\ent{x} - 6 = 0 \\;\\Rightarrow\\; \\ent{x} = 3"} nota="igualar a 0" on={frame >= c2.at && frame < c3.at} ancho={760} size={62} />
        <Paso at={c3.at} n={3} tex={"f(\\ent{3}) = 9 - 18 + 5 = \\sal{-4}"} nota="evaluar" on={frame >= c3.at} ancho={760} size={62} />
      </div>
    </Stage>
  );
};

const Ejemplo2: React.FC<EscenaProps> = ({ lineas }) => {
  const [m1, m2, m3] = lineas;
  const frame = useCurrentFrame();
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Aparece at={m1.at}>
            <Formula tex={"f(\\ent{x}) = \\ent{x}^3 - 3\\ent{x}"} size={72} />
          </Aparece>
          <Aparece at={m1.at + m1.frames * 0.45}>
            <Formula tex={"f'(\\ent{x}) = 3\\ent{x}^2 - 3 = 0 \\;\\Rightarrow\\; \\ent{x} = \\pm 1"} size={50} />
          </Aparece>
          <Aparece at={m2.at}>
            <Signos
              marcas={[-1, 1]}
              tramos={[
                { x: -2.2, v: "+9", sube: true },
                { x: 0, v: "−3", sube: false },
                { x: 2.2, v: "+9", sube: true },
              ]}
              at={m2.at + 10}
              dur={m2.frames * 0.8}
            />
          </Aparece>
        </>
      }
      right={
        <Plano w={620} h={520} x={[-2.3, 2.3]} y={[-3.5, 3.5]} paso={1} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={g} x={[-2.2, 2.2]} />
              {frame >= m3.at && (
                <>
                  <circle cx={e.X(-1)} cy={e.Y(2)} r={14} fill={C.coral} stroke={C.bg} strokeWidth={4} />
                  <text x={e.X(-1)} y={e.Y(2) - 26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.coral}>
                    máx local (−1, 2)
                  </text>
                </>
              )}
              {frame >= m3.at + m3.frames * 0.4 && (
                <>
                  <circle cx={e.X(1)} cy={e.Y(-2)} r={14} fill={C.green} stroke={C.bg} strokeWidth={4} />
                  <text x={e.X(1)} y={e.Y(-2) + 50} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.green}>
                    mín local (1, −2)
                  </text>
                </>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const CorralEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2, k3, k4] = lineas;
  const frame = useCurrentFrame();
  const A = (x: number) => x * (20 - x);
  const pA = useP(k2.at, k2.at + 50);
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Aparece at={k1.at}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ width: 200, height: 150, border: `8px dashed ${C.yellow}`, borderRadius: 10, position: "relative" }}>
                <span style={{ position: "absolute", bottom: -46, left: 80, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: COL.entrada }}>x</span>
                <span style={{ position: "absolute", right: -110, top: 50, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: COL.salida }}>20 − x</span>
              </div>
            </div>
          </Aparece>
          <Aparece at={k2.at}>
            <Formula tex={"A(\\ent{x}) = \\ent{x}(20 - \\ent{x}) = 20\\ent{x} - \\ent{x}^2"} size={50} />
          </Aparece>
          <Aparece at={k2.at + k2.frames * 0.55}>
            <Formula tex={"A'(\\ent{x}) = 20 - 2\\ent{x}"} size={54} color={COL.derivada} />
          </Aparece>
          <Aparece at={k3.at}>
            <Formula tex={"20 - 2\\ent{x} = 0 \\;\\Rightarrow\\; \\ent{x} = 10"} size={54} />
          </Aparece>
          <Sequence from={k4.at} layout="none">
            <Card accent={C.green} style={{ padding: "10px 30px" }}>
              <Formula tex={"10 \\times 10 = \\der{100 \\ \\text{m}^2} \\;\\; \\text{(un cuadrado)}"} size={50} />
            </Card>
          </Sequence>
        </>
      }
      right={
        <Plano w={620} h={480} x={[0, 20]} y={[0, 110]} paso={5} pasoY={25} etiquetaX="x" etiquetaY="área">
          {(e) => (
            <>
              <Curva e={e} f={A} x={[0, 20]} p={pA} />
              {frame >= k3.at && (
                <>
                  <Recta e={e} x0={10} y0={100} m={0} xa={6.5} xb={13.5} color={C.yellow} ancho={6} />
                  <circle cx={e.X(10)} cy={e.Y(100)} r={14} fill={C.green} stroke={C.bg} strokeWidth={4} />
                  <text x={e.X(10)} y={e.Y(100) - 24} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.green}>
                    (10, 100)
                  </text>
                  <text x={e.X(5)} y={e.Y(55)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.green}>
                    sube
                  </text>
                  <text x={e.X(15)} y={e.Y(55)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.coral}>
                    baja
                  </text>
                </>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  const usos = [
    { t: "GANANCIA MÁXIMA", d: "el mejor precio", c: C.green },
    { t: "COSTO MÍNIMO", d: "la lata con menos material", c: C.yellow },
    { t: "TIEMPO MÍNIMO", d: "la ruta más corta", c: C.blue },
  ];
  return (
    <Stage gap={34}>
      <Words text="¿Para qué se *usa*? Optimizar" size={66} accent={C.blue} delay={u1.at} />
      <div style={{ display: "flex", gap: 28 }}>
        {usos.map((u, i) => (
          <Aparece key={u.t} at={u1.at + 30 + i * 20}>
            <Card accent={u.c} style={{ width: 500, textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: u.c }}>{u.t}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink }}>{u.d}</div>
            </Card>
          </Aparece>
        ))}
      </div>
      <Aparece at={u2.at}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40 }}>
          <Chip bg={C.bg2} color={C.ink} size={34}>
            1 · escribir la función
          </Chip>
          <span style={{ color: C.yellow }}>→</span>
          <Chip bg={C.bg2} color={C.ink} size={34}>
            2 · derivar
          </Chip>
          <span style={{ color: C.yellow }}>→</span>
          <Chip bg={C.yellow} size={34}>
            3 · igualar a 0
          </Chip>
        </div>
      </Aparece>
    </Stage>
  );
};

const DATOS = [1, 2, 6];

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const frame = useCurrentFrame();
  const pc = useP(p1.at + 30, p1.at + p1.frames, false);
  const c = frame >= p2.at ? 3 : pc < 0.6 ? 0.5 + 5 * (pc / 0.6) : 5.5 - 2.5 * ((pc - 0.6) / 0.4);
  const W = 820;
  const xs = (v: number) => 40 + (v / 7) * W;
  const err = DATOS.reduce((a, d) => a + (d - c) ** 2, 0);
  return (
    <Stage gap={26}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: el promedio es un mínimo" size={60} accent={C.purple} delay={p1.at} />
      <svg width={W + 80} height={190} viewBox={`0 -40 ${W + 80} 190`}>
        <line x1={xs(0)} y1={90} x2={xs(7)} y2={90} stroke={C.dim} strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => (
          <text key={v} x={xs(v)} y={130} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.dim}>
            {v}
          </text>
        ))}
        {DATOS.map((d) => (
          <g key={d}>
            <line x1={xs(d)} y1={90} x2={xs(c)} y2={90} stroke={`${C.coral}aa`} strokeWidth={10} />
            <circle cx={xs(d)} cy={90} r={14} fill={C.ink} stroke={C.bg} strokeWidth={4} />
          </g>
        ))}
        <line x1={xs(c)} y1={30} x2={xs(c)} y2={110} stroke={C.purple} strokeWidth={6} />
        <text x={xs(c)} y={16} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.purple}>
          c = {c.toFixed(1)} · error {err.toFixed(1)}
        </text>
      </svg>
      <Aparece at={p1.at + p1.frames * 0.55}>
        <Formula tex={"E(c) = \\sum (x_i - c)^2 \\;\\Rightarrow\\; E'(c) = -2\\sum (x_i - c) = 0 \\;\\Rightarrow\\; c = \\bar{x}"} size={44} />
      </Aparece>
      <Sequence from={p2.at + p2.frames * 0.4} layout="none">
        <Sticker bg={C.purple} size={30}>
          Entrenar un modelo = minimizar el error
        </Sticker>
      </Sequence>
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
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · sympy</span>
        </div>
        <Codigo at={y1.at} texto="sp.solve(sp.diff(x**2 - 6*x + 5, x), x)" dur={28} />
        <Aparece at={y2.at}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>[3]</div>
        </Aparece>
        <Codigo at={y3.at} texto="sp.solve(sp.diff(x**3 - 3*x, x), x)" dur={26} />
        <Aparece at={y3.at + 34}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>[-1, 1]</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  return (
    <Split
      ratio={0.45}
      left={
        <>
          <div style={{ alignSelf: "flex-start" }}>
            <Sticker bg={C.coral} color={C.ink} size={48}>
              ¡CUIDADO!
            </Sticker>
          </div>
          <Cuidado at={x1.at + 10}>
            <Formula tex={"f(x) = x^3: \\quad f'(0) = 0"} size={56} />
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink }}>…pero no es máximo ni mínimo</div>
          </Cuidado>
          <Sequence from={x2.at + x2.frames * 0.5} layout="none">
            <Chip bg={C.yellow} size={30}>
              Siempre revisa los signos a cada lado
            </Chip>
          </Sequence>
        </>
      }
      right={
        <Plano w={560} h={480} x={[-1.8, 1.8]} y={[-4, 4]} paso={1} pasoY={2} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={(x) => x ** 3} x={[-1.58, 1.58]} />
              <Recta e={e} x0={0} y0={0} m={0} xa={-0.9} xb={0.9} color={C.coral} ancho={6} />
              <circle cx={e.X(0)} cy={e.Y(0)} r={13} fill={C.coral} stroke={C.bg} strokeWidth={4} />
              {frame >= x2.at && (
                <>
                  <text x={e.X(-1.2)} y={e.Y(-1)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.green}>
                    sube
                  </text>
                  <text x={e.X(1.1)} y={e.Y(2.6)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.green}>
                    sube
                  </text>
                </>
              )}
            </>
          )}
        </Plano>
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
          <Formula tex={"f(\\ent{x}) = \\ent{x}^2 - 4\\ent{x}"} size={90} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.yellow }}>¿En qué x es mínima? ¿Cuánto vale el mínimo?</div>
        </Card>
      }
      ideas={["Máx y mín: donde f'(x) = 0", "Sube→baja = máximo · baja→sube = mínimo", "Optimizar: función → derivar → igualar a 0"]}
    />
  );
};

export const C09 = leerGuion(guion);

export const C09MaxMin: React.FC = () => (
  <VideoLargo
    guion={C09}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={9} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      idea: Idea,
      calcula: Calcula,
      ejemplo2: Ejemplo2,
      corral: CorralEsc,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={10} titulo="Segunda *derivada*" sub="¿La curva sonríe o está triste?" />,
    }}
  />
);
