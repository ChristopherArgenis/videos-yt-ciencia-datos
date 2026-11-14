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
  Plano,
  PlusDatos,
  Recuerda,
  RetoResumen,
  SerieCalculo,
  type Ejes,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c03-continuidad.json";

// Cálculo Diferencial #3 · Continuidad. Énfasis matemático; la Ciencia de Datos es un plus.

/** Escalera del estacionamiento: 20 pesos por hora o fracción (x en horas). */
const Escalera: React.FC<{ e: Ejes; resaltar?: boolean; p?: number }> = ({ e, resaltar = false, p = 1 }) => {
  const tramos = [0, 1, 2, 3].filter((k) => k < p * 4);
  return (
    <>
      {tramos.map((k) => (
        <g key={k}>
          <line x1={e.X(k)} y1={e.Y(20 * (k + 1))} x2={e.X(k + 1)} y2={e.Y(20 * (k + 1))} stroke={C.yellow} strokeWidth={7} strokeLinecap="round" />
          <circle cx={e.X(k)} cy={e.Y(20 * (k + 1))} r={10} fill={C.bg} stroke={C.yellow} strokeWidth={4} />
          <circle cx={e.X(k + 1)} cy={e.Y(20 * (k + 1))} r={10} fill={C.yellow} />
          {k < 3 && (
            <line
              x1={e.X(k + 1)}
              y1={e.Y(20 * (k + 1)) - 12}
              x2={e.X(k + 1)}
              y2={e.Y(20 * (k + 2)) + 12}
              stroke={resaltar && k === 0 ? C.coral : `${C.dim}66`}
              strokeWidth={resaltar && k === 0 ? 5 : 2}
              strokeDasharray="8 6"
            />
          )}
        </g>
      ))}
    </>
  );
};

const Reloj: React.FC<{ min: number; pesos: number; color: string; at: number }> = ({ min, pesos, color, at }) => (
  <Aparece at={at}>
    <Card accent={color} style={{ textAlign: "center", width: 360, padding: "22px 30px" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 70, color: COL.entrada }}>{min} min</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color }}>${pesos}</div>
    </Card>
  </Aparece>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const pE = useP(g3.at + 20, g3.at + 90, false);
  if (frame < g3.at) {
    return (
      <Stage gap={40}>
        <Aparece at={g1.at}>
          <div
            style={{
              background: "#f5f0e1",
              color: "#1b1b1b",
              borderRadius: 18,
              padding: "24px 50px",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 46,
              rotate: "-2deg",
              boxShadow: "0 18px 40px #0008",
            }}
          >
            ESTACIONAMIENTO · $20 por hora o fracción
          </div>
        </Aparece>
        <div style={{ display: "flex", gap: 60 }}>
          <Reloj min={59} pesos={20} color={C.green} at={g2.at} />
          <Reloj min={61} pesos={40} color={C.coral} at={g2.at + g2.frames * 0.5} />
        </div>
        <Nota>Ejemplo simplificado</Nota>
      </Stage>
    );
  }
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="2 minutos, el *doble* de precio" size={64} align="left" accent={C.coral} delay={g3.at} />
          <Sequence from={g4.at} layout="none">
            <Sticker bg={C.yellow} size={36}>
              Esos brincos tienen nombre
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Plano w={700} h={520} x={[0, 4]} y={[0, 90]} paso={1} pasoY={20} etiquetaX="horas" etiquetaY="pesos">
          {(e) => (
            <>
              <Escalera e={e} p={pE} resaltar={frame >= g3.at + 100} />
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
      idea={<>Límite: a qué valor se acerca f(x), sin llegar</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Formula tex={"\\lim_{\\ent{x} \\to 3} \\dfrac{\\ent{x}^2 - 9}{\\ent{x} - 3} = \\lim_{\\ent{x} \\to 3} \\dfrac{\\reg{\\cancel{(\\ent{x} - 3)}}(\\ent{x} + 3)}{\\reg{\\cancel{\\ent{x} - 3}}}"} size={56} />
          <Formula tex={"= \\lim_{\\ent{x} \\to 3} (\\ent{x} + 3) = \\sal{6}"} size={64} />
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
        { at: o1.at + 10, t: "Decir si una función es continua" },
        { at: o1.at + t, t: "Comprobarlo con 3 condiciones" },
        { at: o1.at + 2 * t, t: "Reconocer los 3 tipos de brinco" },
      ]}
    />
  );
};

/** Lápiz sencillo (punta abajo a la izquierda) que sigue un punto. */
const Lapiz: React.FC<{ x: number; y: number; arriba?: boolean }> = ({ x, y, arriba = false }) => (
  <g transform={`translate(${x}, ${y - (arriba ? 40 : 0)}) rotate(-35)`}>
    <rect x={0} y={-80} width={22} height={80} rx={4} fill={arriba ? C.coral : C.yellow} />
    <polygon points="0,0 22,0 11,22" fill="#f5d0a9" />
    <polygon points="7,15 15,15 11,22" fill="#333" />
  </g>
);

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3, q4] = lineas;
  const frame = useCurrentFrame();
  const pP = useP(q2.at + 5, q2.at + q2.frames - 10, false);
  const pE = useP(q3.at + 5, q3.at + q3.frames - 10, false);
  const parabola = frame < q3.at;
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="¿Qué es la *continuidad*?" size={70} align="left" accent={C.blue} delay={q1.at} />
          <Aparece at={q1.at + 30}>
            <Card accent={C.yellow} style={{ padding: "18px 28px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>Se dibuja sin levantar el lápiz</div>
            </Card>
          </Aparece>
          {frame >= q2.at && (
            <Aparece at={q2.at + 20}>
              <Chip bg={parabola ? C.green : C.coral} color={parabola ? C.bg : C.ink} size={34}>
                {parabola ? "x²: continua ✓" : "escalera: discontinua ✕"}
              </Chip>
            </Aparece>
          )}
          <Sequence from={q4.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={30}>
              Falta algo que se pueda comprobar
            </Sticker>
          </Sequence>
        </>
      }
      right={
        parabola ? (
          <Plano w={680} h={540} x={[-3, 3]} y={[-1, 9]} paso={1} etiquetaY="y">
            {(e) => {
              const xx = -3 + 6 * pP;
              return (
                <>
                  <Curva e={e} f={(x) => x * x} x={[-3, 3]} p={pP} />
                  {frame >= q2.at && <Lapiz x={e.X(xx)} y={e.Y(xx * xx)} />}
                </>
              );
            }}
          </Plano>
        ) : (
          <Plano w={680} h={540} x={[0, 4]} y={[0, 90]} paso={1} pasoY={20} etiquetaX="horas" etiquetaY="pesos">
            {(e) => {
              const pos = 4 * pE;
              const k = Math.min(3, Math.floor(pos));
              const salto = pos - k > 0.88 && k < 3;
              return (
                <>
                  <Escalera e={e} p={pE} />
                  <Lapiz x={e.X(Math.min(pos, 4))} y={e.Y(20 * (k + 1))} arriba={salto} />
                </>
              );
            }}
          </Plano>
        )
      }
    />
  );
};

const Condicion: React.FC<{ at: number; n: number; tex: string; ok?: boolean | null; on: boolean }> = ({ at, n, tex, ok = null, on }) => (
  <Aparece at={at}>
    <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: on ? 1 : 0.5 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          border: `4px solid ${ok ? C.green : C.dim}`,
          background: ok ? C.green : "transparent",
          color: C.bg,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ok ? "✓" : n}
      </div>
      <Formula tex={tex} size={64} />
    </div>
  </Aparece>
);

const Condiciones: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4, c5, c6] = lineas;
  const frame = useCurrentFrame();
  const ejemplo = frame >= c5.at;
  const t = c5.frames / 4;
  const ok = (i: number) => (ejemplo && frame >= c5.at + t * (i + 0.6) ? true : null);
  return (
    <Stage gap={30}>
      <Words text="Continua en *x = a* si:" size={70} accent={C.yellow} delay={c1.at} />
      <Card accent={C.yellow} style={{ display: "flex", flexDirection: "column", gap: 22, padding: "30px 46px" }}>
        <Condicion at={c2.at} n={1} tex={ejemplo ? "f(\\ent{3}) = \\sal{9} \\quad \\text{existe}" : "f(\\ent{a}) \\ \\text{existe}"} ok={ok(0)} on={!ejemplo ? frame < c3.at : true} />
        <Condicion at={c3.at} n={2} tex={ejemplo ? "\\lim_{\\ent{x} \\to 3} \\ent{x}^2 = \\sal{9} \\quad \\text{existe}" : "\\lim_{\\ent{x} \\to \\ent{a}} f(\\ent{x}) \\ \\text{existe}"} ok={ok(1)} on={!ejemplo ? frame >= c3.at && frame < c4.at : true} />
        <Condicion at={c4.at} n={3} tex={ejemplo ? "\\sal{9} = \\sal{9}" : "\\lim_{\\ent{x} \\to \\ent{a}} f(\\ent{x}) = f(\\ent{a})"} ok={ok(2)} on={!ejemplo ? frame >= c4.at : true} />
      </Card>
      <div style={{ height: 70 }}>
        {ejemplo && frame < c6.at && (
          <Aparece at={c5.at}>
            <Chip bg={C.blue} color={C.ink} size={32}>
              Ejemplo: f(x) = x² en x = 3
            </Chip>
          </Aparece>
        )}
        <Sequence from={c6.at} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={34}>
            Si falla una sola → discontinua
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const MiniTipo: React.FC<{ at: number; titulo: string; falla: string; on: boolean; children: (e: Ejes) => React.ReactNode; y: [number, number]; x: [number, number] }> = ({
  at,
  titulo,
  falla,
  on,
  children,
  x,
  y,
}) => (
  <Aparece at={at}>
    <Card accent={on ? C.coral : C.dim} style={{ width: 520, padding: "20px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: on ? 1 : 0.55 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: on ? C.coral : C.ink }}>{titulo}</div>
      <Plano w={380} h={250} x={x} y={y} paso={1} etiquetaY="">
        {children}
      </Plano>
      <div style={{ fontFamily: MONO, fontSize: 24, color: C.ink, textAlign: "center" }}>{falla}</div>
    </Card>
  </Aparece>
);

const Tipos: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2, t3, t4] = lineas;
  const frame = useCurrentFrame();
  const cur = frame >= t4.at ? 2 : frame >= t3.at ? 1 : frame >= t2.at ? 0 : -1;
  return (
    <Stage gap={26}>
      <Words text="3 tipos de *discontinuidad*" size={70} accent={C.coral} delay={t1.at} />
      <div style={{ display: "flex", gap: 26 }}>
        <MiniTipo at={t2.at} titulo="HUECO" falla="falla la 1: f(2) no existe" on={cur === 0} x={[-1, 4]} y={[0, 6]}>
          {(e) => (
            <>
              <Curva e={e} f={(x) => x + 2} x={[-1, 1.9]} ancho={5} />
              <Curva e={e} f={(x) => x + 2} x={[2.1, 4]} ancho={5} />
              <circle cx={e.X(2)} cy={e.Y(4)} r={10} fill={C.bg} stroke={C.yellow} strokeWidth={4} />
            </>
          )}
        </MiniTipo>
        <MiniTipo at={t3.at} titulo="SALTO" falla="falla la 2: −1 ≠ 1" on={cur === 1} x={[-3, 3]} y={[-2, 2]}>
          {(e) => (
            <>
              <line x1={e.X(-3)} y1={e.Y(-1)} x2={e.X(-0.1)} y2={e.Y(-1)} stroke={C.yellow} strokeWidth={5} />
              <line x1={e.X(0.1)} y1={e.Y(1)} x2={e.X(3)} y2={e.Y(1)} stroke={C.yellow} strokeWidth={5} />
              <circle cx={e.X(0)} cy={e.Y(-1)} r={9} fill={C.bg} stroke={C.yellow} strokeWidth={4} />
              <circle cx={e.X(0)} cy={e.Y(1)} r={9} fill={C.bg} stroke={C.yellow} strokeWidth={4} />
            </>
          )}
        </MiniTipo>
        <MiniTipo at={t4.at} titulo="INFINITA" falla="se dispara: 1/x cerca de 0" on={cur === 2} x={[-3, 3]} y={[-4, 4]}>
          {(e) => (
            <>
              <Curva e={e} f={(x) => 1 / x} x={[0.25, 3]} ancho={5} />
              <Curva e={e} f={(x) => 1 / x} x={[-3, -0.25]} ancho={5} />
            </>
          )}
        </MiniTipo>
      </div>
    </Stage>
  );
};

const Reparar: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2, f3] = lineas;
  const frame = useCurrentFrame();
  const tapado = frame >= f2.at + f2.frames * 0.45;
  return (
    <Split
      ratio={0.48}
      left={
        <>
          <Words text="¿Se puede *reparar*?" size={70} align="left" accent={C.green} delay={f1.at} />
          <Aparece at={f2.at + f2.frames * 0.3}>
            <Formula tex={"g(\\ent{x}) = \\begin{cases} \\dfrac{\\ent{x}^2 - 4}{\\ent{x} - 2} & \\ent{x} \\neq 2 \\\\[6pt] \\reg{4} & \\ent{x} = 2 \\end{cases}"} size={52} />
          </Aparece>
          <Sequence from={f2.at + f2.frames * 0.6} layout="none">
            <Chip bg={C.green} size={32}>
              hueco = discontinuidad evitable ✓
            </Chip>
          </Sequence>
          <Aparece at={f3.at}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.coral }}>Salto e infinita: no tienen arreglo ✕</div>
          </Aparece>
        </>
      }
      right={
        <Plano w={640} h={520} x={[-1, 4.5]} y={[0, 7]} paso={1}>
          {(e) => (
            <>
              <Curva e={e} f={(x) => x + 2} x={[-1, 1.93]} />
              <Curva e={e} f={(x) => x + 2} x={[2.07, 4.5]} />
              <circle cx={e.X(2)} cy={e.Y(4)} r={13} fill={tapado ? C.yellow : C.bg} stroke={C.yellow} strokeWidth={5} />
              {tapado && (
                <text x={e.X(2) + 24} y={e.Y(4) + 44} fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.green}>
                  g(2) = 4
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
  const [u1, u2, u3] = lineas;
  const frame = useCurrentFrame();
  const pT = useP(u1.at + 30, u1.at + u1.frames, false);
  // Temperatura entre las 6 y las 14 h (ilustración suave, continua).
  const temp = (h: number) => 10 + 15 * (0.5 - 0.5 * Math.cos((Math.PI * (h - 6)) / 8)) + 1.2 * Math.sin((h - 6) * 1.3);
  // Hora en la que cruza 20 °C (búsqueda simple).
  let cruce = 6;
  for (let h = 6; h <= 14; h += 0.01) {
    if (temp(h) >= 20) {
      cruce = h;
      break;
    }
  }
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="¿Para qué *sirve*?" size={70} align="left" accent={C.blue} delay={u1.at} />
          <Aparece at={u2.at + u2.frames * 0.4}>
            <Card accent={C.green} style={{ padding: "16px 26px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>
                En algún momento hubo <span style={{ color: C.green }}>exactamente 20°</span>
              </div>
            </Card>
          </Aparece>
          <Aparece at={u3.at}>
            <Chip bg={C.yellow} size={32}>
              Teorema del valor intermedio
            </Chip>
          </Aparece>
          <Nota>Ejemplo simplificado</Nota>
        </>
      }
      right={
        <Plano w={680} h={500} x={[6, 14]} y={[0, 30]} paso={2} pasoY={10} etiquetaX="hora" etiquetaY="°C">
          {(e) => (
            <>
              <line x1={e.X(6)} y1={e.Y(20)} x2={e.X(14)} y2={e.Y(20)} stroke={C.green} strokeWidth={3} strokeDasharray="10 8" opacity={frame >= u2.at ? 1 : 0} />
              <Curva e={e} f={temp} x={[6, 14]} p={pT} />
              <circle cx={e.X(6)} cy={e.Y(temp(6))} r={12} fill={COL.entrada} stroke={C.bg} strokeWidth={4} />
              {pT >= 1 && <circle cx={e.X(14)} cy={e.Y(temp(14))} r={12} fill={COL.entrada} stroke={C.bg} strokeWidth={4} />}
              {frame >= u2.at + u2.frames * 0.4 && <circle cx={e.X(cruce)} cy={e.Y(20)} r={15} fill={C.green} stroke={C.bg} strokeWidth={4} />}
            </>
          )}
        </Plano>
      }
    />
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const frame = useCurrentFrame();
  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  return (
    <Stage gap={30}>
      <PlusDatos />
      <Words text="Un *plus*: neuronas artificiales" size={64} accent={C.purple} delay={p1.at} />
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={p1.at + 30}>
          <Card accent={C.coral} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.coral }}>ESCALÓN ✕</div>
            <Plano w={420} h={240} x={[-4, 4]} y={[-0.2, 1.2]} paso={2} etiquetaY="">
              {(e) => (
                <>
                  <line x1={e.X(-4)} y1={e.Y(0)} x2={e.X(-0.05)} y2={e.Y(0)} stroke={C.coral} strokeWidth={6} />
                  <line x1={e.X(0.05)} y1={e.Y(1)} x2={e.X(4)} y2={e.Y(1)} stroke={C.coral} strokeWidth={6} />
                </>
              )}
            </Plano>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>o no cambia nada, o cambia todo</div>
          </Card>
        </Aparece>
        <Aparece at={p2.at + p2.frames * 0.45}>
          <Card accent={C.purple} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.purple }}>SIGMOIDE ✓</div>
            <Plano w={420} h={240} x={[-4, 4]} y={[-0.2, 1.2]} paso={2} etiquetaY="">
              {(e) => <Curva e={e} f={sig} x={[-4, 4]} color={C.purple} />}
            </Plano>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>continua: aprende poco a poco</div>
          </Card>
        </Aparece>
      </div>
      {frame < 0 && null}
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
        <Codigo at={y1.at} texto="f = x**2" dur={10} />
        <Codigo at={y2.at} texto="sp.limit(f, x, 3) == f.subs(x, 3)" dur={26} />
        <Aparece at={y2.at + 36}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>True</div>
        </Aparece>
        <Codigo at={y3.at} texto="((x**2 - 4)/(x - 2)).subs(x, 2)" dur={26} />
        <Aparece at={y3.at + 36}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: C.coral, height: 50 }}>nan</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  const pV = useP(x1.at + 30, x1.at + 90, false);
  return (
    <Split
      ratio={0.45}
      left={
        <>
          <Sticker bg={C.coral} color={C.ink} size={48}>
            ¡CUIDADO!
          </Sticker>
          <Cuidado at={x1.at + 10}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink }}>Continua ≠ suave</div>
            <Formula tex={"f(\\ent{x}) = |\\ent{x}|"} size={72} />
          </Cuidado>
          <Sequence from={x2.at + x2.frames * 0.4} layout="none">
            <Chip bg={C.blue} color={C.ink} size={30}>
              Esto lo veremos en el #4
            </Chip>
          </Sequence>
        </>
      }
      right={
        <Plano w={620} h={480} x={[-3, 3]} y={[-0.5, 3.5]} paso={1} etiquetaY="y">
          {(e) => (
            <>
              <Curva e={e} f={(x) => Math.abs(x)} x={[-3, 3]} p={pV} n={400} />
              {frame >= x2.at && (
                <g>
                  <circle cx={e.X(0)} cy={e.Y(0)} r={30} fill="none" stroke={C.coral} strokeWidth={5} />
                  <text x={e.X(0)} y={e.Y(0) + 76} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.coral}>
                    ⚠ pico
                  </text>
                </g>
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
          <Formula tex={"f(\\ent{x}) = \\dfrac{\\ent{x}^2 - 1}{\\ent{x} - 1} \\quad \\text{en } \\ent{x} = 1"} size={76} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.yellow }}>¿Es continua? ¿Qué tipo de brinco? ¿Qué valor la repara?</div>
        </Card>
      }
      ideas={["Continua: se dibuja sin levantar el lápiz", "3 condiciones: f(a) existe, el límite existe y son iguales", "Hueco (se repara), salto e infinita"]}
    />
  );
};

export const C03 = leerGuion(guion);

export const C03Continuidad: React.FC = () => (
  <VideoLargo
    guion={C03}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={3} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      condiciones: Condiciones,
      tipos: Tipos,
      reparar: Reparar,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={4} titulo="Qué es la *derivada*" sub="El cambio en un solo instante" />,
    }}
  />
);
