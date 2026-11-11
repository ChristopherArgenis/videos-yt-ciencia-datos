import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { CreditoStatsBomb } from "../kit/cancha";
import { Aparece, ARG, Chip, CierreFutbol, Codigo, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/09-scouting.json";
// Generado por scripts/futbol/ep09_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep09.json";

// Fútbol con Datos #9 · Scouting: el gemelo estadístico de Enzo. Datos: StatsBomb Open Data, Mundial 2022.

const ENZO = ARG;
const CRO = "#ff5a5a"; // Croacia: rojo (de su camiseta a cuadros rojos y blancos)
const E = datos.enzo.por90;
const K = datos.kovacic.por90;
const TOP = datos.top;
const ULT = datos.ultimo;

/** Nota abajo a la derecha (el crédito de StatsBomb ocupa la izquierda). */
const Fuente: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", right: 64, bottom: 172, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: 0.9 }}>{children}</div>
);

/** Silueta genérica de jugador (sin rostro). */
const Silueta: React.FC<{ color: string; size?: number; signo?: boolean }> = ({ color, size = 120, signo }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140">
    <circle cx={50} cy={24} r={18} fill={color} />
    <path d="M18 60 Q50 40 82 60 L76 112 L24 112 Z" fill={color} />
    <rect x={28} y={110} width={16} height={28} rx={6} fill={color} />
    <rect x={56} y={110} width={16} height={28} rx={6} fill={color} />
    {signo && (
      <text x={50} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.bg}>
        ?
      </text>
    )}
  </svg>
);

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={34}>
      {frame < g3.at ? (
        <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
          <Aparece at={g1.at}>
            <Card accent={ENZO} style={{ textAlign: "center", width: 620 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: ENZO }}>ENZO FERNÁNDEZ</div>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>Argentina · 21 años</div>
              <div style={{ marginTop: 18, display: "flex", gap: 12, justifyContent: "center" }}>
                <Chip bg={C.dim}>1.er partido: banco</Chip>
              </div>
              <Sequence from={g1.at + 75} layout="none">
                <div style={{ marginTop: 14 }}>
                  <Chip bg={C.yellow}>Mejor jugador joven</Chip>
                </div>
              </Sequence>
            </Card>
          </Aparece>
          <Aparece at={g2.at}>
            <Card accent={C.yellow} style={{ textAlign: "center", width: 560 }}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>Chelsea · enero 2023</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.yellow, lineHeight: 1.05 }}>
                €<Num to={121} start={g2.at + 10} dur={40} />M
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.ink }}>el fichaje más caro del fútbol inglés</div>
            </Card>
          </Aparece>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Aparece key={i} at={g3.at + i * 5}>
                <Silueta color={i === 3 ? C.yellow : `${C.dim}66`} size={150} signo={i === 3} />
              </Aparece>
            ))}
          </div>
          <Words text="¿Había *otro* como él?" size={80} accent={C.yellow} delay={g3.at} />
          <Sequence from={g4.at} layout="none">
            <Sticker bg={C.green} size={36}>
              Hoy lo buscamos con datos
            </Sticker>
          </Sequence>
        </>
      )}
      <Fuente>Fichaje y premio: datos públicos (no StatsBomb)</Fuente>
      <Sfx src="whoosh.wav" at={g3.at} volume={0.3} />
    </Stage>
  );
};

const FilaPerfil: React.FC<{ at: number; k: string; v: number; dec?: number; on?: boolean }> = ({ at, k, v, dec = 0, on }) => (
  <Aparece at={at}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 30,
        fontFamily: FONT,
        padding: "8px 0",
        borderBottom: `1px solid ${C.dim}22`,
      }}
    >
      <span style={{ fontSize: 36, color: on ? C.ink : C.dim, fontWeight: 700 }}>{k}</span>
      <span style={{ fontSize: 54, color: ENZO, fontWeight: 900 }}>
        <Num to={v} start={at} dur={25} dec={dec} />
      </span>
    </div>
  </Aparece>
);

const Perfil: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3, p4, p5] = lineas;
  const frame = useCurrentFrame();
  const d = (p2.frames - 20) / 3;
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="Paso 1: el *perfil*" size={76} align="left" accent={C.green} delay={p1.at} />
          <Aparece at={p1.at + 20}>
            <div style={{ fontFamily: FONT, fontSize: 38, color: C.ink }}>
              ¿Cómo juega <b style={{ color: ENZO }}>Enzo</b>?
            </div>
          </Aparece>
          <Aparece at={p1.at + 30}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>por cada 90 minutos · {datos.enzo.minutos} min jugados</div>
          </Aparece>
          <Sequence from={p5.at} layout="none">
            <Sticker bg={C.yellow} size={34}>
              No es goleador: mueve al equipo
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Card accent={ENZO} style={{ width: 860 }}>
          <FilaPerfil at={p2.at} k="Pases" v={E.pases} on={frame < p3.at} />
          <FilaPerfil at={p2.at + d} k="Pases hacia adelante" v={E.prog} on={frame < p3.at} />
          <FilaPerfil at={p2.at + 2 * d} k="Pases al último tercio" v={E.ult_tercio} on={frame < p3.at} />
          <FilaPerfil at={p3.at} k="Conducciones que avanzan" v={E.cond_prog} dec={1} on={frame >= p3.at && frame < p4.at} />
          <FilaPerfil at={p4.at} k="Presiones" v={E.pres} on={frame >= p4.at} />
          <FilaPerfil at={p4.at + 30} k="Entradas" v={E.entradas} on={frame >= p4.at} />
        </Card>
      }
    />
  );
};

/** Campana normal con la escala del puntaje z. */
const Campana: React.FC<{ p: number; zEnzo: number }> = ({ p, zEnzo }) => {
  const W = 1000;
  const H = 300;
  const x = (z: number) => ((z + 3) / 6) * W;
  const y = (z: number) => H - Math.exp((-z * z) / 2) * (H - 40);
  const pts = Array.from({ length: 121 }, (_, i) => -3 + (6 * i) / 120)
    .filter((z) => z <= -3 + 6 * p + 1e-6)
    .map((z) => `${x(z)},${y(z)}`)
    .join(" ");
  return (
    <svg width={W} height={H + 70} viewBox={`0 0 ${W} ${H + 70}`} style={{ overflow: "visible" }}>
      <line x1={0} y1={H} x2={W} y2={H} stroke={C.dim} strokeWidth={3} />
      <polyline points={pts} fill="none" stroke={C.green} strokeWidth={6} strokeLinejoin="round" />
      {[-2, -1, 0, 1, 2].map((z) => (
        <g key={z} opacity={p}>
          <line x1={x(z)} y1={H} x2={x(z)} y2={H + 14} stroke={C.dim} strokeWidth={3} />
          <text x={x(z)} y={H + 50} textAnchor="middle" fontFamily={MONO} fontSize={30} fill={z === 0 ? C.yellow : C.dim}>
            {z > 0 ? `+${z}` : z}
          </text>
        </g>
      ))}
      {p >= 1 && (
        <g>
          <line x1={x(zEnzo)} y1={y(zEnzo) - 10} x2={x(zEnzo)} y2={H} stroke={ENZO} strokeWidth={5} strokeDasharray="8 6" />
          <circle cx={x(zEnzo)} cy={y(zEnzo)} r={14} fill={ENZO} stroke={C.bg} strokeWidth={4} />
          <text x={x(zEnzo) + 20} y={y(zEnzo) - 18} fontFamily={FONT} fontWeight={900} fontSize={32} fill={ENZO}>
            Enzo en pases: z = +{zEnzo.toFixed(1)}
          </text>
        </g>
      )}
    </svg>
  );
};

const Comparar: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c2b, c3, c4, c5] = lineas;
  const frame = useCurrentFrame();
  const pC = useP(c4.at + 10, c4.at + 60);
  const vals = datos.pases90_grupo;
  const enzoPos = vals.length - datos.rank_pases; // índice en la lista ordenada de menor a mayor
  if (frame >= c4.at) {
    return (
      <Stage gap={30}>
        <Words text="Puntaje *z*" size={84} accent={C.green} />
        <Card accent={C.yellow} style={{ padding: "14px 34px" }}>
          <span style={{ fontFamily: MONO, fontSize: 38, color: C.yellow }}>z = (valor − promedio) ÷ desviación estándar</span>
        </Card>
        <Campana p={pC} zEnzo={datos.enzo.z.pases} />
        <Sequence from={c4.at + 60} layout="none">
          <Sticker bg={C.blue} color={C.ink} size={30}>
            Short: distribución normal y puntaje z
          </Sticker>
        </Sequence>
        <Aparece at={c5.at}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>Todas las estadísticas, en la misma escala</div>
        </Aparece>
      </Stage>
    );
  }
  return (
    <Stage gap={34}>
      <Words text="Paso 2: comparar *justo*" size={76} accent={C.green} delay={c1.at} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: 1240, justifyContent: "center" }}>
        {vals.map((_, i) => (
          <div
            key={i}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: i === 25 ? ENZO : C.green,
              border: `3px solid ${C.bg}`,
              opacity: frame >= c1.at + 20 + i * 1.5 ? 1 : 0,
              scale: i === 25 ? "1.3" : "1",
            }}
          />
        ))}
      </div>
      <Aparece at={c1.at + 20}>
        <div style={{ fontFamily: MONO, fontSize: 28, color: C.dim }}>{datos.grupo} mediocampistas con 270+ minutos</div>
      </Aparece>
      {frame >= c2.at && frame < c2b.at && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, width: 1400, justifyContent: "center" }}>
          {datos.metricas.map((m, i) => (
            <Aparece key={m.k} at={c2.at + i * 4}>
              <Chip bg={C.bg2} color={C.ink} size={24}>
                {m.nombre}
              </Chip>
            </Aparece>
          ))}
        </div>
      )}
      {frame >= c2b.at && frame < c3.at && (
        <Aparece at={c2b.at}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.ink }}>
            Pases por 90: Enzo es el <span style={{ color: ENZO }}>{datos.rank_pases}.º</span> de {datos.grupo}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim, textAlign: "center" }}>
            {vals[enzoPos].toFixed(1)} · el máximo: {vals[vals.length - 1].toFixed(1)}
          </div>
        </Aparece>
      )}
      {frame >= c3.at && (
        <Aparece at={c3.at}>
          <div style={{ display: "flex", gap: 40, alignItems: "center", fontFamily: FONT, fontWeight: 900 }}>
            <span style={{ fontSize: 90, color: ENZO }}>70 pases</span>
            <span style={{ fontSize: 60, color: C.coral }}>≠</span>
            <span style={{ fontSize: 90, color: ENZO }}>3 entradas</span>
          </div>
        </Aparece>
      )}
    </Stage>
  );
};

/** Dos flechas desde el origen; ilustración del ángulo entre vectores. */
const Flechas: React.FC<{ ang: number; frame: number; at: number }> = ({ ang, frame, at }) => {
  const R = 300;
  const base = -25; // grados: la flecha de Enzo
  const punta = (a: number, color: string, label: string) => {
    const r = (a * Math.PI) / 180;
    const x = Math.cos(r) * R;
    const y = -Math.sin(r) * R;
    const r1 = r + 0.12;
    const r2 = r - 0.12;
    return (
      <g>
        <line x1={0} y1={0} x2={x} y2={y} stroke={color} strokeWidth={10} strokeLinecap="round" />
        <polygon points={`${x * 1.08},${y * 1.08} ${Math.cos(r1) * R * 0.95},${-Math.sin(r1) * R * 0.95} ${Math.cos(r2) * R * 0.95},${-Math.sin(r2) * R * 0.95}`} fill={color} />
        <text x={x * 1.25} y={y * 1.25 + 12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={color}>
          {label}
        </text>
      </g>
    );
  };
  const cos = Math.cos(((ang - base) * Math.PI) / 180);
  const a0 = (Math.min(base, ang) * Math.PI) / 180;
  const a1 = (Math.max(base, ang) * Math.PI) / 180;
  const ra = 90;
  const largo = a1 - a0 > Math.PI ? 1 : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width={820} height={760} viewBox="-410 -400 820 760" style={{ opacity: frame >= at ? 1 : 0 }}>
        <circle cx={0} cy={0} r={R} fill="none" stroke={`${C.dim}33`} strokeWidth={2} strokeDasharray="6 8" />
        {Math.abs(ang - base) > 3 && (
          <path
            d={`M ${Math.cos(a0) * ra} ${-Math.sin(a0) * ra} A ${ra} ${ra} 0 ${largo} 0 ${Math.cos(a1) * ra} ${-Math.sin(a1) * ra}`}
            fill="none"
            stroke={C.yellow}
            strokeWidth={5}
          />
        )}
        {punta(ang, C.dim, "Otro")}
        {punta(base, ENZO, "Enzo")}
        <circle cx={0} cy={0} r={10} fill={C.ink} />
      </svg>
      <div style={{ fontFamily: MONO, fontSize: 44, color: C.yellow, fontWeight: 700 }}>similitud = {cos.toFixed(2)}</div>
    </div>
  );
};

const Coseno: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2, k3, k4] = lineas;
  const frame = useCurrentFrame();
  // Diferencia de ángulo con Enzo: k2 de parecido a opuesto; k3 recorre 1 → 0 → −1 con la voz.
  const t = k3.frames / 3;
  const pGiro = useP(k2.at + 20, k2.at + k2.frames - 10);
  const pA = useP(k3.at, k3.at + t * 0.6);
  const pB = useP(k3.at + t, k3.at + t * 1.6);
  const pC = useP(k3.at + 2 * t, k3.at + t * 2.6);
  const ang = -25 + 15 + 165 * pGiro - 180 * pA + 90 * pB + 90 * pC;
  return (
    <Split
      ratio={0.45}
      left={
        <>
          <Words text="Paso 3: similitud *coseno*" size={70} align="left" accent={C.green} delay={k1.at} />
          <Aparece at={k1.at + 30}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink }}>
              12 números → cada jugador es una <b style={{ color: C.yellow }}>flecha</b> (un vector)
            </div>
          </Aparece>
          <Aparece at={k3.at}>
            <div style={{ fontFamily: MONO, fontSize: 32, color: C.ink, lineHeight: 1.6 }}>
              <span style={{ color: C.green }}> 1</span> = idéntico
              <br />
              <span style={{ color: C.yellow }}> 0</span> = nada que ver
              <br />
              <span style={{ color: C.coral }}>−1</span> = opuesto
            </div>
          </Aparece>
          <Sequence from={k1.at + 60} durationInFrames={k4.at - k1.at - 60} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={28}>
              Short: vectores y similitud
            </Sticker>
          </Sequence>
          <Sequence from={k4.at} layout="none">
            <Sticker bg={C.green} size={30}>
              Como las apps de música, pero con jugadores
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <div style={{ position: "relative" }}>
          <Flechas ang={ang} frame={frame} at={k1.at + 20} />
          <div style={{ position: "absolute", top: 0, left: 0, fontFamily: MONO, fontSize: 22, color: C.dim }}>Ilustración en 2D (son 12 dimensiones)</div>
        </div>
      }
    />
  );
};

const Barra: React.FC<{ at: number; n: number; nombre: string; equipo: string; sim: number; color: string; on?: boolean }> = ({
  at,
  n,
  nombre,
  equipo,
  sim,
  color,
  on = true,
}) => {
  const p = useP(at, at + 30);
  const W = 520;
  return (
    <Aparece at={at}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT, opacity: on ? 1 : 0.45 }}>
        <span style={{ width: 50, fontFamily: MONO, fontSize: 30, color: C.dim }}>{n}</span>
        <span style={{ width: 380, fontWeight: 900, fontSize: 42, color }}>
          {nombre} <span style={{ fontSize: 24, color: C.dim, fontWeight: 600 }}>{equipo}</span>
        </span>
        <div style={{ width: W * 2, height: 40, position: "relative" }}>
          <div style={{ position: "absolute", left: W, top: -6, bottom: -6, width: 3, background: C.dim }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              height: 40,
              borderRadius: 8,
              background: color,
              left: sim >= 0 ? W : W + sim * W * p,
              width: Math.abs(sim) * W * p,
            }}
          />
          <span
            style={{
              position: "absolute",
              top: -2,
              left: sim >= 0 ? W + sim * W * p + 14 : W + 14,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 34,
              color,
            }}
          >
            {sim.toFixed(2)}
          </span>
        </div>
      </div>
    </Aparece>
  );
};

const Gemelo: React.FC<EscenaProps> = ({ lineas }) => {
  const [m1, m2, , m3, m4, m5, m6] = lineas;
  const frame = useCurrentFrame();
  const colores = [CRO, C.green, C.green, C.green];
  return (
    <Stage gap={22}>
      <Words text="El gemelo de *Enzo*" size={72} accent={C.yellow} delay={m1.at} />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {TOP.map((t, i) => (
          <Barra
            key={t.nombre}
            at={i === 0 ? m2.at + 40 : m3.at + (i - 1) * 25}
            n={i + 1}
            nombre={t.nombre}
            equipo={t.equipo}
            sim={t.sim}
            color={colores[i]}
            on={frame < m4.at || i === 0}
          />
        ))}
        <Aparece at={m4.at}>
          <div style={{ fontFamily: MONO, fontSize: 28, color: C.dim, paddingLeft: 70 }}>⋮</div>
        </Aparece>
        <Barra at={m4.at + 10} n={datos.grupo - 1} nombre={ULT.nombre} equipo={ULT.equipo} sim={ULT.sim} color={C.coral} />
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", height: 70 }}>
        <Sequence from={m5.at} durationInFrames={m6.at - m5.at} layout="none">
          <Sticker bg={CRO} color={C.ink} size={30}>
            Croacia: semifinalista
          </Sticker>
        </Sequence>
        <Sequence from={m6.at} layout="none">
          <Sticker bg={C.yellow} size={30}>
            Kovačić ya jugaba en el Chelsea
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const FILAS_K: { k: keyof typeof E; n: string; dec: number }[] = [
  { k: "pases", n: "Pases", dec: 0 },
  { k: "prog", n: "Hacia adelante", dec: 1 },
  { k: "ult_tercio", n: "Al último tercio", dec: 1 },
  { k: "cond_prog", n: "Conducciones", dec: 1 },
  { k: "pres", n: "Presiones", dec: 0 },
  { k: "entradas", n: "Entradas", dec: 1 },
];

const Kovacic: React.FC<EscenaProps> = ({ lineas }) => {
  const [v1, v1b, v2, v3, v3b, v4] = lineas;
  const frame = useCurrentFrame();
  const p = useP(v1.at + 10, v1.at + 50);
  const resaltar: string[] =
    frame >= v4.at ? [] : frame >= v3b.at ? ["entradas"] : frame >= v3.at ? ["ult_tercio", "cond_prog", "pres"] : frame >= v2.at ? ["pases"] : [];
  return (
    <Stage gap={20}>
      <div style={{ display: "flex", gap: 60, fontFamily: FONT, fontWeight: 900, fontSize: 52, alignItems: "baseline" }}>
        <span style={{ color: ENZO }}>■ Enzo</span>
        <span style={{ fontSize: 30, color: C.dim }}>por 90 min</span>
        <span style={{ color: CRO }}>■ Kovačić</span>
      </div>
      <Aparece at={v1b.at}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>
          {datos.enzo.minutos} min · {datos.kovacic.minutos} min
        </div>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FILAS_K.map((f) => {
          const max = Math.max(E[f.k], K[f.k]);
          const on = resaltar.includes(f.k);
          return (
            <div key={f.k} style={{ display: "flex", alignItems: "center", gap: 20, opacity: resaltar.length && !on ? 0.4 : 1 }}>
              <span style={{ width: 310, textAlign: "right", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: on ? C.yellow : C.ink }}>{f.n}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { v: E[f.k], c: ENZO },
                  { v: K[f.k], c: CRO },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: (b.v / max) * 900 * p, height: 28, background: b.c, borderRadius: 8 }} />
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: b.c }}>{(b.v * p).toFixed(f.dec)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 70 }}>
        <Sequence from={v4.at} layout="none">
          <Sticker bg={C.green} size={32}>
            El mismo perfil, con matices
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const Limites: React.FC<EscenaProps> = ({ lineas }) => {
  const [l1, l2, l2b, l3, l4] = lineas;
  const frame = useCurrentFrame();
  const cosas = ["Edad", "Precio", "Lesiones", "Idioma", "Carácter"];
  const embudo = [
    { t: `${datos.grupo} jugadores`, w: 900, c: C.green },
    { t: "datos → lista corta de 4", w: 640, c: C.yellow },
    { t: "scouts y video", w: 420, c: C.blue },
    { t: "fichaje", w: 240, c: C.coral },
  ];
  return (
    <Stage gap={30}>
      <Words text="Lo que los datos *no ven*" size={76} accent={C.coral} delay={l1.at} />
      {frame < l3.at ? (
        <>
          <div style={{ display: "flex", gap: 18 }}>
            {cosas.map((c, i) => (
              <Aparece key={c} at={l2.at + i * 12}>
                <Chip bg={C.bg2} color={C.ink} size={36}>
                  ✕ {c}
                </Chip>
              </Aparece>
            ))}
          </div>
          <Aparece at={l2b.at}>
            <div style={{ display: "flex", gap: 40 }}>
              <Card accent={CRO} style={{ textAlign: "center", padding: "20px 40px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: CRO }}>Kovačić</div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.ink }}>28 años</div>
              </Card>
              <Card accent={ENZO} style={{ textAlign: "center", padding: "20px 40px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: ENZO }}>Enzo</div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.ink }}>21 años</div>
              </Card>
            </div>
          </Aparece>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {embudo.map((e, i) => (
            <Aparece key={e.t} at={l3.at + i * (i < 2 ? 25 : 0) + (i >= 2 ? l4.at - l3.at + (i - 2) * 25 : 0)}>
              <div
                style={{
                  width: e.w,
                  padding: "14px 0",
                  textAlign: "center",
                  background: `${e.c}33`,
                  border: `3px solid ${e.c}`,
                  borderRadius: 16,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 36,
                  color: C.ink,
                }}
              >
                {e.t}
              </div>
            </Aparece>
          ))}
          <Sequence from={l4.at + 60} layout="none">
            <div style={{ marginTop: 16 }}>
              <Sticker bg={C.yellow} size={34}>
                Los datos encuentran. Los ojos deciden.
              </Sticker>
            </div>
          </Sequence>
        </div>
      )}
      <Fuente>Edades: datos públicos (no StatsBomb)</Fuente>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  const frame = useCurrentFrame();
  const res = [{ nombre: "Enzo", sim: 1 }, ...TOP];
  return (
    <Stage gap={30}>
      <div style={{ width: 1280, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · pandas + scikit-learn · X = tabla por 90</span>
        </div>
        <Codigo at={y1.at} texto="z = (X - X.mean()) / X.std()" dur={24} />
        <Codigo at={y2.at} texto={'sim = cosine_similarity(z, z.loc[["Enzo Fernandez"]])'} dur={36} />
        <Codigo at={y2.at + 50} texto="pd.Series(sim[:, 0], index=z.index).nlargest(5)" dur={32} />
      </div>
      <div style={{ display: "flex", gap: 22, opacity: frame >= y2.at + 90 ? 1 : 0.1 }}>
        {res.map((r, i) => (
          <div key={r.nombre} style={{ fontFamily: MONO, fontSize: 30, color: i === 0 ? ENZO : i === 1 ? CRO : C.ink, background: C.bg2, borderRadius: 12, padding: "8px 18px" }}>
            {r.nombre} {r.sim.toFixed(2)}
          </div>
        ))}
      </div>
      <Sequence from={y3.at} layout="none">
        <Sticker bg={C.green} size={30}>
          Cambia el nombre → el gemelo de cualquiera
        </Sticker>
      </Sequence>
    </Stage>
  );
};

export const V09 = leerGuion(guion);

export const V09Scouting: React.FC = () => (
  <VideoLargo
    guion={V09}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={9} />,
      perfil: Perfil,
      comparar: Comparar,
      coseno: Coseno,
      gemelo: Gemelo,
      kovacic: Kovacic,
      limites: Limites,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={10} titulo="La final, con *datos*" sub="El último episodio de la serie" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);
