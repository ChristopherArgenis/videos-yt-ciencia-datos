import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import duracionesJson from "../voz-duraciones.json";
import tiempos from "./tiempos.json";
import { Bg, Handle, Sfx, Stage, useIn, Words } from "./kit";
import { C, FONT, MONO } from "./theme";

// Motor de videos largos.
// Un video = un guion JSON (src/guiones/<id>.json) + un componente por escena.
// La duración de cada escena sale de la voz de Alex: primero se genera la voz
// (scripts/make_voice.py) y el video se acomoda solo a esos tiempos.

export type EscenaGuion = {
  id: string;
  /** Si la escena abre un capítulo, su nombre (sale en la barra y en la descripción). */
  capitulo?: string;
  /** Qué se ve en pantalla (solo para revisar el guion). */
  pantalla?: string;
  /** Frases de Alex en orden: { id: texto }. Los ids no se repiten en el video. */
  voz: Record<string, string>;
  /** Texto del subtítulo cuando debe verse distinto a lo que dice Alex (cifras con números). */
  sub?: Record<string, string>;
  /** Segundos de silencio al final de la escena. */
  pausa?: number;
  /** Duración mínima de la escena en segundos. */
  min?: number;
};

export type Guion = {
  id: string;
  titulo: string;
  aprobado: boolean;
  musica: string;
  acento?: string;
  subtitulos?: boolean;
  escenas: EscenaGuion[];
};

export type LineaPlan = {
  id: string;
  texto: string;
  /** Lo que se lee en el subtítulo. */
  subtitulo: string;
  /** Frame de inicio, relativo a la escena. */
  at: number;
  frames: number;
  /** true si ya existe el audio de Alex (si no, la duración es estimada). */
  real: boolean;
};

export type EscenaPlan = {
  id: string;
  capitulo?: string;
  from: number;
  frames: number;
  lineas: LineaPlan[];
};

export type Plan = { escenas: EscenaPlan[]; total: number; vozCompleta: boolean };

const duraciones = duracionesJson as Record<string, Record<string, number>>;

const segAFrames = (s: number) => Math.ceil(s * tiempos.fps);

const estimar = (texto: string) =>
  Math.max(1, texto.split(/\s+/).filter(Boolean).length / tiempos.palabrasPorSegundo);

/** Calcula en qué frame empieza cada escena y cada frase. */
export const planificar = (g: Guion): Plan => {
  const dur = duraciones[g.id] ?? {};
  const vistos = new Set<string>();
  let from = 0;
  let vozCompleta = true;
  const escenas = g.escenas.map((e) => {
    let t = segAFrames(tiempos.inicio);
    const ids = Object.keys(e.voz);
    const lineas = ids.map((id, i) => {
      if (vistos.has(id)) throw new Error(`Frase repetida en ${g.id}: ${id}`);
      vistos.add(id);
      const real = dur[id] !== undefined;
      if (!real) vozCompleta = false;
      const frames = segAFrames(real ? dur[id] : estimar(e.voz[id]));
      const l: LineaPlan = { id, texto: e.voz[id], subtitulo: e.sub?.[id] ?? e.voz[id], at: t, frames, real };
      t += frames + (i < ids.length - 1 ? segAFrames(tiempos.entre) : 0);
      return l;
    });
    t += segAFrames(e.pausa ?? tiempos.pausa);
    const frames = Math.max(t, segAFrames(e.min ?? 0));
    const plan: EscenaPlan = { id: e.id, capitulo: e.capitulo, from, frames, lineas };
    from += frames;
    return plan;
  });
  return { escenas, total: from, vozCompleta };
};

/** Lo que recibe cada componente de escena. */
export type EscenaProps = { lineas: LineaPlan[]; frames: number };
export type Escenas = Record<string, React.FC<EscenaProps>>;

// ---------- Audio ----------

const Narracion: React.FC<{ id: string; plan: Plan }> = ({ id, plan }) => (
  <>
    {plan.escenas.flatMap((e) =>
      e.lineas
        .filter((l) => l.real)
        .map((l) => (
          <Sequence key={l.id} from={e.from + l.at} layout="none" name={`Voz ${l.id}`}>
            <Audio src={staticFile(`voz/${id}/${l.id}.wav`)} volume={1} />
          </Sequence>
        )),
    )}
  </>
);

/** Música en bucle: baja cuando habla Alex, sube en los silencios, entra y sale suave. */
const MusicaFondo: React.FC<{ src: string; plan: Plan; alto?: number; bajo?: number }> = ({
  src,
  plan,
  alto = 0.16,
  bajo = 0.045,
}) => {
  const { fps } = useVideoConfig();
  const tramos = plan.escenas.flatMap((e) =>
    e.lineas.map((l) => [e.from + l.at, e.from + l.at + l.frames] as const),
  );
  return (
    <Audio
      name="Música"
      src={staticFile(src)}
      loop
      volume={(f) => {
        let k = 0;
        for (const [a, b] of tramos) {
          if (f < a - 12 || f > b + 15) continue;
          k = Math.max(
            k,
            interpolate(f, [a - 12, a, b, b + 15], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          );
        }
        const entra = interpolate(f, [0, fps], [0, 1], { extrapolateRight: "clamp" });
        const sale = interpolate(f, [plan.total - 2.5 * fps, plan.total], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (alto - (alto - bajo) * k) * entra * sale;
      }}
    />
  );
};

// ---------- Subtítulos ----------

/** Corta una frase en trozos de hasta `max` palabras, prefiriendo cortar en comas y puntos. */
const trozos = (texto: string, max = 8) => {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur: string[] = [];
  for (const p of palabras) {
    cur.push(p);
    const corte = /[,.;:?!…]$/.test(p) && cur.length >= 3;
    if (cur.length >= max || corte) {
      out.push(cur.join(" "));
      cur = [];
    }
  }
  if (cur.length) out.push(cur.join(" "));
  return out;
};

const Subtitulos: React.FC<{ plan: Plan }> = ({ plan }) => {
  const frame = useCurrentFrame();
  let texto = "";
  for (const e of plan.escenas) {
    if (frame < e.from || frame >= e.from + e.frames) continue;
    for (const l of e.lineas) {
      const a = e.from + l.at;
      if (frame < a || frame >= a + l.frames) continue;
      const partes = trozos(l.subtitulo);
      const total = partes.reduce((s, p) => s + p.length, 0);
      let acc = 0;
      for (const p of partes) {
        acc += p.length;
        if (frame - a < (acc / total) * l.frames) {
          texto = p;
          break;
        }
      }
    }
  }
  if (!texto) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 58,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.2,
          color: "#ffffff",
          WebkitTextStroke: "8px #000000",
          paintOrder: "stroke fill",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// ---------- Capítulos ----------

type Cap = { nombre: string; from: number; to: number };

export const capitulos = (plan: Plan): Cap[] => {
  const caps: Cap[] = [];
  for (const e of plan.escenas) {
    if (e.capitulo || caps.length === 0)
      caps.push({ nombre: e.capitulo ?? "Inicio", from: e.from, to: plan.total });
    if (caps.length > 1) caps[caps.length - 2].to = caps[caps.length - 1].from;
  }
  return caps;
};

/** Barra de progreso por capítulos (arriba) + nombre del capítulo actual. */
const BarraCapitulos: React.FC<{ plan: Plan; acento: string }> = ({ plan, acento }) => {
  const frame = useCurrentFrame();
  const caps = capitulos(plan);
  const i = Math.max(0, caps.findIndex((c) => frame >= c.from && frame < c.to));
  const actual = caps[i];
  const enCap = frame - actual.from;
  const chip = interpolate(enCap, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex", gap: 6 }}>
        {caps.map((c, k) => {
          const p = interpolate(frame, [c.from, c.to], [0, 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={k} style={{ flex: c.to - c.from, background: `${C.dim}33` }}>
              <div style={{ width: `${p}%`, height: "100%", background: acento }} />
            </div>
          );
        })}
      </div>
      {caps.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 26,
            color: C.ink,
            opacity: chip,
            translate: `${interpolate(chip, [0, 1], [-20, 0])}px 0px`,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 22,
              background: acento,
              color: C.bg,
              borderRadius: 10,
              padding: "4px 12px",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          {actual.nombre}
        </div>
      )}
    </>
  );
};

// ---------- Escenas comunes ----------

/** Tarjeta grande al inicio de un capítulo. */
export const TituloCapitulo: React.FC<{ n: number; nombre: string; acento?: string }> = ({
  n,
  nombre,
  acento = C.yellow,
}) => {
  const p = useIn(0);
  return (
    <Stage gap={20}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 40,
          color: acento,
          opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        CAPÍTULO {n}
      </div>
      <Words text={nombre} size={120} delay={6} />
      <Sfx src="whoosh.wav" at={0} volume={0.35} />
    </Stage>
  );
};

/**
 * Cierre estándar del canal. Deja libre la mitad derecha para la pantalla
 * final de YouTube (2 videos + botón de suscribirse), que pide 5–20 s al final.
 */
export const Cierre: React.FC<EscenaProps> = () => (
  <AbsoluteFill style={{ padding: "150px 120px 210px 120px", display: "flex", flexDirection: "row" }}>
    <div style={{ flex: 0.46, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
      <Words text="¿Te *sirvió?*" size={110} align="left" />
      <Words text="Ve más videos en" size={54} weight={800} align="left" delay={18} stagger={2} />
      <Words
        text="*@UniversoCienciaDatos*"
        size={50}
        weight={800}
        align="left"
        delay={28}
        accent={C.green}
        style={{ fontFamily: MONO }}
      />
      <Words text="Suscríbete y sigue aprendiendo →" size={38} weight={600} color={C.dim} align="left" delay={45} />
      <Sfx src="ding.wav" at={18} volume={0.4} />
    </div>
    <div style={{ flex: 0.54 }} />
  </AbsoluteFill>
);

// ---------- Video completo ----------

const Entrada: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
      {children}
    </AbsoluteFill>
  );
};

export const VideoLargo: React.FC<{ guion: Guion; escenas: Escenas }> = ({ guion, escenas }) => {
  const plan = planificar(guion);
  const acento = guion.acento ?? C.blue;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Bg accent={acento} />
      {plan.escenas.map((e) => {
        const Comp = escenas[e.id];
        if (!Comp) throw new Error(`Falta el componente de la escena "${e.id}" en ${guion.id}`);
        return (
          <Sequence key={e.id} from={e.from} durationInFrames={e.frames} name={e.id}>
            <Entrada>
              <Comp lineas={e.lineas} frames={e.frames} />
            </Entrada>
          </Sequence>
        );
      })}
      <Handle />
      <BarraCapitulos plan={plan} acento={acento} />
      {guion.subtitulos !== false && <Subtitulos plan={plan} />}
      <Narracion id={guion.id} plan={plan} />
      <MusicaFondo src={guion.musica} plan={plan} />
    </AbsoluteFill>
  );
};

/** Convierte el JSON importado de src/guiones/ al tipo Guion. */
export const leerGuion = (json: unknown) => json as Guion;
