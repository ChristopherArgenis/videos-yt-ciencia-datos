import React from "react";
import { C } from "../kit/theme";
import { ChipMini, FondoMini, Grande, MiniSplit } from "../kit/miniatura";

// Miniaturas 1280×720, una por video.
// Exportar: npx remotion still <id> out/miniaturas/<id>.png

const Personas: React.FC = () => {
  const colores = [C.green, C.blue, C.purple];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 80px)", gap: 22 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <svg key={i} width={80} height={90} viewBox="0 0 80 90">
          <circle cx={40} cy={24} r={20} fill={i === 3 || i === 11 ? C.yellow : colores[i % 3]} />
          <path d="M8 90 Q8 52 40 52 Q72 52 72 90 Z" fill={i === 3 || i === 11 ? C.yellow : colores[i % 3]} />
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

export const MiniFutbol01: React.FC = () => (
  <FondoMini accent={C.green}>
    <div style={{ position: "absolute", right: -40, top: 90, rotate: "-4deg", opacity: 0.95 }}>
      <Cancha width={760} lineas={0.8}>
        {datosEp01.puntos.map(([x, y, t], i) => (
          <circle
            key={i}
            cx={x as number}
            cy={y as number}
            r={0.75}
            fill={t === "Pass" ? C.green : t === "Carry" ? C.blue : t === "Pressure" ? C.coral : "#ffffff"}
            opacity={0.8}
          />
        ))}
      </Cancha>
    </div>
    <div style={{ position: "absolute", left: 60, top: 70, display: "flex", flexDirection: "column", gap: 18 }}>
      <ChipMini bg={C.green}>FÚTBOL CON DATOS #1</ChipMini>
      <Grande size={190} color={C.yellow}>
        4,407
      </Grande>
      <Grande size={150}>DATOS</Grande>
      <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, color: C.ink, textShadow: "0 4px 12px #000" }}>
        en una sola final
      </div>
    </div>
  </FondoMini>
);
