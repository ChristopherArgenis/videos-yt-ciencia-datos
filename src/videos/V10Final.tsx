import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { Cierre, leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { CreditoStatsBomb, MediaVertical } from "../kit/cancha";
import { Aparece, ARG, Chip, Codigo, EPISODIOS, FRA, FRA_TEXTO, Num, SerieFutbol, useP } from "../kit/futbol";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/10-final.json";
// Generado por scripts/futbol/ep10_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep10.json";

// Fútbol con Datos #10 · La final del Mundial 2022 por fases. Datos: StatsBomb Open Data.

type Tiro = (typeof datos.tiros)[number];
const TIROS = datos.tiros;
const FASES = datos.fases;
const color = (eq: string) => (eq === "arg" ? ARG : FRA_TEXTO);
const relleno = (eq: string) => (eq === "arg" ? ARG : FRA);

const Marcador: React.FC<{ a: number | string; f: number | string; size?: number; nota?: string }> = ({ a, f, size = 90, nota }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: FONT, fontWeight: 900, fontSize: size }}>
      <span style={{ color: ARG, fontSize: size * 0.55 }}>ARGENTINA</span>
      <span style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>
        {a}–{f}
      </span>
      <span style={{ color: FRA_TEXTO, fontSize: size * 0.55 }}>FRANCIA</span>
    </div>
    {nota && <div style={{ fontFamily: MONO, fontSize: size * 0.3, color: C.yellow }}>{nota}</div>}
  </div>
);

/** Escalones del xG acumulado hasta el minuto `hasta`. */
const Escalones: React.FC<{ hasta: number; w?: number; h?: number; marcas?: { t: number; txt: string }[] }> = ({ hasta, w = 1000, h = 520, marcas = [] }) => {
  const FIN = Math.ceil(datos.fin);
  const MAXY = 3;
  const x = (t: number) => (t / FIN) * w;
  const y = (v: number) => h - (v / MAXY) * h;
  const serie = (eq: string) => {
    let acc = 0;
    const pts: string[] = [`${x(0)},${y(0)}`];
    const goles: { t: number; v: number }[] = [];
    for (const t of TIROS.filter((t) => t.eq === eq && t.t <= hasta)) {
      pts.push(`${x(t.t)},${y(acc)}`);
      acc += t.xg;
      pts.push(`${x(t.t)},${y(acc)}`);
      if (t.gol) goles.push({ t: t.t, v: acc });
    }
    pts.push(`${x(Math.min(hasta, datos.fin))},${y(acc)}`);
    return { pts: pts.join(" "), goles, acc };
  };
  return (
    <svg width={w + 140} height={h + 70} viewBox={`-60 -10 ${w + 140} ${h + 70}`} style={{ overflow: "visible" }}>
      {[0, 1, 2, 3].map((v) => (
        <g key={v}>
          <line x1={0} y1={y(v)} x2={w} y2={y(v)} stroke={`${C.dim}33`} strokeWidth={2} />
          <text x={-16} y={y(v) + 9} textAnchor="end" fontFamily={MONO} fontSize={24} fill={C.dim}>
            {v}
          </text>
        </g>
      ))}
      {[0, 45, 90, 105, 120].map((t) => (
        <text key={t} x={x(t)} y={h + 40} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.dim}>
          {t}'
        </text>
      ))}
      <line x1={x(90)} y1={0} x2={x(90)} y2={h} stroke={`${C.dim}55`} strokeWidth={2} strokeDasharray="6 6" />
      {marcas.map((m) => (
        <g key={m.txt}>
          <line x1={x(m.t)} y1={0} x2={x(m.t)} y2={h} stroke={C.yellow} strokeWidth={3} strokeDasharray="8 6" />
          <text x={x(m.t) + 10} y={26} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.yellow}>
            {m.txt}
          </text>
        </g>
      ))}
      {(["fra", "arg"] as const).map((eq) => {
        const s = serie(eq);
        return (
          <g key={eq}>
            <polyline points={s.pts} fill="none" stroke={color(eq)} strokeWidth={6} strokeLinejoin="round" />
            {s.goles.map((g) => (
              <circle key={g.t} cx={x(g.t)} cy={y(g.v)} r={11} fill={C.yellow} stroke={C.bg} strokeWidth={4} />
            ))}
            <text x={x(Math.min(hasta, datos.fin)) + 14} y={y(s.acc) + 10} fontFamily={MONO} fontWeight={700} fontSize={30} fill={color(eq)}>
              {eq === "arg" ? "ARG" : "FRA"} {s.acc.toFixed(2)}
            </text>
          </g>
        );
      })}
      <text x={0} y={-20} fontFamily={MONO} fontSize={22} fill={C.dim}>
        xG acumulado · ● gol
      </text>
    </svg>
  );
};

/** Contador doble Argentina vs Francia. */
const Duelo: React.FC<{ at: number; k: string; a: number; f: number; dec?: number }> = ({ at, k, a, f, dec = 0 }) => (
  <Aparece at={at}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 24, fontFamily: FONT, fontWeight: 900 }}>
      <span style={{ width: 230, fontSize: 30, color: C.dim, fontWeight: 700 }}>{k}</span>
      <span style={{ width: 150, fontSize: 64, color: ARG }}>
        <Num to={a} start={at} dur={25} dec={dec} />
      </span>
      <span style={{ fontSize: 40, color: C.dim }}>vs</span>
      <span style={{ fontSize: 64, color: FRA_TEXTO }}>
        <Num to={f} start={at} dur={25} dec={dec} />
      </span>
    </div>
  </Aparece>
);

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={40}>
      <Aparece at={g1.at}>
        <Marcador a={3} f={3} size={130} nota={frame >= g1.at + 60 ? "120 minutos · penales 4–2" : undefined} />
      </Aparece>
      {frame >= g3.at && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, width: 1500 }}>
          {EPISODIOS.map((e, i) => (
            <Aparece key={e} at={g3.at + i * 4}>
              <Chip bg={i === 9 ? C.yellow : C.bg2} color={i === 9 ? C.bg : C.ink} size={26}>
                #{i + 1} {e}
              </Chip>
            </Aparece>
          ))}
        </div>
      )}
      {frame >= g2.at && frame < g3.at && (
        <Aparece at={g2.at}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink }}>¿La mejor final de la historia?</div>
        </Aparece>
      )}
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={38}>
          ¿Quién mereció ganarla?
        </Sticker>
      </Sequence>
      <Sfx src="whoosh.wav" at={g1.at} volume={0.3} />
    </Stage>
  );
};

const Fase1: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a2b, a3, a4] = lineas;
  const frame = useCurrentFrame();
  const f = FASES[0];
  const pH = useP(a1.at, a2b.at, false);
  const hasta = frame < a3.at ? 0.1 + 34 * pH : 36;
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="0' a 36': *Argentina*" size={68} align="left" accent={ARG} delay={a1.at} />
          <Duelo at={a2.at} k="Tiros" a={f.arg.tiros} f={f.fra.tiros} />
          <Duelo at={a2.at + 30} k="xG" a={f.arg.xg} f={f.fra.xg} dec={2} />
          <Duelo at={a2b.at} k="Presiones" a={datos.presiones_0_36.arg} f={datos.presiones_0_36.fra} />
          <Sequence from={a3.at} layout="none">
            <Aparece at={0}>
              <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
                <b style={{ color: C.yellow }}>23'</b> penal de Messi · falta de Dembélé a Di María
              </div>
            </Aparece>
          </Sequence>
          <Sequence from={a4.at} layout="none">
            <Aparece at={0}>
              <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
                <b style={{ color: C.yellow }}>36'</b> gol de Di María · pase de Mac Allister
              </div>
            </Aparece>
          </Sequence>
          <Sequence from={a4.at + 90} layout="none">
            <Marcador a={2} f={0} size={70} />
          </Sequence>
        </>
      }
      right={<Escalones hasta={hasta} w={900} h={480} marcas={frame >= a3.at ? [{ t: 36, txt: "36'" }] : []} />}
    />
  );
};

const Fase2: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3, b4, b5] = lineas;
  const frame = useCurrentFrame();
  const pH = useP(b2.at, b3.at, false);
  const hasta = frame < b3.at ? 36 + 42 * pH : frame < b4.at ? 79.5 : 81;
  const pases = datos.pases_36_80;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Aparece at={b1.at}>
            <Card accent={FRA_TEXTO} style={{ padding: "18px 30px" }}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>41' · doble cambio de Francia</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: FRA_TEXTO }}>Entran Kolo Muani y Thuram</div>
            </Card>
          </Aparece>
          <Duelo at={b2.at} k="Pases 36'–80'" a={pases.arg} f={pases.fra} />
          <Sequence from={b3.at} layout="none">
            <Aparece at={0}>
              <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
                <b style={{ color: C.yellow }}>80'</b> penal de Mbappé · lo provoca Kolo Muani
              </div>
            </Aparece>
          </Sequence>
          <Sequence from={b4.at} layout="none">
            <Aparece at={0}>
              <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
                <b style={{ color: C.yellow }}>81'</b> volea de Mbappé · xG 0.10
              </div>
            </Aparece>
          </Sequence>
          <Sequence from={b4.at + 30} layout="none">
            <Sticker bg={C.coral} color={C.ink} size={44}>
              95 segundos
            </Sticker>
          </Sequence>
          <Sequence from={b5.at} layout="none">
            <Marcador a={2} f={2} size={70} />
          </Sequence>
        </>
      }
      right={<Escalones hasta={hasta} w={860} h={480} marcas={[{ t: 41, txt: "41' cambio" }]} />}
    />
  );
};

const PuntoTiro: React.FC<{ t: Tiro; at: number; gris?: boolean; etiqueta?: string }> = ({ t, at, gris, etiqueta }) => {
  const frame = useCurrentFrame();
  const p = useP(at, at + 15);
  if (frame < at) return null;
  const r = 0.9 + Math.sqrt(t.xg) * 3.2;
  const c = gris ? "#8a8fa8" : color(t.eq);
  return (
    <g>
      <circle cx={t.x} cy={t.y} r={r * p} fill={t.gol ? C.yellow : `${c}cc`} stroke={t.gol ? relleno(t.eq) : C.bg} strokeWidth={t.gol ? 1 : 0.4} />
      {etiqueta && (
        <text x={t.x - r - 1.5} y={t.y} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={2.6} fill={C.ink} transform={`rotate(90 ${t.x - r - 1.5} ${t.y})`}>
          {etiqueta}
        </text>
      )}
    </g>
  );
};

const Fase3: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c2b, c3] = lineas;
  const messi = TIROS.find((t) => t.gol && t.jugador === "Messi" && t.min > 100)!;
  const mbappe = TIROS.find((t) => t.gol && t.jugador === "Mbappé" && t.min > 110)!;
  const kolo = TIROS.find((t) => t.jugador === "Kolo Muani" && t.min > 120)!;
  const lautaro = TIROS.filter((t) => t.jugador === "Lautaro" && t.min >= 100);
  // En StatsBomb cada equipo ataca hacia x = 120: todos los tiros caen en la misma media cancha.
  const fix = (t: Tiro) => t;
  return (
    <Split
      ratio={0.46}
      left={
        <>
          <Words text="Tiempo *extra*" size={72} align="left" accent={C.yellow} delay={c1.at} />
          <Aparece at={c1.at + 20}>
            <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
              <b style={{ color: C.yellow }}>108'</b> Messi, a 4 metros · xG {messi.xg.toFixed(2)} · <b>3–2</b>
            </div>
          </Aparece>
          <Aparece at={c2.at}>
            <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
              <b style={{ color: C.yellow }}>118'</b> penal de Mbappé (mano de Montiel) · <b>3–3</b>
            </div>
          </Aparece>
          <Sequence from={c2.at + 90} durationInFrames={c2b.at - c2.at - 90} layout="none">
            <Sticker bg={FRA} color={C.ink} size={28}>
              Hat-trick en una final: el primero desde 1966
            </Sticker>
          </Sequence>
          <Aparece at={c2b.at}>
            <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
              Lautaro: <b>{lautaro.length} tiros</b>, 0 goles <span style={{ color: C.dim }}>(gris)</span>
            </div>
          </Aparece>
          <Aparece at={c3.at}>
            <div style={{ fontFamily: FONT, fontSize: 32, color: C.ink }}>
              <b style={{ color: C.yellow }}>123'</b> Kolo Muani · xG {kolo.xg.toFixed(2)} → <b style={{ color: ARG }}>ataja el Dibu</b>
            </div>
          </Aparece>
        </>
      }
      right={
        <div style={{ position: "relative" }}>
          <MediaVertical alto={560}>
            <PuntoTiro t={fix(messi)} at={c1.at + 20} />
            <PuntoTiro t={fix(mbappe)} at={c2.at} />
            {lautaro.map((t, i) => (
              <PuntoTiro key={t.t} t={fix(t)} at={c2b.at + 20 + i * 8} gris />
            ))}
            <PuntoTiro t={fix(kolo)} at={c3.at} />
          </MediaVertical>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, textAlign: "center", marginTop: 8 }}>
            celeste = Argentina · azul = Francia · amarillo = gol · tamaño = xG
          </div>
        </div>
      }
    />
  );
};

const Xg: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2, x2b, x2c, x3] = lineas;
  const ats = [x2.at, x2b.at, x2c.at];
  const nombres = ["0'–36'", "36'–81'", "81'–fin"];
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Aparece at={x1.at}>
            <div style={{ display: "flex", gap: 40, fontFamily: FONT, fontWeight: 900, alignItems: "baseline" }}>
              <span style={{ fontSize: 30, color: C.dim }}>xG total</span>
              <span style={{ fontSize: 90, color: ARG }}>{datos.total.arg.toFixed(2)}</span>
              <span style={{ fontSize: 90, color: FRA_TEXTO }}>{datos.total.fra.toFixed(2)}</span>
            </div>
          </Aparece>
          <Escalones hasta={200} w={760} h={400} />
        </>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {FASES.map((f, i) => (
            <Aparece key={i} at={ats[i]}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 28, color: C.yellow }}>{nombres[i]}</span>
                {(["arg", "fra"] as const).map((eq) => (
                  <div key={eq} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: Math.max(4, f[eq].xg * 360), height: 34, background: relleno(eq), borderRadius: 8 }} />
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: color(eq) }}>{f[eq].xg.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Aparece>
          ))}
          <Sequence from={x3.at} layout="none">
            <Sticker bg={C.yellow} size={32}>
              Parejo: momentos para cada uno
            </Sticker>
          </Sequence>
        </div>
      }
    />
  );
};

const Penales: React.FC<EscenaProps> = ({ lineas }) => {
  const [n1, n2, n3, n3b, n4] = lineas;
  const frame = useCurrentFrame();
  const arg = datos.tanda.filter((t) => t.eq === "arg");
  const fra = datos.tanda.filter((t) => t.eq === "fra");
  const fila = (lista: typeof arg, at: number, eq: string) => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <span style={{ width: 230, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: color(eq) }}>{eq === "arg" ? "Argentina" : "Francia"}</span>
      {lista.map((t, i) => (
        <Aparece key={t.jugador} at={at + i * 20}>
          <div
            style={{
              width: 190,
              height: 120,
              borderRadius: 18,
              background: t.gol ? `${relleno(eq)}cc` : `${C.coral}33`,
              border: `4px solid ${t.gol ? relleno(eq) : C.coral}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              outline: frame >= n4.at && t.jugador === "Montiel" ? `6px solid ${C.yellow}` : undefined,
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: !t.gol ? C.coral : eq === "arg" ? C.bg : C.ink, lineHeight: 1 }}>{t.gol ? "✓" : "✕"}</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: t.gol && eq === "arg" ? C.bg : C.ink }}>{t.jugador}</span>
            {!t.gol && <span style={{ fontFamily: MONO, fontSize: 18, color: C.dim }}>{t.res === "Saved" ? "atajado" : "afuera"}</span>}
          </div>
        </Aparece>
      ))}
    </div>
  );
  return (
    <Stage gap={30}>
      <Aparece at={n1.at}>
        <Card accent={C.yellow} style={{ padding: "14px 30px" }}>
          <span style={{ fontFamily: MONO, fontSize: 34, color: C.yellow }}>penal = xG 0.78 → de cada 4, se esperan ~3</span>
        </Card>
      </Aparece>
      {fila(arg, n2.at, "arg")}
      {fila(fra, n3.at, "fra")}
      <div style={{ display: "flex", gap: 30, alignItems: "center", height: 80 }}>
        <Sequence from={n3b.at} durationInFrames={n4.at - n3b.at} layout="none">
          <Sticker bg={ARG} size={32}>
            Dibu: 2 atajadas en el partido + 1 en la tanda
          </Sticker>
        </Sequence>
        <Sequence from={n4.at} layout="none">
          <Sticker bg={C.yellow} size={30}>
            Montiel: la mano del 3–3… y el penal del título
          </Sticker>
        </Sequence>
        <Sequence from={n4.at + 120} layout="none">
          <Marcador a={4} f={2} size={60} nota="Argentina, campeona del mundo" />
        </Sequence>
      </div>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <div style={{ width: 1340, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · pandas · ev = eventos de la final</span>
        </div>
        <Codigo at={y1.at} texto={'tiros = ev[(ev.type == "Shot") & (ev.period < 5)]'} dur={30} />
        <Codigo at={y2.at} texto="fase = pd.cut(tiros.minute, [0, 36, 81, 130], right=False)" dur={36} />
        <Codigo at={y2.at + 50} texto={'tiros.groupby([fase, "team"]).shot_statsbomb_xg.sum()'} dur={32} />
      </div>
      <div style={{ display: "flex", gap: 26, opacity: frame >= y2.at + 90 ? 1 : 0.1 }}>
        {FASES.map((f, i) => (
          <div key={i} style={{ fontFamily: MONO, fontSize: 28, background: C.bg2, borderRadius: 12, padding: "10px 20px", display: "flex", gap: 16 }}>
            <span style={{ color: C.yellow }}>{["0–36", "36–81", "81–fin"][i]}</span>
            <span style={{ color: ARG }}>{f.arg.xg.toFixed(2)}</span>
            <span style={{ color: FRA_TEXTO }}>{f.fra.xg.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <Sequence from={y3.at} layout="none">
        <Sticker bg={C.green} size={30}>
          Cambia los minutos → cualquier partido por capítulos
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const TEMAS = ["Eventos", "xG", "Mapa de tiros", "Red de pases", "Presión", "Mapa de calor", "xA", "Radares", "Scouting", "La final"];

const Repaso: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r3, r4] = lineas;
  const frame = useCurrentFrame();
  const paso = (r2.frames - 20) / 9;
  return (
    <Stage gap={34}>
      <Words text="Lo que *aprendimos*" size={80} accent={C.green} delay={r1.at} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 290px)", gap: 18 }}>
        {TEMAS.map((t, i) => {
          const on = frame >= r2.at + i * paso;
          const uno = frame >= r4.at && i === 0;
          return (
            <Aparece key={t} at={r1.at + i * 3}>
              <div
                style={{
                  height: 130,
                  borderRadius: 18,
                  background: uno ? C.yellow : on ? `${C.green}33` : C.bg2,
                  border: `3px solid ${uno ? C.yellow : on ? C.green : C.dim + "44"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  color: uno ? C.bg : C.ink,
                  scale: uno ? "1.08" : "1",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 24, opacity: 0.8 }}>#{i + 1}</span>
                <span style={{ fontWeight: 800, fontSize: 32 }}>{t}</span>
                {uno && <span style={{ fontFamily: MONO, fontSize: 22 }}>4,407 datos</span>}
              </div>
            </Aparece>
          );
        })}
      </div>
      <div style={{ height: 70 }}>
        <Sequence from={r3.at} durationInFrames={r4.at - r3.at} layout="none">
          <Sticker bg={C.blue} color={C.ink} size={30}>
            Datos abiertos + unas pocas líneas de Python
          </Sticker>
        </Sequence>
        <Sequence from={r4.at} layout="none">
          <Sticker bg={C.yellow} size={30}>
            ¿Te perdiste alguno? Empieza por el #1
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const CierreSerie: React.FC<EscenaProps> = (props) => {
  const [, z1b, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={C.yellow}>FIN DE LA SERIE · 10 EPISODIOS</Chip>
          </Aparece>
          <Words text="¿Qué serie *sigue*?" size={110} align="left" accent={C.green} delay={6} />
          <Words text="Dímelo en los comentarios" size={52} weight={700} color={C.dim} align="left" delay={20} />
          <Sequence from={z1b.at} layout="none">
            <Aparece at={0}>
              <Chip bg={C.bg2} color={C.ink}>
                Los 10 episodios están en una lista, en orden
              </Chip>
            </Aparece>
          </Sequence>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};

export const V10 = leerGuion(guion);

export const V10Final: React.FC = () => (
  <VideoLargo
    guion={V10}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieFutbol n={10} />,
      fase1: Fase1,
      fase2: Fase2,
      fase3: Fase3,
      xg: Xg,
      penales: Penales,
      python: Python,
      repaso: Repaso,
      cierre: CierreSerie,
    }}
    extra={<CreditoStatsBomb />}
  />
);
