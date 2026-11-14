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
  PlusDatos,
  Recuerda,
  RetoResumen,
  SerieCalculo,
  type Ejes,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c04-derivada.json";

// Cálculo Diferencial #4 · Qué es la derivada. Énfasis matemático; la Ciencia de Datos es un plus.

const f = (x: number) => x * x;

/** Recta que pasa por (x0, y0) con pendiente m, dibujada entre xa y xb. */
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

/** Velocímetro sencillo. */
const Velocimetro: React.FC<{ v: number; max?: number }> = ({ v, max = 160 }) => {
  const ang = -120 + (240 * Math.min(v, max)) / max;
  return (
    <svg width={420} height={380} viewBox="-210 -210 420 380">
      <path d="M -173 100 A 200 200 0 1 1 173 100" fill="none" stroke={C.bg2} strokeWidth={30} strokeLinecap="round" />
      {[0, 40, 80, 120, 160].map((k) => {
        const a = ((-120 + (240 * k) / max) * Math.PI) / 180;
        return (
          <text key={k} x={Math.sin(a) * 150} y={-Math.cos(a) * 150 + 10} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={C.dim}>
            {k}
          </text>
        );
      })}
      <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * 175} y2={-Math.cos((ang * Math.PI) / 180) * 175} stroke={C.coral} strokeWidth={10} strokeLinecap="round" />
      <circle r={20} fill={C.ink} />
      <text y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={50} fill={C.ink}>
        {Math.round(v)} km/h
      </text>
    </svg>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const pV = useP(g2.at + 20, g2.at + 70);
  const v = frame < g2.at ? 100 : 100 + 20 * pV;
  return (
    <Stage direction="row" gap={80}>
      <Velocimetro v={v} />
      <div style={{ display: "flex", flexDirection: "column", gap: 26, width: 880 }}>
        <Aparece at={g1.at}>
          <Formula tex={"\\text{promedio} = \\dfrac{100 \\text{ km}}{1 \\text{ h}} = 100 \\text{ km/h}"} size={58} />
        </Aparece>
        <Aparece at={g2.at + 30}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink }}>
            Pero en un momento marcó <span style={{ color: C.coral }}>120</span>. ¿Cómo se calcula un <span style={{ color: C.yellow }}>instante</span>?
          </div>
        </Aparece>
        <Aparece at={g3.at}>
          <Formula tex={"\\text{en un instante: } \\dfrac{\\reg{0} \\text{ km}}{\\reg{0} \\text{ h}} = \\; ?"} size={58} />
        </Aparece>
        <Sequence from={g4.at} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={38}>
            0/0 → un límite → la DERIVADA
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
      idea={<>Continua: f(a) existe, el límite existe y son iguales</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Formula tex={"\\dfrac{\\ent{x}^2 - 1}{\\ent{x} - 1} = \\dfrac{\\reg{\\cancel{(\\ent{x} - 1)}}(\\ent{x} + 1)}{\\reg{\\cancel{\\ent{x} - 1}}} = \\ent{x} + 1"} size={58} />
          <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
            <Chip bg={C.coral} color={C.ink} size={30}>
              HUECO en x = 1
            </Chip>
            <Chip bg={C.green} size={30}>
              se repara con f(1) = 2
            </Chip>
          </div>
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
        { at: o1.at + 10, t: "Explicar qué es la derivada" },
        { at: o1.at + t, t: "Calcularla con su definición" },
        { at: o1.at + 2 * t, t: "Leer lo que dice su signo" },
      ]}
    />
  );
};

const Promedio: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3, a4] = lineas;
  const frame = useCurrentFrame();
  const pC = useP(a1.at + 10, a1.at + 60);
  return (
    <Split
      ratio={0.46}
      left={
        <>
          <Words text="El cambio *promedio*" size={70} align="left" accent={C.yellow} delay={a1.at} />
          <Aparece at={a2.at}>
            <Formula tex={"f(\\ent{3}) = \\sal{9} \\qquad f(\\ent{5}) = \\sal{25}"} size={50} />
          </Aparece>
          <Aparece at={a3.at + 30}>
            <Formula tex={"\\dfrac{\\sal{\\Delta y}}{\\ent{\\Delta x}} = \\dfrac{\\sal{25 - 9}}{\\ent{5 - 3}} = \\dfrac{16}{2} = \\der{8}"} size={50} />
          </Aparece>
          <Sequence from={a4.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={30}>
              Como la velocidad promedio del auto
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Plano w={640} h={560} x={[-1, 6]} y={[-2, 30]} paso={1} pasoY={10} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={f} x={[-1, 5.4]} p={pC} />
              {frame >= a2.at && (
                <>
                  <circle cx={e.X(3)} cy={e.Y(9)} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                  <circle cx={e.X(5)} cy={e.Y(25)} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                </>
              )}
              {frame >= a3.at && (
                <>
                  <Recta e={e} x0={3} y0={9} m={8} xa={1.9} xb={5.6} color={C.coral} />
                  <line x1={e.X(3)} y1={e.Y(9)} x2={e.X(5)} y2={e.Y(9)} stroke={COL.entrada} strokeWidth={5} strokeDasharray="8 6" />
                  <line x1={e.X(5)} y1={e.Y(9)} x2={e.X(5)} y2={e.Y(25)} stroke={COL.salida} strokeWidth={5} strokeDasharray="8 6" />
                  <text x={e.X(4)} y={e.Y(9) + 34} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26} fill={COL.entrada}>
                    Δx = 2
                  </text>
                  <text x={e.X(5) + 14} y={e.Y(17)} fontFamily={MONO} fontWeight={700} fontSize={26} fill={COL.salida}>
                    Δy = 16
                  </text>
                  <text x={e.X(2.2)} y={e.Y(2.5)} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.coral}>
                    secante
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

const PASOS_H = [1, 0.1, 0.01];

const Tangente: React.FC<EscenaProps> = ({ lineas }) => {
  const [d1, d2, d3, d4] = lineas;
  const frame = useCurrentFrame();
  // h baja de 2 a casi 0 durante d1–d3.
  const p = useP(d1.at + 10, d3.at + d3.frames * 0.6);
  const h = 2 * Math.pow(0.002, p);
  const m = 6 + h;
  const tangente = frame >= d3.at + d3.frames * 0.6;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Acerquemos el *punto*" size={66} align="left" accent={C.yellow} delay={d1.at} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {PASOS_H.map((hh, i) => (
              <Aparece key={hh} at={d2.at + (i * d2.frames) / 3}>
                <div style={{ display: "flex", fontFamily: MONO, fontWeight: 700, fontSize: 36 }}>
                  <span style={{ width: 230, color: C.yellow }}>h = {hh}</span>
                  <span style={{ color: C.dim }}>→ pendiente </span>
                  <span style={{ marginLeft: 12, color: C.coral }}>{(6 + hh).toFixed(hh < 0.1 ? 2 : 1)}</span>
                </div>
              </Aparece>
            ))}
            <Aparece at={d3.at + d3.frames * 0.6}>
              <div style={{ display: "flex", fontFamily: MONO, fontWeight: 700, fontSize: 36 }}>
                <span style={{ width: 230, color: C.yellow }}>h → 0</span>
                <span style={{ color: C.dim }}>→ pendiente </span>
                <span style={{ marginLeft: 12, color: C.green }}>6</span>
              </div>
            </Aparece>
          </div>
          <Sequence from={d4.at} layout="none">
            <Card accent={C.yellow} style={{ padding: "16px 26px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>
                Derivada = pendiente de la <span style={{ color: C.yellow }}>tangente</span>: el cambio en un instante
              </div>
            </Card>
          </Sequence>
        </>
      }
      right={
        <Plano w={640} h={560} x={[0, 6]} y={[-2, 30]} paso={1} pasoY={10} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={f} x={[0, 5.4]} />
              <Recta e={e} x0={3} y0={9} m={m} xa={1.6} xb={4.9} color={tangente ? C.yellow : C.coral} ancho={6} />
              <circle cx={e.X(3)} cy={e.Y(9)} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
              {!tangente && <circle cx={e.X(3 + h)} cy={e.Y(f(3 + h))} r={12} fill={C.coral} stroke={C.bg} strokeWidth={4} />}
              <text x={e.X(3) + 20} y={e.Y(9) + 40} fontFamily={FONT} fontWeight={800} fontSize={28} fill={tangente ? C.yellow : C.coral}>
                {tangente ? "tangente · pendiente 6" : `secante · pendiente ${m.toFixed(2)}`}
              </text>
            </>
          )}
        </Plano>
      }
    />
  );
};

const Definicion: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4, e5, e6, e7] = lineas;
  const frame = useCurrentFrame();
  const DEF = "f'(\\ent{x}) = \\lim_{\\reg{h} \\to 0} \\dfrac{\\sal{f(\\ent{x} + \\reg{h}) - f(\\ent{x})}}{\\reg{h}}";
  if (frame < e3.at) {
    const t = e2.frames / 4;
    const etiquetas = [
      { at: e2.at, c: C.yellow, t: "h = el paso" },
      { at: e2.at + t, c: COL.salida, t: "arriba = cuánto subió" },
      { at: e2.at + 2 * t, c: C.coral, t: "÷ h = la pendiente" },
      { at: e2.at + 3 * t, c: C.yellow, t: "h → 0 = un instante" },
    ];
    return (
      <Stage gap={40}>
        <Words text="La *definición*" size={70} accent={C.yellow} delay={e1.at} />
        <Aparece at={e1.at + 20}>
          <Formula tex={DEF} size={110} />
        </Aparece>
        <div style={{ display: "flex", gap: 36 }}>
          {etiquetas.map((x) => (
            <Aparece key={x.t} at={x.at}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: x.c }}>{x.t}</div>
            </Aparece>
          ))}
        </div>
      </Stage>
    );
  }
  const actual = frame >= e7.at ? 5 : frame >= e6.at ? 4 : frame >= e5.at ? 3 : frame >= e4.at ? 2 : 1;
  return (
    <Stage gap={20}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Chip bg={C.blue} color={C.ink} size={30}>
          f(x) = x²
        </Chip>
        <Formula tex={DEF} size={50} color={C.dim} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={e3.at + 20} n={1} tex={"f(\\ent{x} + \\reg{h}) = (\\ent{x} + \\reg{h})^2 = \\ent{x}^2 + 2\\ent{x}\\reg{h} + \\reg{h}^2"} on={actual === 1} ancho={980} size={52} />
        <Paso at={e4.at} n={2} tex={"f(\\ent{x} + \\reg{h}) - f(\\ent{x}) = 2\\ent{x}\\reg{h} + \\reg{h}^2"} on={actual === 2} ancho={980} size={52} />
        <Paso at={e5.at} n={3} tex={"\\dfrac{2\\ent{x}\\reg{h} + \\reg{h}^2}{\\reg{h}} = 2\\ent{x} + \\reg{h}"} on={actual === 3} ancho={980} size={52} />
        <Paso at={e6.at} n={4} tex={"\\reg{h} \\to 0: \\quad f'(\\ent{x}) = \\der{2\\ent{x}}"} on={actual === 4} ancho={980} size={52} />
      </div>
      <Sequence from={e7.at} layout="none">
        <Card accent={C.green} style={{ padding: "12px 32px" }}>
          <Formula tex={"f'(\\ent{3}) = 2 \\cdot \\ent{3} = \\der{6} \\;\\; \\checkmark"} size={60} />
        </Card>
      </Sequence>
    </Stage>
  );
};

const PUNTOS = [
  { x: -2, color: C.coral, t: "f'(−2) = −4 · baja" },
  { x: 0, color: C.yellow, t: "f'(0) = 0 · plano" },
  { x: 3, color: C.green, t: "f'(3) = 6 · sube" },
];

const Signo: React.FC<EscenaProps> = ({ lineas }) => {
  const [n1, n2, n3, n4, n5] = lineas;
  const frame = useCurrentFrame();
  const visibles = [n2.at, n3.at, n4.at];
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="¿Qué dice el *signo*?" size={68} align="left" accent={C.yellow} delay={n1.at} />
          {PUNTOS.map((p, i) => (
            <Aparece key={p.x} at={visibles[i]}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: p.color }}>{p.t}</div>
            </Aparece>
          ))}
          <Aparece at={n4.at + n4.frames * 0.5}>
            <div style={{ display: "flex", gap: 14 }}>
              <Chip bg={C.green} size={26}>
                + sube
              </Chip>
              <Chip bg={C.coral} color={C.ink} size={26}>
                − baja
              </Chip>
              <Chip bg={C.yellow} size={26}>
                0 plano
              </Chip>
            </div>
          </Aparece>
          <Sequence from={n5.at} layout="none">
            <Card accent={C.blue} style={{ padding: "12px 26px" }}>
              <Formula tex={"f'(\\ent{x}) = \\dfrac{d\\sal{y}}{d\\ent{x}}"} size={56} />
            </Card>
          </Sequence>
        </>
      }
      right={
        <Plano w={640} h={540} x={[-4, 4]} y={[-3, 13]} paso={1} pasoY={3} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={f} x={[-3.5, 3.5]} />
              {PUNTOS.map((p, i) =>
                frame >= visibles[i] ? (
                  <g key={p.x}>
                    <Recta e={e} x0={p.x} y0={f(p.x)} m={2 * p.x} xa={p.x - (p.x === 3 ? 0.65 : 1.1)} xb={p.x + (p.x === 3 ? 0.65 : 1.1)} color={p.color} ancho={6} />
                    <circle cx={e.X(p.x)} cy={e.Y(f(p.x))} r={12} fill={p.color} stroke={C.bg} strokeWidth={4} />
                  </g>
                ) : null,
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
    { at: u1.at, t: "VELOCIDAD", d: "derivada de la posición", c: C.coral },
    { at: u2.at, t: "COSTO MARGINAL", d: "cuánto cuesta una unidad más", c: C.yellow },
    { at: u2.at + u2.frames * 0.55, t: "CRECIMIENTO", d: "qué tan rápido crece una población", c: C.green },
  ];
  return (
    <Stage gap={34}>
      <Words text="¿Para qué se *usa*?" size={74} accent={C.blue} delay={u1.at} />
      <div style={{ display: "flex", gap: 30 }}>
        {usos.map((u) => (
          <Aparece key={u.t} at={u.at + 10}>
            <Card accent={u.c} style={{ width: 500, textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: u.c }}>{u.t}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.ink }}>{u.d}</div>
            </Card>
          </Aparece>
        ))}
      </div>
      <Sequence from={u1.at + u1.frames * 0.55} layout="none">
        <Sticker bg={C.coral} color={C.ink} size={32}>
          El velocímetro te muestra una derivada
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const frame = useCurrentFrame();
  const err = (w: number) => 0.6 * (w - 3) ** 2 + 1;
  const pB = useP(p2.at + p2.frames * 0.35, p2.at + p2.frames * 0.75);
  const w = 6 - 3 * pB;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Un *plus*: entrenar un modelo" size={62} align="left" accent={C.purple} delay={p1.at} />
          <Aparece at={p1.at + 30}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
              El <b style={{ color: C.purple }}>error</b> depende de un parámetro <b style={{ color: COL.entrada }}>w</b>
            </div>
          </Aparece>
          <Aparece at={p2.at}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
              Derivada positiva → mueve <b style={{ color: COL.entrada }}>w</b> al otro lado → el error <b style={{ color: C.green }}>baja</b>
            </div>
          </Aparece>
          <Sequence from={p2.at + p2.frames * 0.75} layout="none">
            <Sticker bg={C.purple} size={30}>
              Repetirlo miles de veces = entrenar (#12)
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <>
          <Plano w={640} h={480} x={[0, 6.5]} y={[0, 8]} paso={1} etiquetaX="w" etiquetaY="error">
            {(e) => (
              <>
                <Curva e={e} f={err} x={[0, 6.4]} color={C.purple} />
                {frame >= p2.at && <Recta e={e} x0={w} y0={err(w)} m={1.2 * (w - 3)} xa={w - 1} xb={w + 1} color={C.yellow} />}
                <circle cx={e.X(w)} cy={e.Y(err(w))} r={14} fill={C.ink} stroke={C.bg} strokeWidth={4} />
              </>
            )}
          </Plano>
          <PlusDatos />
          <Nota>Ejemplo simplificado</Nota>
        </>
      }
    />
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
        <Codigo at={y1.at} texto="f = lambda x: x**2" dur={18} />
        <Codigo at={y2.at} texto="h = 1e-5; (f(3 + h) - f(3)) / h" dur={26} />
        <Aparece at={y2.at + 36}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>6.00001</div>
        </Aparece>
        <Codigo at={y3.at} texto="sp.diff(x**2, x)" dur={16} />
        <Aparece at={y3.at + 26}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>2*x</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  const pico = frame >= x2.at;
  return (
    <Split
      ratio={0.45}
      left={
        <>
          <Sticker bg={C.coral} color={C.ink} size={48}>
            ¡CUIDADO!
          </Sticker>
          {!pico ? (
            <Cuidado at={x1.at + 10}>
              <Formula tex={"f(\\ent{3}) = \\sal{9}"} size={70} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.dim }}>qué tan alto está</div>
              <Formula tex={"f'(\\ent{3}) = \\der{6}"} size={70} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.dim }}>qué tan inclinado está</div>
            </Cuidado>
          ) : (
            <Cuidado at={x2.at}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.ink }}>En un pico no hay derivada</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.ink }}>
                izquierda <span style={{ color: COL.entrada }}>−1</span> ≠ derecha <span style={{ color: C.coral }}>1</span>
              </div>
              <Chip bg={C.yellow} size={28}>
                continua, pero no derivable
              </Chip>
            </Cuidado>
          )}
        </>
      }
      right={
        !pico ? (
          <Plano w={600} h={500} x={[0, 5]} y={[-2, 20]} paso={1} pasoY={5} etiquetaY="y">
            {(e) => (
              <>
                <Curva e={e} f={f} x={[0, 4.4]} />
                <line x1={e.X(3)} y1={e.Y(0)} x2={e.X(3)} y2={e.Y(9)} stroke={COL.salida} strokeWidth={5} strokeDasharray="8 6" />
                <Recta e={e} x0={3} y0={9} m={6} xa={2} xb={4.1} color={C.coral} ancho={6} />
                <circle cx={e.X(3)} cy={e.Y(9)} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                <text x={e.X(3) + 14} y={e.Y(4)} fontFamily={MONO} fontWeight={700} fontSize={26} fill={COL.salida}>
                  altura 9
                </text>
              </>
            )}
          </Plano>
        ) : (
          <Plano w={600} h={460} x={[-3, 3]} y={[-0.5, 3.5]} paso={1} etiquetaY="y">
            {(e) => (
              <>
                <Curva e={e} f={(x) => Math.abs(x)} x={[-3, 3]} n={400} />
                <Recta e={e} x0={0} y0={0} m={-1} xa={-3} xb={0} color={COL.entrada} ancho={9} />
                <Recta e={e} x0={0} y0={0} m={1} xa={0} xb={3} color={C.coral} ancho={9} />
                <text x={e.X(-1.9)} y={e.Y(0.6)} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={COL.entrada}>
                  pendiente −1
                </text>
                <text x={e.X(1.9)} y={e.Y(0.6)} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.coral}>
                  pendiente 1
                </text>
                <circle cx={e.X(0)} cy={e.Y(0)} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
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
          <Formula tex={"\\text{Si } f(\\ent{x}) = \\ent{x}^2"} size={76} />
          <Formula tex={"f'(\\ent{5}) = \\; ? \\qquad f'(\\ent{-1}) = \\; ?"} size={90} color={C.yellow} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>¿Sube o baja en cada punto?</div>
        </Card>
      }
      ideas={["Derivada: pendiente de la tangente, el cambio en un instante", "Se calcula con un límite: h → 0", "Signo: + sube, − baja, 0 plano"]}
    />
  );
};

export const C04 = leerGuion(guion);

export const C04Derivada: React.FC = () => (
  <VideoLargo
    guion={C04}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={4} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      promedio: Promedio,
      tangente: Tangente,
      definicion: Definicion,
      signo: Signo,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={5} titulo="Reglas de *derivación*" sub="Los atajos para derivar en segundos" />,
    }}
  />
);
