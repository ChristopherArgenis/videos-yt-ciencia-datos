import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Cancha, CreditoStatsBomb } from "../kit/cancha";
import { Calor, CapaCalor } from "../kit/calor";
import { Aparece, Chip, CierreFutbol, Codigo, ESP, MAR, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/06-mapas-calor.json";
// Generado por scripts/futbol/ep06_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep06.json";

// Fútbol con Datos #6 · Mapas de calor: España 0–0 Marruecos (octavos, Mundial 2022). Datos: StatsBomb Open Data.

const E = datos.espana;
const M = datos.marruecos;
const MAR_CLARO = "#7dffb0";

const Dato: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Aparece at={at}>
    <div style={{ fontFamily: FONT, fontSize: 38, color: C.ink, lineHeight: 1.25 }}>{children}</div>
  </Aparece>
);

const Ataca: React.FC = () => (
  <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, textAlign: "center", marginTop: 8 }}>ataca hacia la derecha →</div>
);

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4, g4b] = lineas;
  const pPos = useP(g2.at + 10, g2.at + 60);
  return (
    <Stage gap={26}>
      <Aparece at={g1.at}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, fontFamily: FONT, fontWeight: 900, fontSize: 64 }}>
          <span style={{ color: ESP }}>ESPAÑA</span>
          <span style={{ color: C.ink }}>0 – 0</span>
          <span style={{ color: MAR_CLARO }}>MARRUECOS</span>
          <Chip bg={C.yellow}>Octavos</Chip>
        </div>
      </Aparece>
      <Aparece at={g2.at}>
        <div style={{ width: 1200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.dim, marginBottom: 8 }}>
            <span>Posesión (% de pases)</span>
            <span>
              <Num to={E.pases} start={g2.at + 20} dur={50} /> pases de España
            </span>
          </div>
          <div style={{ display: "flex", height: 54, borderRadius: 27, overflow: "hidden" }}>
            <div style={{ width: `${50 + (E.posesion - 50) * pPos}%`, background: ESP, display: "flex", alignItems: "center", paddingLeft: 18 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.ink }}>{Math.round(50 + (E.posesion - 50) * pPos)} %</span>
            </div>
            <div style={{ flex: 1, background: MAR, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 18 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.ink }}>{Math.round(50 - (E.posesion - 50) * pPos)} %</span>
            </div>
          </div>
        </div>
      </Aparece>
      <Aparece at={g3.at + 20}>
        <Chip bg={MAR} color={C.ink} size={34}>
          Penales: España 0 – 3 Marruecos
        </Chip>
      </Aparece>
      <Sequence from={g4.at} layout="none">
        <div style={{ position: "relative" }}>
          <div style={{ filter: "blur(6px)" }}>
            <Calor grid={E.calor} width={640} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 180, color: C.yellow }}>
            ?
          </div>
        </div>
      </Sequence>
      <Sfx src="boom.wav" at={g3.at + 20} volume={0.3} />
      <Sequence from={g4b.at} layout="none">
        <div style={{ position: "absolute", bottom: 230, display: "flex", gap: 20 }}>
          <Chip bg={ESP} color={C.ink}>
            Mapa de España
          </Chip>
          <Chip bg={MAR} color={C.ink}>
            Mapa de Marruecos
          </Chip>
        </div>
      </Sequence>
    </Stage>
  );
};

const Que: React.FC<EscenaProps> = ({ lineas }) => {
  const [h1, h2, h2b, h3, h4, h4b, h5, h5b] = lineas;
  const frame = useCurrentFrame();
  const pPts = useP(h2.at, h2.at + 60, false);
  const pBell = useP(h3.at, h3.at + 40);
  const pHeat = useP(h4.at, h4.at + 40);
  const pSuave = useP(h5b.at + 10, h5b.at + 40);
  const n = Math.floor(pPts * E.puntos.length);
  const muestra = E.puntos.filter((_, i) => i % 25 === 0);
  return (
    <Split
      ratio={0.36}
      left={
        <>
          <Words text="¿Qué es un *mapa de calor*?" size={58} align="left" accent={C.yellow} delay={h1.at} />
          <Dato at={h2.at}>
            <span style={{ color: C.yellow, fontWeight: 900 }}>1.</span> Cada acción con balón = un punto
          </Dato>
          <Aparece at={h2b.at}>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>en este partido: casi {(Math.round((E.acciones + M.acciones) / 100) * 100).toLocaleString("en-US")}</div>
          </Aparece>
          <Dato at={h3.at}>
            <span style={{ color: C.yellow, fontWeight: 900 }}>2.</span> Sobre cada punto, una campana
          </Dato>
          <Dato at={h4.at}>
            <span style={{ color: C.yellow, fontWeight: 900 }}>3.</span> Se suman: donde hay muchas, calor
          </Dato>
          <Sequence from={h3.at} durationInFrames={h4.at - h3.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={30}>
              La campana normal · Short de matemáticas
            </Sticker>
          </Sequence>
          <Sequence from={h4b.at} durationInFrames={h5.at - h4b.at} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={30}>
              Como una cámara térmica
            </Sticker>
          </Sequence>
          <Aparece at={h5.at}>
            <Chip bg={C.green}>Estimación de densidad (KDE)</Chip>
          </Aparece>
        </>
      }
      right={
        <div>
          <Cancha width={1040} lineas={0.9}>
            <defs>
              <radialGradient id="campana">
                <stop offset="0" stopColor={C.yellow} stopOpacity={0.9} />
                <stop offset="1" stopColor={C.yellow} stopOpacity={0} />
              </radialGradient>
            </defs>
            <CapaCalor grid={E.calor} p={pHeat * (1 - pSuave)} />
            <CapaCalor grid={E.calor_suave} p={pSuave} />
            {pBell > 0 &&
              pHeat < 1 &&
              muestra.map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r={6 * pBell} fill="url(#campana)" opacity={1 - pHeat} />)}
            {E.puntos.slice(0, n).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={0.35} fill="#fff" opacity={0.55 * (1 - pHeat)} />
            ))}
          </Cancha>
          {frame >= h5b.at && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 28 }}>
              <span style={{ color: pSuave < 0.5 ? C.yellow : C.dim }}>campana angosta: más detalle</span>
              <span style={{ color: pSuave >= 0.5 ? C.yellow : C.dim }}>campana ancha: más suave</span>
            </div>
          )}
        </div>
      }
    />
  );
};

const Espana: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e2b, e3, , e4, e5, e6] = lineas;
  const frame = useCurrentFrame();
  const pH = useP(e1.at, e1.at + 40);
  return (
    <Split
      ratio={0.33}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: ESP, lineHeight: 1 }}>ESPAÑA</div>
          <Dato at={e2.at}>
            <b>
              <Num to={E.acciones} start={e2.at} dur={40} />
            </b>{" "}
            acciones con balón
          </Dato>
          <Dato at={e2.at + 40}>
            <b style={{ color: C.yellow }}>{E.rival} %</b> en campo rival
          </Dato>
          <Dato at={e2b.at}>
            <b style={{ color: C.green }}>{E.acierto} %</b> de pases completos
          </Dato>
          <Dato at={e4.at}>
            solo <b style={{ color: C.coral }}>{E.ultimo_tercio} %</b> en el último tercio
          </Dato>
          <Aparece at={e5.at}>
            <Card accent={ESP} style={{ padding: "12px 22px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
                Rodri (central): <span style={{ color: C.yellow }}>{datos.rodri}</span> acciones · el que más
              </div>
            </Card>
          </Aparece>
        </>
      }
      right={
        <div>
          <Calor grid={E.calor} width={1100} p={pH}>
            {frame >= e3.at && frame < e4.at && <ellipse cx={58} cy={40} rx={22} ry={26} fill="none" stroke="#fff" strokeWidth={0.6} strokeDasharray="1.5 1" />}
            {frame >= e4.at && <rect x={80} y={0} width={40} height={80} fill="none" stroke={C.coral} strokeWidth={0.8} strokeDasharray="2 1" />}
            {frame >= e4.at && (
              <text x={100} y={-1.5} textAnchor="middle" fontFamily={MONO} fontSize={3} fill={C.coral}>
                último tercio
              </text>
            )}
          </Calor>
          <Ataca />
          <Sequence from={e6.at} layout="none">
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
              <Sticker bg={C.yellow} size={32}>
                Balón sí… peligro no
              </Sticker>
            </div>
          </Sequence>
        </div>
      }
    />
  );
};

const Marruecos: React.FC<EscenaProps> = ({ lineas }) => {
  const [m1, m2, m2b, m3, m4, m5] = lineas;
  const frame = useCurrentFrame();
  const pH = useP(m1.at, m1.at + 40);
  const pP = useP(m3.at, m3.at + 40);
  return (
    <Split
      ratio={0.33}
      left={
        <>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: MAR_CLARO, lineHeight: 1 }}>MARRUECOS</div>
          <Dato at={m2.at}>
            <b>{M.acciones}</b> acciones con balón
          </Dato>
          <Dato at={m2b.at}>
            <b style={{ color: C.coral }}>{M.acierto} %</b> de pases completos
          </Dato>
          <Dato at={m3.at}>
            <b style={{ color: C.yellow }}>{M.pres_propio} %</b> de sus presiones, en su campo
          </Dato>
          <Aparece at={m4.at}>
            <Card accent={MAR} style={{ padding: "12px 22px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>
                Amrabat: <span style={{ color: C.yellow }}>{datos.amrabat_presiones}</span> presiones · el que más
              </div>
            </Card>
          </Aparece>
          <Sequence from={m5.at} layout="none">
            <Sticker bg={MAR} color={C.ink} size={32}>
              No quería el balón: quería cerrar espacios
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.dim, textAlign: "center", marginBottom: 8 }}>
            {frame >= m3.at ? "Mapa de sus presiones" : "Mapa con balón"}
          </div>
          <Cancha width={1100} lineas={0.9}>
            <CapaCalor grid={M.calor} p={pH * (1 - pP)} />
            <CapaCalor grid={M.calor_presion} p={pP} />
            {frame >= m3.at && <rect x={0} y={0} width={60} height={80} fill="none" stroke={C.yellow} strokeWidth={0.6} strokeDasharray="2 1" />}
          </Cancha>
          <Ataca />
        </div>
      }
    />
  );
};

const Jugadores: React.FC<EscenaProps> = ({ lineas }) => {
  const [j1, j2, j3, , j4b, j5] = lineas;
  const pP = useP(j2.at, j2.at + 40);
  const pH = useP(j3.at, j3.at + 40);
  return (
    <Stage gap={14}>
      <Aparece at={j1.at}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink }}>
          Un jugador, <span style={{ color: C.yellow }}>un mapa</span>
        </div>
      </Aparece>
      <div style={{ display: "flex", gap: 50 }}>
        {[
          { n: "Pedri", eq: "España", c: ESP, d: datos.pedri, p: pP, at: j2.at, t: `${datos.pedri.acciones} acciones · ${datos.pedri.presiones} presiones (1.º de España)` },
          { n: "Hakimi", eq: "Marruecos", c: MAR_CLARO, d: datos.hakimi, p: pH, at: j3.at, t: `${datos.hakimi.acciones} acciones · el que más tocó de Marruecos` },
        ].map((x) => (
          <div key={x.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: x.c }}>
              {x.n} <span style={{ fontSize: 28, color: C.dim }}>· {x.eq}</span>
            </div>
            <Calor grid={x.d.calor} width={760} p={x.p} />
            <Aparece at={x.at + 20}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.ink }}>{x.t}</div>
            </Aparece>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        <Sticker delay={j4b.at} bg={C.blue} color={C.ink} size={30}>
          Mismo partido, mapas distintos
        </Sticker>
        <Sticker delay={j5.at} bg={C.yellow} size={30} rotate={2}>
          El mapa te dice el rol
        </Sticker>
      </div>
    </Stage>
  );
};

const FilaComp: React.FC<{ at: number; label: string; a: number; b: number; dec?: number }> = ({ at, label, a, b, dec = 0 }) => {
  const p = useP(at, at + 30);
  const max = Math.max(a, b);
  return (
    <Aparece at={at}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px 1fr", alignItems: "center", gap: 20, width: 1400 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: ESP }}>{(a * p).toFixed(dec)}</span>
          <div style={{ width: 380, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: `${(a / max) * 100 * p}%`, height: 30, background: ESP, borderRadius: 15 }} />
          </div>
        </div>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 380 }}>
            <div style={{ width: `${(b / max) * 100 * p}%`, height: 30, background: MAR, borderRadius: 15 }} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: MAR_CLARO }}>{(b * p).toFixed(dec)}</span>
        </div>
      </div>
    </Aparece>
  );
};

const Ocasiones: React.FC<EscenaProps> = ({ lineas }) => {
  const [, o2, o2b, o3, o3b, o4, o5, o5b] = lineas;
  const pen = datos.penales;
  return (
    <Stage gap={18}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px 1fr", width: 1400, fontFamily: FONT, fontWeight: 900, fontSize: 52 }}>
        <span style={{ textAlign: "right", color: ESP }}>ESPAÑA</span>
        <span />
        <span style={{ color: MAR_CLARO }}>MARRUECOS</span>
      </div>
      <FilaComp at={o2.at} label="Tiros" a={E.tiros} b={M.tiros} />
      <FilaComp at={o2.at + 40} label="xG" a={E.xg} b={M.xg} dec={2} />
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={o2b.at}>
          <Card accent={ESP} style={{ padding: "12px 22px", width: 620 }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.ink }}>
              Mejor ocasión: {E.mejor.jugador} {E.mejor.min}&apos; · xG {E.mejor.xg.toFixed(2)} · <span style={{ color: C.coral }}>al poste</span>
            </div>
          </Card>
        </Aparece>
        <Aparece at={o3b.at}>
          <Card accent={MAR} style={{ padding: "12px 22px", width: 620 }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.ink }}>
              Mejor ocasión: {M.mejor.jugador} {M.mejor.min}&apos; (cabeza) · xG {M.mejor.xg.toFixed(2)}
            </div>
          </Card>
        </Aparece>
      </div>
      <Aparece at={o4.at}>
        <div style={{ display: "flex", gap: 50, alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink }}>
          <span>Penales:</span>
          {(["Spain", "Morocco"] as const).map((t) => (
            <span key={t} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: t === "Spain" ? ESP : MAR_CLARO }}>{t === "Spain" ? "España" : "Marruecos"}</span>
              {pen
                .filter((p) => p.equipo === t)
                .map((p, i) => (
                  <span key={i} style={{ color: p.resultado === "Goal" ? C.green : C.coral }}>
                    {p.resultado === "Goal" ? "✓" : "✗"}
                  </span>
                ))}
            </span>
          ))}
          <Chip bg={C.yellow}>Hakimi · a lo Panenka</Chip>
        </div>
      </Aparece>
      <div style={{ display: "flex", gap: 30 }}>
        <Sticker delay={o5.at} bg={C.blue} color={C.ink} size={30}>
          Tener el balón ≠ dominar
        </Sticker>
        <Sticker delay={o5b.at} bg={C.yellow} size={30} rotate={2}>
          Calor = dónde está el balón · xG = dónde está el peligro
        </Sticker>
      </div>
      <Sfx src="ding.wav" at={o3.at} volume={0.25} />
    </Stage>
  );
};

/** Línea de código algo más pequeña para que quepan las largas. */
const CodigoChico: React.FC<{ at: number; texto: string; prompt?: string }> = ({ at, texto, prompt }) => (
  <div style={{ transform: "scale(0.7)", transformOrigin: "left center", width: "143%", height: 38 }}>
    <Codigo at={at} texto={texto} dur={26} prompt={prompt} />
  </div>
);

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, , y3b] = lineas;
  const frame = useCurrentFrame();
  const pM = useP(y2.at + 150, y2.at + 180);
  return (
    <Stage direction="row" gap={40}>
      <div style={{ width: 1000, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · mplsoccer</span>
        </div>
        <CodigoChico at={y1.at} texto="df = sb.events(match_id=3869220)" />
        <CodigoChico at={y2.at} texto={'esp = df[(df.team == "Spain") & df.location.notna()]'} />
        <CodigoChico at={y2.at + 35} texto="pitch = Pitch()" />
        <CodigoChico at={y2.at + 55} texto="fig, ax = pitch.draw()" />
        <CodigoChico at={y2.at + 80} texto="pitch.kdeplot(esp.location.str[0], esp.location.str[1]," />
        <CodigoChico at={y2.at + 105} texto="              ax=ax, fill=True)" prompt="... " />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: pM }}>
        <Calor grid={E.calor} width={560} />
        {frame >= y3b.at && (
          <Sticker bg={C.green} size={28}>
            Cambia el número → otro partido
          </Sticker>
        )}
      </div>
    </Stage>
  );
};

export const V06 = leerGuion(guion);

export const V06MapasCalor: React.FC = () => (
  <VideoLargo
    guion={V06}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={6} />,
      que: Que,
      espana: Espana,
      marruecos: Marruecos,
      jugadores: Jugadores,
      ocasiones: Ocasiones,
      python: Python,
      cierre: (p) => <CierreFutbol {...p} n={7} titulo="Asistencias *esperadas* (xA)" sub="El jugador que crea los goles" />,
    }}
    extra={<CreditoStatsBomb />}
  />
);
