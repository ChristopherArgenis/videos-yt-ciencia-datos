import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Cancha, CreditoStatsBomb } from "../kit/cancha";
import { ALE, Aparece, ARG, Chip, CierreFutbol, Codigo, ESP, FRA, FRA_TEXTO, JPN, MAR, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/05-presion.json";
// Generado por scripts/futbol/ep05_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep05.json";

// Fútbol con Datos #5 · La presión. Datos: StatsBomb Open Data, Mundial 2022.

type Equipo = (typeof datos.equipos)[number];
const eq = (en: string) => datos.equipos.find((e) => e.en === en)!;
const COLOR: Record<string, string> = { Japan: JPN, Morocco: MAR, Spain: ESP, Germany: ALE, England: "#f2f2f2", Argentina: ARG, France: FRA };

/** Barra horizontal con valor. */
const Barra: React.FC<{ at: number; label: string; valor: number; max: number; color: string; suf?: string; dec?: number; resaltar?: boolean; ancho?: number }> = ({
  at,
  label,
  valor,
  max,
  color,
  suf = "",
  dec = 0,
  resaltar = false,
  ancho = 1200,
}) => {
  const p = useP(at, at + 30);
  return (
    <Aparece at={at}>
      <div
        style={{
          width: ancho,
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: FONT,
          padding: "4px 12px",
          borderRadius: 14,
          background: resaltar ? `${C.yellow}22` : undefined,
          border: resaltar ? `3px solid ${C.yellow}99` : "3px solid transparent",
        }}
      >
        <span style={{ width: 260, fontWeight: 800, fontSize: 36, color: C.ink }}>{label}</span>
        <div style={{ flex: 1, height: 34, background: C.bg2, borderRadius: 17, overflow: "hidden" }}>
          <div style={{ width: `${(valor / max) * 100 * p}%`, height: "100%", background: color, borderRadius: 17 }} />
        </div>
        <span style={{ width: 130, textAlign: "right", fontWeight: 900, fontSize: 40, color: C.ink }}>
          {(valor * p).toFixed(dec)}
          {suf}
        </span>
      </div>
    </Aparece>
  );
};

// ---------- Escenas ----------

const Marcador: React.FC<{ a: string; ga: number; b: string; gb: number; ca: string; cb: string }> = ({ a, ga, b, gb, ca, cb }) => (
  <Card accent={C.dim} style={{ padding: "14px 30px", display: "flex", gap: 22, alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52 }}>
    <span style={{ color: ca }}>{a}</span>
    <span style={{ color: C.ink }}>
      {ga} – {gb}
    </span>
    <span style={{ color: cb }}>{b}</span>
  </Card>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const pPos = useP(g2.at + 30, g2.at + 70);
  const j = eq("Japan");
  return (
    <Stage gap={30}>
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={g1.at}>
          <Marcador a="Alemania" ga={1} b="Japón" gb={2} ca={ALE} cb={JPN} />
        </Aparece>
        <Aparece at={g1.at + 60}>
          <Marcador a="Japón" ga={2} b="España" gb={1} ca={JPN} cb={ESP} />
        </Aparece>
      </div>
      <Aparece at={g2.at + 20}>
        <div style={{ width: 1100 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, marginBottom: 8 }}>Posesión de Japón (% de pases)</div>
          <div style={{ height: 50, borderRadius: 25, background: C.bg2, overflow: "hidden" }}>
            <div style={{ width: `${j.posesion * pPos}%`, height: "100%", background: JPN, borderRadius: 25, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.ink }}>{Math.round(j.posesion * pPos)} %</span>
            </div>
          </div>
        </div>
      </Aparece>
      <Aparece at={g3.at}>
        <Card accent={JPN} style={{ padding: "14px 30px", display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.yellow }}>#1</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink }}>
            en presiones: <span style={{ color: JPN }}>{Math.round(j.pres90)}</span> por partido
          </span>
        </Card>
      </Aparece>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={34}>
          Hoy: medir la presión con datos
        </Sticker>
      </Sequence>
      <Sfx src="boom.wav" at={g3.at} volume={0.3} />
    </Stage>
  );
};

const Que: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q2b, q3, q4, q5] = lineas;
  const frame = useCurrentFrame();
  const corre = useP(q1.at + 20, q1.at + 70);
  const f = datos.final;
  const pPos = useP(q4.at + 20, q4.at + 60);
  const rival = { x: 70, y: 40 };
  const pres = { x: 52 + (67 - 52) * corre, y: 52 + (42 - 52) * corre };
  return (
    <>
      <Sequence durationInFrames={q3.at} layout="none">
        <Split
          ratio={0.4}
          left={
            <>
              <Words text="¿Qué es una *presión*?" size={64} align="left" accent={C.green} />
              <Aparece at={q1.at + 30}>
                <div style={{ fontFamily: FONT, fontSize: 36, color: C.ink, lineHeight: 1.35 }}>
                  Correr hacia el rival que tiene el balón, para <b style={{ color: C.yellow }}>quitárselo o apurarlo</b>.
                </div>
              </Aparece>
              <Aparece at={q2b.at}>
                <Card accent={C.green} style={{ padding: "14px 24px" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: C.green }}>
                    <Num to={datos.total} start={q2b.at} dur={40} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>presiones en el Mundial · {datos.por_partido} por partido</div>
                </Card>
              </Aparece>
            </>
          }
          right={
            <Cancha width={980}>
              <text x={60} y={78} textAnchor="middle" fontFamily={MONO} fontSize={2.6} fill={C.dim}>
                Ejemplo simplificado
              </text>
              <circle cx={rival.x} cy={rival.y} r={2.4} fill="#ffffff" />
              <circle cx={rival.x + 2.6} cy={rival.y + 1.4} r={1} fill={C.yellow} />
              <line x1={52} y1={52} x2={pres.x} y2={pres.y} stroke={C.coral} strokeWidth={0.5} strokeDasharray="1.2 0.8" />
              <circle cx={pres.x} cy={pres.y} r={2.4} fill={C.coral} />
              {frame >= q2.at && (
                <g>
                  <rect x={56} y={22} width={46} height={9} rx={1.5} fill="#0b1020dd" />
                  <text x={79} y={28.2} textAnchor="middle" fontFamily={MONO} fontSize={3.4} fill={C.yellow} fontWeight={700}>
                    Presión → se guarda minuto y lugar
                  </text>
                </g>
              )}
            </Cancha>
          }
        />
      </Sequence>
      <Sequence from={q3.at} layout="none">
        <Stage gap={34}>
          <Chip>FINAL · MUNDIAL 2022</Chip>
          <div style={{ display: "flex", gap: 120, fontFamily: FONT, fontWeight: 900, textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 130, color: ARG, lineHeight: 1 }}>
                <Num to={f.Argentina.pres} start={10} dur={35} />
              </div>
              <div style={{ fontSize: 36, color: C.ink }}>Argentina</div>
            </div>
            <div>
              <div style={{ fontSize: 130, color: FRA_TEXTO, lineHeight: 1 }}>
                <Num to={f.France.pres} start={10} dur={35} />
              </div>
              <div style={{ fontSize: 36, color: C.ink }}>Francia</div>
            </div>
          </div>
          <Aparece at={q4.at - q3.at + 10}>
            <div style={{ width: 1100 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.dim, marginBottom: 8 }}>Posesión (% de pases)</div>
              <div style={{ display: "flex", height: 48, borderRadius: 24, overflow: "hidden" }}>
                <div style={{ width: `${50 + (f.posesion_arg - 50) * pPos}%`, background: ARG, display: "flex", alignItems: "center", paddingLeft: 16 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.bg }}>Argentina {f.posesion_arg} %</span>
                </div>
                <div style={{ flex: 1, background: FRA, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: C.ink }}>{100 - f.posesion_arg} % Francia</span>
                </div>
              </div>
            </div>
          </Aparece>
          <Sticker delay={q5.at - q3.at} bg={C.yellow} size={40}>
            El que no tiene el balón, presiona
          </Sticker>
        </Stage>
      </Sequence>
    </>
  );
};

/** Dispersión posesión vs presiones de los 32 equipos, con recta de tendencia. */
const Dispersion: React.FC<{ p: number; resaltar: string[] }> = ({ p, resaltar }) => {
  const W = 1150;
  const H = 560;
  const xs = datos.equipos.map((e) => e.posesion);
  const ys = datos.equipos.map((e) => e.pres90);
  const [x0, x1, y0, y1] = [25, 80, 80, 160];
  const px = (v: number) => ((v - x0) / (x1 - x0)) * W;
  const py = (v: number) => H - ((v - y0) / (y1 - y0)) * H;
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  const m = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  const b = my - m * mx;
  return (
    <svg width={W + 120} height={H + 90} viewBox={`-90 -10 ${W + 120} ${H + 90}`} style={{ overflow: "visible" }}>
      <line x1={0} y1={H} x2={W} y2={H} stroke={C.dim} strokeWidth={2} />
      <line x1={0} y1={0} x2={0} y2={H} stroke={C.dim} strokeWidth={2} />
      {[30, 40, 50, 60, 70, 80].map((v) => (
        <text key={v} x={px(v)} y={H + 34} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.dim}>
          {v}%
        </text>
      ))}
      {[80, 100, 120, 140, 160].map((v) => (
        <text key={v} x={-14} y={py(v) + 8} textAnchor="end" fontFamily={MONO} fontSize={24} fill={C.dim}>
          {v}
        </text>
      ))}
      <text x={W / 2} y={H + 76} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.ink}>
        Posesión (% de pases) →
      </text>
      <text x={-70} y={H / 2} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.ink} transform={`rotate(-90 -70 ${H / 2})`}>
        Presiones por partido →
      </text>
      <line x1={px(28)} y1={py(m * 28 + b)} x2={px(28 + (78 - 28) * p)} y2={py(m * (28 + (78 - 28) * p) + b)} stroke={C.yellow} strokeWidth={5} strokeDasharray="14 8" />
      {datos.equipos.map((e: Equipo, i) => {
        const on = resaltar.includes(e.en);
        const c = COLOR[e.en] ?? C.blue;
        return (
          <g key={e.en} opacity={Math.min(1, p * 3 - i * 0.05)}>
            <circle cx={px(e.posesion)} cy={py(e.pres90)} r={on ? 16 : 10} fill={on ? c : `${C.green}bb`} stroke="#0b1020" strokeWidth={2} />
            {on && (
              <text x={px(e.posesion) + 22} y={py(e.pres90) + 9} fontFamily={FONT} fontWeight={900} fontSize={30} fill="#fff" stroke="#0b1020" strokeWidth={5} paintOrder="stroke">
                {e.equipo}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const Ranking: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r2b, r3, r4, r5, r5b, r6] = lineas;
  const frame = useCurrentFrame();
  const top = datos.equipos.slice(0, 3);
  const bottom = datos.equipos.slice(-2);
  const max = 160;
  const pD = useP(r5.at, r5.at + 60, false);
  const resaltar = frame >= r5b.at ? ["Costa Rica", "Japan", "Spain"] : ["Japan", "Spain"];
  return (
    <>
      <Sequence durationInFrames={r5.at} layout="none">
        <Stage gap={14}>
          <Aparece at={r1.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink }}>
              Presiones por cada <span style={{ color: C.green }}>90 minutos</span>
            </div>
          </Aparece>
          {top.map((e, i) => (
            <Barra key={e.en} at={r2.at + i * 15} label={`${i + 1}. ${e.equipo}`} valor={e.pres90} max={max} color={COLOR[e.en] ?? C.green} resaltar={e.en === "Japan" && frame >= r2b.at && frame < r3.at} />
          ))}
          <Aparece at={r3.at}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.dim }}>· · ·</div>
          </Aparece>
          {bottom.map((e, i) => (
            <Barra key={e.en} at={r3.at + 10 + i * 15} label={`${datos.equipos.length - 1 + i}. ${e.equipo}`} valor={e.pres90} max={max} color={COLOR[e.en] ?? C.blue} resaltar={e.en === "Spain" && frame >= r4.at} />
          ))}
          <Sequence from={r2b.at} durationInFrames={r3.at - r2b.at} layout="none">
            <Sticker bg={JPN} color={C.ink} size={32}>
              Ganó a Alemania y a España: los dos 2–1
            </Sticker>
          </Sequence>
          <Sequence from={r4.at} layout="none">
            <Sticker bg={ESP} color={C.ink} size={34}>
              España: {eq("Spain").posesion} % de los pases
            </Sticker>
          </Sequence>
        </Stage>
      </Sequence>
      <Sequence from={r5.at} layout="none">
        <Stage gap={10}>
          <Dispersion p={pD} resaltar={resaltar} />
          <div style={{ display: "flex", gap: 30 }}>
            <Sticker delay={30} bg={C.yellow} size={34}>
              Correlación {datos.correlacion.toFixed(2).replace("-", "−")}
            </Sticker>
            <Sticker delay={r6.at - r5.at} bg={C.blue} color={C.ink} size={30} rotate={2}>
              Short: correlación ≠ causalidad
            </Sticker>
          </div>
        </Stage>
      </Sequence>
    </>
  );
};

/** Cancha con las presiones de un equipo en el torneo. */
const MapaPresion: React.FC<{ puntos: number[][]; color: string; p: number; ancho: number; mitad?: number }> = ({ puntos, color, p, ancho, mitad = 0 }) => {
  const n = Math.floor(p * puntos.length);
  return (
    <Cancha width={ancho}>
      {mitad > 0 && <rect x={60} y={0} width={60} height={80} fill={`${C.yellow}18`} stroke={C.yellow} strokeWidth={0.4} opacity={mitad} />}
      {puntos.slice(0, n).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} fill={color} stroke="#0b1020" strokeWidth={0.25} opacity={0.85} />
      ))}
    </Cancha>
  );
};

const Donde: React.FC<EscenaProps> = ({ lineas }) => {
  const [d1, d2, d3, d3b, d4, , d5] = lineas;
  const pA = useP(d2.at, d2.at + 60, false);
  const pM = useP(d3.at, d3.at + 60, false);
  const zona = useP(d1.at + 10, d1.at + 30);
  const A = eq("Germany");
  const M = eq("Morocco");
  return (
    <Stage gap={16}>
      <div style={{ display: "flex", gap: 50 }}>
        {[
          { n: "Alemania", e: A, pts: datos.puntos.Germany, c: ALE, p: pA, at: d2.at, est: "Presión alta", punto: ALE },
          { n: "Marruecos", e: M, pts: datos.puntos.Morocco, c: MAR, p: pM, at: d3.at, est: "Bloque bajo", punto: "#7dffb0" },
        ].map((x) => (
          <div key={x.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "baseline", fontFamily: FONT, fontWeight: 900 }}>
              <span style={{ fontSize: 46, color: x.c === ALE ? C.ink : x.c }}>{x.n}</span>
              <Aparece at={x.at + 30}>
                <span style={{ fontSize: 46, color: C.yellow }}>{x.e.rival} %</span>
                <span style={{ fontSize: 26, color: C.dim }}> en campo rival</span>
              </Aparece>
            </div>
            <MapaPresion puntos={x.pts} color={x.punto} p={x.p} ancho={700} mitad={zona} />
            <Aparece at={d4.at + (x.n === "Marruecos" ? 20 : 0)}>
              <Chip bg={x.n === "Marruecos" ? MAR : C.ink} color={C.bg}>
                {x.est}
              </Chip>
            </Aparece>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>cada equipo ataca hacia la derecha → · zona amarilla = campo rival</div>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <Aparece at={d3b.at}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
            Recuperaciones altas por partido: <span style={{ color: MAR }}>Marruecos {M.recup_alta90.toFixed(0)}</span> ·{" "}
            <span style={{ color: C.ink }}>Alemania {A.recup_alta90.toFixed(0)}</span>
          </div>
        </Aparece>
        <Sticker delay={d5.at} bg={MAR} color={C.ink} size={32}>
          Marruecos → semifinales
        </Sticker>
      </div>
    </Stage>
  );
};

const Contra: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2, , , k3b, k4] = lineas;
  const frame = useCurrentFrame();
  const reloj = useP(k1.at + 20, k1.at + 20 + 150, false);
  const orden = [...datos.equipos].sort((a, b) => b.contra - a.contra);
  const top = orden.slice(0, 4);
  const jap = eq("Japan");
  return (
    <Split
      ratio={0.36}
      left={
        <>
          <Words text="La *contrapresión*" size={68} align="left" accent={C.yellow} />
          <Aparece at={k1.at + 10}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <svg width={150} height={150} viewBox="-50 -50 100 100">
                <circle r={44} fill="none" stroke={C.bg2} strokeWidth={10} />
                <circle r={44} fill="none" stroke={C.yellow} strokeWidth={10} strokeDasharray={`${276 * reloj} 276`} transform="rotate(-90)" strokeLinecap="round" />
                <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.ink}>
                  {Math.min(5, Math.floor(reloj * 5) + 1)}s
                </text>
              </svg>
              <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink, lineHeight: 1.3 }}>
                Presionar <b style={{ color: C.yellow }}>justo después</b> de perder el balón
              </div>
            </div>
          </Aparece>
          <Aparece at={k3b.at}>
            <Card accent={C.green} style={{ padding: "12px 22px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
                Final: <span style={{ color: ARG }}>Argentina {datos.final.Argentina.contra}</span> ·{" "}
                <span style={{ color: FRA_TEXTO }}>Francia {datos.final.France.contra}</span>
              </div>
            </Card>
          </Aparece>
        </>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Aparece at={k2.at}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.dim }}>% de presiones que son contrapresión</div>
          </Aparece>
          {top.map((e, i) => (
            <Barra key={e.en} at={k2.at + 15 + i * 12} label={`${i + 1}. ${e.equipo}`} valor={e.contra} max={35} color={COLOR[e.en] ?? C.green} suf=" %" ancho={1000} resaltar={e.en === "Spain"} />
          ))}
          <Aparece at={k4.at}>
            <div style={{ fontFamily: FONT, fontSize: 36, color: C.dim, paddingLeft: 20 }}>· · ·</div>
          </Aparece>
          {frame >= k4.at && <Barra at={k4.at + 10} label={`Japón`} valor={jap.contra} max={35} color={JPN} suf=" %" ancho={1000} resaltar />}
        </div>
      }
    />
  );
};

const Sirve: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3, p4, p4b] = lineas;
  const A = eq("Germany");
  const estilos = [
    { n: "Japón", t: "Presiona sin el balón", c: JPN },
    { n: "Marruecos", t: "Bloque bajo", c: MAR },
    { n: "España", t: "Contrapresión", c: ESP },
  ];
  return (
    <>
      <Sequence durationInFrames={p4.at} layout="none">
        <Stage gap={24}>
          <Aparece at={p1.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.ink }}>ALEMANIA</div>
          </Aparece>
          <div style={{ display: "flex", gap: 40 }}>
            <Aparece at={p2.at}>
              <Card accent={C.yellow} style={{ textAlign: "center", width: 440 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: C.yellow }}>{A.rival} %</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink }}>presiones en campo rival · 1.º</div>
              </Card>
            </Aparece>
            <Aparece at={p2.at + 40}>
              <Card accent={C.yellow} style={{ textAlign: "center", width: 440 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: C.yellow }}>{A.recup_alta90.toFixed(0)}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink }}>recuperaciones altas por partido · 1.º</div>
              </Card>
            </Aparece>
          </div>
          <Sequence from={p3.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={48} rotate={-4}>
              Eliminada en la fase de grupos
            </Sticker>
          </Sequence>
          <Sfx src="boom.wav" at={p3.at} volume={0.3} />
        </Stage>
      </Sequence>
      <Sequence from={p4.at} layout="none">
        <Stage gap={30}>
          <Words text="Una *herramienta*, no una garantía" size={70} accent={C.green} />
          <div style={{ display: "flex", gap: 34 }}>
            {estilos.map((e, i) => (
              <Aparece key={e.n} at={20 + i * 15}>
                <Card accent={e.c} style={{ width: 400, textAlign: "center" }}>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: e.c }}>{e.n}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.ink }}>{e.t}</div>
                </Card>
              </Aparece>
            ))}
          </div>
          <Sticker delay={p4b.at - p4.at} bg={C.yellow} size={36}>
            Presionar con un plan: cuándo, dónde y para qué
          </Sticker>
        </Stage>
      </Sequence>
    </>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3, y3b] = lineas;
  const f = datos.final;
  return (
    <Stage gap={26}>
      <div style={{ width: 1350, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 34px 30px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python</span>
        </div>
        <Codigo at={y1.at} texto="df = sb.events(match_id=3869685)" dur={25} />
        <Codigo at={y2.at} texto={'pres = df[df.type == "Pressure"]'} dur={25} />
        <Codigo at={y2.at + 35} texto={'pres.groupby("team").size()'} dur={22} />
        <Aparece at={y2.at + 65}>
          <div style={{ fontFamily: MONO, fontSize: 30, margin: "4px 0 12px 64px", lineHeight: 1.45 }}>
            <span style={{ color: ARG }}>Argentina  {f.Argentina.pres}</span>
            <br />
            <span style={{ color: FRA_TEXTO }}>France     {f.France.pres}</span>
          </div>
        </Aparece>
        <Codigo at={y3.at} texto={"(pres.location.str[0] >= 60).groupby(pres.team).mean()"} dur={30} />
        <Aparece at={y3.at + 40}>
          <div style={{ fontFamily: MONO, fontSize: 30, margin: "4px 0 0 64px", lineHeight: 1.45 }}>
            <span style={{ color: ARG }}>Argentina  {(f.Argentina.rival / 100).toFixed(2)}</span>
            <br />
            <span style={{ color: FRA_TEXTO }}>France     {(f.France.rival / 100).toFixed(2)}</span>
          </div>
        </Aparece>
      </div>
      <Sticker delay={y3b.at} bg={C.green} size={32}>
        Cambia el número del partido → otra selección
      </Sticker>
    </Stage>
  );
};

export const V05 = leerGuion(guion);

export const V05Presion: React.FC = () => (
  <VideoLargo
    guion={V05}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={5} />,
      que: Que,
      ranking: Ranking,
      donde: Donde,
      contra: Contra,
      sirve: Sirve,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={6} titulo="Mapas de *calor*" sub="75 % del balón… y perdió" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);
