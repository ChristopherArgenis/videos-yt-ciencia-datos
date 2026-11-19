import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { Cierre, leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { COL, Cuidado, Formula, Nota, Objetivo, Paso, Plano, RetoResumen, type Ejes } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/e01-entropia.json";

// Video especial de fisicoquímica: cambio de entropía al convertir 1 mol de hielo a −10 °C en vapor a 110 °C.
// Datos de tablas estándar (Atkins, CRC). Cp constante por tramo.

const CP = { hielo: 37.6, agua: 75.3, vapor: 33.6 };
const DH = { fus: 6010, vap: 40700 };
const TK = [263.15, 273.15, 373.15, 383.15];
const DS = [
  CP.hielo * Math.log(TK[1] / TK[0]),
  DH.fus / TK[1],
  CP.agua * Math.log(TK[2] / TK[1]),
  DH.vap / TK[2],
  CP.vapor * Math.log(TK[3] / TK[2]),
];
const TOTAL = DS.reduce((a, b) => a + b, 0);
const NOMBRES = ["Calentar hielo", "Fusión", "Calentar agua", "Vaporización", "Calentar vapor"];
const COLORES = [C.blue, C.green, C.yellow, C.coral, C.purple];
// Calor acumulado (kJ) al final de cada etapa y temperatura (°C) en cada punto de la curva.
const Q = [0, 0.376, 6.386, 13.916, 54.616, 54.952];
const T = [-10, 0, 0, 100, 100, 110];

/** Curva de calentamiento (T vs calor agregado). `on` resalta una etapa (0–4); `hasta` dibuja hasta esa etapa. */
const CurvaCalor: React.FC<{ w?: number; h?: number; on?: number; hasta?: number; etiquetas?: boolean }> = ({
  w = 900,
  h = 460,
  on = -1,
  hasta = 5,
  etiquetas = true,
}) => (
  <Plano w={w} h={h} x={[0, 58]} y={[-20, 120]} paso={10} pasoY={20} etiquetaX="calor (kJ)" etiquetaY="T (°C)">
    {(e: Ejes) => (
      <>
        {[0, 1, 2, 3, 4].map((i) =>
          i < hasta ? (
            <g key={i} opacity={on >= 0 && on !== i ? 0.35 : 1}>
              <line
                x1={e.X(Q[i])}
                y1={e.Y(T[i])}
                x2={e.X(Q[i + 1])}
                y2={e.Y(T[i + 1])}
                stroke={COLORES[i]}
                strokeWidth={on === i ? 12 : 8}
                strokeLinecap="round"
              />
              {etiquetas && (
                <g>
                  <circle cx={e.X((Q[i] + Q[i + 1]) / 2)} cy={e.Y((T[i] + T[i + 1]) / 2) - 34} r={20} fill={COLORES[i]} />
                  <text
                    x={e.X((Q[i] + Q[i + 1]) / 2)}
                    y={e.Y((T[i] + T[i + 1]) / 2) - 25}
                    textAnchor="middle"
                    fontFamily={FONT}
                    fontWeight={900}
                    fontSize={24}
                    fill={C.bg}
                  >
                    {i + 1}
                  </text>
                </g>
              )}
            </g>
          ) : null,
        )}
      </>
    )}
  </Plano>
);

/** Contador "ΔS acumulado" en la esquina. */
const Acumulado: React.FC<{ valor: number; at: number }> = ({ valor, at }) => (
  <div style={{ position: "absolute", right: 140, top: 150 }}>
    <Aparece at={at}>
      <Card accent={C.green} style={{ padding: "12px 24px", textAlign: "right" }}>
        <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>ΔS acumulado</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.green }}>{valor.toFixed(2)} J/K</div>
      </Card>
    </Aparece>
  </div>
);

// ---------- Escenas ----------

/** Vaso con hielo: `p` 0→1 lo derrite (o lo congela si `alReves`). */
const Vaso: React.FC<{ p: number; ok: boolean; titulo: string }> = ({ p, ok, titulo }) => {
  const lado = 110 * (1 - p);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <svg width={300} height={340} viewBox="0 0 300 340">
        <path d="M 40 20 L 70 320 L 230 320 L 260 20" fill={`${C.blue}22`} stroke={C.dim} strokeWidth={6} strokeLinejoin="round" />
        <rect x={66} y={200 - 30 * p} width={168} height={120 + 30 * p} fill={`${C.blue}55`} />
        {lado > 4 && <rect x={150 - lado / 2} y={190 - lado / 2} width={lado} height={lado} rx={14} fill="#dff3ff" stroke="#9fd3f5" strokeWidth={5} />}
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>{titulo}</div>
      <Chip bg={ok ? C.green : C.coral} color={ok ? C.bg : C.ink} size={32}>
        {ok ? "✓ pasa solo" : "✕ nunca pasa"}
      </Chip>
    </div>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const pD = useP(g1.at + 10, g1.at + g1.frames + 20);
  const pC = useP(g2.at + 10, g2.at + 70);
  if (frame >= g4.at) {
    return (
      <Stage gap={30}>
        <Chip bg={C.blue} color={C.ink} size={30}>
          FISICOQUÍMICA · EJERCICIO RESUELTO
        </Chip>
        <Words text="Hielo → *vapor*: ¿cuánto cambia la entropía?" size={74} accent={C.yellow} />
        <Formula tex={"\\Delta S = \\; ?"} size={120} color={C.green} />
      </Stage>
    );
  }
  return (
    <Stage direction="row" gap={120}>
      <Vaso p={pD} ok titulo="Se derrite a 25 °C" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: 520 }}>
        <Aparece at={g2.at + g2.frames * 0.55}>
          <Card accent={C.yellow} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>La energía se conserva en los dos</div>
          </Card>
        </Aparece>
        <Sequence from={g3.at} layout="none">
          <Words text="¿Qué decide la *dirección*?" size={64} accent={C.yellow} />
        </Sequence>
      </div>
      <div style={{ opacity: frame >= g2.at ? 1 : 0 }}>
        <Vaso p={1 - pC} ok={false} titulo="Se congela a 25 °C" />
      </div>
    </Stage>
  );
};

const ObjetivoEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [o1] = lineas;
  const t = o1.frames / 3;
  return (
    <Objetivo
      at={0}
      metas={[
        { at: o1.at + 10, t: "Explicar qué mide la entropía" },
        { at: o1.at + t, t: "Calcular ΔS al calentar y al cambiar de fase" },
        { at: o1.at + 2 * t, t: "Decidir si un proceso es espontáneo" },
      ]}
    />
  );
};

/** Caja con moléculas: `modo` 0 sólido, 1 líquido, 2 gas. */
const Caja: React.FC<{ modo: 0 | 1 | 2; at: number; titulo: string; color: string }> = ({ modo, at, titulo, color }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  const W = 300;
  const pts = Array.from({ length: 16 }, (_, i) => {
    const fx = (i % 4) * 56 + 66;
    const fy = Math.floor(i / 4) * 56 + 66;
    if (modo === 0) return [fx + 3 * Math.sin(t * 9 + i), fy + 3 * Math.cos(t * 8 + i * 2)];
    if (modo === 1) return [fx + 22 * Math.sin(t * 1.3 + i * 1.7), fy + 50 + 14 * Math.cos(t * 1.1 + i)];
    const sx = Math.sin(i * 12.9898) * 43758.5453;
    const sy = Math.sin(i * 78.233) * 12543.123;
    const vx = ((sx - Math.floor(sx)) - 0.5) * 220;
    const vy = ((sy - Math.floor(sy)) - 0.5) * 220;
    const wrap = (v: number) => 20 + ((((v - 20) % (W - 40)) + (W - 40)) % (W - 40));
    return [wrap(fx + vx * t), wrap(fy + vy * t)];
  });
  return (
    <Aparece at={at}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`}>
          <rect x={4} y={4} width={W - 8} height={W - 8} rx={20} fill={`${C.bg2}cc`} stroke={color} strokeWidth={5} />
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={16} fill={color} stroke={C.bg} strokeWidth={3} />
          ))}
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color }}>{titulo}</div>
      </div>
    </Aparece>
  );
};

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3, q4] = lineas;
  const frame = useCurrentFrame();
  if (frame >= q4.at) {
    return (
      <Stage gap={36}>
        <Chip bg={C.yellow} size={32}>
          SEGUNDA LEY DE LA TERMODINÁMICA
        </Chip>
        <Formula tex={"\\Delta S_{\\text{universo}} \\geq 0"} size={140} color={C.green} />
        <Aparece at={q4.at + 50}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink }}>En un proceso espontáneo, la entropía del universo aumenta</div>
        </Aparece>
      </Stage>
    );
  }
  const t = q2.frames / 3;
  return (
    <Stage gap={30}>
      <Words text="¿Qué es la *entropía*?" size={72} accent={C.blue} delay={q1.at} />
      <Aparece at={q1.at + 30}>
        <Card accent={C.yellow} style={{ padding: "14px 30px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>Cuántas formas hay de acomodar las partículas y su energía</div>
        </Card>
      </Aparece>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <Caja modo={0} at={q2.at} titulo="SÓLIDO" color={C.blue} />
        <Caja modo={1} at={q2.at + t} titulo="LÍQUIDO" color={C.green} />
        <Caja modo={2} at={q2.at + 2 * t} titulo="GAS" color={C.coral} />
      </div>
      <Sequence from={q3.at} layout="none">
        <Sticker bg={C.yellow} size={36}>
          S aumenta: sólido → líquido → gas
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const Formulas: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2, f3, f4] = lineas;
  return (
    <Stage gap={22}>
      <Aparece at={f1.at}>
        <Formula tex={"dS = \\dfrac{\\delta q_{\\text{rev}}}{\\ent{T}}"} size={76} />
      </Aparece>
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={f2.at}>
          <Card accent={C.yellow} style={{ width: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.yellow }}>1 · CALENTAR (P constante)</div>
            <Formula tex={"\\delta q = n\\,C_p\\,d\\ent{T}"} size={56} color={C.dim} />
            <Aparece at={f2.at + f2.frames * 0.55}>
              <Formula tex={"\\Delta S = n\\,C_p \\ln\\dfrac{\\ent{T_2}}{\\ent{T_1}}"} size={72} />
            </Aparece>
          </Card>
        </Aparece>
        <Aparece at={f3.at}>
          <Card accent={C.coral} style={{ width: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.coral }}>2 · CAMBIO DE FASE (T constante)</div>
            <Formula tex={"\\Delta S = \\dfrac{n\\,\\Delta H}{\\ent{T}}"} size={72} />
          </Card>
        </Aparece>
      </div>
      <div style={{ height: 70 }}>
        <Sequence from={f4.at} layout="none">
          <Sticker bg={C.yellow} size={40}>
            T SIEMPRE EN KELVIN
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const Dato: React.FC<{ at: number; k: string; v: string; color?: string }> = ({ at, k, v, color = C.ink }) => (
  <Aparece at={at}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 40, fontFamily: MONO, fontSize: 32, padding: "6px 0", borderBottom: `1px solid ${C.dim}22` }}>
      <span style={{ color: C.dim }}>{k}</span>
      <span style={{ color, fontWeight: 700 }}>{v}</span>
    </div>
  </Aparece>
);

const Enunciado: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4] = lineas;
  const t2 = e2.frames / 3;
  const t3 = e3.frames / 2;
  return (
    <Stage gap={26}>
      <Aparece at={e1.at}>
        <Card accent={C.blue} style={{ width: 1500, padding: "24px 40px" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.blue, marginBottom: 8 }}>EJERCICIO</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink, lineHeight: 1.3 }}>
            Calcula ΔS al convertir <span style={{ color: C.yellow }}>18 g (1 mol)</span> de hielo a <span style={{ color: COL.entrada }}>−10 °C</span> en vapor de agua a{" "}
            <span style={{ color: C.coral }}>110 °C</span>, a 1 atm.
          </div>
        </Card>
      </Aparece>
      <Card accent={C.dim} style={{ width: 1100, padding: "18px 40px" }}>
        <Dato at={e2.at + 10} k="Cp hielo" v="37.6 J/(mol·K)" color={C.blue} />
        <Dato at={e2.at + t2} k="Cp agua líquida" v="75.3 J/(mol·K)" color={C.yellow} />
        <Dato at={e2.at + 2 * t2} k="Cp vapor" v="33.6 J/(mol·K)" color={C.purple} />
        <Dato at={e3.at} k="ΔH fusión (0 °C)" v="6.01 kJ/mol" color={C.green} />
        <Dato at={e3.at + t3} k="ΔH vaporización (100 °C)" v="40.7 kJ/mol" color={C.coral} />
      </Card>
      <Sequence from={e4.at} layout="none">
        <Chip bg={C.bg2} color={C.ink} size={28}>
          Supuesto: cada Cp es constante en su tramo
        </Chip>
      </Sequence>
      <Nota>Datos: tablas estándar (Atkins, Química Física · CRC Handbook)</Nota>
    </Stage>
  );
};

const Plan: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3, p4] = lineas;
  const frame = useCurrentFrame();
  const t = p2.frames / 5;
  const hasta = frame < p2.at ? 0 : Math.min(5, 1 + Math.floor((frame - p2.at) / t));
  const conv = [
    ["−10 °C", "263.15 K"],
    ["0 °C", "273.15 K"],
    ["100 °C", "373.15 K"],
    ["110 °C", "383.15 K"],
  ];
  return (
    <Split
      ratio={0.36}
      left={
        <>
          <Words text="El plan: *5 etapas*" size={70} align="left" accent={C.yellow} delay={p1.at} />
          {frame < p4.at ? (
            <>
              {NOMBRES.map((n, i) => (
                <Aparece key={n} at={p2.at + i * t}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        background: COLORES[i],
                        color: C.bg,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                      }}
                    >
                      {i + 1}
                    </span>
                    {n}
                  </div>
                </Aparece>
              ))}
              <Aparece at={p3.at}>
                <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, lineHeight: 1.6 }}>
                  rampas → n·Cp·ln(T₂/T₁)
                  <br />
                  mesetas → ΔH/T
                </div>
              </Aparece>
            </>
          ) : (
            <Card accent={C.yellow} style={{ padding: "18px 30px" }}>
              {conv.map(([c, k], i) => (
                <Aparece key={c} at={p4.at + (i * p4.frames) / 4}>
                  <div style={{ display: "flex", gap: 20, fontFamily: MONO, fontWeight: 700, fontSize: 36 }}>
                    <span style={{ width: 160, textAlign: "right", color: C.dim }}>{c}</span>
                    <span style={{ color: C.dim }}>→</span>
                    <span style={{ color: COL.entrada }}>{k}</span>
                  </div>
                </Aparece>
              ))}
            </Card>
          )}
        </>
      }
      right={<CurvaCalor hasta={hasta} w={860} h={500} />}
    />
  );
};

const Etapa: React.FC<{ on: number; acumulado: number; atAcum: number; children: React.ReactNode }> = ({ on, acumulado, atAcum, children }) => (
  <>
    <Stage gap={26} style={{ alignItems: "flex-start", paddingRight: 620 }}>
      {children}
    </Stage>
    <div style={{ position: "absolute", right: 200, top: 340 }}>
      <CurvaCalor on={on} w={380} h={280} etiquetas={false} />
    </div>
    <Acumulado valor={acumulado} at={atAcum} />
  </>
);

const Etapa1: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3, a4] = lineas;
  const frame = useCurrentFrame();
  const fase = frame >= a3.at;
  return (
    <Etapa on={fase ? 1 : 0} acumulado={fase && frame >= a3.at + a3.frames * 0.7 ? DS[0] + DS[1] : frame >= a2.at + a2.frames * 0.5 ? DS[0] : 0} atAcum={a1.at}>
      {!fase ? (
        <>
          <Chip bg={C.blue} color={C.ink} size={32}>
            ETAPA 1 · calentar el hielo
          </Chip>
          <Paso at={a1.at + 20} n={1} tex={"\\Delta S_1 = (1)(37.6)\\ln\\dfrac{273.15}{263.15}"} on ancho={900} size={64} />
          <Paso at={a2.at} n={2} tex={"= 37.6 \\times 0.0373"} on ancho={900} size={64} />
          <Paso at={a2.at + a2.frames * 0.5} n={3} tex={"\\Delta S_1 = \\sal{1.40 \\ \\text{J/K}}"} on ancho={900} size={72} />
        </>
      ) : (
        <>
          <Chip bg={C.green} size={32}>
            ETAPA 2 · fundir el hielo
          </Chip>
          <Aparece at={a3.at + 10}>
            <Formula tex={"6.01 \\ \\text{kJ} = 6010 \\ \\text{J}"} size={56} color={C.yellow} />
          </Aparece>
          <Paso at={a3.at + a3.frames * 0.45} n={1} tex={"\\Delta S_2 = \\dfrac{6010}{273.15} = \\sal{22.00 \\ \\text{J/K}}"} on ancho={900} size={60} />
          <Sequence from={a4.at} layout="none">
            <Sticker bg={C.green} size={32}>
              Casi 16 veces más que calentar el hielo
            </Sticker>
          </Sequence>
        </>
      )}
    </Etapa>
  );
};

const Etapa3: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3] = lineas;
  const frame = useCurrentFrame();
  return (
    <Etapa on={2} acumulado={frame >= b3.at + b3.frames * 0.4 ? DS[0] + DS[1] + DS[2] : DS[0] + DS[1]} atAcum={0}>
      <Chip bg={C.yellow} size={32}>
        ETAPA 3 · calentar el agua (0 → 100 °C)
      </Chip>
      <Paso at={b2.at} n={1} tex={"\\Delta S_3 = (1)(75.3)\\ln\\dfrac{373.15}{273.15}"} on ancho={900} size={64} />
      <Paso at={b3.at} n={2} tex={"= 75.3 \\times 0.312"} on ancho={900} size={64} />
      <Paso at={b3.at + b3.frames * 0.4} n={3} tex={"\\Delta S_3 = \\sal{23.49 \\ \\text{J/K}}"} on ancho={900} size={72} />
      {frame < b1.at && null}
    </Etapa>
  );
};

const Etapa4: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3] = lineas;
  const frame = useCurrentFrame();
  const cinco = frame >= c3.at;
  const ac = DS[0] + DS[1] + DS[2] + (frame >= c1.at + c1.frames * 0.6 ? DS[3] : 0) + (cinco && frame >= c3.at + c3.frames * 0.6 ? DS[4] : 0);
  return (
    <Etapa on={cinco ? 4 : 3} acumulado={ac} atAcum={0}>
      {!cinco ? (
        <>
          <Chip bg={C.coral} color={C.ink} size={32}>
            ETAPA 4 · hervir el agua
          </Chip>
          <Aparece at={c1.at + 10}>
            <Formula tex={"40.7 \\ \\text{kJ} = 40\\,700 \\ \\text{J}"} size={56} color={C.yellow} />
          </Aparece>
          <Paso at={c1.at + c1.frames * 0.45} n={1} tex={"\\Delta S_4 = \\dfrac{40\\,700}{373.15} = \\sal{109.07 \\ \\text{J/K}}"} on ancho={900} size={56} />
          <Sequence from={c2.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={32}>
              El más grande: el gas tiene todo el espacio
            </Sticker>
          </Sequence>
        </>
      ) : (
        <>
          <Chip bg={C.purple} size={32}>
            ETAPA 5 · calentar el vapor
          </Chip>
          <Paso at={c3.at + 10} n={1} tex={"\\Delta S_5 = (1)(33.6)\\ln\\dfrac{383.15}{373.15}"} on ancho={900} size={64} />
          <Paso at={c3.at + c3.frames * 0.6} n={2} tex={"\\Delta S_5 = \\sal{0.89 \\ \\text{J/K}}"} on ancho={900} size={72} />
        </>
      )}
    </Etapa>
  );
};

const Total: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2, t3, t4] = lineas;
  const frame = useCurrentFrame();
  const pB = useP(t3.at, t3.at + 50);
  if (frame < t3.at) {
    return (
      <Stage gap={36}>
        <Words text="El *resultado*" size={76} accent={C.green} delay={t1.at} />
        <Aparece at={t1.at + 20}>
          <Formula tex={"\\Delta S = 1.40 + 22.00 + 23.49 + 109.07 + 0.89"} size={70} />
        </Aparece>
        <Aparece at={t2.at}>
          <Card accent={C.green} style={{ padding: "16px 50px" }}>
            <Formula tex={"\\Delta S = \\sal{156.86 \\ \\text{J/K}} \\;\\approx\\; 157 \\ \\text{J/K}"} size={90} />
          </Card>
        </Aparece>
      </Stage>
    );
  }
  return (
    <Stage gap={22}>
      <Words text="¿De dónde sale la *entropía*?" size={64} accent={C.coral} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {DS.map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ width: 300, textAlign: "right", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COLORES[i] }}>{NOMBRES[i]}</span>
            <div style={{ width: (v / DS[3]) * 900 * pB, height: 46, background: COLORES[i], borderRadius: 10, minWidth: 6 }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.ink }}>
              {v.toFixed(2)} · {((100 * v) / TOTAL).toFixed(1)} %
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: 70 }}>
        <Sequence from={t4.at} layout="none">
          <Sticker bg={C.green} size={32}>
            ΔS &gt; 0: del estado más ordenado al más disperso
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const Universo: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2, u3, u4] = lineas;
  const frame = useCurrentFrame();
  const reves = frame >= u4.at;
  const s = reves ? -1 : 1;
  const sis = (s * DH.fus) / 273.15;
  const ent = (-s * DH.fus) / 298.15;
  const tarjeta = (at: number, titulo: string, tex: string, res: string, color: string) => (
    <Aparece at={at}>
      <Card accent={color} style={{ width: 520, minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color }}>{titulo}</div>
        {tex && <Formula tex={tex} size={46} />}
        <Formula tex={res} size={62} color={color} />
      </Card>
    </Aparece>
  );
  const f = (v: number) => `${v >= 0 ? "+" : "-"}${Math.abs(v).toFixed(2)}`;
  return (
    <Stage gap={30}>
      <Words text={reves ? "Al revés: *congelarse* a 25 °C" : "¿Por qué el hielo se *derrite solo*?"} size={64} accent={reves ? C.coral : C.green} />
      <div style={{ display: "flex", gap: 26 }}>
        {tarjeta(u1.at + 20, "SISTEMA (hielo, 0 °C)", `\\Delta S = ${reves ? "-" : "+"}\\dfrac{6010}{273.15}`, `${f(sis)} \\ \\text{J/K}`, C.blue)}
        {tarjeta(u2.at + u2.frames * 0.4, "ENTORNO (aire, 25 °C)", `\\Delta S = ${reves ? "+" : "-"}\\dfrac{6010}{298.15}`, `${f(ent)} \\ \\text{J/K}`, C.yellow)}
        {tarjeta(u3.at, "UNIVERSO", `${f(sis)} ${ent >= 0 ? "+" : "-"} ${Math.abs(ent).toFixed(2)}`, `${f(sis + ent)} \\ \\text{J/K}`, reves ? C.coral : C.green)}
      </div>
      <div style={{ height: 80 }}>
        {frame >= u3.at + 40 && (
          <Sticker bg={reves ? C.coral : C.green} color={reves ? C.ink : C.bg} size={40}>
            {reves ? "< 0 → ✕ la Segunda Ley lo prohíbe" : "> 0 → ✓ espontáneo"}
          </Sticker>
        )}
      </div>
      <Nota>Simplificación: solo la fusión a 0 °C, con el entorno a 25 °C</Nota>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1280, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · numpy</span>
        </div>
        <Codigo at={y1.at} texto="cal = lambda Cp, T1, T2: Cp * np.log(T2 / T1)" dur={28} />
        <Codigo at={y2.at} texto="s = cal(37.6, 263.15, 273.15) + 6010 / 273.15" dur={28} />
        <Codigo at={y2.at + 34} texto="s += cal(75.3, 273.15, 373.15) + 40700 / 373.15" dur={28} />
        <Codigo at={y2.at + 68} texto="s += cal(33.6, 373.15, 383.15)" dur={20} />
        <Aparece at={y3.at}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>156.86</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      {frame < x2.at ? (
        <Cuidado at={x1.at + 10}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: C.ink }}>Usar °C en el logaritmo</div>
          <Formula tex={"\\ln\\dfrac{100}{0} \\;\\to\\; \\text{¡división entre cero!}"} size={64} color={C.coral} />
          <Aparece at={x1.at + x1.frames * 0.7}>
            <Chip bg={C.green} size={32}>
              Siempre kelvin: ln(373.15 / 273.15)
            </Chip>
          </Aparece>
        </Cuidado>
      ) : (
        <Cuidado at={x2.at}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: C.ink }}>Mezclar kJ con J</div>
          <Formula tex={"\\dfrac{40.7}{373.15} = 0.109 \\quad \\boldsymbol{\\times}"} size={60} color={C.coral} />
          <Aparece at={x2.at + x2.frames * 0.55} style={{ marginTop: 44 }}>
            <Formula tex={"\\dfrac{40\\,700}{373.15} = 109.07 \\quad \\checkmark"} size={60} color={C.green} />
          </Aparece>
        </Cuidado>
      )}
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2] = lineas;
  const moneda = (at: number, p: number, h: string, color: string) => (
    <Aparece at={at}>
      <Card accent={color} style={{ width: 460, textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color }}>{p === 0.5 ? "MONEDA JUSTA" : "MONEDA CARGADA"}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <div style={{ width: 300 * p, height: 40, background: color, borderRadius: 8 }} />
          <div style={{ width: 300 * (1 - p), height: 40, background: `${color}55`, borderRadius: 8 }} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>
          cara {Math.round(p * 100)} % · cruz {Math.round((1 - p) * 100)} %
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.ink }}>H = {h} {h === "1" ? "bit" : "bits"}</div>
      </Card>
    </Aparece>
  );
  return (
    <Stage gap={30}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: entropía de Shannon" size={64} accent={C.purple} delay={k1.at} />
      <Aparece at={k1.at + 40}>
        <Formula tex={"H = -\\sum_i p_i \\log_2 p_i"} size={80} />
      </Aparece>
      <div style={{ display: "flex", gap: 40 }}>
        {moneda(k2.at, 0.5, "1", C.green)}
        {moneda(k2.at + k2.frames * 0.3, 0.9, "0.47", C.coral)}
      </div>
      <Sequence from={k2.at + k2.frames * 0.65} layout="none">
        <Sticker bg={C.purple} size={30}>
          Árboles de decisión: la pregunta que más baja la entropía
        </Sticker>
      </Sequence>
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
        <Card accent={C.yellow} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, padding: "30px 60px", width: 1300 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink, lineHeight: 1.3 }}>
            ΔS al convertir <span style={{ color: C.yellow }}>1 mol</span> de agua líquida a <span style={{ color: COL.entrada }}>25 °C</span> en vapor a{" "}
            <span style={{ color: C.coral }}>100 °C</span>, a 1 atm
          </div>
          <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim }}>pista: son 2 etapas</div>
        </Card>
      }
      ideas={["Calentar: ΔS = n·Cp·ln(T₂/T₁)", "Cambio de fase: ΔS = n·ΔH/T", "Espontáneo si ΔS del universo > 0"]}
    />
  );
};

const CierreEsp: React.FC<EscenaProps> = (props) => {
  const [, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={C.blue} color={C.ink}>
              FISICOQUÍMICA
            </Chip>
          </Aparece>
          <Words text="¿Más *ejercicios*?" size={110} align="left" accent={C.yellow} delay={6} />
          <Words text="Dime en los comentarios cuál te cuesta más" size={52} weight={700} color={C.dim} align="left" delay={20} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};

export const E01 = leerGuion(guion);

export const E01Entropia: React.FC = () => (
  <VideoLargo
    guion={E01}
    escenas={{
      gancho: Gancho,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      formulas: Formulas,
      enunciado: Enunciado,
      plan: Plan,
      etapa1: Etapa1,
      etapa3: Etapa3,
      etapa4: Etapa4,
      total: Total,
      universo: Universo,
      python: Python,
      error: ErrorComun,
      plus: Plus,
      reto: Reto,
      cierre: CierreEsp,
    }}
  />
);
