import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../kit/theme";
import { ChipMini, FondoMini, Grande, MiniSplit } from "../kit/miniatura";

// Miniaturas 1280×720, una por video.
// Exportar: npx remotion still <id> out/miniaturas/<id>.png

const Personas: React.FC = () => {
  const colores = [C.green, C.blue, C.purple];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 80px)",
        gap: 22,
      }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <svg key={i} width={80} height={90} viewBox="0 0 80 90">
          <circle
            cx={40}
            cy={24}
            r={20}
            fill={i === 3 || i === 11 ? C.yellow : colores[i % 3]}
          />
          <path
            d="M8 90 Q8 52 40 52 Q72 52 72 90 Z"
            fill={i === 3 || i === 11 ? C.yellow : colores[i % 3]}
          />
        </svg>
      ))}
    </div>
  );
};

export const MiniPlantilla: React.FC = () => (
  <FondoMini accent={C.yellow}>
    <MiniSplit
      texto={
        <>
          <ChipMini bg={C.coral} color={C.ink}>
            PROBABILIDAD
          </ChipMini>
          <Grande size={170}>¿SOLO</Grande>
          <Grande size={210} color={C.yellow}>
            23?
          </Grande>
        </>
      }
      visual={<Personas />}
    />
  </FondoMini>
);

// ---------- Fútbol con Datos ----------
import { Cancha } from "../kit/cancha";
import datosEp01 from "../datos/privado/ep01.json";
import datosEp02 from "../datos/privado/ep02.json";
import datosEp04 from "../datos/privado/ep04.json";
import { Red } from "../videos/V04RedPases";
import { ESP, FRA, FRA_TEXTO, JPN, MAR } from "../kit/futbol";
import datosEp05 from "../datos/privado/ep05.json";
import datosEp06 from "../datos/privado/ep06.json";
import { Calor } from "../kit/calor";

export const MiniFutbol01: React.FC = () => (
  <FondoMini accent={C.green}>
    <div
      style={{
        position: "absolute",
        right: -40,
        top: 90,
        rotate: "-4deg",
        opacity: 0.95,
      }}
    >
      <Cancha width={760} lineas={0.8}>
        {datosEp01.puntos.map(([x, y, t], i) => (
          <circle
            key={i}
            cx={x as number}
            cy={y as number}
            r={0.75}
            fill={
              t === "Pass"
                ? C.green
                : t === "Carry"
                  ? C.blue
                  : t === "Pressure"
                    ? C.coral
                    : "#ffffff"
            }
            opacity={0.8}
          />
        ))}
      </Cancha>
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 70,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <ChipMini bg={C.green}>FÚTBOL CON DATOS #1</ChipMini>
      <Grande size={190} color={C.yellow}>
        4,407
      </Grande>
      <Grande size={150}>DATOS</Grande>
      <div
        style={{
          fontFamily: "Poppins",
          fontWeight: 800,
          fontSize: 40,
          color: C.ink,
          textShadow: "0 4px 12px #000",
        }}
      >
        en una sola final
      </div>
    </div>
  </FondoMini>
);

const probColor = (p: number) => {
  const t = Math.min(1, p / 0.45);
  const mix = (a: number[], b: number[], k: number) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const c =
    t < 0.5
      ? mix([40, 70, 160], [255, 209, 102], t / 0.5)
      : mix([255, 209, 102], [255, 70, 60], (t - 0.5) / 0.5);
  return `rgb(${c.join(",")})`;
};

export const MiniFutbol02: React.FC = () => {
  const mb = datosEp02.final.find(
    (t) => t.jugador === "Mbappé" && t.min === 81,
  )!;
  return (
    <FondoMini accent={C.coral}>
      <div style={{ position: "absolute", right: 40, top: 30 }}>
        <Cancha width={470} mitad lineas={0.9}>
          {datosEp02.rejilla.map((fila, i) =>
            fila.map((p, k) => (
              <rect
                key={`${i}-${k}`}
                x={60 + i * 2}
                y={k * 2}
                width={2.05}
                height={2.05}
                fill={probColor(p)}
                opacity={0.85}
              />
            )),
          )}
          <line
            x1={mb.x}
            y1={mb.y}
            x2={120}
            y2={40}
            stroke="#fff"
            strokeWidth={0.8}
            strokeDasharray="1.5 1"
          />
          <circle
            cx={mb.x}
            cy={mb.y}
            r={2.6}
            fill="#fff"
            stroke={C.bg}
            strokeWidth={0.6}
          />
        </Cancha>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 80,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <ChipMini bg={C.green}>FÚTBOL CON DATOS #2</ChipMini>
        <Grande size={250} color={C.yellow}>
          10 %
        </Grande>
        <Grande size={96}>¿GOL O</Grande>
        <Grande size={96} color={C.coral}>
          MILAGRO?
        </Grande>
      </div>
    </FondoMini>
  );
};

// Rivalidad: pantalla partida en diagonal, el 10 de fondo (los dos llevaban el 10),
// rayo con "VS" en el centro. Sin fotos ni escudos (regla del canal).
const CELESTE = "#7cc6f2";
const MARINO = "#1d2f6e"; // camiseta de Francia
const MARINO_TEXTO = "#e8edff";

/**
 * Silueta de futbolista de perfil, mirando a la derecha (sin rostro: es una figura genérica,
 * no un retrato). `rayas` dibuja la camiseta a rayas verticales.
 */
const Jugador: React.FC<{
  color: string;
  halo?: string;
  rayas?: boolean;
  espejo?: boolean;
  alto?: number;
  numero?: string;
}> = ({
  color,
  halo,
  rayas = false,
  espejo = false,
  alto = 460,
  numero = "10",
}) => {
  const id = `torso-${color.replace("#", "")}`;
  const piel = "#0b1020";
  const borde = "#ffffff55";
  const torso =
    "M 74 106 Q 110 90 146 106 L 156 168 Q 154 212 144 242 L 78 242 Q 68 204 68 160 Z";
  return (
    <svg
      width={(alto * 230) / 440}
      height={alto}
      viewBox="0 0 230 440"
      style={{
        overflow: "visible",
        transform: espejo ? "scaleX(-1) rotate(5deg)" : "rotate(5deg)",
        transformOrigin: "50% 95%",
      }}
    >
      <defs>
        <clipPath id={id}>
          <path d={torso} />
        </clipPath>
        <filter
          id={`brillo-${id}`}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {/* Halo del color del equipo */}
      <ellipse
        cx={112}
        cy={230}
        rx={110}
        ry={210}
        fill={halo ?? color}
        opacity={0.35}
        filter={`url(#brillo-${id})`}
      />
      {/* Pierna de atrás */}
      <line
        x1={100}
        y1={258}
        x2={82}
        y2={336}
        stroke={piel}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <line
        x1={82}
        y1={336}
        x2={70}
        y2={404}
        stroke={color}
        strokeWidth={25}
        strokeLinecap="round"
      />
      <ellipse cx={80} cy={414} rx={24} ry={11} fill="#f5f5f5" />
      {/* Brazo de atrás */}
      <polyline
        points="80,118 66,180 76,236"
        fill="none"
        stroke={piel}
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Short */}
      <path
        d="M 76 236 L 146 236 L 156 292 L 124 296 L 111 268 L 98 296 L 68 292 Z"
        fill={rayas ? "#111a3a" : "#f5f5f5"}
        stroke={borde}
        strokeWidth={2}
      />
      {/* Pierna de adelante */}
      <line
        x1={120}
        y1={260}
        x2={152}
        y2={332}
        stroke={piel}
        strokeWidth={31}
        strokeLinecap="round"
      />
      <line
        x1={152}
        y1={332}
        x2={164}
        y2={400}
        stroke={color}
        strokeWidth={25}
        strokeLinecap="round"
      />
      <ellipse cx={178} cy={410} rx={26} ry={11} fill="#f5f5f5" />
      {/* Camiseta */}
      <path d={torso} fill={color} stroke={borde} strokeWidth={2} />
      {rayas && (
        <g clipPath={`url(#${id})`}>
          {[78, 104, 130].map((x) => (
            <rect key={x} x={x} y={80} width={13} height={180} fill="#ffffff" />
          ))}
        </g>
      )}
      {/* Manga y brazo de adelante */}
      <polyline
        points="140,116 172,160 198,140"
        fill="none"
        stroke={piel}
        strokeWidth={22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={202}
        cy={137}
        r={14}
        fill={piel}
        stroke={borde}
        strokeWidth={2}
      />
      <path d="M 128 108 Q 152 110 160 140 L 140 150 Z" fill={color} />
      {/* Cuello y cabeza */}
      <rect x={100} y={78} width={22} height={26} fill={piel} />
      <path
        d="M 114 25 A 31 31 0 1 0 128 84 L 136 78 Q 142 72 140 66 L 152 62 L 143 48 Q 141 34 130 28 Q 122 25 114 25 Z"
        fill={piel}
        stroke={borde}
        strokeWidth={2}
      />
      {/* El 10 */}
      <text
        x={112}
        y={198}
        textAnchor="middle"
        fontFamily="Poppins"
        fontWeight={900}
        fontSize={64}
        fill="#ffd166"
        stroke="#0b1020"
        strokeWidth={6}
        paintOrder="stroke"
        transform={espejo ? "translate(224 0) scale(-1 1)" : undefined}
      >
        {numero}
      </text>
    </svg>
  );
};

/** Balón sencillo. */
const Balon: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <circle r={46} fill="#ffffff" stroke="#0b1020" strokeWidth={4} />
    <polygon points="0,-16 15,-5 9,13 -9,13 -15,-5" fill="#0b1020" />
    {[0, 72, 144, 216, 288].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <line
          x1={0}
          y1={-16}
          x2={0}
          y2={-30}
          stroke="#0b1020"
          strokeWidth={3}
        />
        <path d="M -10 -44 L 0 -30 L 10 -44" fill="#0b1020" />
      </g>
    ))}
  </svg>
);

const Nombre: React.FC<{
  children: React.ReactNode;
  color: string;
  size?: number;
}> = ({ children, color, size = 128 }) => (
  <div
    style={{
      fontFamily: "Poppins",
      fontWeight: 900,
      fontSize: size,
      lineHeight: 0.9,
      color,
      letterSpacing: -3,
      WebkitTextStroke: "6px #0b1020",
      paintOrder: "stroke fill",
      textShadow: "0 10px 0 rgba(0,0,0,0.45), 0 0 40px rgba(0,0,0,0.5)",
    }}
  >
    {children}
  </div>
);

export const MiniFutbol03: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0b1020", overflow: "hidden" }}>
    {/* Mitades en diagonal */}
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="izq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4aa8e8" />
          <stop offset="1" stopColor="#14466f" />
        </linearGradient>
        <linearGradient id="der" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3f8f" />
          <stop offset="1" stopColor="#0a1233" />
        </linearGradient>
      </defs>
      <polygon points="0,0 720,0 560,720 0,720" fill="url(#izq)" />
      <polygon points="720,0 1280,0 1280,720 560,720" fill="url(#der)" />
      {/* "10" gigante de fondo en cada lado */}
      <text
        x={300}
        y={600}
        textAnchor="middle"
        fontFamily="Poppins"
        fontWeight={900}
        fontSize={560}
        fill="#ffffff"
        opacity={0.08}
      >
        10
      </text>
      <text
        x={1000}
        y={600}
        textAnchor="middle"
        fontFamily="Poppins"
        fontWeight={900}
        fontSize={560}
        fill="#ffffff"
        opacity={0.08}
      >
        10
      </text>
      {/* Rayo en la línea divisoria */}
      <polyline
        points="720,0 660,250 700,250 620,470 665,470 560,720"
        fill="none"
        stroke="#ffd166"
        strokeWidth={22}
        opacity={0.35}
      />
      <polyline
        points="720,0 660,250 700,250 620,470 665,470 560,720"
        fill="none"
        stroke="#fff6d5"
        strokeWidth={8}
      />
    </svg>

    {/* Lado Messi */}
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Nombre color={CELESTE}>MESSI</Nombre>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <Nombre color="#ffd166" size={110}>
          7
        </Nombre>
        <span
          style={{
            fontFamily: "Poppins",
            fontWeight: 900,
            fontSize: 40,
            color: "#fff",
            textShadow: "0 4px 10px #000",
          }}
        >
          GOLES
        </span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 255, bottom: -24 }}>
      <Jugador color={CELESTE} rayas />
    </div>

    {/* Lado Mbappé */}
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
      }}
    >
      <Nombre color={MARINO_TEXTO}>MBAPPÉ</Nombre>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "Poppins",
            fontWeight: 900,
            fontSize: 40,
            color: "#fff",
            textShadow: "0 4px 10px #000",
          }}
        >
          GOLES
        </span>
        <Nombre color="#ffd166" size={110}>
          8
        </Nombre>
      </div>
    </div>
    <div style={{ position: "absolute", right: 255, bottom: -24 }}>
      <Jugador color={MARINO} halo="#5b7cff" espejo />
    </div>

    {/* Balón entre los dos */}
    <div style={{ position: "absolute", left: 640 - 42, bottom: 22 }}>
      <Balon size={84} />
    </div>

    {/* Insignia VS en el centro */}
    <div
      style={{
        position: "absolute",
        left: 640 - 95,
        top: 360 - 95,
        width: 190,
        height: 190,
        borderRadius: 95,
        background:
          "radial-gradient(circle at 35% 30%, #fff3c4, #ffd166 45%, #e0a422)",
        border: "8px solid #0b1020",
        boxShadow: "0 0 60px #ffd166cc, 0 14px 30px #000c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        rotate: "-8deg",
      }}
    >
      <span
        style={{
          fontFamily: "Poppins",
          fontWeight: 900,
          fontSize: 92,
          color: "#0b1020",
          letterSpacing: -4,
        }}
      >
        VS
      </span>
    </div>

    {/* Sello de la serie */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 470,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Poppins",
          fontWeight: 900,
          fontSize: 26,
          background: C.green,
          color: "#0b1020",
          padding: "6px 18px",
          borderRadius: 12,
          boxShadow: "0 8px 20px #0008",
        }}
      >
        FÚTBOL CON DATOS #3
      </div>
    </div>
  </AbsoluteFill>
);

export const MiniFutbol04: React.FC = () => (
  <FondoMini accent={FRA}>
    <div style={{ position: "absolute", right: 30, top: 150, opacity: 0.95 }}>
      <Red red={datosEp04.francia_antes} width={700} color={FRA} />
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 60,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <ChipMini bg={C.green}>FÚTBOL CON DATOS #4</ChipMini>
      <Grande size={230} color={C.yellow}>
        41&apos;
      </Grande>
      <Grande size={84}>¿POR QUÉ</Grande>
      <Grande size={84} color={FRA_TEXTO}>
        LOS SACÓ?
      </Grande>
    </div>
  </FondoMini>
);

/** Chip de marcador para miniaturas. */
const MarcadorMini: React.FC<{ texto: string; color: string }> = ({
  texto,
  color,
}) => (
  <div
    style={{
      fontFamily: "Poppins",
      fontWeight: 900,
      fontSize: 34,
      color: "#fff",
      background: "#0b1020cc",
      border: `4px solid ${color}`,
      borderRadius: 14,
      padding: "6px 18px",
      boxShadow: "0 8px 20px #0008",
    }}
  >
    {texto}
  </div>
);

export const MiniFutbol05: React.FC = () => {
  const jap = datosEp05.equipos.find((e) => e.en === "Japan")!;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020", overflow: "hidden" }}>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="jap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2b5fd8" />
            <stop offset="1" stopColor="#0b1d4d" />
          </linearGradient>
        </defs>
        <polygon points="0,0 760,0 620,720 0,720" fill="url(#jap)" />
        <text
          x={320}
          y={640}
          textAnchor="middle"
          fontFamily="Poppins"
          fontWeight={900}
          fontSize={420}
          fill="#ffffff"
          opacity={0.07}
        >
          #1
        </text>
        <polyline
          points="760,0 700,250 740,250 660,470 705,470 620,720"
          fill="none"
          stroke="#ffd166"
          strokeWidth={20}
          opacity={0.3}
        />
        <polyline
          points="760,0 700,250 740,250 660,470 705,470 620,720"
          fill="none"
          stroke="#fff6d5"
          strokeWidth={7}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 40,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Nombre color="#ffffff" size={150}>
          JAPÓN
        </Nombre>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <Nombre color="#ffd166" size={150}>
            {Math.round(jap.pres90)}
          </Nombre>
          <span
            style={{
              fontFamily: "Poppins",
              fontWeight: 900,
              fontSize: 44,
              color: "#fff",
              textShadow: "0 4px 10px #000",
              lineHeight: 1,
            }}
          >
            PRESIONES
            <br />
            POR PARTIDO
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 14,
          }}
        >
          <MarcadorMini texto="Japón 2–1 Alemania" color={C.ink} />
          <MarcadorMini texto="Japón 2–1 España" color={ESP} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 330, bottom: -24 }}>
        <Jugador color={JPN} halo="#5b8cff" numero="" />
      </div>
      <div
        style={{ position: "absolute", right: 30, bottom: -24, opacity: 0.8 }}
      >
        <Jugador color="#9aa0b8" halo="#444" espejo alto={430} numero="" />
      </div>
      <div style={{ position: "absolute", right: 245, bottom: 22 }}>
        <Balon size={70} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 22,
          display: "flex",
          justifyContent: "center",
          paddingRight: 420,
        }}
      >
        <ChipMini bg={C.green}>FÚTBOL CON DATOS #5</ChipMini>
      </div>
    </AbsoluteFill>
  );
};

export const MiniFutbol06: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0b1020", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        right: -60,
        top: 120,
        rotate: "-5deg",
        opacity: 0.95,
      }}
    >
      <Calor grid={datosEp06.espana.calor} width={860} />
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, #0b1020 30%, #0b102000 70%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 40,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <ChipMini bg={C.green}>FÚTBOL CON DATOS #6</ChipMini>
      <Nombre color={ESP} size={230}>
        75 %
      </Nombre>
      <Nombre color="#ffffff" size={100}>
        DEL BALÓN…
      </Nombre>
      <Nombre color="#ffd166" size={120}>
        Y PERDIÓ
      </Nombre>
    </div>
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 30,
        display: "flex",
        gap: 14,
      }}
    >
      <MarcadorMini texto="España 0–0 Marruecos" color={ESP} />
    </div>
    <div style={{ position: "absolute", right: 140, bottom: 40 }}>
      <MarcadorMini texto="Penales 0–3" color={MAR} />
    </div>
  </AbsoluteFill>
);
