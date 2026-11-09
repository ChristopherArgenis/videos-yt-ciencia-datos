import React from "react";
import { Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Card, Counter, Fuente, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { Cierre, leerGuion, TituloCapitulo, VideoLargo, type EscenaProps } from "../kit/largo";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/plantilla.json";

// Video de prueba: muestra cómo se arma una escena y cómo se sincroniza con la voz.
// Cada escena recibe `lineas` (frase de Alex con su frame de inicio `at` y duración).

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2] = lineas;
  return (
    <Stage gap={50}>
      <Words text="¿Solo *23* personas?" size={150} stagger={4} />
      <Sequence from={g2.at} layout="none">
        <Sticker bg={C.coral} color={C.ink}>
          Pista: no son 183
        </Sticker>
        <Sfx src="pop.wav" at={0} />
      </Sequence>
      <Sfx src="boom.wav" at={g1.at} volume={0.35} />
    </Stage>
  );
};

const Barra: React.FC<{ label: string; valor: number; max: number; color: string; delay: number }> = ({
  label,
  valor,
  max,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 40], [0, (valor / max) * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ width: 820, fontFamily: FONT, color: C.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 38 }}>
        <span>{label}</span>
        <Counter to={valor} start={delay} dur={40} style={{ color }} />
      </div>
      <div style={{ height: 40, borderRadius: 20, background: C.bg2, marginTop: 8, overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: 20 }} />
      </div>
    </div>
  );
};

const Cap1: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2] = lineas;
  return (
    <>
      <Sequence durationInFrames={c2.at} layout="none">
        <TituloCapitulo n={2} nombre={guion.escenas[1].capitulo ?? ""} />
      </Sequence>
      <Sequence from={c2.at} layout="none">
        <Split
          left={
            <>
              <Words text="Comparas *parejas*, no personas" size={72} align="left" stagger={2} />
              <div style={{ fontFamily: MONO, fontSize: 34, color: C.dim }}>23 × 22 ÷ 2 = 253</div>
            </>
          }
          right={
            <Card accent={C.yellow} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <Barra label="Tu cumpleaños vs. los demás" valor={22} max={253} color={C.blue} delay={10} />
              <Barra label="Todas las parejas" valor={253} max={253} color={C.yellow} delay={30} />
            </Card>
          }
        />
        <Fuente>Ejemplo simplificado</Fuente>
      </Sequence>
      <Sfx src="whoosh.wav" at={c1.at} volume={0.3} />
    </>
  );
};

export const PLANTILLA = leerGuion(guion);

export const Plantilla: React.FC = () => (
  <VideoLargo guion={PLANTILLA} escenas={{ gancho: Gancho, cap1: Cap1, cierre: Cierre }} />
);
