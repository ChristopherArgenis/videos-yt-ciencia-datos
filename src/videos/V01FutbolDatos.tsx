import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, useIn, Words } from "../kit/kit";
import { Cierre, leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Cancha, CreditoStatsBomb, Flecha } from "../kit/cancha";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/01-futbol-datos.json";
// Generado por scripts/futbol/ep01_datos.py (no se sube a git: licencia de StatsBomb).
import datos from "../datos/privado/ep01.json";

// Fútbol con Datos #1 · Cómo un partido de fútbol se convierte en datos.
// Datos: StatsBomb Open Data, final del Mundial 2022 (partido 3869685).

const ARG = "#7cc6f2";
const FRA = C.coral;

const COLOR_TIPO: Record<string, string> = {
  Pass: C.green,
  Carry: C.blue,
  Pressure: C.coral,
  "Ball Receipt*": "#a3abd6",
  Shot: C.yellow,
};
const NOMBRE_TIPO: Record<string, string> = {
  Pass: "Pase",
  "Ball Receipt*": "Recepción",
  Carry: "Conducción",
  Pressure: "Presión",
  "Foul Committed": "Falta",
  "Foul Won": "Falta recibida",
  Shot: "Tiro",
};

/** 0 → 1 entre los frames a y b. */
const useP = (a: number, b: number, ease = true) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.out(Easing.cubic) : undefined,
  });
};

const fmt = (n: number, dec = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Número que cuenta con separador de miles. */
const Num: React.FC<{ to: number; start: number; dur?: number; dec?: number; style?: React.CSSProperties }> = ({
  to,
  start,
  dur = 30,
  dec = 0,
  style,
}) => {
  const p = useP(start, start + dur);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(to * p, dec)}</span>;
};

/** Aparece (opacidad + subida) en el frame `at`. */
const Aparece: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const p = useIn(at);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string; size?: number }> = ({
  children,
  color = C.bg,
  bg = C.green,
  size = 28,
}) => (
  <span
    style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      background: bg,
      color,
      borderRadius: 12,
      padding: "6px 16px",
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const fin = (l: { at: number; frames: number }) => l.at + l.frames;

// ---------- Escenas ----------

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4, g5] = lineas;
  const p = useP(g3.at, fin(g4), false);
  const n = Math.floor(p * datos.puntos.length);
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Aparece at={0}>
            <Chip>FINAL · MUNDIAL 2022</Chip>
          </Aparece>
          <Aparece at={g1.at + 20}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.ink, lineHeight: 1.1 }}>
              <span style={{ color: ARG }}>Argentina</span> 3 <br />
              <span style={{ color: FRA }}>Francia</span> 3
            </div>
          </Aparece>
          <Aparece at={g2.at}>
            <div style={{ fontFamily: MONO, fontSize: 28, color: C.dim }}>120 min · 6 goles · penales</div>
          </Aparece>
          <Aparece at={g3.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.yellow, lineHeight: 1 }}>
              <Num to={datos.total} start={g3.at} dur={fin(g4) - g3.at} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink }}>datos registrados</div>
          </Aparece>
          <Sequence from={g5.at} layout="none">
            <Words text="Hoy aprendes a *leerlos*" size={52} align="left" accent={C.green} />
          </Sequence>
          <Sfx src="whoosh.wav" at={g3.at} volume={0.3} />
          <Sfx src="ding.wav" at={fin(g4) - 4} volume={0.35} />
        </>
      }
      right={
        <Cancha width={920}>
          {datos.puntos.slice(0, n).map(([x, y, t], i) => (
            <circle
              key={i}
              cx={x as number}
              cy={y as number}
              r={t === "Shot" ? 1 : 0.55}
              fill={COLOR_TIPO[t as string] ?? C.purple}
              opacity={0.75}
            />
          ))}
        </Cancha>
      }
    />
  );
};

const EPISODIOS = ["Datos", "xG", "Tiros", "Pases", "Presión", "Calor", "xA", "Radares", "Scouting", "La final"];

const Serie: React.FC<EscenaProps> = () => (
  <Stage gap={50}>
    <Words text="FÚTBOL CON *DATOS*" size={120} accent={C.green} />
    <div style={{ display: "flex", gap: 18 }}>
      {EPISODIOS.map((e, i) => (
        <Aparece key={e} at={12 + i * 3}>
          <div
            style={{
              width: 140,
              height: 120,
              borderRadius: 18,
              background: i === 0 ? C.green : `${C.bg2}dd`,
              border: `3px solid ${i === 0 ? C.green : C.dim + "44"}`,
              color: i === 0 ? C.bg : C.ink,
              fontFamily: FONT,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              scale: i === 0 ? "1.12" : "1",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 24, opacity: 0.8 }}>#{i + 1}</span>
            <span style={{ fontWeight: 800, fontSize: 24 }}>{e}</span>
          </div>
        </Aparece>
      ))}
    </div>
  </Stage>
);

const Fila: React.FC<{ at: number; k: string; v: string; color?: string }> = ({ at, k, v, color = C.ink }) => (
  <Aparece at={at}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 30,
        fontFamily: MONO,
        fontSize: 30,
        padding: "6px 0",
        borderBottom: `1px solid ${C.dim}22`,
      }}
    >
      <span style={{ color: C.dim }}>{k}</span>
      <span style={{ color, fontWeight: 700 }}>{v}</span>
    </div>
  </Aparece>
);

const Evento: React.FC<EscenaProps> = ({ lineas }) => {
  const [, e2, e3, e4, e5, e5b, e6] = lineas;
  const pf = useP(e4.at + 10, e4.at + 45);
  const pa = datos.pase;
  const paso5 = e5.frames / 6;
  const paso5b = e5b.frames / 3;
  return (
    <>
      <Sequence durationInFrames={e3.at} layout="none">
        <Stage gap={50}>
          <Words text="¿Qué es un *evento*?" size={120} accent={C.green} />
          <div style={{ display: "flex", gap: 30 }}>
            {["Pase", "Tiro", "Falta", "Presión"].map((t, i) => (
              <Sticker key={t} delay={e2.at + 25 + i * 14} rotate={i % 2 ? 3 : -3} bg={[C.green, C.yellow, C.coral, C.blue][i]}>
                {t}
              </Sticker>
            ))}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <Sfx key={i} src="pop.wav" at={e2.at + 25 + i * 14} volume={0.3} />
          ))}
        </Stage>
      </Sequence>
      <Sequence from={e3.at} layout="none">
        <Split
          ratio={0.55}
          left={
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Aparece at={0}>
                <Chip>MINUTO 0:39</Chip>
              </Aparece>
              <Cancha width={860}>
                <Flecha x1={pa.inicio[0]} y1={pa.inicio[1]} x2={pa.fin[0]} y2={pa.fin[1]} p={pf} />
              </Cancha>
            </div>
          }
          right={
            <Card accent={C.green} style={{ width: 600, position: "relative" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.green, marginBottom: 10 }}>
                FICHA DEL EVENTO
              </div>
              <Fila at={e5.at - e3.at} k="Tipo" v="Pase" />
              <Fila at={e5.at - e3.at + paso5} k="Jugador" v="Otamendi" />
              <Fila at={e5.at - e3.at + paso5 * 2} k="Minuto" v="0:39" />
              <Fila at={e5.at - e3.at + paso5 * 3} k="Inicio" v={`(${pa.inicio[0].toFixed(1)}, ${pa.inicio[1].toFixed(1)})`} color={C.yellow} />
              <Fila at={e5.at - e3.at + paso5 * 4} k="Fin" v={`(${pa.fin[0].toFixed(1)}, ${pa.fin[1].toFixed(1)})`} color={C.yellow} />
              <Fila at={e5.at - e3.at + paso5 * 5} k="¿Llegó?" v="Sí ✓" color={C.green} />
              <Fila at={e5b.at - e3.at} k="Pie" v="Derecho" />
              <Fila at={e5b.at - e3.at + paso5b} k="Altura" v="Raso" />
              <Fila at={e5b.at - e3.at + paso5b * 2} k="Recibe" v="Romero" />
              <div style={{ position: "absolute", right: -30, bottom: -40 }}>
                <Sticker delay={e6.at - e3.at} bg={C.yellow}>
                  × {fmt(datos.total)}
                </Sticker>
              </div>
            </Card>
          }
        />
        <Sfx src="whoosh.wav" at={e4.at - e3.at + 10} volume={0.3} />
      </Sequence>
    </>
  );
};

const Quien: React.FC<EscenaProps> = ({ lineas }) => {
  const [w1, w2, w3] = lineas;
  const frame = useCurrentFrame();
  const ev = datos.inicio;
  const paso = (w1.frames - 10) / ev.length;
  const k = Math.min(ev.length, Math.max(0, Math.floor((frame - w1.at) / paso) + 1));
  const cur = ev[Math.max(0, Math.min(ev.length - 1, k - 1))];
  const sig = ev[Math.min(ev.length - 1, k)];
  const t = ((frame - w1.at) % paso) / paso;
  const cx = cur.x + (sig.x - cur.x) * Math.min(1, t * 1.6);
  const cy = cur.y + (sig.y - cur.y) * Math.min(1, t * 1.6);
  const ok = useIn(w2.at, 9);
  return (
    <Split
      ratio={0.56}
      left={
        <div
          style={{
            position: "relative",
            borderRadius: 26,
            border: `4px solid ${C.dim}55`,
            background: "#060a16",
            padding: 24,
          }}
        >
          <Cancha width={800}>
            {ev.slice(0, k).map((e, i) => (
              <circle key={i} cx={e.x} cy={e.y} r={1.4} fill={COLOR_TIPO[e.tipo] ?? C.purple} />
            ))}
            {frame < w2.at && <polygon points={`${cx},${cy} ${cx + 2.5},${cy + 5} ${cx + 4},${cy + 3}`} fill="#fff" />}
          </Cancha>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 40,
              background: C.green,
              color: C.bg,
              borderRadius: 16,
              padding: "6px 22px",
              opacity: interpolate(ok, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              scale: `${interpolate(ok, [0, 1], [0.4, 1])}`,
            }}
          >
            Revisado ✓
          </div>
        </div>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 640 }}>
          {ev.slice(Math.max(0, k - 7), k).map((e) => (
            <div
              key={e.t + e.tipo + e.jugador}
              style={{ display: "flex", gap: 18, fontFamily: MONO, fontSize: 28, color: C.ink, alignItems: "center" }}
            >
              <span style={{ color: C.dim }}>{e.t}</span>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: COLOR_TIPO[e.tipo] ?? C.purple }} />
              <span style={{ fontWeight: 700 }}>{NOMBRE_TIPO[e.tipo] ?? e.tipo}</span>
              <span style={{ color: C.dim }}>· {e.jugador}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            {["Clubes", "Medios", "Analistas"].map((c, i) => (
              <Sticker key={c} delay={w3.at + i * 10} bg={[C.yellow, C.blue, C.purple][i]} size={34} rotate={i % 2 ? 2 : -2}>
                {c}
              </Sticker>
            ))}
          </div>
          {ev.map((_, i) => (
            <Sfx key={i} src="tick.wav" at={w1.at + Math.round(i * paso)} volume={0.25} />
          ))}
          <Sfx src="ding.wav" at={w2.at} volume={0.35} />
        </div>
      }
    />
  );
};

const CanchaPlano: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c2b, c3, c4, c5, c6] = lineas;
  const rejilla = useP(c1.at, c1.at + 25);
  const ejes = useP(c2.at, c2.at + 30);
  const pto = useIn(c3.at + 10);
  const todos = useP(c6.at, c6.at + 40);
  const etiquetas = useIn(c5.at);
  return (
    <AbsoluteFill style={{ padding: "150px 140px 230px 140px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", marginRight: 300 }}>
        <Cancha width={1000}>
          <g stroke="#ffffff" strokeWidth={0.15} opacity={0.35 * rejilla}>
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * 10} y1={0} x2={(i + 1) * 10} y2={80} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i + 1) * 10} x2={120} y2={(i + 1) * 10} />
            ))}
          </g>
          <g opacity={ejes} fontFamily={MONO} fontSize={3.4} fill={C.yellow}>
            <text x={0} y={-4.5} textAnchor="middle">0</text>
            <text x={60} y={-4.5} textAnchor="middle">x (largo)</text>
            <text x={120} y={-4.5} textAnchor="middle">120</text>
            <text x={-4.5} y={80} textAnchor="end">80</text>
            <text x={-4.5} y={41} textAnchor="end">y</text>
          </g>
          {datos.puntos.map(([x, y], i) =>
            i % 2 ? null : <circle key={i} cx={x as number} cy={y as number} r={0.5} fill={C.green} opacity={0.5 * todos} />,
          )}
          <g opacity={interpolate(pto, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })}>
            <line x1={24} y1={27.1} x2={24} y2={0} stroke={C.yellow} strokeWidth={0.3} strokeDasharray="1 1" />
            <line x1={24} y1={27.1} x2={0} y2={27.1} stroke={C.yellow} strokeWidth={0.3} strokeDasharray="1 1" />
            <circle cx={24} cy={27.1} r={1.5 * pto} fill={C.yellow} />
            <text x={26.5} y={25.5} fontFamily={MONO} fontSize={3.6} fill={C.yellow}>
              (24, 27)
            </text>
          </g>
          {datos.penales.map((p, i) => {
            const a = c4.at + 40 + i * 22;
            return <Caida key={i} at={a} x={p.x} y={p.y} />;
          })}
          <g opacity={interpolate(etiquetas, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })}>
            <circle cx={108} cy={40} r={3 + 2 * etiquetas} fill="none" stroke={C.yellow} strokeWidth={0.5} />
            <text x={108} y={50} textAnchor="middle" fontFamily={MONO} fontSize={4.4} fill={C.yellow} fontWeight={700}>
              (108, 40)
            </text>
          </g>
        </Cancha>
        <div style={{ position: "absolute", left: "102%", top: 250, display: "flex", flexDirection: "column", gap: 8 }}>
          {datos.penales.map((p, i) => (
            <Aparece key={i} at={c4.at + 40 + i * 22}>
              <div style={{ fontFamily: MONO, fontSize: 26, color: C.ink }}>
                ⚽ Penal · {p.jugador.startsWith("Lionel") ? "Messi" : "Mbappé"} {p.minuto}&apos;
              </div>
            </Aparece>
          ))}
        </div>
        <div style={{ position: "absolute", left: "102%", top: 60 }}>
          <Sticker delay={c2b.at} bg={C.blue} color={C.ink} size={32}>
            1 yarda ≈ 0.91 m<br />cancha ≈ 110 m
          </Sticker>
        </div>
      </div>
      {datos.penales.map((_, i) => (
        <Sfx key={i} src="pop.wav" at={c4.at + 52 + i * 22} volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};

/** Punto que cae desde arriba hasta (x, y). */
const Caida: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const p = useP(at, at + 14, false);
  if (p <= 0) return null;
  return <circle cx={x} cy={-10 + (y + 10) * Easing.bounce(p)} r={1.6} fill={C.coral} />;
};

const Barra: React.FC<{ at: number; label: string; valor: number; max: number; color: string }> = ({
  at,
  label,
  valor,
  max,
  color,
}) => {
  const p = useP(at, at + 35);
  return (
    <Aparece at={at}>
      <div style={{ width: 1300, display: "flex", alignItems: "center", gap: 24, fontFamily: FONT }}>
        <span style={{ width: 280, fontWeight: 800, fontSize: 40, color: C.ink }}>{label}</span>
        <div style={{ flex: 1, height: 46, background: `${C.bg2}`, borderRadius: 23, overflow: "hidden" }}>
          <div style={{ width: `${Math.max(2, (valor / max) * 100 * p)}%`, height: "100%", background: color, borderRadius: 23 }} />
        </div>
        <span style={{ width: 150, textAlign: "right", fontWeight: 900, fontSize: 48, color }}>
          <Num to={valor} start={at} dur={35} />
        </span>
      </div>
    </Aparece>
  );
};

const Partido: React.FC<EscenaProps> = ({ lineas }) => {
  const [, p2, p3, p3b, p4, p5] = lineas;
  const c = datos.conteo;
  const max = c.Pass;
  return (
    <>
      <Sequence durationInFrames={p4.at} layout="none">
        <Stage gap={26}>
          <Words text="Toda la final, en *eventos*" size={70} accent={C.green} />
          <Barra at={p2.at} label="Pases" valor={c.Pass} max={max} color={C.green} />
          <Barra at={p2.at + Math.round(p2.frames * 0.45)} label="Conducciones" valor={c.Carry} max={max} color={C.blue} />
          <Barra at={p3.at} label="Presiones" valor={c.Pressure} max={max} color={C.coral} />
          <Barra at={p3.at + Math.round(p3.frames * 0.55)} label="Tiros" valor={c.Shot} max={max} color={C.yellow} />
          <Barra at={p3b.at} label="Recepciones" valor={c["Ball Receipt*"]} max={max} color="#a3abd6" />
        </Stage>
      </Sequence>
      <Sequence from={p4.at} durationInFrames={p5.at - p4.at} layout="none">
        <Stage gap={10}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 220, color: C.yellow, lineHeight: 1 }}>
            ≈ <Num to={35} start={10} dur={30} />
          </div>
          <Words text="eventos por *minuto*" size={70} accent={C.green} delay={8} />
          <Words text="casi uno cada 2 segundos" size={44} weight={600} color={C.dim} delay={45} />
        </Stage>
      </Sequence>
      <Sequence from={p5.at} layout="none">
        <Stage gap={40}>
          <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 44px)", gap: 14 }}>
              {Array.from({ length: 42 }).map((_, i) => (
                <Aparece key={i} at={i}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: C.green }} />
                </Aparece>
              ))}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: C.dim }}>:</div>
            <Aparece at={46}>
              <div style={{ width: 150, height: 150, borderRadius: 75, background: C.yellow }} />
            </Aparece>
          </div>
          <div style={{ display: "flex", gap: 160, fontFamily: FONT, fontWeight: 900, fontSize: 56 }}>
            <span style={{ color: C.green }}>+40 pases</span>
            <span style={{ color: C.yellow }}>1 tiro</span>
          </div>
        </Stage>
        <Sfx src="boom.wav" at={46} volume={0.3} />
      </Sequence>
    </>
  );
};

const Messi: React.FC<EscenaProps> = ({ lineas }) => {
  const [, m2, m3, m4, m5] = lineas;
  const m = datos.messi;
  const pm = useP(m5.at, m5.at + 60, false);
  const n = Math.floor(pm * m.puntos.length);
  const paso = m2.frames / 4;
  return (
    <Split
      ratio={0.42}
      left={
        <Card accent={C.yellow} style={{ width: 640 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.ink, lineHeight: 1 }}>MESSI</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.yellow, marginBottom: 10 }}>
            <Num to={m.eventos} start={m2.at} dur={40} /> eventos
          </div>
          <Fila at={m2.at + paso} k="Recepciones" v={String(m.recepciones)} />
          <Fila at={m2.at + paso * 2} k="Pases" v={String(m.pases)} color={C.green} />
          <Fila at={m2.at + paso * 3} k="Conducciones" v={String(m.conducciones)} color={C.blue} />
          <Fila at={m3.at} k="Goles" v="2 · penal 23' y 108'" color={C.yellow} />
          <Fila at={m4.at} k="Presiones" v={String(m.presiones)} color={C.coral} />
          <div style={{ marginTop: 18 }}>
            <Sticker delay={m4.at + 20} bg={C.coral} color={C.ink} size={34}>
              ¡También defiende!
            </Sticker>
          </div>
        </Card>
      }
      right={
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <Cancha width={860}>
            <defs>
              <filter id="calor" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={3} />
              </filter>
            </defs>
            <g filter="url(#calor)">
              {m.puntos.slice(0, n).map(([x, y], i) => (
                <circle key={`h${i}`} cx={x} cy={y} r={4} fill={C.yellow} opacity={0.09} />
              ))}
            </g>
            {m.puntos.slice(0, n).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={0.7} fill="#fff" opacity={0.85} />
            ))}
          </Cancha>
          <Sticker delay={m5.at + Math.round(m5.frames * 0.6)} bg={C.green} size={34}>
            Mapa de calor → episodio 6
          </Sticker>
        </div>
      }
    />
  );
};

const FilaEquipos: React.FC<{ at: number; label: string; a: number; b: number; dec?: number; suf?: string; destacar?: boolean }> = ({
  at,
  label,
  a,
  b,
  dec = 0,
  suf = "",
  destacar = false,
}) => {
  const p = useP(at, at + 35);
  const max = Math.max(a, b);
  return (
    <Aparece at={at}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px 1fr",
          alignItems: "center",
          gap: 24,
          width: 1500,
          fontFamily: FONT,
          padding: "8px 16px",
          borderRadius: 18,
          background: destacar ? `${C.yellow}22` : undefined,
          border: destacar ? `3px solid ${C.yellow}88` : "3px solid transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "flex-end" }}>
          <span style={{ fontWeight: 900, fontSize: 52, color: ARG }}>
            <Num to={a} start={at} dur={35} dec={dec} />
            {suf}
          </span>
          <div style={{ width: 380, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: `${(a / max) * 100 * p}%`, height: 30, background: ARG, borderRadius: 15 }} />
          </div>
        </div>
        <div style={{ textAlign: "center", fontWeight: 800, fontSize: 38, color: destacar ? C.yellow : C.ink }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 380 }}>
            <div style={{ width: `${(b / max) * 100 * p}%`, height: 30, background: FRA, borderRadius: 15 }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 52, color: FRA }}>
            <Num to={b} start={at} dur={35} dec={dec} />
            {suf}
          </span>
        </div>
      </div>
    </Aparece>
  );
};

const Equipos: React.FC<EscenaProps> = ({ lineas }) => {
  const [, q2, q2b, q3, q4, q5, q6] = lineas;
  const A = datos.equipos.Argentina;
  const F = datos.equipos.France;
  return (
    <Stage gap={18}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px 1fr", width: 1500, fontFamily: FONT, fontWeight: 900, fontSize: 56 }}>
        <span style={{ textAlign: "right", color: ARG }}>ARGENTINA</span>
        <span />
        <span style={{ color: FRA }}>FRANCIA</span>
      </div>
      <FilaEquipos at={q2.at} label="Pases" a={A.pases} b={F.pases} />
      <FilaEquipos
        at={q2b.at}
        label="% completados"
        a={Math.round((A.completados / A.pases) * 100)}
        b={Math.round((F.completados / F.pases) * 100)}
        suf="%"
      />
      <FilaEquipos at={q3.at} label="Tiros" a={A.tiros} b={F.tiros} />
      <FilaEquipos at={q4.at} label="Goles" a={A.goles} b={F.goles} />
      <FilaEquipos at={q5.at + Math.round(q5.frames * 0.45)} label="xG" a={A.xg} b={F.xg} dec={2} destacar />
      <Sticker delay={q6.at} bg={C.yellow} size={40}>
        ¿Qué es el xG? → Episodio 2
      </Sticker>
      <Sfx src="boom.wav" at={q4.at + 5} volume={0.3} />
    </Stage>
  );
};

/** Línea de código que se escribe letra por letra. */
const Codigo: React.FC<{ at: number; texto: string; dur?: number; resaltar?: string; resaltarDesde?: number }> = ({
  at,
  texto,
  dur = 30,
  resaltar,
  resaltarDesde = 1e9,
}) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [at, at + dur], [0, texto.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (frame < at) return <div style={{ height: 50 }} />;
  const vis = texto.slice(0, n);
  const i = resaltar ? vis.indexOf(resaltar) : -1;
  const on = frame >= resaltarDesde && i >= 0;
  return (
    <div style={{ fontFamily: MONO, fontSize: 32, color: C.ink, height: 50, whiteSpace: "pre" }}>
      <span style={{ color: C.dim }}>&gt;&gt;&gt; </span>
      {on ? (
        <>
          {vis.slice(0, i)}
          <span style={{ background: C.yellow, color: C.bg, borderRadius: 6, padding: "0 4px" }}>{resaltar}</span>
          {vis.slice(i + resaltar!.length)}
        </>
      ) : (
        vis
      )}
      {n < texto.length && <span style={{ color: C.green }}>▍</span>}
    </div>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y2b, y3, y3b, y4] = lineas;
  const conteo: [string, number][] = [
    ["Pass", 1263],
    ["Ball Receipt*", 1114],
    ["Carry", 940],
    ["Pressure", 361],
    ["Ball Recovery", 115],
  ];
  return (
    <Stage direction="row" gap={50}>
      <div
        style={{
          width: 980,
          background: "#060a16",
          border: `3px solid ${C.dim}44`,
          borderRadius: 24,
          padding: "22px 34px 30px",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python</span>
        </div>
        <Codigo at={y2.at} texto="from statsbombpy import sb" />
        <Codigo at={y2.at + 40} texto="df = sb.events(match_id=3869685)" resaltar="3869685" resaltarDesde={y3b.at} />
        <Codigo at={y2b.at} texto="len(df)" dur={12} />
        <Aparece at={y2b.at + 16}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: C.yellow, marginBottom: 12 }}>4407</div>
        </Aparece>
        <Codigo at={y3.at} texto={'df["type"].value_counts()'} dur={24} />
        {conteo.map(([t, v], i) => (
          <Aparece key={t} at={y3.at + 30 + i * 6}>
            <div style={{ fontFamily: MONO, fontSize: 28, color: C.ink, display: "flex", width: 420, justifyContent: "space-between" }}>
              <span>{t}</span>
              <span style={{ color: C.green }}>{v}</span>
            </div>
          </Aparece>
        ))}
      </div>
      <div style={{ width: 520, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
        <Aparece at={y1.at}>
          <Chip bg={C.green}>DATOS ABIERTOS</Chip>
        </Aparece>
        <Aparece at={y2b.at + 10}>
          <Card accent={C.blue} style={{ padding: "18px 24px" }}>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginBottom: 8 }}>vista simplificada de df</div>
            {[["minute", "player", "type"], ...datos.inicio.slice(0, 4).map((e) => [e.t.split(":")[0], e.jugador, e.tipo])].map(
              (r, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 190px 1fr",
                    fontFamily: MONO,
                    fontSize: 22,
                    color: i === 0 ? C.yellow : C.ink,
                    padding: "3px 0",
                  }}
                >
                  {r.map((c, j) => (
                    <span key={j}>{c}</span>
                  ))}
                </div>
              ),
            )}
          </Card>
        </Aparece>
        <Sticker delay={y3b.at + 10} bg={C.yellow} size={32}>
          Cambia el número → otro partido
        </Sticker>
        <Sticker delay={y4.at} bg={C.blue} color={C.ink} size={32} rotate={2}>
          Código en la descripción ↓
        </Sticker>
      </div>
    </Stage>
  );
};

const CierreFutbol: React.FC<EscenaProps> = (props) => {
  const [, z2] = props.lineas;
  return (
    <>
      <Sequence durationInFrames={z2.at} layout="none">
        <AbsoluteFill style={{ padding: "150px 120px 230px 120px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <Aparece at={0}>
            <Chip bg={C.yellow}>PRÓXIMO EPISODIO · #2</Chip>
          </Aparece>
          <Words text="¿Qué es el *xG*?" size={120} align="left" accent={C.green} delay={6} />
          <Words text="Por qué un tiro vale más que otro" size={52} weight={700} color={C.dim} align="left" delay={20} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={z2.at} layout="none">
        <Cierre {...props} />
      </Sequence>
    </>
  );
};

export const V01 = leerGuion(guion);

export const V01FutbolDatos: React.FC = () => (
  <VideoLargo
    guion={V01}
    escenas={{
      gancho: Gancho,
      serie: Serie,
      evento: Evento,
      quien: Quien,
      cancha: CanchaPlano,
      partido: Partido,
      messi: Messi,
      equipos: Equipos,
      python: Python,
      cierre: CierreFutbol,
    }}
    extra={<CreditoStatsBomb />}
  />
);
