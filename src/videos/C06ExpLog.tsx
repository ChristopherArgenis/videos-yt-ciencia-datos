import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import {
  CierreCurso,
  COL,
  Cuidado,
  Curva,
  Formula,
  Nota,
  Objetivo,
  Paso,
  Plano,
  Recuerda,
  RetoResumen,
  SerieCalculo,
  type Ejes,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c06-exp-log.json";

// Cálculo Diferencial #6 · Derivada exponencial y logaritmo. Énfasis matemático; la Ciencia de Datos es un plus.

const E = Math.E;

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

const BANCO = [
  { t: "1 vez al año", n: 1 },
  { t: "cada mes", n: 12 },
  { t: "cada día", n: 365 },
  { t: "cada instante", n: 1e6 },
];

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const ats = [g1.at + g1.frames * 0.5, g2.at + g2.frames * 0.3, g2.at + g2.frames * 0.75, g3.at + g3.frames * 0.5];
  return (
    <Split
      ratio={0.46}
      left={
        <>
          <Aparece at={g1.at}>
            <Card accent={C.yellow} style={{ padding: "18px 30px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink }}>1 peso · 100 % anual</div>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>los intereses también generan intereses</div>
            </Card>
          </Aparece>
          <Aparece at={g2.at}>
            <Formula tex={"\\left(1 + \\dfrac{1}{\\ent{n}}\\right)^{\\ent{n}}"} size={84} />
          </Aparece>
          <Nota>Ejemplo simplificado</Nota>
        </>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {BANCO.map((b, i) => (
            <Aparece key={b.t} at={ats[i]}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 30, fontFamily: FONT }}>
                <span style={{ width: 330, textAlign: "right", fontWeight: 800, fontSize: 38, color: COL.entrada }}>{b.t}</span>
                <span style={{ fontWeight: 900, fontSize: 64, color: i === 3 ? C.yellow : COL.salida, fontVariantNumeric: "tabular-nums" }}>
                  {i === 3 ? "2.718…" : ((1 + 1 / b.n) ** b.n).toFixed(2)}
                </span>
              </div>
            </Aparece>
          ))}
          <Sequence from={g4.at} layout="none">
            <Card accent={C.yellow} style={{ padding: "14px 40px", marginTop: 10 }}>
              <Formula tex={"e = 2.71828\\ldots"} size={90} color={C.yellow} />
            </Card>
          </Sequence>
          {frame < 0 && null}
        </div>
      }
    />
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>Regla de la potencia: (xⁿ)' = n·xⁿ⁻¹</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"f(\\ent{x}) = 4\\ent{x}^3 + 2\\ent{x} - 9"} size={54} color={C.dim} />
          <Formula tex={"f'(\\ent{x}) = \\der{12\\ent{x}^2 + 2} \\qquad f'(\\ent{1}) = \\der{14}"} size={68} />
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
        { at: o1.at + 10, t: "Explicar qué es el número e" },
        { at: o1.at + t, t: "Derivar e^x y ln x" },
        { at: o1.at + 2 * t, t: "Derivar cualquier exponencial a^x" },
      ]}
    />
  );
};

const NumeroE: React.FC<EscenaProps> = ({ lineas }) => {
  const [n1, n2, n3] = lineas;
  const frame = useCurrentFrame();
  const pC = useP(n1.at + 30, n2.at + n2.frames * 0.6);
  return (
    <Split
      ratio={0.44}
      left={
        <>
          <Words text="¿Qué es el número *e*?" size={68} align="left" accent={C.yellow} delay={n1.at} />
          <Aparece at={n1.at + 30}>
            <Formula tex={"e = \\lim_{\\ent{n} \\to \\infty} \\left(1 + \\dfrac{1}{\\ent{n}}\\right)^{\\ent{n}}"} size={64} />
          </Aparece>
          <Aparece at={n2.at + n2.frames * 0.4}>
            <Formula tex={"= 2.71828\\ldots"} size={70} color={C.yellow} />
          </Aparece>
          <Sequence from={n3.at} layout="none">
            <Chip bg={C.bg2} color={C.ink} size={30}>
              como π: sus decimales nunca terminan
            </Chip>
          </Sequence>
        </>
      }
      right={
        <Plano w={640} h={480} x={[0, 30]} y={[1.8, 2.9]} paso={5} pasoY={0.2} etiquetaX="n" etiquetaY="">
          {(e) => (
            <>
              <line x1={e.X(0)} y1={e.Y(E)} x2={e.X(30)} y2={e.Y(E)} stroke={C.yellow} strokeWidth={3} strokeDasharray="10 8" opacity={frame >= n2.at ? 1 : 0.3} />
              <text x={e.X(30) - 10} y={e.Y(E) - 14} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={26} fill={C.yellow}>
                e
              </text>
              <Curva e={e} f={(n) => (1 + 1 / n) ** n} x={[1, 30]} p={pC} n={300} />
              {[1, 2, 5, 10, 20, 30].map((n) =>
                pC * 29 + 1 >= n ? <circle key={n} cx={e.X(n)} cy={e.Y((1 + 1 / n) ** n)} r={9} fill={COL.salida} stroke={C.bg} strokeWidth={3} /> : null,
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const PUNTOS_E = [0, 1, 2];

const Exp: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2, x3, x4] = lineas;
  const frame = useCurrentFrame();
  const t = x2.frames / 3;
  const k = frame < x2.at ? 0 : Math.min(2, Math.floor((frame - x2.at) / t));
  const p = PUNTOS_E[k];
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="La derivada de *e^x*" size={64} align="left" accent={C.yellow} delay={x1.at} />
          {frame >= x2.at && frame < x3.at && (
            <Card accent={C.dim} style={{ padding: "16px 26px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: MONO, fontWeight: 700, fontSize: 34, whiteSpace: "nowrap" }}>
                <span style={{ color: COL.entrada }}>x = {p}</span>
                <span style={{ color: COL.salida }}>altura {Math.exp(p).toFixed(2)}</span>
                <span style={{ color: COL.derivada }}>pendiente {Math.exp(p).toFixed(2)}</span>
              </div>
            </Card>
          )}
          <Aparece at={x3.at}>
            <Card accent={C.yellow} style={{ padding: "16px 40px" }}>
              <Formula tex={"\\dfrac{d}{d\\ent{x}}\\left(e^{\\ent{x}}\\right) = \\der{e^{\\ent{x}}}"} size={84} />
            </Card>
          </Aparece>
          <Sequence from={x3.at + x3.frames * 0.5} layout="none">
            <Sticker bg={C.yellow} size={34}>
              Su propia derivada
            </Sticker>
          </Sequence>
          <Sequence from={x4.at} layout="none">
            <Chip bg={C.bg2} color={C.ink} size={28}>
              más grande → crece más rápido
            </Chip>
          </Sequence>
        </>
      }
      right={
        <Plano w={620} h={520} x={[-2, 2.4]} y={[-1, 10]} paso={1} pasoY={2} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={Math.exp} x={[-2, 2.3]} />
              {frame >= x2.at && (
                <>
                  <Recta e={e} x0={p} y0={Math.exp(p)} m={Math.exp(p)} xa={p - 0.9} xb={p + (p === 2 ? 0.25 : 0.7)} color={C.coral} ancho={6} />
                  <line x1={e.X(p)} y1={e.Y(0)} x2={e.X(p)} y2={e.Y(Math.exp(p))} stroke={COL.salida} strokeWidth={4} strokeDasharray="8 6" />
                  <circle cx={e.X(p)} cy={e.Y(Math.exp(p))} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                </>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const OtrasBases: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Words text="¿Y otras *bases*?" size={70} accent={C.yellow} delay={b1.at} />
      <Aparece at={b1.at + 20}>
        <Card accent={C.yellow} style={{ padding: "16px 50px" }}>
          <Formula tex={"\\dfrac{d}{d\\ent{x}}\\left(a^{\\ent{x}}\\right) = a^{\\ent{x}} \\cdot \\reg{\\ln a}"} size={90} />
        </Card>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 240 }}>
        {frame >= b2.at && frame < b3.at && (
          <>
            <Paso at={b2.at} n={1} tex={"(2^{\\ent{x}})' = 2^{\\ent{x}} \\cdot \\ln 2 \\approx \\der{0.69 \\cdot 2^{\\ent{x}}}"} on ancho={1000} size={58} />
            <Aparece at={b2.at + b2.frames * 0.55}>
              <Formula tex={"(2^{x})' \\neq x \\cdot 2^{x-1} \\;\\; \\boldsymbol{\\times}"} size={52} color={C.coral} />
            </Aparece>
          </>
        )}
        {frame >= b3.at && (
          <>
            <Paso at={b3.at} n={2} tex={"a = e: \\;\\; \\ln e = 1 \\;\\Rightarrow\\; (e^{\\ent{x}})' = e^{\\ent{x}} \\;\\checkmark"} on ancho={1000} size={58} />
            <Sequence from={b3.at + b3.frames * 0.6} layout="none">
              <Sticker bg={C.green} size={34}>
                e es la base natural
              </Sticker>
            </Sequence>
          </>
        )}
      </div>
    </Stage>
  );
};

const PUNTOS_LN = [1, 2, 4];

const Logaritmo: React.FC<EscenaProps> = ({ lineas }) => {
  const [l1, l2, l3, l4] = lineas;
  const frame = useCurrentFrame();
  const pR = useP(l1.at + 30, l1.at + 90);
  const t = l2.frames / 3;
  const k = frame < l2.at ? -1 : Math.min(2, Math.floor((frame - l2.at) / t));
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="La derivada de *ln x*" size={60} align="left" accent={C.yellow} delay={l1.at} />
          <Aparece at={l1.at + 30}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>
              ln x es la <span style={{ color: C.yellow }}>inversa</span> de e^x: su reflejo en la diagonal
            </div>
          </Aparece>
          {k >= 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {PUNTOS_LN.slice(0, k + 1).map((x) => (
                <div key={x} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34 }}>
                  <span style={{ color: COL.entrada }}>x = {x}</span>
                  <span style={{ color: C.dim }}> → pendiente </span>
                  <span style={{ color: COL.derivada }}>{(1 / x).toFixed(x === 4 ? 2 : 1)}</span>
                </div>
              ))}
            </div>
          )}
          <Aparece at={l3.at}>
            <Card accent={C.yellow} style={{ padding: "14px 40px" }}>
              <Formula tex={"\\dfrac{d}{d\\ent{x}}\\left(\\ln \\ent{x}\\right) = \\der{\\dfrac{1}{\\ent{x}}}"} size={76} />
            </Card>
          </Aparece>
          <Sequence from={l4.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={30}>
              Siempre sube, pero cada vez más lento
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Plano w={600} h={560} x={[-2, 5]} y={[-2, 5]} paso={1} etiquetaY="y">
          {(e) => (
            <>
              <line x1={e.X(-2)} y1={e.Y(-2)} x2={e.X(5)} y2={e.Y(5)} stroke={`${C.dim}88`} strokeWidth={3} strokeDasharray="10 8" />
              <Curva e={e} f={Math.exp} x={[-2, 1.6]} color={`${C.yellow}66`} ancho={5} />
              <Curva e={e} f={Math.log} x={[0.14, 5]} p={pR} color={C.green} n={300} />
              {k >= 0 && (
                <>
                  <Recta e={e} x0={PUNTOS_LN[k]} y0={Math.log(PUNTOS_LN[k])} m={1 / PUNTOS_LN[k]} xa={PUNTOS_LN[k] - 1} xb={Math.min(5, PUNTOS_LN[k] + 1)} color={C.coral} ancho={6} />
                  <circle cx={e.X(PUNTOS_LN[k])} cy={e.Y(Math.log(PUNTOS_LN[k]))} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                </>
              )}
              <text x={e.X(1.3)} y={e.Y(4.3)} fontFamily={MONO} fontWeight={700} fontSize={26} fill={`${C.yellow}aa`}>
                e^x
              </text>
              <text x={e.X(4.2)} y={e.Y(1.4) - 16} fontFamily={MONO} fontWeight={700} fontSize={26} fill={C.green}>
                ln x
              </text>
            </>
          )}
        </Plano>
      }
    />
  );
};

const Ejemplo: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4, e5] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Aparece at={e1.at}>
        <Formula tex={"f(\\ent{x}) = 3e^{\\ent{x}} + 5\\ln \\ent{x} - \\ent{x}^2"} size={80} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={e2.at} n={1} tex={"3e^{\\ent{x}} \\to \\der{3e^{\\ent{x}}}"} nota="su propia derivada" on={frame < e3.at} ancho={620} size={58} />
        <Paso at={e3.at} n={2} tex={"5\\ln \\ent{x} \\to 5 \\cdot \\dfrac{1}{\\ent{x}} = \\der{\\dfrac{5}{\\ent{x}}}"} nota="uno entre x" on={frame >= e3.at && frame < e4.at} ancho={620} size={58} />
        <Paso at={e4.at} n={3} tex={"-\\ent{x}^2 \\to \\der{-2\\ent{x}}"} nota="regla de la potencia" on={frame >= e4.at && frame < e5.at} ancho={620} size={58} />
      </div>
      <Sequence from={e5.at} layout="none">
        <Card accent={C.green} style={{ padding: "12px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Formula tex={"f'(\\ent{x}) = 3e^{\\ent{x}} + \\dfrac{5}{\\ent{x}} - 2\\ent{x}"} size={56} color={COL.derivada} />
          <Formula tex={"f'(\\ent{1}) = 3e + 5 - 2 = 3e + 3 \\approx \\der{11.15}"} size={56} />
        </Card>
      </Sequence>
    </Stage>
  );
};

const Bacterias: React.FC<{ n: number }> = ({ n }) => (
  <svg width={420} height={420} viewBox="0 0 420 420">
    <circle cx={210} cy={210} r={200} fill={`${C.bg2}cc`} stroke={C.dim} strokeWidth={5} />
    {Array.from({ length: Math.min(n, 128) }, (_, i) => {
      const a = i * 2.39996;
      const r = 14 * Math.sqrt(i + 0.5);
      return <ellipse key={i} cx={210 + Math.cos(a) * r} cy={210 + Math.sin(a) * r} rx={9} ry={5} fill={C.green} transform={`rotate(${(i * 37) % 180} ${210 + Math.cos(a) * r} ${210 + Math.sin(a) * r})`} />;
    })}
  </svg>
);

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2, u3] = lineas;
  const frame = useCurrentFrame();
  const gen = Math.max(0, Math.min(7, Math.floor((frame - u1.at) / 25)));
  return (
    <Stage direction="row" gap={80}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Bacterias n={2 ** gen} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.green }}>{2 ** gen} bacterias</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 980 }}>
        <Words text="¿Para qué se *usa*?" size={70} align="left" accent={C.blue} delay={u1.at} />
        <Aparece at={u1.at + 40}>
          <Formula tex={"P(t) = P_0\\, e^{\\reg{k}t}"} size={70} />
        </Aparece>
        <Aparece at={u2.at}>
          <Formula tex={"P'(t) = \\reg{k}\\, P(t)"} size={70} color={COL.derivada} />
        </Aparece>
        <Sequence from={u2.at + u2.frames * 0.4} layout="none">
          <Sticker bg={C.green} size={30}>
            El ritmo de crecimiento es proporcional al tamaño
          </Sticker>
        </Sequence>
        <Aparece at={u3.at}>
          <div style={{ display: "flex", gap: 14, whiteSpace: "nowrap" }}>
            <Chip bg={C.bg2} color={C.ink} size={24}>
              poblaciones
            </Chip>
            <Chip bg={C.bg2} color={C.ink} size={24}>
              interés continuo
            </Chip>
            <Chip bg={C.bg2} color={C.ink} size={24}>
              decaimiento radiactivo (k &lt; 0)
            </Chip>
          </div>
        </Aparece>
      </div>
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2] = lineas;
  return (
    <Stage gap={30}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: por qué los modelos usan logaritmos" size={58} accent={C.purple} delay={k1.at} />
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={k1.at + 30}>
          <Card accent={C.coral} style={{ width: 640, textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.coral }}>MULTIPLICAR</div>
            <Formula tex={"0.01 \\times 0.01 \\times \\cdots \\;(1000\\text{ veces})"} size={40} />
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: C.coral }}>= 0.0 ✕</div>
          </Card>
        </Aparece>
        <Aparece at={k2.at}>
          <Card accent={C.green} style={{ width: 640, textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.green }}>SUMAR LOGARITMOS</div>
            <Formula tex={"\\ln 0.01 + \\ln 0.01 + \\cdots"} size={40} />
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: C.green }}>= −4605.2 ✓</div>
          </Card>
        </Aparece>
      </div>
      <Sequence from={k2.at + k2.frames * 0.55} layout="none">
        <Card accent={C.purple} style={{ padding: "10px 30px" }}>
          <Formula tex={"\\text{para entrenar: } \\dfrac{d}{dp}\\left(\\ln p\\right) = \\dfrac{1}{p}"} size={50} />
        </Card>
      </Sequence>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1180, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · sympy</span>
        </div>
        <Codigo at={y1.at} texto="sp.diff(sp.exp(x), x)" dur={18} />
        <Aparece at={y1.at + 26}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>exp(x)</div>
        </Aparece>
        <Codigo at={y2.at + y2.frames * 0.4} texto="sp.diff(sp.log(x), x)" dur={18} />
        <Aparece at={y2.at + y2.frames * 0.4 + 26}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>1/x</div>
        </Aparece>
        <Codigo at={y3.at} texto="sp.diff(2**x, x)" dur={14} />
        <Aparece at={y3.at + 22}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>2**x*log(2)</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      {frame < f2.at ? (
        <Cuidado at={f1.at + 10}>
          <Formula tex={"(2^{x})' \\neq x \\cdot 2^{x-1} \\;\\; \\boldsymbol{\\times}"} size={64} color={C.coral} />
          <Aparece at={f1.at + f1.frames * 0.5} style={{ marginTop: 20 }}>
            <Formula tex={"(2^{x})' = 2^{x} \\cdot \\ln 2 \\;\\; \\checkmark"} size={64} color={C.green} />
          </Aparece>
        </Cuidado>
      ) : (
        <Cuidado at={f2.at}>
          <Formula tex={"\\ln(a + b) \\neq \\ln a + \\ln b"} size={60} color={C.coral} />
          <div style={{ fontFamily: MONO, fontSize: 28, color: C.dim }}>ln(2 + 3) = 1.61 · ln 2 + ln 3 = 1.79</div>
          <Aparece at={f2.at + f2.frames * 0.55} style={{ marginTop: 16 }}>
            <Formula tex={"\\ln(a \\cdot b) = \\ln a + \\ln b \\;\\; \\checkmark"} size={60} color={C.green} />
          </Aparece>
        </Cuidado>
      )}
    </Stage>
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
          <Formula tex={"f(\\ent{x}) = 5\\ln \\ent{x} + e^{\\ent{x}}"} size={84} />
          <Formula tex={"f'(\\ent{x}) = \\; ? \\qquad f'(\\ent{1}) = \\; ?"} size={84} color={C.yellow} />
        </Card>
      }
      ideas={["(e^x)' = e^x: su propia derivada", "(ln x)' = 1/x", "(a^x)' = a^x · ln a"]}
    />
  );
};

export const C06 = leerGuion(guion);

export const C06ExpLog: React.FC = () => (
  <VideoLargo
    guion={C06}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={6} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      numero_e: NumeroE,
      exp: Exp,
      otras_bases: OtrasBases,
      logaritmo: Logaritmo,
      ejemplo: Ejemplo,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={7} titulo="Producto y *cociente*" sub="Cuando dos funciones se multiplican o se dividen" />,
    }}
  />
);
