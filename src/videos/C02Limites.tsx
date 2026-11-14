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
import guion from "../guiones/c02-limites.json";

// Cálculo Diferencial #2 · Límites. Énfasis matemático; la Ciencia de Datos es un plus.

const F_TEX = "f(\\ent{x}) = \\dfrac{\\ent{x}^2 - 4}{\\ent{x} - 2}";

/** La recta y = x + 2 con un hueco en x = 2 (la gráfica de (x² − 4)/(x − 2)). */
const ConHueco: React.FC<{ e: Ejes; p?: number; brilla?: boolean }> = ({ e, p = 1, brilla = false }) => (
  <>
    <Curva e={e} f={(x) => x + 2} x={[-1, 1.93]} p={Math.min(1, p * 1.6)} />
    {p > 0.62 && <Curva e={e} f={(x) => x + 2} x={[2.07, 4.5]} p={Math.min(1, (p - 0.62) / 0.38)} />}
    {p > 0.6 && (
      <circle cx={e.X(2)} cy={e.Y(4)} r={brilla ? 16 : 12} fill={C.bg} stroke={brilla ? C.yellow : COL.cambio} strokeWidth={5} />
    )}
  </>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const pG = useP(g3.at + 10, g3.at + 60);
  if (frame < g3.at) {
    return (
      <Stage gap={40}>
        <Aparece at={g1.at}>
          <Formula tex={F_TEX} size={110} />
        </Aparece>
        <Aparece at={g1.at + 40}>
          <Formula tex={"f(\\ent{2}) = \\; ?"} size={90} color={C.yellow} />
        </Aparece>
        <Sequence from={g2.at} layout="none">
          <div
            style={{
              width: 520,
              background: "#060a16",
              border: `6px solid ${C.dim}66`,
              borderRadius: 30,
              padding: 26,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#2a1418",
                borderRadius: 14,
                padding: "16px 24px",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 64,
                color: C.coral,
                textAlign: "right",
              }}
            >
              ERROR
            </div>
            <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim, textAlign: "right" }}>0 ÷ 0</div>
          </div>
        </Sequence>
      </Stage>
    );
  }
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Formula tex={F_TEX} size={70} />
          <Aparece at={g3.at + 60}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>
              Una recta con un <b style={{ color: C.yellow }}>hueco</b> en x = 2… a la altura 4
            </div>
          </Aparece>
          <Sequence from={g4.at} layout="none">
            <Words text="¿*Error*… o *4*?" size={92} align="left" accent={C.yellow} />
          </Sequence>
        </>
      }
      right={
        <Plano w={700} h={560} x={[-1, 4.5]} y={[0, 7]} paso={1}>
          {(e) => (
            <>
              <ConHueco e={e} p={pG} brilla={frame >= g4.at} />
              {frame >= g3.at + 60 && (
                <line x1={e.X(2)} y1={e.Y(4)} x2={e.X(2)} y2={e.Y(0)} stroke={`${C.yellow}88`} strokeWidth={3} strokeDasharray="8 6" />
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={
        <>
          Función: a cada <span style={{ color: COL.entrada }}>entrada</span>, una sola <span style={{ color: COL.salida }}>salida</span>
        </>
      }
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Formula tex={"f(\\ent{x}) = \\ent{x}^2 - 1"} size={60} color={C.dim} />
          <Formula tex={"f(\\ent{3}) = \\ent{3}^2 - 1 = 9 - 1 = \\sal{8}"} size={84} />
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
        { at: o1.at + 10, t: "Explicar qué es un límite" },
        { at: o1.at + t, t: "Calcularlo (tres métodos)" },
        { at: o1.at + 2 * t, t: "Saber cuándo no existe" },
      ]}
    />
  );
};

const IZQ = [1.9, 1.99, 1.999];
const DER = [2.1, 2.01, 2.001];
const fx = (x: number) => x + 2;
const n3 = (v: number) => (Math.round(v * 1000) / 1000).toString();

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3, q4, q5, q6] = lineas;
  const frame = useCurrentFrame();
  // Índices visibles por lado y el punto actual que se acerca.
  const ki = frame < q2.at ? 0 : Math.min(3, 1 + Math.floor((frame - q2.at) / (q2.frames / 3)));
  const kd = frame < q3.at ? 0 : Math.min(3, 1 + Math.floor((frame - q3.at) / (q3.frames / 2.2)));
  const xi = ki ? IZQ[ki - 1] : 1;
  const xd = kd ? DER[kd - 1] : 3;
  const fila = (x: number, i: number, at: number, color: string) => (
    <Aparece key={x} at={at}>
      <div style={{ display: "flex", fontFamily: MONO, fontWeight: 700, fontSize: 38 }}>
        <span style={{ width: 160, textAlign: "center", color: COL.entrada }}>{n3(x)}</span>
        <span style={{ width: 40, color: C.dim }}>→</span>
        <span style={{ width: 160, textAlign: "center", color }}>{n3(fx(x))}</span>
      </div>
    </Aparece>
  );
  if (frame >= q5.at) {
    return (
      <Stage gap={40}>
        <Aparece at={q5.at}>
          <Formula tex={"\\lim_{\\ent{x} \\to 2} \\; f(\\ent{x}) = \\sal{4}"} size={140} />
        </Aparece>
        <Aparece at={q5.at + 40}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.dim }}>
            «el límite, cuando <span style={{ color: COL.entrada }}>x</span> tiende a 2, de f(x), es <span style={{ color: COL.salida }}>4</span>»
          </div>
        </Aparece>
        <Sequence from={q6.at} layout="none">
          <div style={{ display: "flex", gap: 30 }}>
            <Chip bg={C.coral} color={C.ink} size={34}>
              f(2): no existe
            </Chip>
            <Chip bg={C.green} size={34}>
              límite en 2: sí, es 4
            </Chip>
          </div>
        </Sequence>
      </Stage>
    );
  }
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="¿Qué es un *límite*?" size={72} align="left" accent={C.blue} delay={q1.at} />
          <Aparece at={q1.at + 30}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
              ¿A qué valor se acerca <b style={{ color: COL.salida }}>f(x)</b> cuando <b style={{ color: COL.entrada }}>x</b> se acerca a un número?
            </div>
          </Aparece>
          <div style={{ display: "flex", gap: 30 }}>
            <div>
              {frame >= q2.at && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.dim }}>por la izquierda</div>}
              {IZQ.map((x, i) => (frame >= q2.at + (i * q2.frames) / 3 ? fila(x, i, q2.at + (i * q2.frames) / 3, COL.salida) : null))}
            </div>
            <div>
              {frame >= q3.at && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.dim }}>por la derecha</div>}
              {DER.slice(0, 2).map((x, i) => (frame >= q3.at + (i * q3.frames) / 2.2 ? fila(x, i, q3.at + (i * q3.frames) / 2.2, COL.salida) : null))}
            </div>
          </div>
          <Sequence from={q4.at} layout="none">
            <Sticker bg={C.yellow} size={34}>
              Por los dos lados → 4 (sin usar el 2)
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Plano w={720} h={600} x={[-1, 4.5]} y={[0, 7]} paso={1}>
          {(e) => (
            <>
              <ConHueco e={e} brilla={frame >= q4.at} />
              {ki > 0 && (
                <g>
                  <line x1={e.X(xi)} y1={e.Y(0)} x2={e.X(xi)} y2={e.Y(fx(xi))} stroke={`${COL.entrada}aa`} strokeWidth={3} strokeDasharray="6 6" />
                  <line x1={e.X(xi)} y1={e.Y(fx(xi))} x2={e.X(-1)} y2={e.Y(fx(xi))} stroke={`${COL.salida}aa`} strokeWidth={3} strokeDasharray="6 6" />
                  <circle cx={e.X(xi)} cy={e.Y(fx(xi))} r={13} fill={COL.entrada} stroke={C.bg} strokeWidth={4} />
                </g>
              )}
              {kd > 0 && (
                <g>
                  <line x1={e.X(xd)} y1={e.Y(0)} x2={e.X(xd)} y2={e.Y(fx(xd))} stroke={`${COL.entrada}aa`} strokeWidth={3} strokeDasharray="6 6" />
                  <circle cx={e.X(xd)} cy={e.Y(fx(xd))} r={13} fill={COL.derivada} stroke={C.bg} strokeWidth={4} />
                </g>
              )}
              <circle cx={e.X(2)} cy={e.Y(4)} r={frame >= q4.at ? 16 : 12} fill={C.bg} stroke={frame >= q4.at ? C.yellow : COL.cambio} strokeWidth={5} />
            </>
          )}
        </Plano>
      }
    />
  );
};

const Calcular: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4, c5, c6] = lineas;
  const frame = useCurrentFrame();
  if (frame < c3.at) {
    return (
      <Stage gap={40}>
        <Words text="Cómo se *calcula*" size={80} accent={C.yellow} delay={c1.at} />
        <div style={{ display: "flex", gap: 24 }}>
          {["1 · Tabla", "2 · Sustitución directa", "3 · Factorizar el 0/0"].map((t, i) => (
            <Aparece key={t} at={c1.at + 20 + i * 12}>
              <Chip bg={i === 1 && frame >= c2.at ? C.yellow : C.bg2} color={i === 1 && frame >= c2.at ? C.bg : C.ink} size={32}>
                {t}
              </Chip>
            </Aparece>
          ))}
        </div>
        <Sequence from={c2.at} layout="none">
          <Card accent={C.yellow} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Formula tex={"\\lim_{\\ent{x} \\to 3} (2\\ent{x} + 1)"} size={90} />
            <Aparece at={c2.at + c2.frames * 0.55}>
              <Formula tex={"= 2(\\ent{3}) + 1 = \\sal{7}"} size={90} />
            </Aparece>
          </Card>
        </Sequence>
      </Stage>
    );
  }
  return (
    <Stage gap={30}>
      <Aparece at={c3.at}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Chip bg={C.yellow} size={32}>
            3 · Factorizar
          </Chip>
          <Formula tex={"\\dfrac{0}{0}"} size={70} color={C.coral} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>= señal: simplifica</span>
        </div>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <Paso at={c4.at} n={1} tex={"\\dfrac{\\ent{x}^2 - 4}{\\ent{x} - 2} = \\dfrac{(\\ent{x} - 2)(\\ent{x} + 2)}{\\ent{x} - 2}"} nota="factoriza" on={frame < c5.at} ancho={900} size={64} />
        <Paso
          at={c5.at}
          n={2}
          tex={"\\dfrac{\\reg{\\cancel{(\\ent{x} - 2)}}(\\ent{x} + 2)}{\\reg{\\cancel{\\ent{x} - 2}}} = \\ent{x} + 2"}
          nota="cancela"
          on={frame >= c5.at && frame < c6.at}
          ancho={900}
          size={64}
        />
        <Paso at={c6.at} n={3} tex={"\\lim_{\\ent{x} \\to 2} (\\ent{x} + 2) = 2 + 2 = \\sal{4}"} nota="sustituye" on={frame >= c6.at} ancho={900} size={64} />
      </div>
    </Stage>
  );
};

const Laterales: React.FC<EscenaProps> = ({ lineas }) => {
  const [l1, l2, l3, l4] = lineas;
  const frame = useCurrentFrame();
  const pI = useP(l3.at + 10, l3.at + l3.frames * 0.45, false);
  const pD = useP(l3.at + l3.frames * 0.5, l3.at + l3.frames - 10, false);
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Límites *laterales*" size={72} align="left" accent={C.yellow} delay={l1.at} />
          <Aparece at={l1.at + 30}>
            <Card accent={C.green} style={{ padding: "16px 26px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>
                Existe solo si <span style={{ color: COL.entrada }}>izquierda</span> = <span style={{ color: COL.derivada }}>derecha</span>
              </div>
            </Card>
          </Aparece>
          <Aparece at={l2.at}>
            <Formula tex={"f(\\ent{x}) = \\dfrac{|\\ent{x}|}{\\ent{x}}"} size={80} />
          </Aparece>
          <Aparece at={l3.at + 20}>
            <Formula tex={"\\lim_{\\ent{x} \\to 0^-} = -1"} size={56} color={COL.entrada} />
          </Aparece>
          <Aparece at={l3.at + l3.frames * 0.55}>
            <Formula tex={"\\lim_{\\ent{x} \\to 0^+} = 1"} size={56} color={COL.derivada} />
          </Aparece>
          <Sequence from={l4.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={40}>
              NO EXISTE: hay un salto
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Plano w={700} h={520} x={[-3, 3]} y={[-2, 2]} paso={1}>
          {(e) => (
            <>
              {frame >= l2.at && (
                <>
                  <line x1={e.X(-3)} y1={e.Y(-1)} x2={e.X(-0.06)} y2={e.Y(-1)} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
                  <line x1={e.X(0.06)} y1={e.Y(1)} x2={e.X(3)} y2={e.Y(1)} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />
                  <circle cx={e.X(0)} cy={e.Y(-1)} r={11} fill={C.bg} stroke={C.yellow} strokeWidth={5} />
                  <circle cx={e.X(0)} cy={e.Y(1)} r={11} fill={C.bg} stroke={C.yellow} strokeWidth={5} />
                </>
              )}
              {frame >= l3.at + 10 && <circle cx={e.X(-3 + 2.85 * pI)} cy={e.Y(-1)} r={14} fill={COL.entrada} stroke={C.bg} strokeWidth={4} />}
              {frame >= l3.at + l3.frames * 0.5 && <circle cx={e.X(3 - 2.85 * pD)} cy={e.Y(1)} r={14} fill={COL.derivada} stroke={C.bg} strokeWidth={4} />}
            </>
          )}
        </Plano>
      }
    />
  );
};

const Infinito: React.FC<EscenaProps> = ({ lineas }) => {
  const [i1, i2, i3, i4] = lineas;
  const frame = useCurrentFrame();
  const pC = useP(i1.at + 10, i1.at + 60);
  const filas = [10, 100, 1000];
  return (
    <Split
      ratio={0.44}
      left={
        <>
          <Words text="Límites al *infinito*" size={72} align="left" accent={C.yellow} delay={i1.at} />
          <Aparece at={i1.at + 20}>
            <Formula tex={"f(\\ent{x}) = \\dfrac{1}{\\ent{x}}"} size={60} />
          </Aparece>
          {frame < i4.at ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {filas.map((v, i) => (
                  <Aparece key={v} at={i2.at + (i * i2.frames) / 3}>
                    <div style={{ display: "flex", fontFamily: MONO, fontWeight: 700, fontSize: 32 }}>
                      <span style={{ width: 160, textAlign: "right", color: COL.entrada }}>{v}</span>
                      <span style={{ width: 70, textAlign: "center", color: C.dim }}>→</span>
                      <span style={{ color: COL.salida }}>{1 / v}</span>
                    </div>
                  </Aparece>
                ))}
              </div>
              <Aparece at={i3.at + 20}>
                <Formula tex={"\\lim_{\\ent{x} \\to \\infty} \\dfrac{1}{\\ent{x}} = \\sal{0}"} size={56} />
              </Aparece>
              <Sequence from={i3.at + i3.frames * 0.6} layout="none">
                <Chip bg={C.yellow} size={30}>
                  asíntota: la curva se pega, sin tocarla
                </Chip>
              </Sequence>
            </>
          ) : (
            <Aparece at={i4.at}>
              <Formula tex={"\\lim_{\\ent{x} \\to 0^+} \\dfrac{1}{\\ent{x}} = \\der{\\infty}"} size={80} />
            </Aparece>
          )}
        </>
      }
      right={
        <Plano w={700} h={560} x={[-0.5, 10]} y={[-0.5, 6]} paso={2}>
          {(e) => (
            <>
              <line x1={e.X(-0.5)} y1={e.Y(0)} x2={e.X(10)} y2={e.Y(0)} stroke={C.yellow} strokeWidth={3} strokeDasharray="10 8" opacity={frame >= i3.at ? 1 : 0} />
              <line x1={e.X(0)} y1={e.Y(6)} x2={e.X(0)} y2={e.Y(-0.5)} stroke={C.coral} strokeWidth={3} strokeDasharray="10 8" opacity={frame >= i4.at ? 1 : 0} />
              <Curva e={e} f={(x) => 1 / x} x={[1 / 6, 10]} p={pC} n={400} />
              {frame >= i4.at && (
                <text x={e.X(0) + 20} y={e.Y(5.6)} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.coral}>
                  ↑ crece sin parar
                </text>
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
  const frame = useCurrentFrame();
  const aguja = useP(u1.at + 10, u1.at + 50);
  const ang = -120 + 170 * aguja;
  return (
    <Stage direction="row" gap={80}>
      <svg width={460} height={360} viewBox="-230 -230 460 360">
        <path d="M -190 40 A 200 200 0 1 1 190 40" fill="none" stroke={C.bg2} strokeWidth={34} strokeLinecap="round" />
        <path d="M -190 40 A 200 200 0 1 1 190 40" fill="none" stroke={C.blue} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
        <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * 170} y2={-Math.cos((ang * Math.PI) / 180) * 170} stroke={C.coral} strokeWidth={10} strokeLinecap="round" />
        <circle r={22} fill={C.ink} />
        <text y={100} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={36} fill={C.ink}>
          velocidad ahora
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, width: 900 }}>
        <Words text="¿Para qué *sirven*?" size={72} align="left" accent={C.blue} delay={u1.at} />
        <Aparece at={u1.at + 40}>
          <Formula tex={"\\text{velocidad} = \\dfrac{\\text{distancia}}{\\reg{\\text{tiempo}}}"} size={70} />
        </Aparece>
        <Aparece at={u1.at + u1.frames * 0.6}>
          <Formula tex={"\\reg{\\text{tiempo}} \\to 0"} size={60} color={C.yellow} />
        </Aparece>
        <Sequence from={u2.at + u2.frames * 0.45} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={34}>
            Límite → la idea de la derivada (#4)
          </Sticker>
        </Sequence>
      </div>
      {frame < 0 && <span />}
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const frame = useCurrentFrame();
  const pS = useP(p1.at + 20, p1.at + 70);
  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Un *plus*: en Ciencia de Datos" size={62} align="left" accent={C.purple} delay={p1.at} />
          <Aparece at={p1.at + 30}>
            <Formula tex={"\\sigma(\\ent{x}) = \\dfrac{1}{1 + e^{-\\ent{x}}}"} size={72} />
          </Aparece>
          <Aparece at={p2.at}>
            <Formula tex={"\\lim_{\\ent{x} \\to \\infty} \\sigma(\\ent{x}) = 1"} size={54} />
          </Aparece>
          <Aparece at={p2.at + 40}>
            <Formula tex={"\\lim_{\\ent{x} \\to -\\infty} \\sigma(\\ent{x}) = 0"} size={54} />
          </Aparece>
          <Sequence from={p2.at + p2.frames * 0.5} layout="none">
            <Sticker bg={C.purple} size={30}>
              Siempre entre 0 y 1: una probabilidad
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <>
          <Plano w={720} h={460} x={[-6, 6]} y={[-0.2, 1.2]} paso={2} etiquetaY="σ(x)">
            {(e) => (
              <>
                {[0, 1].map((v) => (
                  <line key={v} x1={e.X(-6)} y1={e.Y(v)} x2={e.X(6)} y2={e.Y(v)} stroke={C.yellow} strokeWidth={3} strokeDasharray="10 8" opacity={frame >= p2.at ? 1 : 0.25} />
                ))}
                <text x={e.X(-5.8)} y={e.Y(1) - 12} fontFamily={MONO} fontWeight={700} fontSize={26} fill={C.yellow}>
                  1
                </text>
                <Curva e={e} f={sig} x={[-6, 6]} p={pS} color={C.purple} />
              </>
            )}
          </Plano>
          <PlusDatos />
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
        <Codigo at={y1.at} texto="x = sp.symbols('x')" dur={18} />
        <Codigo at={y2.at} texto="sp.limit((x**2 - 4)/(x - 2), x, 2)" dur={28} />
        <Aparece at={y2.at + 40}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>4</div>
        </Aparece>
        <Codigo at={y3.at} texto="sp.limit(1/x, x, sp.oo)" dur={20} />
        <Aparece at={y3.at + 30}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>0</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={34}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      {frame < x2.at ? (
        <Cuidado at={x1.at + 20}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink }}>El límite NO es el valor en el punto</div>
          <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            <Formula tex={"f(2) = \\text{no existe}"} size={64} color={C.coral} />
            <Formula tex={"\\lim_{x \\to 2} f(x) = \\sal{4}"} size={64} />
          </div>
        </Cuidado>
      ) : (
        <Cuidado at={x2.at}>
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <Formula tex={"\\dfrac{0}{0} \\neq 0"} size={84} />
            <Formula tex={"\\dfrac{0}{0} \\neq 1"} size={84} />
          </div>
          <Aparece at={x2.at + x2.frames * 0.45}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.yellow }}>Es una indeterminación: falta simplificar</div>
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
        <Card accent={C.yellow} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20, padding: "30px 60px" }}>
          <Formula tex={"\\lim_{\\ent{x} \\to 3} \\dfrac{\\ent{x}^2 - 9}{\\ent{x} - 3} = \\; ?"} size={100} />
          <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim }}>pista: sale 0/0</div>
        </Card>
      }
      ideas={["Límite: a qué valor se acerca f(x), sin llegar", "Si sale 0/0, simplifica", "Existe solo si izquierda = derecha"]}
    />
  );
};

export const C02 = leerGuion(guion);

export const C02Limites: React.FC = () => (
  <VideoLargo
    guion={C02}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={2} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      calcular: Calcular,
      laterales: Laterales,
      infinito: Infinito,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={3} titulo="*Continuidad*" sub="Dibujar sin levantar el lápiz" />,
    }}
  />
);
