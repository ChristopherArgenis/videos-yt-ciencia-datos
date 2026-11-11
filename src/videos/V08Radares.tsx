import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { CreditoStatsBomb } from "../kit/cancha";
import { Aparece, ARG, Chip, CierreFutbol, Codigo, FRA, FRA_TEXTO, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/08-radares.json";
// Generado por scripts/futbol/ep08_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep08.json";

// Fútbol con Datos #8 · Radares: Julián Álvarez vs Giroud. Datos: StatsBomb Open Data, Mundial 2022.

type Clave = "goles" | "npxg" | "tiros" | "area" | "cabeza" | "pres" | "kp" | "xa";
const MET = datos.metricas as { k: Clave; nombre: string }[];
const J = datos.julian;
const G = datos.giroud;
const JUL = ARG;
const GIR = FRA_TEXTO;

type Serie = { pct: Record<Clave, number>; color: string; p: number; relleno?: string };

/** Radar de percentiles (0–100). `ejes` = cuántos ejes se ven (para dibujarlos uno por uno). */
export const Radar: React.FC<{ series: Serie[]; size: number; ejes?: number; resaltar?: Clave[]; etiquetas?: boolean }> = ({
  series,
  size,
  ejes = MET.length,
  resaltar = [],
  etiquetas = true,
}) => {
  const n = MET.length;
  const r0 = size * 0.36;
  const ang = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const pt = (i: number, v: number) => [Math.cos(ang(i)) * r0 * (v / 100), Math.sin(ang(i)) * r0 * (v / 100)];
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ overflow: "visible" }}>
      {[25, 50, 75, 100].map((v) => (
        <polygon
          key={v}
          points={MET.map((_, i) => pt(i, v).join(",")).join(" ")}
          fill="none"
          stroke={v === 50 ? `${C.yellow}88` : `${C.dim}44`}
          strokeWidth={v === 50 ? 2 : 1.5}
          strokeDasharray={v === 50 ? "6 5" : undefined}
        />
      ))}
      {MET.map((m, i) => {
        if (i >= ejes) return null;
        const [x, y] = pt(i, 100);
        const [lx, ly] = pt(i, 122);
        const on = resaltar.includes(m.k);
        return (
          <g key={m.k}>
            <line x1={0} y1={0} x2={x} y2={y} stroke={on ? C.yellow : `${C.dim}66`} strokeWidth={on ? 3 : 1.5} />
            {etiquetas && (
              <text
                x={lx}
                y={ly + 8}
                textAnchor={Math.abs(lx) < 20 ? "middle" : lx > 0 ? "start" : "end"}
                fontFamily={FONT}
                fontWeight={800}
                fontSize={size * 0.034}
                fill={on ? C.yellow : C.ink}
              >
                {m.nombre}
              </text>
            )}
          </g>
        );
      })}
      {series.map((s, k) =>
        s.p > 0 ? (
          <polygon
            key={k}
            points={MET.map((m, i) => pt(i, s.pct[m.k] * s.p).join(",")).join(" ")}
            fill={s.relleno ?? `${s.color}55`}
            stroke={s.color}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        ) : null,
      )}
    </svg>
  );
};

const Tarjeta: React.FC<{ nombre: string; equipo: string; color: string; at: number }> = ({ nombre, equipo, color, at }) => (
  <Aparece at={at}>
    <Card accent={color} style={{ textAlign: "center", width: 520 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color }}>{nombre}</div>
      <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>{equipo}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.yellow, lineHeight: 1.1 }}>4 goles</div>
    </Card>
  </Aparece>
);

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [, g2, g3, g3b, g4] = lineas;
  const pR = useP(g3.at, g3.at + 40);
  return (
    <Stage gap={20}>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Tarjeta nombre="JULIÁN ÁLVAREZ" equipo="Argentina" color={JUL} at={g2.at} />
          <Sequence from={g3b.at} layout="none">
            <Chip bg={JUL}>Persigue a los defensas</Chip>
          </Sequence>
        </div>
        <Sequence from={g3.at} layout="none">
          <div style={{ display: "flex", gap: 10 }}>
            <Radar series={[{ pct: J.pct, color: JUL, p: pR }]} size={300} etiquetas={false} />
            <Radar series={[{ pct: G.pct, color: GIR, p: pR, relleno: `${FRA}aa` }]} size={300} etiquetas={false} />
          </div>
        </Sequence>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Tarjeta nombre="OLIVIER GIROUD" equipo="Francia" color={GIR} at={g2.at + 30} />
          <Sequence from={g3b.at} layout="none">
            <Chip bg={FRA} color={C.ink}>
              Vive en el área
            </Chip>
          </Sequence>
        </div>
      </div>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={34}>
          Hoy: comparar jugadores como un analista
        </Sticker>
      </Sequence>
      <Sfx src="whoosh.wav" at={g3.at} volume={0.3} />
    </Stage>
  );
};

const Por90: React.FC<EscenaProps> = ({ lineas }) => {
  const [, n2, n3, n3b, n4, n5] = lineas;
  const p = useP(n2.at, n2.at + 35);
  const filas = [
    { n: "Julián", m: J.minutos, c: JUL },
    { n: "Giroud", m: G.minutos, c: GIR },
  ];
  return (
    <Stage gap={24}>
      <Words text="Primero: por cada *90 minutos*" size={64} accent={C.green} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 1100 }}>
        {filas.map((f) => (
          <Aparece key={f.n} at={n2.at}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT }}>
              <span style={{ width: 200, fontWeight: 900, fontSize: 40, color: f.c }}>{f.n}</span>
              <div style={{ flex: 1, height: 34, background: C.bg2, borderRadius: 17 }}>
                <div style={{ width: `${(f.m / 500) * 100 * p}%`, height: "100%", background: f.c === GIR ? FRA : f.c, borderRadius: 17 }} />
              </div>
              <span style={{ width: 220, fontWeight: 900, fontSize: 40, color: C.ink, whiteSpace: "nowrap" }}>{Math.round(f.m * p)} min</span>
            </div>
          </Aparece>
        ))}
      </div>
      <Aparece at={n3.at}>
        <Card accent={C.yellow} style={{ padding: "14px 30px" }}>
          <span style={{ fontFamily: MONO, fontSize: 40, color: C.yellow }}>valor ÷ minutos × 90</span>
        </Card>
      </Aparece>
      <Sequence from={n3b.at} durationInFrames={n4.at - n3b.at} layout="none">
        <Sticker bg={C.coral} color={C.ink} size={30}>
          Si no, el que jugó más parece mejor
        </Sticker>
      </Sequence>
      <Aparece at={n4.at}>
        <div style={{ display: "flex", gap: 80, fontFamily: FONT, fontWeight: 900, alignItems: "baseline" }}>
          <span style={{ fontSize: 30, color: C.dim }}>Goles por 90:</span>
          <span style={{ fontSize: 80, color: GIR }}>Giroud {G.por90.goles.toFixed(2)}</span>
          <span style={{ fontSize: 80, color: JUL }}>Julián {J.por90.goles.toFixed(2)}</span>
        </div>
      </Aparece>
      <Aparece at={n5.at}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>…y lo mismo para tiros, presiones, pases…</div>
      </Aparece>
    </Stage>
  );
};

const Percentil: React.FC<EscenaProps> = ({ lineas }) => {
  const [, p2, p3, p3b, p4] = lineas;
  const frame = useCurrentFrame();
  const vals = datos.goles90_grupo;
  const W = 1400;
  const max = Math.max(...vals);
  const x = (v: number) => (v / max) * W;
  const jv = J.por90.goles;
  const debajo = vals.filter((v) => v <= jv).length;
  return (
    <Stage gap={30}>
      <Words text="Después: *percentiles*" size={70} accent={C.yellow} />
      <Aparece at={p2.at}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
          Los {datos.grupo} delanteros centro con 270+ minutos · goles por 90
        </div>
      </Aparece>
      <svg width={W + 60} height={200} viewBox={`-30 -90 ${W + 60} 200`}>
        <line x1={0} y1={0} x2={W} y2={0} stroke={C.dim} strokeWidth={3} />
        {vals.map((v, i) => {
          const on = frame >= p3b.at && v <= jv;
          return (
            <circle key={i} cx={x(v)} cy={0} r={frame >= p2.at + i * 3 ? 14 : 0} fill={on ? JUL : C.green} stroke="#0b1020" strokeWidth={3} opacity={frame >= p3b.at && !on ? 0.4 : 1} />
          );
        })}
        {frame >= p3b.at && (
          <g>
            <line x1={x(jv)} y1={-20} x2={x(jv)} y2={-60} stroke={JUL} strokeWidth={4} />
            <text x={x(jv)} y={-70} textAnchor={x(jv) > W * 0.6 ? "end" : "middle"} fontFamily={FONT} fontWeight={900} fontSize={32} fill={JUL}>
              Julián · {debajo} de {vals.length} → percentil {J.pct.goles}
            </text>
          </g>
        )}
        {frame >= p4.at && (
          <g>
            <line x1={(x(vals[9]) + x(vals[10])) / 2} y1={20} x2={(x(vals[9]) + x(vals[10])) / 2} y2={60} stroke={C.yellow} strokeWidth={4} />
            <text x={(x(vals[9]) + x(vals[10])) / 2} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.yellow}>
              percentil 50 = mediana
            </text>
          </g>
        )}
      </svg>
      <Aparece at={p3.at}>
        <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink }}>
          Percentil = % de delanteros que están <b style={{ color: C.yellow }}>por debajo o igual</b>
        </div>
      </Aparece>
      <Sequence from={p4.at + 30} layout="none">
        <Sticker bg={C.blue} color={C.ink} size={30}>
          Short: promedio vs mediana
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const Leer: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3, , a5] = lineas;
  const frame = useCurrentFrame();
  const ejes = frame < a3.at ? 0 : Math.min(MET.length, Math.floor((frame - a3.at) / ((a3.frames - 10) / MET.length)) + 1);
  return (
    <Split
      ratio={0.36}
      left={
        <>
          <Words text="Cómo leer un *radar*" size={66} align="left" accent={C.green} delay={a1.at} />
          <Aparece at={a2.at}>
            <div style={{ fontFamily: FONT, fontSize: 36, color: C.ink, lineHeight: 1.35 }}>
              Cada eje, una estadística. <b style={{ color: C.yellow }}>Más lejos del centro = mejor.</b>
            </div>
          </Aparece>
          <Aparece at={a2.at + 30}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>anillos: percentil 25 · 50 · 75 · 100</div>
          </Aparece>
          <Sequence from={a5.at} layout="none">
            <Sticker bg={C.yellow} size={30}>
              Redondo = completo · Con picos = especialista
            </Sticker>
          </Sequence>
        </>
      }
      right={<Radar series={[]} size={760} ejes={frame >= a1.at && frame < a3.at ? MET.length : ejes} />}
    />
  );
};

const Jugador: React.FC<{
  lineas: EscenaProps["lineas"];
  d: typeof J;
  color: string;
  titulo: string;
  sub: string;
  pasos: { at: number; k: Clave[]; t: React.ReactNode }[];
}> = ({ lineas, d, color, titulo, sub, pasos }) => {
  const frame = useCurrentFrame();
  const p = useP(lineas[0].at + 10, lineas[0].at + 50);
  const actual = [...pasos].reverse().find((x) => frame >= x.at);
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color, lineHeight: 1 }}>{titulo}</div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{sub}</div>
          {pasos.map((x) => (
            <Aparece key={x.at} at={x.at}>
              <div style={{ fontFamily: FONT, fontSize: 32, color: actual === x ? C.ink : C.dim, lineHeight: 1.3 }}>{x.t}</div>
            </Aparece>
          ))}
        </>
      }
      right={<Radar series={[{ pct: d.pct, color, p, relleno: color === GIR ? `${FRA}aa` : undefined }]} size={720} resaltar={actual?.k ?? []} />}
    />
  );
};

const Giroud: React.FC<EscenaProps> = ({ lineas }) => {
  const [, o2, o3, o4, o5] = lineas;
  return (
    <Jugador
      lineas={lineas}
      d={G}
      color={GIR}
      titulo="GIROUD"
      sub={`Francia · ${G.minutos} min`}
      pasos={[
        { at: o2.at, k: ["area", "tiros"], t: <>~{G.por90.area.toFixed(1)} balones en el área por partido · {G.total.tiros} tiros</> },
        { at: o3.at, k: ["cabeza"], t: <>{G.total.cabeza} cabezazos · <b style={{ color: C.yellow }}>percentil {G.pct.cabeza}</b></> },
        { at: o4.at, k: ["npxg"], t: <>xG sin penales {G.total.npxg.toFixed(1)} · percentil {G.pct.npxg}</> },
        { at: o5.at, k: ["pres"], t: <>Presiones: percentil {G.pct.pres} (a la mitad)</> },
      ]}
    />
  );
};

const Julian: React.FC<EscenaProps> = ({ lineas }) => {
  const [, j2, j3, j3b] = lineas;
  return (
    <Jugador
      lineas={lineas}
      d={J}
      color={JUL}
      titulo="JULIÁN ÁLVAREZ"
      sub={`Argentina · ${J.minutos} min`}
      pasos={[
        { at: j2.at, k: ["pres"], t: <>{J.total.pres} presiones (~{Math.round(J.por90.pres)} por partido) · <b style={{ color: C.yellow }}>percentil {J.pct.pres}</b></> },
        { at: j3.at, k: ["goles", "npxg"], t: <>{J.total.goles} goles con {J.total.tiros} tiros y xG {J.total.npxg.toFixed(1)}: más del doble</> },
        { at: j3b.at, k: ["tiros", "area"], t: <>Tiros: percentil {J.pct.tiros} · Área: percentil {J.pct.area}</> },
      ]}
    />
  );
};

const Cara: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4, c4b, c5] = lineas;
  const frame = useCurrentFrame();
  const pJ = useP(c1.at + 10, c1.at + 40);
  const pG = useP(c1.at + 30, c1.at + 60);
  const resaltar: Clave[] = frame >= c4.at ? [] : frame >= c3.at ? ["pres", "goles"] : frame >= c2.at ? ["tiros", "area", "cabeza"] : [];
  return (
    <Split
      ratio={0.36}
      left={
        <>
          <div style={{ display: "flex", gap: 20, fontFamily: FONT, fontWeight: 900, fontSize: 44 }}>
            <span style={{ color: JUL }}>■ Julián</span>
            <span style={{ color: GIR }}>■ Giroud</span>
          </div>
          <Aparece at={c2.at}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink }}>
              <b style={{ color: GIR }}>Giroud</b> gana en el área: tiros, balones y cabezazos
            </div>
          </Aparece>
          <Aparece at={c3.at}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink }}>
              <b style={{ color: JUL }}>Julián</b> gana en presión y eficacia
            </div>
          </Aparece>
          <Sequence from={c4.at} layout="none">
            <Sticker bg={C.yellow} size={30}>
              No da un ganador: muestra el estilo
            </Sticker>
          </Sequence>
          <Aparece at={c4b.at}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim, lineHeight: 1.5 }}>
              ¿Centras mucho? → Giroud
              <br />
              ¿Presionas arriba? → Julián
            </div>
          </Aparece>
          <Sequence from={c5.at} layout="none">
            <Sticker bg={C.green} size={30} rotate={2}>
              Los clubes fichan perfiles
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Radar
          series={[
            { pct: G.pct, color: GIR, p: pG, relleno: `${FRA}aa` },
            { pct: J.pct, color: JUL, p: pJ },
          ]}
          size={740}
          resaltar={resaltar}
        />
      }
    />
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y2b] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage direction="row" gap={40}>
      <div style={{ width: 1000, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · mplsoccer</span>
        </div>
        <Codigo at={y1.at} texto="from mplsoccer import Radar" dur={20} />
        <Codigo at={y2.at} texto="radar = Radar(params, minimos, maximos)" dur={28} />
        <Codigo at={y2.at + 40} texto="fig, ax = radar.setup_axis()" dur={24} />
        <Codigo at={y2b.at + 30} texto="radar.draw_radar_compare(julian, giroud, ax=ax)" dur={30} />
      </div>
      <div style={{ opacity: frame >= y2b.at + 60 ? 1 : 0.15 }}>
        <Radar
          series={[
            { pct: G.pct, color: GIR, p: 1, relleno: `${FRA}aa` },
            { pct: J.pct, color: JUL, p: 1 },
          ]}
          size={520}
          etiquetas={false}
        />
      </div>
    </Stage>
  );
};

export const V08 = leerGuion(guion);

export const V08Radares: React.FC = () => (
  <VideoLargo
    guion={V08}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={8} />,
      por90: Por90,
      percentil: Percentil,
      leer: Leer,
      giroud: Giroud,
      julian: Julian,
      cara: Cara,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={9} titulo="Scouting con *datos*" sub="Fichar sin ver un solo partido" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);
