import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Cancha, CreditoStatsBomb, Flecha } from "../kit/cancha";
import { Aparece, ARG, Chip, CierreFutbol, Codigo, FRA_TEXTO, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/07-xa.json";
// Generado por scripts/futbol/ep07_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep07.json";

// Fútbol con Datos #7 · xA (asistencias esperadas). Datos: StatsBomb Open Data, Mundial 2022.

type Jugada = (typeof datos.jugadas.Messi)[number];
const R = (j: string) => datos.ranking.find((r) => r.jugador === j)!;
const COLOR_EQ: Record<string, string> = { Francia: FRA_TEXTO, Argentina: ARG, Alemania: "#e8e8e8", Brasil: "#ffd84a", Inglaterra: "#f2f2f2", Croacia: C.coral };

/** Una asistencia dibujada en media cancha: pase (flecha) y tiro (línea a la portería). */
const Asistencia: React.FC<{ j: Jugada; at: number; color: string; ancho: number; titulo?: string }> = ({ j, at, color, ancho, titulo }) => {
  const pP = useP(at + 10, at + 35);
  const pT = useP(at + 35, at + 55);
  return (
    <Aparece at={at}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {titulo && <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.ink }}>{titulo}</div>}
        <Cancha width={ancho} mitad>
          <Flecha x1={j.de[0]} y1={j.de[1]} x2={j.a[0]} y2={j.a[1]} p={pP} color={color} />
          {pT > 0 && (
            <>
              <line x1={j.tiro[0]} y1={j.tiro[1]} x2={j.tiro[0] + (120 - j.tiro[0]) * pT} y2={j.tiro[1] + (40 - j.tiro[1]) * pT} stroke="#fff" strokeWidth={0.5} strokeDasharray="1.2 0.8" />
              <circle cx={j.tiro[0]} cy={j.tiro[1]} r={1 + j.xa * 6} fill={C.yellow} stroke="#0b1020" strokeWidth={0.4} />
            </>
          )}
        </Cancha>
        <Aparece at={at + 50}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.yellow }}>xA {j.xa.toFixed(2)}</span>
            <Chip bg={C.green} size={20}>
              Asistencia ✓
            </Chip>
          </div>
        </Aparece>
      </div>
    </Aparece>
  );
};

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const G = R("Griezmann");
  const M = R("Messi");
  return (
    <Stage gap={26}>
      <Aparece at={g1.at}>
        <Card accent={FRA_TEXTO} style={{ display: "flex", gap: 40, alignItems: "center", padding: "20px 40px" }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: FRA_TEXTO }}>GRIEZMANN</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink }}>{datos.griezmann_partidos} partidos</span>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.coral }}>{G.goles} goles</span>
        </Card>
      </Aparece>
      <Aparece at={g2.at}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 1000 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.dim }}>Pases que terminaron en tiro · Mundial 2022</div>
          {[G, M].map((r, i) => (
            <div key={r.jugador} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT }}>
              <span style={{ width: 300, fontWeight: 900, fontSize: 44, color: COLOR_EQ[r.equipo] }}>
                {i + 1}. {r.jugador}
              </span>
              <div style={{ flex: 1, height: 36, background: C.bg2, borderRadius: 18 }}>
                <div style={{ width: `${(r.kp / 20) * 100}%`, height: "100%", background: COLOR_EQ[r.equipo], borderRadius: 18 }} />
              </div>
              <span style={{ width: 80, fontWeight: 900, fontSize: 44, color: C.ink }}>{r.kp}</span>
            </div>
          ))}
        </div>
      </Aparece>
      <Sequence from={g3.at} layout="none">
        <Words text="Asistencias esperadas: *xA*" size={70} accent={C.yellow} />
      </Sequence>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={34}>
          El talento de los que hacen jugar
        </Sticker>
      </Sequence>
      <Sfx src="boom.wav" at={g1.at + 30} volume={0.3} />
    </Stage>
  );
};

const Que: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3, q4] = lineas;
  const frame = useCurrentFrame();
  const pP = useP(q2.at, q2.at + 25);
  const pT = useP(q2.at + 25, q2.at + 45);
  const ej = { de: [96, 22], a: [111, 36], tiro: [111, 36] };
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="¿Qué es el *xA*?" size={70} align="left" accent={C.yellow} />
          <Aparece at={q1.at + 20}>
            <div style={{ fontFamily: FONT, fontSize: 36, color: C.ink, lineHeight: 1.35 }}>
              Asistencia = pase que termina en gol. <span style={{ color: C.coral }}>Depende de tu compañero.</span>
            </div>
          </Aparece>
          <Aparece at={q3.at}>
            <Card accent={C.yellow} style={{ padding: "14px 24px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.yellow }}>xA = xG del tiro que creó tu pase</div>
            </Card>
          </Aparece>
          <Aparece at={q4.at}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink }}>Mide la ocasión que creaste, la meta o no tu compañero.</div>
          </Aparece>
        </>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Cancha width={470} mitad>
            <Flecha x1={ej.de[0]} y1={ej.de[1]} x2={ej.a[0]} y2={ej.a[1]} p={pP} color={C.green} />
            {pT > 0 && <line x1={ej.tiro[0]} y1={ej.tiro[1]} x2={ej.tiro[0] + (120 - ej.tiro[0]) * pT} y2={ej.tiro[1] + (36.3 - ej.tiro[1]) * pT} stroke="#fff" strokeWidth={0.6} />}
            {frame >= q3.at && <circle cx={ej.tiro[0]} cy={ej.tiro[1]} r={3.4} fill={C.yellow} />}
            <text x={90} y={78} textAnchor="middle" fontFamily={MONO} fontSize={2.8} fill={C.dim}>
              Ejemplo simplificado
            </text>
          </Cancha>
          <div style={{ display: "flex", gap: 20 }}>
            <Aparece at={q2.at + 45}>
              <Chip bg={C.coral} color={C.ink}>
                Al poste · Asistencias: 0
              </Chip>
            </Aparece>
            <Aparece at={q3.at + 10}>
              <Chip bg={C.yellow}>xA: 0.40</Chip>
            </Aparece>
          </div>
        </div>
      }
    />
  );
};

const Ejemplos: React.FC<EscenaProps> = ({ lineas }) => {
  const [, e2, e3, e3b, e4, e5] = lineas;
  const [pb, mx, cr] = datos.jugadas.Messi;
  return (
    <Stage gap={18}>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
        <Asistencia j={pb} at={e2.at} color={ARG} ancho={370} titulo={`${pb.rival} → ${pb.receptor}`} />
        <Asistencia j={mx} at={e3.at} color={ARG} ancho={370} titulo={`${mx.rival} → ${mx.receptor}`} />
        <Asistencia j={cr} at={e3b.at} color={ARG} ancho={370} titulo={`${cr.rival} → Julián`} />
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <Sticker delay={e4.at} bg={ARG} color={C.bg} size={30}>
          Países Bajos: mérito de Messi · México: golazo de Enzo
        </Sticker>
        <Sticker delay={e5.at} bg={C.yellow} size={30} rotate={2}>
          El xA separa el pase del remate
        </Sticker>
      </div>
    </Stage>
  );
};

const Ranking: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r3, r4, r5, r5b] = lineas;
  const top = datos.ranking.slice(0, 5);
  const ats = [r2.at, r3.at, r3.at + 40, r3.at + 55, r3.at + 70];
  return (
    <Stage gap={14}>
      <Aparece at={r1.at}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink }}>
          xA de todo el <span style={{ color: C.green }}>Mundial</span>
        </div>
      </Aparece>
      {top.map((r, i) => (
        <RankFila key={r.jugador} at={ats[i]} i={i} r={r} />
      ))}
      <Aparece at={r4.at}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
          3 asistencias: <span style={{ color: FRA_TEXTO }}>Griezmann</span> · <span style={{ color: ARG }}>Messi</span> · Kane · Bruno Fernandes · Perišić
        </div>
      </Aparece>
      <div style={{ display: "flex", gap: 30 }}>
        <Sticker delay={r5.at} bg={C.coral} color={C.ink} size={32}>
          Messi {R("Messi").goles} goles · Griezmann {R("Griezmann").goles}
        </Sticker>
        <Sticker delay={r5b.at} bg={C.yellow} size={32} rotate={2}>
          Por 90 min: {datos.lider90.jugador} {datos.lider90.xa90.toFixed(2)} (1.º)
        </Sticker>
      </div>
    </Stage>
  );
};

const RankFila: React.FC<{ at: number; i: number; r: (typeof datos.ranking)[number] }> = ({ at, i, r }) => {
  const p = useP(at, at + 30);
  const c = COLOR_EQ[r.equipo] ?? C.green;
  return (
    <Aparece at={at}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, width: 1400, fontFamily: FONT }}>
        <span style={{ width: 360, fontWeight: 900, fontSize: 38, color: c }}>
          {i + 1}. {r.jugador}
        </span>
        <div style={{ flex: 1, height: 34, background: C.bg2, borderRadius: 17, overflow: "hidden" }}>
          <div style={{ width: `${(r.xa / 2.6) * 100 * p}%`, height: "100%", background: c, borderRadius: 17 }} />
        </div>
        <span style={{ width: 110, fontWeight: 900, fontSize: 40, color: C.ink }}>{(r.xa * p).toFixed(2)}</span>
        <span style={{ width: 230, fontFamily: MONO, fontSize: 24, color: C.dim }}>{r.kp} pases a tiro</span>
      </div>
    </Aparece>
  );
};

const NOMBRE_TIPO: Record<string, string> = { normal: "Pase normal", centro: "Centro", atras: "Pase atrás", filtrado: "Pase filtrado" };

const Tipos: React.FC<EscenaProps> = ({ lineas }) => {
  const [, t2, t3, t4, t5, t6] = lineas;
  const orden: [string, number][] = [
    ["normal", t3.at],
    ["centro", t4.at],
    ["atras", t4.at + 40],
    ["filtrado", t5.at],
  ];
  return (
    <Stage gap={20}>
      <Aparece at={t2.at}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.ink }}>
          <span style={{ color: C.green }}>
            <Num to={datos.total_pases_tiro} start={t2.at} dur={40} />
          </span>{" "}
          pases terminaron en tiro · xA promedio por tipo
        </div>
      </Aparece>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 70, height: 420 }}>
        {orden.map(([k, at]) => (
          <BarraTipo key={k} at={at} label={NOMBRE_TIPO[k]} v={datos.tipos[k as keyof typeof datos.tipos].media} n={datos.tipos[k as keyof typeof datos.tipos].n} rey={k === "filtrado"} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <Sticker delay={t5.at + 30} bg={C.yellow} size={34}>
          ×3 que un pase normal
        </Sticker>
        <Sticker delay={t6.at} bg={ARG} color={C.bg} size={32} rotate={2}>
          Messi → Molina: pase filtrado
        </Sticker>
      </div>
    </Stage>
  );
};

const BarraTipo: React.FC<{ at: number; label: string; v: number; n: number; rey: boolean }> = ({ at, label, v, n, rey }) => {
  const p = useP(at, at + 30);
  const c = rey ? C.yellow : C.green;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: p > 0 ? 1 : 0.15 }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: c }}>{(v * p).toFixed(2)}</span>
      <div style={{ width: 190, height: (v / 0.23) * 250 * p + 6, background: c, borderRadius: 16 }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>{n} pases</span>
    </div>
  );
};

const Suerte: React.FC<EscenaProps> = ({ lineas }) => {
  const [m1, m2, m2b, m3, m4, m5] = lineas;
  const [ra, ko] = datos.sin_asistencia;
  const tarjeta = (x: typeof ra, at: number) => (
    <Aparece at={at}>
      <Card accent={COLOR_EQ[x.equipo] ?? C.blue} style={{ width: 600, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COLOR_EQ[x.equipo] ?? C.ink }}>{x.jugador}</div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{x.equipo}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 14, fontFamily: FONT, fontWeight: 900 }}>
          <div>
            <div style={{ fontSize: 72, color: C.yellow }}>{x.xa.toFixed(2)}</div>
            <div style={{ fontSize: 26, color: C.ink }}>xA</div>
          </div>
          <div style={{ fontSize: 72, color: C.dim }}>→</div>
          <div>
            <div style={{ fontSize: 72, color: C.coral }}>0</div>
            <div style={{ fontSize: 26, color: C.ink }}>asistencias</div>
          </div>
        </div>
      </Card>
    </Aparece>
  );
  return (
    <Stage gap={26}>
      <Words text="Mala *suerte* en los datos" size={70} accent={C.coral} delay={m1.at} />
      <div style={{ display: "flex", gap: 50 }}>
        {tarjeta(ra, m2.at)}
        {tarjeta(ko, m3.at)}
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <Sticker delay={m2b.at} bg={C.yellow} size={30}>
          El que más creó sin dar asistencias
        </Sticker>
        <Sticker delay={m4.at} bg={C.blue} color={C.ink} size={30} rotate={2}>
          Sus compañeros no las metieron
        </Sticker>
      </div>
      <Sequence from={m5.at} layout="none">
        <Sticker bg={C.green} size={36}>
          El pase es tuyo. El gol, no.
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const Inglaterra: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2, k3, k4, k5] = lineas;
  const [, tch, gir] = datos.jugadas.Griezmann;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Aparece at={k1.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink }}>
              Inglaterra 1 – 2 <span style={{ color: FRA_TEXTO }}>Francia</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>Cuartos de final</div>
          </Aparece>
          <Aparece at={k2.at}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink, lineHeight: 1.4 }}>
              1. → {tch.receptor}, remate de lejos · <b style={{ color: C.yellow }}>xA {tch.xa.toFixed(2)}</b>
              <br />
              2. Centro → {gir.receptor}, de cabeza · <b style={{ color: C.yellow }}>xA {gir.xa.toFixed(2)}</b>
            </div>
          </Aparece>
          <Sequence from={k3.at} durationInFrames={k5.at - k3.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={30}>
              El golazo fue de Tchouaméni
            </Sticker>
          </Sequence>
          <Aparece at={k4.at}>
            <Chip bg={C.green}>Francia → hasta la final</Chip>
          </Aparece>
          <Aparece at={k5.at}>
            <Card accent={ARG} style={{ padding: "12px 22px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.ink }}>
                Final: el que más creó, <span style={{ color: ARG }}>{datos.final_top.jugador}</span> · xA {datos.final_top.xa.toFixed(2)} (gol de Di María)
              </div>
            </Card>
          </Aparece>
        </>
      }
      right={
        <div style={{ display: "flex", gap: 30 }}>
          <Asistencia j={tch} at={k2.at} color={FRA_TEXTO} ancho={430} titulo="17'" />
          <Asistencia j={gir} at={k2.at + 90} color={FRA_TEXTO} ancho={430} titulo="78'" />
        </div>
      }
    />
  );
};

/** Línea de código algo más pequeña para que quepan las largas. */
const CodigoChico: React.FC<{ at: number; texto: string }> = ({ at, texto }) => (
  <div style={{ transform: "scale(0.78)", transformOrigin: "left center", width: "128%", height: 42 }}>
    <Codigo at={at} texto={texto} dur={26} />
  </div>
);

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  const top = datos.ranking.slice(0, 3);
  return (
    <Stage gap={26}>
      <div style={{ width: 1350, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 34px 30px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python</span>
        </div>
        <CodigoChico at={y1.at} texto={'tiros = ev[ev.type == "Shot"].set_index("id").shot_statsbomb_xg'} />
        <CodigoChico at={y2.at} texto="pases = ev[ev.pass_assisted_shot_id.notna()]" />
        <CodigoChico at={y2.at + 35} texto="xa = pases.pass_assisted_shot_id.map(tiros)" />
        <CodigoChico at={y2.at + 70} texto="xa.groupby(pases.player).sum().nlargest(3)" />
        {top.map((r, i) => (
          <Aparece key={r.jugador} at={y3.at + i * 10}>
            <div style={{ fontFamily: MONO, fontSize: 30, color: COLOR_EQ[r.equipo] ?? C.ink, marginLeft: 60, lineHeight: 1.5 }}>
              {r.jugador.padEnd(12, " ")} {r.xa.toFixed(2)}
            </div>
          </Aparece>
        ))}
      </div>
    </Stage>
  );
};

export const V07 = leerGuion(guion);

export const V07Xa: React.FC = () => (
  <VideoLargo
    guion={V07}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={7} />,
      que: Que,
      ejemplos: Ejemplos,
      ranking: Ranking,
      tipos: Tipos,
      suerte: Suerte,
      inglaterra: Inglaterra,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={8} titulo="Comparar con *radares*" sub="Mismos goles, estilos opuestos" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);
