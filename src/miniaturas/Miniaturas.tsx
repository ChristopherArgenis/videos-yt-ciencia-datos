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
import datosEp03 from "../datos/privado/ep03.json";
import datosEp04 from "../datos/privado/ep04.json";
import { MediaVertical } from "../kit/cancha";
import { Red } from "../videos/V04RedPases";

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
const ROJO = "#ff5a4e";

const MapaRival: React.FC<{ n: "Messi" | "Mbappé"; color: string }> = ({
  n,
  color,
}) => (
  <div
    style={{
      height: 190,
      overflow: "hidden",
      borderRadius: 16,
      border: `4px solid ${color}`,
      boxShadow: `0 0 30px ${color}88, 0 12px 30px #000a`,
    }}
  >
    <MediaVertical alto={250}>
      {datosEp03.jugadores[n]
        .filter((t) => !t.penal)
        .map((t, i) => (
          <circle
            key={i}
            cx={t.x}
            cy={t.y}
            r={1.6 + t.xg * 9}
            fill={t.gol ? color : `${color}55`}
            stroke="#fff"
            strokeWidth={t.gol ? 0.8 : 0.3}
          />
        ))}
    </MediaVertical>
  </div>
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
          <stop offset="0" stopColor="#1f6fae" />
          <stop offset="1" stopColor="#0c2a4a" />
        </linearGradient>
        <linearGradient id="der" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b3262b" />
          <stop offset="1" stopColor="#3a0d14" />
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
    <div style={{ position: "absolute", left: 50, bottom: 40 }}>
      <MapaRival n="Messi" color={CELESTE} />
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
      <Nombre color={ROJO}>MBAPPÉ</Nombre>
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
    <div style={{ position: "absolute", right: 120, bottom: 40 }}>
      <MapaRival n="Mbappé" color={ROJO} />
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
        left: -30,
        right: 0,
        bottom: 24,
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
  <FondoMini accent={C.coral}>
    <div style={{ position: "absolute", right: 30, top: 150, opacity: 0.95 }}>
      <Red red={datosEp04.francia_antes} width={700} color={C.coral} />
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
      <Grande size={84} color={C.coral}>
        LOS SACÓ?
      </Grande>
    </div>
  </FondoMini>
);
