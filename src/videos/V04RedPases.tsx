import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Cancha, CreditoStatsBomb } from "../kit/cancha";
import { Aparece, ARG, Chip, CierreFutbol, Codigo, FRA, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/04-red-pases.json";
// Generado por scripts/futbol/ep04_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep04.json";

// Fútbol con Datos #4 · Redes de pases. Datos: StatsBomb Open Data, final del Mundial 2022.

type RedDatos = typeof datos.argentina;

/** Red de pases sobre la cancha. Las coordenadas son las de StatsBomb (cada equipo ataca a la derecha). */
export const Red: React.FC<{
  red: RedDatos;
  width: number;
  color: string;
  nodos?: number;
  lineas?: number;
  tamano?: number;
  cancha?: number;
  resaltar?: string[];
  par?: [string, string];
  borroso?: boolean;
}> = ({ red, width, color, nodos = 1, lineas = 1, tamano = 1, cancha = 1, resaltar = [], par, borroso = false }) => {
  const alto = (width * 86) / 126;
  const pos = Object.fromEntries(red.nodos.map((n) => [n.nombre, n]));
  return (
    <div style={{ position: "relative", width, height: alto, filter: borroso ? "blur(7px)" : undefined }}>
      <div style={{ position: "absolute", inset: 0, opacity: cancha }}>
        <Cancha width={width} />
      </div>
      <svg width={width} height={alto} viewBox="-3 -3 126 86" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {red.lineas.map((l, i) => {
          const a = pos[l.a];
          const b = pos[l.b];
          if (!a || !b) return null;
          const p = Math.max(0, Math.min(1, lineas * red.lineas.length - i * 0.6));
          const es = par && ((par[0] === l.a && par[1] === l.b) || (par[0] === l.b && par[1] === l.a));
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={a.x + (b.x - a.x) * p}
              y2={a.y + (b.y - a.y) * p}
              stroke={es ? C.yellow : color}
              strokeWidth={0.25 + l.n * 0.11}
              strokeLinecap="round"
              opacity={es ? 1 : par ? 0.25 : 0.6}
            />
          );
        })}
        {red.nodos.map((n, i) => {
          const p = Math.max(0, Math.min(1, nodos * red.nodos.length - i * 0.7));
          if (p <= 0) return null;
          const r = (2.4 + (1.3 + Math.sqrt(n.pases) * 0.55 - 2.4) * tamano) * p;
          const on = resaltar.includes(n.nombre);
          const apagado = resaltar.length > 0 && !on;
          return (
            <g key={n.nombre} opacity={apagado ? 0.35 : 1}>
              {on && <circle cx={n.x} cy={n.y} r={r + 1.6} fill="none" stroke={C.yellow} strokeWidth={0.7} />}
              <circle cx={n.x} cy={n.y} r={r} fill={color} stroke="#0b1020" strokeWidth={0.5} />
            </g>
          );
        })}
        {red.nodos.map((n, i) => {
          const p = Math.max(0, Math.min(1, nodos * red.nodos.length - i * 0.7));
          if (p <= 0) return null;
          const r = (2.4 + (1.3 + Math.sqrt(n.pases) * 0.55 - 2.4) * tamano) * p;
          const apagado = resaltar.length > 0 && !resaltar.includes(n.nombre);
          return (
            <text
              key={`t${n.nombre}`}
              x={n.x}
              y={n.y + r + 3.2}
              textAnchor="middle"
              fontFamily={FONT}
              fontWeight={800}
              fontSize={2.7}
              fill="#fff"
              stroke="#0b1020"
              strokeWidth={0.6}
              paintOrder="stroke"
              opacity={apagado ? 0.45 : 1}
            >
              {n.nombre}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const nodo = (red: RedDatos, nombre: string) => red.nodos.find((n) => n.nombre === nombre)!;

/** Texto que cambia según la frase: muestra el último cuyo `at` ya pasó. */
const Segun: React.FC<{ pasos: { at: number; t: React.ReactNode }[] }> = ({ pasos }) => {
  const frame = useCurrentFrame();
  const vis = pasos.filter((p) => frame >= p.at);
  const ult = vis[vis.length - 1];
  if (!ult) return null;
  return (
    <Aparece at={ult.at} key={ult.at}>
      <Card accent={C.yellow} style={{ padding: "16px 24px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, lineHeight: 1.3 }}>{ult.t}</div>
      </Card>
    </Aparece>
  );
};

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  return (
    <Stage gap={26}>
      <Aparece at={g1.at}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: FONT, fontWeight: 900, fontSize: 64 }}>
          <span style={{ color: ARG }}>ARGENTINA</span>
          <span style={{ color: C.ink }}>2 – 0</span>
          <span style={{ color: FRA }}>FRANCIA</span>
          <Chip bg={C.yellow}>41&apos;</Chip>
        </div>
      </Aparece>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {["Giroud", "Dembélé"].map((n, i) => (
            <Aparece key={n} at={g2.at + i * 15}>
              <Card accent={FRA} style={{ padding: "14px 28px", display: "flex", gap: 18, alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.coral }}>↓</span>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.ink }}>{n}</span>
              </Card>
            </Aparece>
          ))}
        </div>
        <Sequence from={g3.at} layout="none">
          <div style={{ position: "relative" }}>
            <Red red={datos.francia_antes} width={900} color={FRA} borroso />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 220, color: C.yellow }}>
              ?
            </div>
          </div>
        </Sequence>
      </div>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={36}>
          Hoy: leer una red de pases
        </Sticker>
      </Sequence>
      <Sfx src="whoosh.wav" at={g2.at} volume={0.3} />
    </Stage>
  );
};

const Que: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r3, r4, r5, r6, r6b] = lineas;
  const pN = useP(r2.at, r2.at + 40, false);
  const pT = useP(r3.at, r3.at + 30);
  const pL = useP(r4.at, r4.at + 60, false);
  const pC = 1 - 0.9 * useP(r5.at, r5.at + 30);
  const vuelve = useP(r6.at, r6.at + 20);
  const pasos = [
    { at: r2.at, k: "Círculo", v: "jugador, en su posición media" },
    { at: r3.at, k: "Tamaño", v: "pases que da y recibe" },
    { at: r4.at, k: "Línea", v: "pases entre los dos" },
  ];
  return (
    <Split
      ratio={0.36}
      left={
        <>
          <Words text="Red de pases = *mapa del equipo*" size={48} align="left" accent={C.green} delay={r1.at} />
          {pasos.map((p) => (
            <Aparece key={p.k} at={p.at}>
              <div style={{ display: "flex", gap: 14, fontFamily: FONT, fontSize: 30, color: C.ink }}>
                <span style={{ fontWeight: 900, color: C.yellow, width: 130 }}>{p.k}</span>
                <span>= {p.v}</span>
              </div>
            </Aparece>
          ))}
          <Sequence from={r5.at} durationInFrames={r6.at - r5.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={32}>
              Es un grafo · como en el Short de grafos
            </Sticker>
          </Sequence>
          <Aparece at={r6.at}>
            <Chip bg={C.green} size={22}>Solo pases completos · hasta el 1.er cambio</Chip>
          </Aparece>
          <Aparece at={r6b.at}>
            <Chip bg={C.yellow} size={22}>Solo parejas con 3 pases o más</Chip>
          </Aparece>
        </>
      }
      right={
        <Red red={datos.argentina} width={1060} color={ARG} nodos={pN} tamano={pT} lineas={pL} cancha={Math.max(pC, vuelve)} />
      }
    />
  );
};

const Argentina: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3, a4, a4b, a5] = lineas;
  const frame = useCurrentFrame();
  const r = datos.argentina;
  const resaltar =
    frame >= a5.at ? ["Messi"] : frame >= a4b.at ? ["Di María"] : frame >= a4.at ? ["Otamendi", "Romero"] : frame >= a3.at ? ["Enzo", "De Paul"] : [];
  const par: [string, string] | undefined = frame >= a4.at && frame < a4b.at ? ["Romero", "Otamendi"] : undefined;
  const pRed = useP(a1.at, a1.at + 50, false);
  const parN = r.lineas.find((l) => [l.a, l.b].includes("Romero") && [l.a, l.b].includes("Otamendi"))!.n;
  return (
    <Split
      ratio={0.3}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: ARG, lineHeight: 1 }}>ARGENTINA</div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>final · hasta el 63&apos;</div>
          <Aparece at={a2.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.ink, lineHeight: 1 }}>
              <Num to={r.completos} start={a2.at} dur={40} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.dim }}>
              pases completos · {r.por_minuto} por minuto
            </div>
          </Aparece>
          <Segun
            pasos={[
              { at: a3.at, t: <>Enzo ({nodo(r, "Enzo").pases}) y De Paul ({nodo(r, "De Paul").pases}): el centro</> },
              { at: a4.at, t: <>Otamendi: el que más tocó ({nodo(r, "Otamendi").pases}) · con Romero, {parN} pases</> },
              { at: a4b.at, t: <>Di María ({nodo(r, "Di María").pases}): salida por la izquierda y gol</> },
              { at: a5.at, t: <>Messi ({nodo(r, "Messi").pases}): pocas, pero bien</> },
            ]}
          />
        </>
      }
      right={<Red red={r} width={1150} color={ARG} nodos={pRed} lineas={pRed} resaltar={resaltar} par={par} />}
    />
  );
};

const Francia: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2, f2b, f3, f4, f4b, f5] = lineas;
  const frame = useCurrentFrame();
  const r = datos.francia_antes;
  const resaltar = frame >= f5.at ? ["Giroud", "Dembélé"] : frame >= f4.at ? ["Mbappé", "Griezmann", "Giroud"] : frame >= f3.at ? ["Varane", "Upamecano", "Koundé"] : [];
  const pRed = useP(f1.at, f1.at + 50, false);
  return (
    <Split
      ratio={0.3}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: FRA, lineHeight: 1 }}>FRANCIA</div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>final · hasta el 41&apos;</div>
          <Aparece at={f2.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.ink, lineHeight: 1 }}>
              <Num to={r.completos} start={f2.at} dur={40} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.dim }}>
              pases completos · {r.por_minuto} por minuto
            </div>
          </Aparece>
          <Aparece at={f2b.at}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
              Acierto: <span style={{ color: FRA }}>{r.acierto} %</span> vs <span style={{ color: ARG }}>{datos.argentina.acierto} %</span>
            </div>
          </Aparece>
          <Segun
            pasos={[
              { at: f3.at, t: <>Los que más tocan: Varane, Upamecano y Koundé (defensas)</> },
              { at: f4.at, t: <>Mbappé {nodo(r, "Mbappé").pases} · Griezmann {nodo(r, "Griezmann").pases} · Giroud {nodo(r, "Giroud").pases}: aislados</> },
              { at: f4b.at, t: <>Tiros en 41 minutos: <span style={{ color: C.coral, fontSize: 48 }}>{datos.francia_tiros.antes}</span></> },
              { at: f5.at, t: <>41&apos;: Giroud → Thuram · Dembélé → Kolo Muani</> },
            ]}
          />
        </>
      }
      right={<Red red={r} width={1150} color={FRA} nodos={pRed} lineas={pRed} resaltar={resaltar} />}
    />
  );
};

const Cambio: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2, k3, k4] = lineas;
  const A = datos.francia_antes;
  const D = datos.francia_despues;
  const filas = [
    { at: k2.at, k: "Pases completos por minuto", a: `${A.por_minuto}`, d: `${D.por_minuto}` },
    { at: k3.at, k: "Mbappé (pases)", a: `${nodo(A, "Mbappé").pases} en 40'`, d: `${nodo(D, "Mbappé").pases} en 30'` },
    { at: k4.at, k: "Tiros", a: `${datos.francia_tiros.antes}`, d: `${datos.francia_tiros.despues} · empató ✓` },
  ];
  return (
    <Stage gap={18}>
      <div style={{ display: "flex", gap: 60 }}>
        {[
          { t: "Antes · 0'–41'", r: A, at: k1.at },
          { t: "Después · 41'–70'", r: D, at: k1.at + 40 },
        ].map((x) => (
          <Aparece key={x.t} at={x.at}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: FRA }}>{x.t}</div>
              <Red red={x.r} width={660} color={FRA} />
            </div>
          </Aparece>
        ))}
      </div>
      {filas.map((f) => (
        <Aparece key={f.k} at={f.at}>
          <div style={{ display: "grid", gridTemplateColumns: "300px 520px 360px", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 38 }}>
            <span style={{ textAlign: "right", color: C.dim }}>{f.a}</span>
            <span style={{ textAlign: "center", color: C.ink, fontWeight: 800, fontSize: 30 }}>← {f.k} →</span>
            <span style={{ color: C.green }}>{f.d}</span>
          </div>
        </Aparece>
      ))}
    </Stage>
  );
};

/** Mini grafo para explicar la intermediación: el nodo del centro es el puente. */
const Puente: React.FC<{ nombres: boolean; p: number }> = ({ nombres, p }) => {
  const n = [
    { id: "Ana", x: 10, y: 20 },
    { id: "", x: 12, y: 50 },
    { id: "Tú", x: 50, y: 35 },
    { id: "Luis", x: 90, y: 20 },
    { id: "", x: 88, y: 52 },
  ];
  const e = [
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 4],
  ];
  return (
    <svg width={760} height={440} viewBox="0 0 100 70">
      {e.map(([a, b], i) => (
        <line key={i} x1={n[a].x} y1={n[a].y} x2={n[b].x} y2={n[b].y} stroke={C.dim} strokeWidth={1} opacity={0.7} />
      ))}
      {n.map((x, i) => (
        <g key={i}>
          {i === 2 && <circle cx={x.x} cy={x.y} r={7 + 3 * p} fill={`${C.yellow}33`} stroke={C.yellow} strokeWidth={0.8 * p} />}
          <circle cx={x.x} cy={x.y} r={5} fill={i === 2 ? C.yellow : C.blue} />
          {nombres && x.id && (
            <text x={x.x} y={x.y + 11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={5} fill="#fff">
              {x.id}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const Ranking: React.FC<{ at: number; red: RedDatos; color: string; titulo: string }> = ({ at, red, color, titulo }) => {
  const top = [...red.nodos].sort((a, b) => b.inter - a.inter).slice(0, 3);
  const p = useP(at, at + 30);
  return (
    <Aparece at={at}>
      <Card accent={color} style={{ width: 620 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color, marginBottom: 10 }}>{titulo}</div>
        {top.map((n, i) => (
          <div key={n.nombre} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, width: 230 }}>
              {i + 1}. {n.nombre}
            </span>
            <div style={{ width: (n.inter / 0.45) * 280 * p, height: 24, background: color, borderRadius: 12 }} />
          </div>
        ))}
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>intermediación</div>
      </Card>
    </Aparece>
  );
};

const Cerebro: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c2b, c3, c4, c4b, c5] = lineas;
  const pPuente = useP(c2.at + 20, c2.at + 50);
  return (
    <>
      <Sequence durationInFrames={c3.at} layout="none">
        <Stage gap={20}>
          <Words text="¿Quién es el *cerebro*?" size={90} accent={C.yellow} delay={c1.at} />
          <Sequence from={c2.at} layout="none">
            <Puente nombres={false} p={pPuente} />
          </Sequence>
          <Sequence from={c2b.at} layout="none">
            <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
              <div style={{ background: "#0b1020", borderRadius: 20 }}>
                <Puente nombres p={1} />
              </div>
            </div>
          </Sequence>
          <Aparece at={c2.at + 30}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>
              Intermediación = cuántas veces eres el <span style={{ color: C.yellow }}>puente</span>
            </div>
          </Aparece>
        </Stage>
      </Sequence>
      <Sequence from={c3.at} layout="none">
        <Stage gap={30}>
          <div style={{ display: "flex", gap: 60 }}>
            <Ranking at={0} red={datos.argentina} color={ARG} titulo="Argentina" />
            <Ranking at={c4.at - c3.at} red={datos.francia_antes} color={FRA} titulo="Francia (hasta el 41')" />
          </div>
          <Sticker delay={60} bg={C.yellow} size={36}>
            El cerebro no siempre lleva el 10
          </Sticker>
          <div style={{ display: "flex", gap: 40 }}>
            <Sticker delay={c4b.at - c3.at} bg={C.coral} color={C.ink} size={32} rotate={2}>
              Si todo pasa por uno, presiónalo
            </Sticker>
            <Sticker delay={c5.at - c3.at} bg={C.green} size={32}>
              Cómo juega · dónde se atasca
            </Sticker>
          </div>
        </Stage>
      </Sequence>
    </>
  );
};

/** Línea de código más pequeña para que quepan las largas. */
const CodigoChico: React.FC<{ at: number; texto: string; prompt?: string }> = ({ at, texto, prompt }) => (
  <div style={{ transform: "scale(0.74)", transformOrigin: "left center", width: "135%", height: 40 }}>
    <Codigo at={at} texto={texto} dur={28} prompt={prompt} />
  </div>
);

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3, y4] = lineas;
  const frame = useCurrentFrame();
  const salida: [string, string, number][] = [
    ["Nicolás Hernán Otamendi", "Cristian Gabriel Romero", 18],
    ["Nahuel Molina Lucero", "Rodrigo Javier De Paul", 15],
    ["Nicolás Hernán Otamendi", "Nicolás Alejandro Tagliafico", 15],
  ];
  return (
    <Stage direction="row" gap={40}>
      <div style={{ width: 1060, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python</span>
        </div>
        <CodigoChico at={y1.at} texto="df = sb.events(match_id=3869685)" />
        <CodigoChico at={y2.at} texto={'pases = df[(df.type == "Pass") & (df.team == "Argentina")'} />
        <CodigoChico at={y2.at + 25} texto={'      & df.pass_outcome.isna()]'} prompt="... " />
        <CodigoChico at={y2.at + 45} texto={'pases.groupby(["player", "pass_recipient"]).size()'} />
        {salida.map(([a, b, n], i) => (
          <Aparece key={i} at={y3.at + i * 8}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                color: i === 0 ? C.yellow : C.ink,
                background: i === 0 && frame >= y3.at + 20 ? `${C.yellow}22` : undefined,
                borderRadius: 8,
                padding: "4px 8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {a} → {b}
              </span>
              <span>{n}</span>
            </div>
          </Aparece>
        ))}
      </div>
      <div style={{ opacity: frame >= y4.at ? 1 : 0.15 }}>
        <Red red={datos.argentina} width={560} color={ARG} nodos={frame >= y4.at ? 1 : 0} lineas={frame >= y4.at ? 1 : 0} />
      </div>
    </Stage>
  );
};

export const V04 = leerGuion(guion);

export const V04RedPases: React.FC = () => (
  <VideoLargo
    guion={V04}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={4} />,
      que: Que,
      argentina: Argentina,
      francia: Francia,
      cambio: Cambio,
      cerebro: Cerebro,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={5} titulo="Cómo medir la *presión*" sub="Qué equipo incomoda más a su rival" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);
