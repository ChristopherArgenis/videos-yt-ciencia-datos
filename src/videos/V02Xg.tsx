import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Cancha, CreditoStatsBomb } from "../kit/cancha";
import { Aparece, ARG, Chip, CierreFutbol, Codigo, FRA, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/02-xg.json";
// Generado por scripts/futbol/ep02_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep02.json";

// Fútbol con Datos #2 · Qué es el xG. Datos: StatsBomb Open Data, Mundial 2022.

const YARDA = 0.9144;

/** Distancia (m) al centro de la portería y ángulo (grados) entre los postes. Igual que en ep02_datos.py. */
const geometria = (x: number, y: number) => {
  const dx = 120 - x;
  const dy = y - 40;
  let a = Math.atan2(8 * dx, dx * dx + dy * dy - 16);
  if (a < 0) a += Math.PI;
  return { dist: Math.hypot(dx, dy) * YARDA, ang: (a * 180) / Math.PI };
};

/** Nuestro modelo de xG (coeficientes entrenados en ep02_datos.py). */
const nuestroXg = (x: number, y: number, cabeza = false) => {
  const { dist, ang } = geometria(x, y);
  const [cd, ca, cc] = datos.modelo.coef;
  const z = datos.modelo.intercepto + cd * dist + ca * ang + cc * (cabeza ? 1 : 0);
  return 1 / (1 + Math.exp(-z));
};

/** Color de una probabilidad: azul (casi imposible) → amarillo → rojo (muy peligroso). */
const colorProb = (p: number) => {
  const t = Math.min(1, p / 0.45);
  const mezcla = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const azul = [40, 70, 160];
  const amarillo = [255, 209, 102];
  const rojo = [255, 70, 60];
  const c = t < 0.5 ? mezcla(azul, amarillo, t / 0.5) : mezcla(amarillo, rojo, (t - 0.5) / 0.5);
  return `rgb(${c.join(",")})`;
};

const tiro = (jugador: string, min: number) => datos.final.find((t) => t.jugador === jugador && t.min === min)!;

/** Tiro dibujado en la cancha: línea a la portería y círculo con tamaño según xG. */
const Tiro: React.FC<{ x: number; y: number; xg: number; color: string; p?: number; gol?: boolean }> = ({
  x,
  y,
  xg,
  color,
  p = 1,
  gol = false,
}) => (
  <g opacity={p}>
    <line x1={x} y1={y} x2={x + (120 - x) * p} y2={y + (40 - y) * p} stroke={color} strokeWidth={0.5} strokeDasharray="1.2 0.8" />
    <circle cx={x} cy={y} r={(1.2 + xg * 5) * Math.min(1, p * 1.5)} fill={color} stroke={gol ? "#fff" : "none"} strokeWidth={0.5} />
  </g>
);

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4, g5] = lineas;
  const mb = tiro("Mbappé", 81);
  const km = tiro("Kolo Muani", 123);
  const p1 = useP(g1.at + 10, g1.at + 40);
  const p2 = useP(g3.at + 10, g3.at + 40);
  const visto = useCurrentFrame() >= g2.at;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Aparece at={0}>
            <Chip>FINAL · MUNDIAL 2022</Chip>
          </Aparece>
          <Aparece at={g1.at + 15}>
            <Card accent={C.green} style={{ padding: "18px 28px" }}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>81&apos; · Mbappé · volea</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.yellow, lineHeight: 1.05 }}>
                {visto ? mb.xg.toFixed(2) : "?"} <span style={{ color: C.green, fontSize: 50 }}>{visto ? "GOL ✓" : ""}</span>
              </div>
            </Card>
          </Aparece>
          <Aparece at={g3.at + 15}>
            <Card accent={C.coral} style={{ padding: "18px 28px" }}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>123&apos; · Kolo Muani</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.yellow, lineHeight: 1.05 }}>
                {km.xg.toFixed(2)} <span style={{ color: C.coral, fontSize: 50 }}>✗ atajado</span>
              </div>
            </Card>
          </Aparece>
          <Sequence from={g4.at} layout="none">
            <Words text="¿Gol seguro o *milagro?*" size={64} align="left" accent={C.green} />
          </Sequence>
          <Sequence from={g5.at} layout="none">
            <Sticker bg={C.yellow} size={34}>
              Hoy creamos nuestro xG
            </Sticker>
          </Sequence>
          <Sfx src="boom.wav" at={g2.at} volume={0.3} />
          <Sfx src="whoosh.wav" at={g3.at + 10} volume={0.3} />
        </>
      }
      right={
        <Cancha width={530} mitad>
          {p1 > 0 && <Tiro x={mb.x} y={mb.y} xg={mb.xg} color={C.green} p={p1} gol />}
          {p2 > 0 && <Tiro x={km.x} y={km.y} xg={km.xg} color={C.coral} p={p2} />}
        </Cancha>
      }
    />
  );
};

const Balones: React.FC<{ total: number; verdes: number; at: number; cols: number; size: number; paso?: number; rojo?: boolean }> = ({
  total,
  verdes,
  at,
  cols,
  size,
  paso = 1,
  rojo = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.3 }}>
      {Array.from({ length: total }).map((_, i) => {
        const on = frame >= at + i * paso;
        const verde = i < verdes;
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              background: on ? (verde ? C.green : rojo ? C.coral : `${C.dim}55`) : `${C.dim}22`,
            }}
          />
        );
      })}
    </div>
  );
};

const Que: React.FC<EscenaProps> = ({ lineas }) => {
  const [, q2, q3, q4, q5] = lineas;
  const pb = useP(q2.at + 10, q2.at + 60);
  const pen = datos.penales;
  return (
    <>
      <Sequence durationInFrames={q4.at} layout="none">
        <Stage gap={50}>
          <Words text="xG = goles *esperados*" size={110} accent={C.green} />
          <Aparece at={q2.at}>
            <div style={{ width: 1200 }}>
              <div style={{ height: 40, borderRadius: 20, background: `linear-gradient(90deg, ${colorProb(0)}, ${colorProb(0.2)}, ${colorProb(0.45)})` }} />
              <div style={{ position: "relative", height: 70 }}>
                <div style={{ position: "absolute", left: `${pb * 100}%`, top: -58, width: 8, height: 76, background: "#fff", borderRadius: 4, translate: "-4px 0px" }} />
                <span style={{ position: "absolute", left: 0, top: 14, fontFamily: MONO, fontSize: 34, color: C.ink }}>0 · nunca</span>
                <span style={{ position: "absolute", right: 0, top: 14, fontFamily: MONO, fontSize: 34, color: C.ink }}>1 · gol seguro</span>
              </div>
            </div>
          </Aparece>
          <Sequence from={q3.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={40}>
              Basado en miles de tiros parecidos
            </Sticker>
          </Sequence>
        </Stage>
      </Sequence>
      <Sequence from={q4.at} durationInFrames={q5.at - q4.at} layout="none">
        <Stage direction="row" gap={100}>
          <Balones total={100} verdes={78} at={20} cols={10} size={46} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Chip bg={C.yellow}>PENAL</Chip>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.green, lineHeight: 1 }}>0.78</div>
            <Words text="78 de cada *100* son gol" size={48} weight={800} align="left" delay={30} accent={C.green} />
          </div>
        </Stage>
      </Sequence>
      <Sequence from={q5.at} layout="none">
        <Stage gap={40}>
          <Chip>MUNDIAL 2022 · PENALES EN LOS PARTIDOS</Chip>
          <Balones total={pen.tiros} verdes={pen.goles} at={10} cols={pen.tiros} size={56} paso={3} rojo />
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.ink }}>
            {pen.goles} / {pen.tiros} = <span style={{ color: C.green }}>{Math.round((pen.goles / pen.tiros) * 100)} %</span>
          </div>
          <Sticker delay={90} bg={C.yellow} size={38}>
            xG 0.78 → muy cerca
          </Sticker>
        </Stage>
      </Sequence>
    </>
  );
};

const Peligro: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p1b, p2, p3, p4, p5] = lineas;
  const j = datos.juego;
  const etiquetas = ["0–6 m", "6–11 m", "11–16 m", "16–22 m", "+22 m"];
  const apar = [p2.at, p3.at, p3.at + Math.round(p3.frames * 0.3), p3.at + Math.round(p3.frames * 0.45), p3.at + Math.round(p3.frames * 0.6)];
  // Dos tiros a la misma distancia (15 yardas): de frente y desde un costado.
  const frente = { x: 105, y: 40 };
  const costado = { x: 112, y: 52.7 };
  const pa = useP(p4.at + 20, p4.at + 50);
  const pie = nuestroXg(108, 40, false);
  const cab = nuestroXg(108, 40, true);
  return (
    <>
      <Sequence durationInFrames={p2.at} layout="none">
        <Stage gap={30}>
          <div style={{ display: "flex", gap: 120, fontFamily: FONT, fontWeight: 900, alignItems: "baseline" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 150, color: C.ink, lineHeight: 1 }}>
                <Num to={j.tiros} start={p1.at} dur={40} />
              </div>
              <div style={{ fontSize: 44, color: C.dim }}>tiros (sin penales)</div>
            </div>
            <Aparece at={p1b.at}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 150, color: C.green, lineHeight: 1 }}>
                  <Num to={j.goles} start={p1b.at} dur={40} />
                </div>
                <div style={{ fontSize: 44, color: C.dim }}>goles</div>
              </div>
            </Aparece>
          </div>
          <Sequence from={p1b.at + 50} layout="none">
            <Balones total={10} verdes={1} at={0} cols={10} size={70} paso={2} />
          </Sequence>
          <Sticker delay={p1b.at + 60} bg={C.yellow} size={44}>
            1 de cada 10
          </Sticker>
        </Stage>
      </Sequence>
      <Sequence from={p2.at} durationInFrames={p4.at - p2.at} layout="none">
        <Stage gap={30}>
          <Words text="% de gol según la *distancia*" size={64} accent={C.green} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 60, height: 460 }}>
            {datos.por_dist.map((d, i) => {
              const pct = (d.goles / d.tiros) * 100;
              return (
                <Barrita key={i} at={apar[i] - p2.at} pct={pct} label={etiquetas[i]} max={45} />
              );
            })}
          </div>
        </Stage>
      </Sequence>
      <Sequence from={p4.at} durationInFrames={p5.at - p4.at} layout="none">
        <Split
          ratio={0.38}
          left={
            <>
              <Words text="El *ángulo* también cuenta" size={64} align="left" accent={C.yellow} />
              <Aparece at={30}>
                <div style={{ fontFamily: MONO, fontSize: 30, color: C.ink, lineHeight: 1.6 }}>
                  Misma distancia: {geometria(frente.x, frente.y).dist.toFixed(0)} m
                  <br />
                  <span style={{ color: C.green }}>De frente: {geometria(frente.x, frente.y).ang.toFixed(0)}°</span>
                  <br />
                  <span style={{ color: C.coral }}>Del costado: {geometria(costado.x, costado.y).ang.toFixed(0)}°</span>
                </div>
              </Aparece>
            </>
          }
          right={
            <Cancha width={530} mitad>
              {[
                { ...frente, c: C.green },
                { ...costado, c: C.coral },
              ].map((t, i) => (
                <g key={i} opacity={pa}>
                  <polygon points={`${t.x},${t.y} 120,36 120,44`} fill={t.c} opacity={0.35} />
                  <line x1={t.x} y1={t.y} x2={120} y2={36} stroke={t.c} strokeWidth={0.4} />
                  <line x1={t.x} y1={t.y} x2={120} y2={44} stroke={t.c} strokeWidth={0.4} />
                  <circle cx={t.x} cy={t.y} r={1.5} fill={t.c} />
                </g>
              ))}
            </Cancha>
          }
        />
      </Sequence>
      <Sequence from={p5.at} layout="none">
        <Stage gap={40}>
          <Words text="Desde el *mismo lugar*" size={70} accent={C.yellow} />
          <div style={{ display: "flex", gap: 80 }}>
            <Aparece at={15}>
              <Card accent={C.green} style={{ textAlign: "center", width: 440 }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.ink }}>🦶 Con el pie</div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.green }}>{pie.toFixed(2)}</div>
              </Card>
            </Aparece>
            <Aparece at={35}>
              <Card accent={C.coral} style={{ textAlign: "center", width: 440 }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.ink }}>🗣️ De cabeza</div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.coral }}>{cab.toFixed(2)}</div>
              </Card>
            </Aparece>
          </div>
          <Aparece at={55}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>xG de nuestro modelo, en el punto penal ({geometria(108, 40).dist.toFixed(0)} m)</div>
          </Aparece>
        </Stage>
      </Sequence>
    </>
  );
};

const Barrita: React.FC<{ at: number; pct: number; label: string; max: number }> = ({ at, pct, label, max }) => {
  const p = useP(at, at + 30);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: p > 0 ? 1 : 0.15 }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: colorProb((pct / 100) * 1.1) }}>
        {Math.round(pct * p)} %
      </span>
      <div style={{ width: 170, height: (pct / max) * 330 * p + 6, background: colorProb((pct / 100) * 1.1), borderRadius: 16 }} />
      <span style={{ fontFamily: MONO, fontSize: 30, color: C.ink }}>{label}</span>
    </div>
  );
};

const Modelo: React.FC<EscenaProps> = ({ lineas }) => {
  const [, m2, m3, m4, m4b, m5, m6] = lineas;
  const frame = useCurrentFrame();
  const barrido = useP(m4.at + 10, m4.at + 70, false);
  const ejemplo = { x: 104, y: 46 };
  const g = geometria(ejemplo.x, ejemplo.y);
  const entradas = [
    ["Distancia", `${g.dist.toFixed(0)} m`],
    ["Ángulo", `${g.ang.toFixed(0)}°`],
    ["¿Cabeza?", "No"],
  ];
  return (
    <>
      <Sequence durationInFrames={m4.at} layout="none">
        <Stage direction="row" gap={60}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {entradas.map(([k, v], i) => (
              <Aparece key={k} at={m2.at + 15 + i * 20}>
                <Card accent={C.blue} style={{ width: 380, padding: "16px 26px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>{k}</span>
                  <span style={{ fontFamily: MONO, fontSize: 38, color: C.yellow }}>{v}</span>
                </Card>
              </Aparece>
            ))}
          </div>
          <Aparece at={m3.at}>
            <div style={{ fontFamily: FONT, fontSize: 90, color: C.dim }}>→</div>
          </Aparece>
          <Aparece at={m3.at + 10}>
            <Card accent={C.green} style={{ width: 460, textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.green }}>Regresión logística</div>
              <svg width={380} height={190} viewBox="-6 -0.1 12 1.2">
                <line x1={-6} y1={1} x2={6} y2={1} stroke={C.dim} strokeWidth={0.03} />
                <path
                  d={Array.from({ length: 61 }, (_, i) => {
                    const x = -6 + i * 0.2;
                    return `${i ? "L" : "M"}${x},${1 - 1 / (1 + Math.exp(-x))}`;
                  }).join(" ")}
                  fill="none"
                  stroke={C.yellow}
                  strokeWidth={0.08}
                />
              </svg>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>convierte datos en probabilidad</div>
            </Card>
          </Aparece>
          <Aparece at={m3.at + 40}>
            <div style={{ fontFamily: FONT, fontSize: 90, color: C.dim }}>→</div>
          </Aparece>
          <Aparece at={m3.at + 50}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.yellow }}>
                {nuestroXg(ejemplo.x, ejemplo.y).toFixed(2)}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>xG</div>
            </div>
          </Aparece>
        </Stage>
      </Sequence>
      <Sequence from={m4.at} durationInFrames={m5.at - m4.at} layout="none">
        <Split
          ratio={0.3}
          left={
            <>
              <Words text="Mapa de *probabilidad* de gol" size={60} align="left" accent={C.yellow} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: MONO, fontSize: 28 }}>
                <span style={{ color: colorProb(0.45) }}>■ muy peligroso</span>
                <span style={{ color: colorProb(0.2) }}>■ a veces</span>
                <span style={{ color: colorProb(0) }}>■ casi imposible</span>
              </div>
              <Sequence from={m4b.at - m4.at} layout="none">
                <Sticker bg={C.coral} color={C.ink} size={34}>
                  La zona roja es pequeñísima
                </Sticker>
              </Sequence>
            </>
          }
          right={
            <Cancha width={560} mitad lineas={0.9}>
              {datos.rejilla.map((fila, i) =>
                fila.map((p, k) => {
                  const x = 60 + i * 2;
                  if ((x - 60) / 60 > barrido) return null;
                  return <rect key={`${i}-${k}`} x={x} y={k * 2} width={2.05} height={2.05} fill={colorProb(p)} opacity={0.82} />;
                }),
              )}
            </Cancha>
          }
        />
      </Sequence>
      <Sequence from={m5.at} layout="none">
        <Stage gap={30}>
          <div style={{ display: "flex", gap: 70, alignItems: "center" }}>
            <Card accent={C.green} style={{ textAlign: "center", width: 420 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>Nuestro xG</div>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>3 datos por tiro</div>
            </Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 160, color: C.yellow, lineHeight: 1 }}>
                <Num to={datos.modelo.corr_sb} start={10} dur={40} dec={2} />
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>correlación</div>
            </div>
            <Card accent={C.blue} style={{ textAlign: "center", width: 420 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>xG de StatsBomb</div>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>
                {frame >= m6.at - m5.at + 0 ? "+ portero y defensas" : "modelo profesional"}
              </div>
            </Card>
          </div>
          <Sequence from={m6.at - m5.at} layout="none">
            <Words text="El suyo ve dónde estaban el *portero* y los *defensas*" size={46} weight={800} accent={C.yellow} />
          </Sequence>
          <Sticker delay={40} bg={C.green} size={30} rotate={2}>
            ¿Regresión logística? Mira el Short del canal
          </Sticker>
        </Stage>
      </Sequence>
    </>
  );
};

/** Gráfica de escalones del xG acumulado en la final. */
const Escalones: React.FC<{ dibujo: number; resaltar: (t: (typeof datos.final)[number]) => boolean }> = ({ dibujo, resaltar }) => {
  const W = 1450;
  const H = 560;
  const maxMin = 125;
  const maxXg = 3;
  const px = (m: number) => (m / maxMin) * W;
  const py = (v: number) => H - (v / maxXg) * H;
  const lim = dibujo * maxMin;
  const serie = (equipo: string) => {
    let acc = 0;
    const pts: [number, number][] = [[0, 0]];
    const tiros: { t: (typeof datos.final)[number]; antes: number; despues: number }[] = [];
    for (const t of datos.final.filter((t) => t.equipo === equipo)) {
      const antes = acc;
      acc += t.xg;
      pts.push([t.min, antes], [t.min, acc]);
      tiros.push({ t, antes, despues: acc });
    }
    pts.push([maxMin, acc]);
    return { pts, tiros, total: acc };
  };
  const equipos = [
    { nombre: "Argentina", color: ARG, ...serie("Argentina") },
    { nombre: "France", color: FRA, ...serie("France") },
  ];
  return (
    <svg width={W + 140} height={H + 70} viewBox={`-70 -10 ${W + 140} ${H + 70}`} style={{ overflow: "visible" }}>
      {[0, 1, 2, 3].map((v) => (
        <g key={v}>
          <line x1={0} y1={py(v)} x2={W} y2={py(v)} stroke={`${C.dim}33`} strokeWidth={2} />
          <text x={-18} y={py(v) + 10} textAnchor="end" fontFamily={MONO} fontSize={28} fill={C.dim}>
            {v}
          </text>
        </g>
      ))}
      {[0, 45, 90, 120].map((m) => (
        <text key={m} x={px(m)} y={H + 44} textAnchor="middle" fontFamily={MONO} fontSize={26} fill={C.dim}>
          {m}&apos;
        </text>
      ))}
      {equipos.map((e) => {
        const pts = e.pts.filter(([m]) => m <= lim);
        const ult = pts[pts.length - 1];
        pts.push([lim, ult[1]]);
        return (
          <g key={e.nombre}>
            <polyline points={pts.map(([m, v]) => `${px(m)},${py(v)}`).join(" ")} fill="none" stroke={e.color} strokeWidth={6} />
            {e.tiros
              .filter(({ t }) => t.min <= lim)
              .map(({ t, antes, despues }, i) => (
                <g key={i}>
                  {resaltar(t) && (
                    <rect x={px(t.min) - 18} y={py(despues) - 8} width={36} height={py(antes) - py(despues) + 16} rx={10} fill="none" stroke={C.yellow} strokeWidth={4} />
                  )}
                  {t.gol && (
                    <text x={px(t.min)} y={py(despues) - 16} textAnchor="middle" fontSize={34}>
                      ⚽
                    </text>
                  )}
                </g>
              ))}
            {dibujo >= 0.99 && (
              <text x={W + 16} y={py(e.total) + 12} fontFamily={FONT} fontWeight={900} fontSize={44} fill={e.color}>
                {e.total.toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const Final: React.FC<EscenaProps> = ({ lineas }) => {
  const [, f2, , f4, f5, f5b, f6] = lineas;
  const frame = useCurrentFrame();
  const dibujo = useP(f2.at, f2.at + Math.min(f2.frames, 150), false);
  const resaltar = (t: (typeof datos.final)[number]) => {
    if (frame >= f4.at && frame < f5.at) return t.tipo === "Penalty";
    if (frame >= f5.at && frame < f5b.at) return t.jugador === "Mbappé" && t.min === 81;
    if (frame >= f5b.at && frame < f6.at) return t.jugador === "Kolo Muani" && t.min === 123;
    return false;
  };
  const nota =
    frame >= f6.at
      ? "Peligro parecido → empate con sentido"
      : frame >= f5b.at
        ? `Kolo Muani 123' · ${datos.mayor_fallo.xg.toFixed(2)} · atajado`
        : frame >= f5.at
          ? "Volea de Mbappé 81' · 0.10 · gol"
          : frame >= f4.at
            ? "3 penales · 0.78 cada uno"
            : "";
  return (
    <Stage gap={16}>
      <div style={{ display: "flex", gap: 40, alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 46 }}>
        <span style={{ color: ARG }}>Argentina</span>
        <span style={{ color: C.dim, fontSize: 36 }}>xG acumulado</span>
        <span style={{ color: FRA }}>Francia</span>
      </div>
      <Escalones dibujo={dibujo} resaltar={resaltar} />
      <div style={{ height: 60 }}>
        {nota && (
          <Sticker key={nota} bg={frame >= f6.at ? C.green : C.yellow} size={36}>
            {nota}
          </Sticker>
        )}
      </div>
    </Stage>
  );
};

const Sirve: React.FC<EscenaProps> = ({ lineas }) => {
  const [, u2, u3, u4, u5, u5b] = lineas;
  const jugadores = [
    { k: "Mbappé", at: u2.at, nota: "" },
    { k: "Messi", at: u3.at, nota: "4 penales" },
    { k: "Julián Álvarez", at: u4.at, nota: "" },
  ];
  const max = 8;
  return (
    <Stage gap={26}>
      <div style={{ display: "flex", gap: 40, fontFamily: FONT, fontWeight: 800, fontSize: 34 }}>
        <span style={{ color: C.yellow }}>■ Goles</span>
        <span style={{ color: C.dim }}>■ xG (lo esperado)</span>
        <span style={{ color: C.dim }}>Mundial 2022</span>
      </div>
      {jugadores.map(({ k, at, nota }) => {
        const d = datos.top.find((t) => t.jugador === k)!;
        return <FilaJugador key={k} at={at} nombre={k} goles={d.goles} xg={d.xg} max={max} nota={nota} />;
      })}
      <div style={{ display: "flex", gap: 40, marginTop: 10 }}>
        <Sticker delay={u5.at} bg={C.purple} color={C.bg} size={36}>
          ¿Define muy bien… o tuvo suerte?
        </Sticker>
        <Sticker delay={u5b.at} bg={C.blue} color={C.ink} size={36} rotate={2}>
          xG ≠ quién merecía ganar
        </Sticker>
      </div>
    </Stage>
  );
};

const FilaJugador: React.FC<{ at: number; nombre: string; goles: number; xg: number; max: number; nota: string }> = ({
  at,
  nombre,
  goles,
  xg,
  max,
  nota,
}) => {
  const p = useP(at + 5, at + 40);
  const w = 900;
  return (
    <Aparece at={at}>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 200px", alignItems: "center", gap: 24, width: 1500 }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.ink }}>{nombre}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: (goles / max) * w * p, height: 34, background: C.yellow, borderRadius: 17 }} />
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.yellow }}>{goles}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: (xg / max) * w * p, height: 34, background: `${C.dim}88`, borderRadius: 17 }} />
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.dim }}>{xg.toFixed(1)}</span>
          </div>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 30, color: goles - xg > 1.5 ? C.green : C.dim }}>
          {nota || `+${(goles - xg).toFixed(1)}`}
        </span>
      </div>
    </Aparece>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y2b, y3] = lineas;
  const frame = useCurrentFrame();
  const paso = Math.round(y2b.frames / 3);
  const activa = frame >= y2b.at ? Math.min(2, Math.floor((frame - y2b.at) / paso)) : -1;
  const lineasCodigo = [
    'df = sb.events(match_id=3869685)',
    'tiros = df[(df.type == "Shot") & (df.period < 5)]',
    'tiros.groupby("team").shot_statsbomb_xg.sum()',
  ];
  const explicacion = ["Carga la final", "Solo tiros, sin tanda de penales", "Suma el xG por equipo"];
  return (
    <Stage gap={30}>
      <div style={{ width: 1350, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 34px 30px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python</span>
        </div>
        <Codigo at={y1.at} texto="from statsbombpy import sb" dur={20} />
        {lineasCodigo.map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, background: activa === i ? `${C.yellow}22` : undefined, borderRadius: 10 }}>
            <Codigo at={y2.at + i * 35} texto={t} dur={30} />
            {activa === i && <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.yellow }}>← {explicacion[i]}</span>}
          </div>
        ))}
        <Aparece at={y2.at + 110}>
          <div style={{ fontFamily: MONO, fontSize: 32, marginTop: 12, lineHeight: 1.5 }}>
            <span style={{ color: ARG }}>Argentina    2.76</span>
            <br />
            <span style={{ color: FRA }}>France       2.27</span>
          </div>
        </Aparece>
      </div>
      <Sticker delay={y3.at + 20} bg={C.blue} color={C.ink} size={34}>
        Código + nuestro modelo en la descripción ↓
      </Sticker>
    </Stage>
  );
};

export const V02 = leerGuion(guion);

export const V02Xg: React.FC = () => (
  <VideoLargo
    guion={V02}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={2} />,
      que: Que,
      peligro: Peligro,
      modelo: Modelo,
      final: Final,
      sirve: Sirve,
      python: Python,
      cierre: (p) => (
        <CierreFutbol {...p} n={3} titulo="Mapa de *tiros* con Python" sub="Desde dónde dispara un goleador" />
      ),
    }}
    extra={<CreditoStatsBomb />}
  />
);
