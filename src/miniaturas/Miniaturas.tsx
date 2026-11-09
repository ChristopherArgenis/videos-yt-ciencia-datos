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
