import React from "react";
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

const MapaMini: React.FC<{ n: "Messi" | "Mbappé"; color: string }> = ({
  n,
  color,
}) => (
  <div style={{ height: 215, overflow: "hidden", borderRadius: 14 }}>
    <MediaVertical alto={270}>
      {datosEp03.jugadores[n]
        .filter((t) => !t.penal)
        .map((t, i) => (
          <circle
            key={i}
            cx={t.x}
            cy={t.y}
            r={1.4 + t.xg * 8}
            fill={t.gol ? color : `${color}44`}
            stroke={t.gol ? "#fff" : color}
            strokeWidth={0.6}
          />
        ))}
    </MediaVertical>
  </div>
);

export const MiniFutbol03: React.FC = () => (
  <FondoMini accent={C.blue}>
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 50,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <ChipMini bg={C.green}>FÚTBOL CON DATOS #3</ChipMini>
      <Grande size={112} color="#7cc6f2">
        MESSI
      </Grande>
      <Grande size={64}>vs</Grande>
      <Grande size={112} color={C.coral}>
        MBAPPÉ
      </Grande>
    </div>
    <div
      style={{
        position: "absolute",
        right: 30,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <MapaMini n="Messi" color="#7cc6f2" />
      <MapaMini n="Mbappé" color={C.coral} />
    </div>
  </FondoMini>
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
