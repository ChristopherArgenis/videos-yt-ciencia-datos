import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { AREA, AREA_CHICA, CreditoStatsBomb, MediaVertical } from "../kit/cancha";
import { Aparece, ARG, CierreFutbol, Codigo, FRA, FRA_TEXTO, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/03-mapa-tiros.json";
// Generado por scripts/futbol/ep03_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep03.json";

// Fútbol con Datos #3 · Mapa de tiros: Messi vs Mbappé. Datos: StatsBomb Open Data, Mundial 2022.

type Tiro = (typeof datos.jugadores.Messi)[number];
const COLOR: Record<string, string> = { Mbappé: FRA_TEXTO, Messi: ARG };
const jugada = (n: "Messi" | "Mbappé") => datos.jugadores[n].filter((t) => !t.penal);
const enArea = (t: { x: number; y: number }) => t.x >= AREA.x && t.y >= AREA.y && t.y <= AREA.y + AREA.h;
const buscar = (n: "Messi" | "Mbappé", rival: string, min: number) =>
  datos.jugadores[n].find((t) => t.rival === rival && t.min === min)!;

/** Punto de tiro: tamaño = xG, relleno = gol. */
const Punto: React.FC<{ t: { x: number; y: number; xg: number; gol: boolean }; color: string; p?: number; tenue?: boolean; brillo?: boolean }> = ({
  t,
  color,
  p = 1,
  tenue = false,
  brillo = false,
}) => {
  if (p <= 0) return null;
  const r = (0.9 + t.xg * 6) * Math.min(1, p * 1.4);
  return (
    <g opacity={tenue ? 0.25 : 1}>
      {brillo && <circle cx={t.x} cy={t.y} r={r + 2.2} fill="none" stroke={C.yellow} strokeWidth={0.6} />}
      <circle
        cx={t.x}
        cy={t.y}
        r={r}
        fill={t.gol ? color : `${color}33`}
        stroke={t.gol ? "#fff" : color}
        strokeWidth={t.gol ? 0.45 : 0.4}
      />
    </g>
  );
};

/** Etiqueta en coordenadas de la cancha (queda derecha aunque la cancha esté girada). */
const Etiqueta: React.FC<{ x: number; y: number; texto: string; color?: string }> = ({ x, y, texto, color = C.yellow }) => (
  <g transform={`translate(${x} ${y}) rotate(90)`}>
    <rect x={-texto.length * 0.95} y={-7.2} width={texto.length * 1.9} height={4.4} rx={1.2} fill="#0b1020dd" />
    <text x={0} y={-3.9} textAnchor="middle" fontFamily={MONO} fontSize={2.9} fill={color} fontWeight={700}>
      {texto}
    </text>
  </g>
);

const Rect: React.FC<{ r: typeof AREA; color: string; p: number }> = ({ r, color, p }) =>
  p > 0 ? (
    <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={`${color}22`} stroke={color} strokeWidth={0.6} opacity={p} />
  ) : null;

/** Mapa de tiros de jugada de un jugador, con aparición escalonada desde el frame `desde`. */
const MapaJugador: React.FC<{
  n: "Messi" | "Mbappé";
  alto: number;
  desde: number;
  resaltar?: (t: Tiro) => boolean;
  atenuar?: (t: Tiro) => boolean;
  /** Se dibuja debajo de los puntos (zonas). */
  children?: React.ReactNode;
  /** Se dibuja encima de los puntos (etiquetas). */
  encima?: React.ReactNode;
}> = ({ n, alto, desde, resaltar, atenuar, children, encima }) => {
  const frame = useCurrentFrame();
  const ts = jugada(n);
  return (
    <MediaVertical alto={alto}>
      {children}
      {ts.map((t, i) => (
        <Punto
          key={i}
          t={t}
          color={COLOR[n]}
          p={(frame - desde - i * 2) / 10}
          brillo={resaltar?.(t)}
          tenue={atenuar?.(t)}
        />
      ))}
      {encima}
    </MediaVertical>
  );
};

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, , g3, g4] = lineas;
  return (
    <Stage gap={20}>
      <div style={{ display: "flex", gap: 70 }}>
        {(["Mbappé", "Messi"] as const).map((n, i) => (
          <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Aparece at={g1.at + i * 20}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COLOR[n] }}>
                {n.toUpperCase()} · {datos.resumen[n].goles} goles
              </div>
            </Aparece>
            <MapaJugador n={n} alto={540} desde={g3.at + i * 10} />
          </div>
        ))}
      </div>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.yellow} size={36}>
          Hoy: leer un mapa de tiros (y hacerlo con Python)
        </Sticker>
      </Sequence>
      <Sfx src="whoosh.wav" at={g3.at} volume={0.3} />
    </Stage>
  );
};

const Leer: React.FC<EscenaProps> = ({ lineas }) => {
  const [, l2, l3, l4, l5, l6] = lineas;
  const frame = useCurrentFrame();
  const ej = buscar("Messi", "Francia", 108);
  const mex = buscar("Messi", "México", 64);
  const crece = useP(l3.at + 10, l3.at + 40);
  const relleno = frame >= l4.at + 10;
  const ejemplo = { ...ej, xg: crece > 0 ? ej.xg * crece : 0.02, gol: relleno };
  const pasos = [
    { at: l2.at, k: "Punto", v: "un tiro, donde se hizo" },
    { at: l3.at, k: "Tamaño", v: "su xG" },
    { at: l4.at, k: "Relleno", v: "fue gol" },
  ];
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Cómo leer un *mapa de tiros*" size={62} align="left" accent={C.green} />
          {pasos.map((p) => (
            <Aparece key={p.k} at={p.at}>
              <div style={{ display: "flex", gap: 18, fontFamily: FONT, fontSize: 40, color: C.ink }}>
                <span style={{ fontWeight: 900, color: C.yellow, width: 170 }}>{p.k}</span>
                <span>= {p.v}</span>
              </div>
            </Aparece>
          ))}
          <Sequence from={l6.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={34}>
              Sin penales: siempre van del mismo punto
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <MediaVertical alto={620}>
          {frame >= l2.at && frame < l5.at && <Punto t={ejemplo} color={ARG} brillo={frame < l3.at} />}
          {frame >= l5.at && (
            <>
              <Punto t={mex} color={ARG} brillo />
              <Etiqueta x={mex.x} y={mex.y} texto={`México · ${mex.dist} m · xG ${mex.xg.toFixed(2)}`} />
            </>
          )}
        </MediaVertical>
      }
    />
  );
};

const Todo: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2, t3, t4] = lineas;
  const frame = useCurrentFrame();
  const m = datos.mundial;
  const fase = frame >= t4.at ? 3 : frame >= t3.at ? 2 : frame >= t2.at ? 1 : 0;
  const pA = useP(t3.at, t3.at + 20);
  const pC = useP(t4.at, t4.at + 20);
  const aparecer = useP(t1.at, t1.at + 60, false);
  const n = Math.floor(aparecer * datos.todos.length);
  const tarjetas = [
    { at: t2.at, t: "Fuera del área", v: `${m.fuera_goles} goles de ${fmtN(m.fuera)}`, c: C.coral },
    { at: t3.at, t: "Dentro del área", v: `${m.area_goles} goles · ${Math.round((100 * m.area_goles) / m.goles)} %`, c: C.green },
    { at: t4.at, t: "Área chica", v: `${m.chica_goles} de ${m.chica} tiros`, c: C.yellow },
  ];
  return (
    <Split
      ratio={0.38}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.ink, lineHeight: 1 }}>
            <Num to={m.tiros} start={t1.at} dur={40} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.dim }}>tiros de jugada · Mundial 2022</div>
          {tarjetas.map((c) => (
            <Aparece key={c.t} at={c.at}>
              <Card accent={c.c} style={{ padding: "14px 24px" }}>
                <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>{c.t}</div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: c.c }}>{c.v}</div>
              </Card>
            </Aparece>
          ))}
        </>
      }
      right={
        <MediaVertical alto={640}>
          <Rect r={AREA} color={C.green} p={fase >= 2 ? pA : 0} />
          <Rect r={AREA_CHICA} color={C.yellow} p={fase >= 3 ? pC : 0} />
          {datos.todos.slice(0, n).map(([x, y, g], i) => {
            const dentro = enArea({ x, y });
            const color =
              fase === 1 ? (dentro ? "#ffffff" : C.coral) : g ? C.yellow : "#ffffff";
            const op = fase === 1 ? (dentro ? 0.12 : g ? 1 : 0.55) : g ? 0.95 : 0.22;
            return <circle key={i} cx={x} cy={y} r={g ? 0.9 : 0.55} fill={color} opacity={op} />;
          })}
        </MediaVertical>
      }
    />
  );
};

const fmtN = (n: number) => n.toLocaleString("en-US");

const Mbappe: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3, b3b, b4, b4b, b5] = lineas;
  const frame = useCurrentFrame();
  const r = datos.resumen["Mbappé"];
  const cab = jugada("Mbappé").find((t) => t.cabeza && t.gol)!;
  const pol = buscar("Mbappé", "Polonia", 91);
  const pA = useP(b2.at, b2.at + 20);
  const resaltar = (t: Tiro) =>
    frame >= b4b.at ? t === pol : frame >= b3b.at && frame < b4.at ? t === cab : frame >= b3.at && frame < b3b.at ? t.gol : false;
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: FRA_TEXTO, lineHeight: 1 }}>MBAPPÉ</div>
          <Aparece at={b1.at + 10}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.ink }}>
              <b>{r.jp_tiros}</b> tiros de jugada
            </div>
          </Aparece>
          <Aparece at={b2.at}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.ink }}>
              <b style={{ color: C.green }}>{r.area}</b> dentro del área ({Math.round((100 * r.area) / r.jp_tiros)} %)
            </div>
          </Aparece>
          <Aparece at={b3.at}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.ink }}>
              <b style={{ color: C.yellow }}>{r.area_goles} de {r.jp_goles}</b> goles, desde adentro
            </div>
          </Aparece>
          <Aparece at={b4.at}>
            <Card accent={C.yellow} style={{ padding: "16px 26px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.ink }}>
                xG {r.jp_xg.toFixed(1)} → <span style={{ color: C.yellow }}>{r.jp_goles} goles</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>más del doble de lo esperado</div>
            </Card>
          </Aparece>
          <Sequence from={b5.at} layout="none">
            <Sticker bg={FRA} color={C.ink} size={38}>
              En el área, no perdona
            </Sticker>
          </Sequence>
          <Sfx src="ding.wav" at={b4.at + 10} volume={0.3} />
        </>
      }
      right={
        <MapaJugador
          n="Mbappé"
          alto={640}
          desde={b1.at}
          resaltar={resaltar}
          encima={
            <>
              {frame >= b3b.at && frame < b4.at && <Etiqueta x={cab.x} y={cab.y} texto="De cabeza · Australia" />}
              {frame >= b4b.at && <Etiqueta x={pol.x} y={pol.y} texto={`Polonia 91' · ${pol.dist} m · xG ${pol.xg.toFixed(2)}`} />}
            </>
          }
        >
          <Rect r={AREA} color={C.green} p={pA} />
        </MapaJugador>
      }
    />
  );
};

const Messi: React.FC<EscenaProps> = ({ lineas }) => {
  const [m1, m2, m3, m4, m4b, m5, m5b] = lineas;
  const frame = useCurrentFrame();
  const r = datos.resumen.Messi;
  const fin = buscar("Messi", "Francia", 108);
  const mex = buscar("Messi", "México", 64);
  const pen = datos.jugadores.Messi.filter((t) => t.penal);
  const resaltar = (t: Tiro) =>
    frame >= m5b.at ? t === mex : frame >= m4b.at && frame < m5.at ? t === fin : frame >= m2.at && frame < m3.at ? !enArea(t) : false;
  const atenuar = (t: Tiro) => frame >= m3.at && frame < m4.at && !t.zurda;
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: ARG, lineHeight: 1 }}>MESSI</div>
          <Aparece at={m1.at + 10}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.ink }}>
              <b>{r.jp_tiros}</b> tiros de jugada
            </div>
          </Aparece>
          <Aparece at={m2.at}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.ink }}>
              <b style={{ color: C.coral }}>{r.jp_tiros - r.area}</b> desde fuera del área
            </div>
          </Aparece>
          <Aparece at={m3.at}>
            <div style={{ fontFamily: FONT, fontSize: 40, color: C.ink }}>
              <b style={{ color: C.yellow }}>{r.zurda} de {r.jp_tiros}</b> con la zurda
            </div>
          </Aparece>
          <Aparece at={m4.at}>
            <Card accent={ARG} style={{ padding: "14px 24px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>
                {r.jp_goles} goles de jugada + {r.penales_gol} de penal
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
                {pen.map((t, i) => (
                  <span key={i} style={{ fontFamily: MONO, fontSize: 26, color: t.gol ? C.green : C.coral }}>
                    {t.gol ? "✓" : "✗"}
                  </span>
                ))}
                <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 10 }}>
                  falló: {pen.find((t) => !t.gol)?.rival}
                </span>
              </div>
            </Card>
          </Aparece>
          <Sequence from={m5.at} layout="none">
            <Sticker bg={C.yellow} size={38}>
              ¿Mal Mundial? Para nada
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <MapaJugador
          n="Messi"
          alto={640}
          desde={m1.at}
          resaltar={resaltar}
          atenuar={atenuar}
          encima={
            <>
              {frame >= m4b.at && frame < m5.at && <Etiqueta x={fin.x} y={fin.y} texto={`Final 108' · ${fin.dist} m · xG ${fin.xg.toFixed(2)}`} />}
              {frame >= m5b.at && <Etiqueta x={mex.x} y={mex.y} texto="México · abrió el marcador" />}
            </>
          }
        >
          <Rect r={AREA} color={C.dim} p={frame >= m2.at && frame < m3.at ? 1 : 0} />
        </MapaJugador>
      }
    />
  );
};

const FilaComp: React.FC<{ at: number; label: string; a: number; b: number; dec?: number; suf?: string; menorMejor?: boolean }> = ({
  at,
  label,
  a,
  b,
  dec = 0,
  suf = "",
}) => {
  const p = useP(at, at + 30);
  const max = Math.max(a, b);
  return (
    <Aparece at={at}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px 1fr", alignItems: "center", gap: 20, width: 1500 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: FRA_TEXTO }}>
            {(a * p).toFixed(dec)}
            {suf}
          </span>
          <div style={{ width: 360, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: `${(a / max) * 100 * p}%`, height: 26, background: FRA, borderRadius: 13 }} />
          </div>
        </div>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 360 }}>
            <div style={{ width: `${(b / max) * 100 * p}%`, height: 26, background: ARG, borderRadius: 13 }} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: ARG }}>
            {(b * p).toFixed(dec)}
            {suf}
          </span>
        </div>
      </div>
    </Aparece>
  );
};

const Cara: React.FC<EscenaProps> = ({ lineas }) => {
  const [, c2, c2b, c3, c4] = lineas;
  const A = datos.resumen["Mbappé"];
  const B = datos.resumen.Messi;
  const cA = datos.creacion["Mbappé"];
  const cB = datos.creacion.Messi;
  return (
    <Stage gap={14}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px 1fr", width: 1500, fontFamily: FONT, fontWeight: 900, fontSize: 52 }}>
        <span style={{ textAlign: "right", color: FRA_TEXTO }}>MBAPPÉ</span>
        <span />
        <span style={{ color: ARG }}>MESSI</span>
      </div>
      <FilaComp at={c2.at} label="% tiros en el área" a={Math.round((100 * A.area) / A.jp_tiros)} b={Math.round((100 * B.area) / B.jp_tiros)} suf=" %" />
      <FilaComp at={c2.at + 20} label="Distancia media (m)" a={A.dist_media} b={B.dist_media} dec={1} />
      <FilaComp at={c2b.at} label="xG por tiro" a={A.jp_xg / A.jp_tiros} b={B.jp_xg / B.jp_tiros} dec={2} />
      <FilaComp at={c2b.at + 25} label="Goles de jugada" a={A.jp_goles} b={B.jp_goles} />
      <FilaComp at={c3.at + 10} label="Pases que acaban en tiro" a={cA.pases_a_tiro} b={cB.pases_a_tiro} />
      <FilaComp at={c3.at + 40} label="Asistencias" a={cA.asistencias} b={cB.asistencias} />
      <div style={{ display: "flex", gap: 260, marginTop: 10 }}>
        <Sticker delay={c4.at} bg={FRA} color={C.ink} size={36}>
          Definidor
        </Sticker>
        <Sticker delay={c4.at + 30} bg={ARG} color={C.bg} size={36} rotate={2}>
          Definidor + creador
        </Sticker>
      </div>
    </Stage>
  );
};

const Defensa: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) =>
  p > 0 ? <circle cx={x} cy={y} r={2.2} fill={C.purple} stroke="#fff" strokeWidth={0.4} opacity={p} /> : null;

const Sirve: React.FC<EscenaProps> = ({ lineas }) => {
  const [, , u3, u4, u5] = lineas;
  const p3 = useP(u3.at, u3.at + 25);
  const p4 = useP(u4.at, u4.at + 25);
  return (
    <Stage gap={16}>
      <div style={{ display: "flex", gap: 70 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: FRA_TEXTO }}>Contra Mbappé</div>
          <MapaJugador n="Mbappé" alto={500} desde={-100} atenuar={() => p3 > 0}>
            {p3 > 0 && <rect x={AREA.x} y={AREA.y} width={AREA.w} height={AREA.h} fill={`${C.purple}33`} opacity={p3} />}
            {[26, 34, 42, 50].map((y, i) => (
              <Defensa key={i} x={109} y={y} p={p3} />
            ))}
          </MapaJugador>
          <Aparece at={u3.at + 20}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>Cierra el área</div>
          </Aparece>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: ARG }}>Contra Messi</div>
          <MapaJugador n="Messi" alto={500} desde={-100} atenuar={(t) => p4 > 0 && enArea(t)}>
            {[
              [95, 34],
              [95, 44],
            ].map(([x, y], i) => (
              <Defensa key={i} x={x} y={y} p={p4} />
            ))}
          </MapaJugador>
          <Aparece at={u4.at + 20}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>No lo dejes perfilar la zurda</div>
          </Aparece>
        </div>
      </div>
      <Sequence from={u5.at} layout="none">
        <Sticker bg={C.green} size={36}>
          Describe… y ayuda a defender
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3, , y5] = lineas;
  const frame = useCurrentFrame();
  const codigo = [
    'tiros = ev[(ev.type == "Shot") & ev.player.str.contains("Messi")]',
    "x, y = tiros.location.str[0], tiros.location.str[1]",
    "pitch = VerticalPitch(half=True)",
    "fig, ax = pitch.draw()",
    "pitch.scatter(x, y, s=tiros.shot_statsbomb_xg * 900, ax=ax)",
  ];
  const inicios = [y3.at, y3.at + 40, y2.at, y2.at + 30, y3.at + 80];
  return (
    <Stage direction="row" gap={40}>
      <div style={{ width: 1080, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · mplsoccer</span>
        </div>
        <Codigo at={y1.at} texto="from mplsoccer import VerticalPitch" dur={20} />
        {codigo.map((t, i) => (
          <div key={t} style={{ fontSize: 0 }}>
            <CodigoChico at={inicios[i]} texto={t} />
          </div>
        ))}
      </div>
      <div style={{ opacity: frame >= y5.at ? 1 : 0.15 }}>
        <MediaVertical alto={520}>
          {datos.jugadores.Messi.map((t, i) => (
            <Punto key={i} t={t} color={ARG} p={(frame - y5.at - i) / 8} />
          ))}
        </MediaVertical>
      </div>
    </Stage>
  );
};

/** Línea de código algo más pequeña para que quepan las largas. */
const CodigoChico: React.FC<{ at: number; texto: string }> = ({ at, texto }) => (
  <div style={{ transform: "scale(0.74)", transformOrigin: "left center", width: "135%", height: 40 }}>
    <Codigo at={at} texto={texto} dur={28} />
  </div>
);

export const V03 = leerGuion(guion);

export const V03MapaTiros: React.FC = () => (
  <VideoLargo
    guion={V03}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={3} />,
      leer: Leer,
      todo: Todo,
      mbappe: Mbappe,
      messi: Messi,
      cara: Cara,
      sirve: Sirve,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={4} titulo="Redes de *pases*" sub="Quién es el cerebro de un equipo" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);

