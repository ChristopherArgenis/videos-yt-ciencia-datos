import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { CierreCurso, COL, Cuidado, Formula, Objetivo, Paso, PlusDatos, Recuerda, RetoResumen, SerieCalculo } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c08-cadena.json";

// Cálculo Diferencial #8 · Regla de la cadena. Énfasis matemático; la Ciencia de Datos es un plus.

const Engrane: React.FC<{ label: string; color: string; at: number }> = ({ label, color, at }) => (
  <Aparece at={at}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width={170} height={170} viewBox="-85 -85 170 170">
        <circle r={62} fill={`${C.bg2}`} stroke={color} strokeWidth={10} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-9} y={-82} width={18} height={26} rx={4} fill={color} transform={`rotate(${i * 45})`} />
        ))}
        <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={60} fill={C.ink}>
          {label}
        </text>
      </svg>
    </div>
  </Aparece>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  return (
    <Stage gap={34}>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <Engrane label="A" color={C.blue} at={g1.at} />
        <Engrane label="B" color={C.green} at={g1.at + 25} />
        <Engrane label="C" color={C.yellow} at={g1.at + 50} />
      </div>
      <Aparece at={g2.at}>
        <Formula tex={"\\text{¿A respecto a C?}"} size={60} color={C.dim} />
      </Aparece>
      <Aparece at={g3.at}>
        <Formula tex={"\\reg{3} \\times \\reg{2} = \\der{6}"} size={90} />
      </Aparece>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={36}>
          Los ritmos se MULTIPLICAN
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>(f · g)' = f'g + fg'</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"(\\ent{x} e^{\\ent{x}})' = e^{\\ent{x}} + \\ent{x} e^{\\ent{x}}"} size={60} />
          <Formula tex={"f'(\\ent{0}) = \\der{1}"} size={70} />
        </div>
      }
    />
  );
};

const ObjetivoEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [o1] = lineas;
  const t = o1.frames / 3;
  return (
    <Objetivo
      at={0}
      metas={[
        { at: o1.at + 10, t: "Reconocer una función dentro de otra" },
        { at: o1.at + t, t: "Usar la regla de la cadena" },
        { at: o1.at + 2 * t, t: "Aplicarla a potencias, exponenciales y logaritmos" },
      ]}
    />
  );
};

const Composicion: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3] = lineas;
  return (
    <Stage gap={34}>
      <Words text="Una función *dentro* de otra" size={70} accent={C.yellow} delay={a1.at} />
      <Aparece at={a1.at + 30}>
        <Formula tex={"f(g(x)) = (\\reg{3x + 1})^{\\der{5}}"} size={80} />
      </Aparece>
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={a2.at}>
          <Card accent={COL.entrada} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: COL.entrada }}>ADENTRO</div>
            <Formula tex={"u = g(x) = 3x + 1"} size={52} />
          </Card>
        </Aparece>
        <Aparece at={a3.at}>
          <Card accent={COL.salida} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: COL.salida }}>AFUERA</div>
            <Formula tex={"f(u) = u^5"} size={52} />
          </Card>
        </Aparece>
      </div>
    </Stage>
  );
};

const Regla: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3] = lineas;
  return (
    <Stage gap={34}>
      <Aparece at={b1.at}>
        <Formula tex={"[f(g(x))]' = \\reg{f'(g(x))} \\cdot \\der{g'(x)}"} size={84} />
      </Aparece>
      <Aparece at={b2.at}>
        <Chip bg={C.bg2} color={C.ink} size={30}>
          afuera: se deriva sin tocar lo de adentro · por la derivada de adentro
        </Chip>
      </Aparece>
      <Aparece at={b3.at}>
        <Formula tex={"\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}"} size={64} color={C.dim} />
      </Aparece>
    </Stage>
  );
};

const Ejemplo1: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={28}>
      <Aparece at={e1.at}>
        <Formula tex={"(3x + 1)^5"} size={80} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Paso at={e1.at + 30} n={1} tex={"5(3x + 1)^4"} nota="afuera" on={frame < e2.at} ancho={700} size={60} />
        <Paso at={e2.at} n={2} tex={"\\cdot 3"} nota="adentro" on={frame >= e2.at && frame < e3.at} ancho={700} size={60} />
        <Paso at={e3.at} n={3} tex={"= \\sal{15(3x + 1)^4}"} on={frame >= e3.at} ancho={700} size={60} />
      </div>
      <Aparece at={e4.at}>
        <Card accent={C.dim} style={{ padding: "12px 34px" }}>
          <Formula tex={"(3x+1)^2 = 9x^2 + 6x + 1 \\Rightarrow 18x + 6"} size={44} />
          <Formula tex={"2(3x+1) \\cdot 3 = 18x + 6 \\;\\checkmark"} size={44} color={C.green} />
        </Card>
      </Aparece>
    </Stage>
  );
};

const Ejemplo2: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2, f3] = lineas;
  return (
    <Stage gap={30}>
      <Words text="Con exponenciales y *logaritmos*" size={64} accent={C.yellow} delay={f1.at} />
      <div style={{ display: "flex", gap: 36 }}>
        <Aparece at={f2.at}>
          <Card accent={C.blue} style={{ width: 720, textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
            <Formula tex={"e^{-x^2}"} size={60} />
            <Formula tex={"\\der{-2x \\, e^{-x^2}}"} size={56} />
          </Card>
        </Aparece>
        <Aparece at={f3.at}>
          <Card accent={COL.salida} style={{ width: 720, textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
            <Formula tex={"\\ln(x^2 + 1)"} size={60} />
            <Formula tex={"\\der{\\dfrac{2x}{x^2 + 1}}"} size={56} />
          </Card>
        </Aparece>
      </div>
    </Stage>
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  const p = useP(u1.at, u2.at);
  const r = 60 + 110 * p;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="¿Para qué se *usa*?" size={64} align="left" accent={C.blue} delay={u1.at} />
          <Aparece at={u1.at + 30}>
            <Formula tex={"V = \\tfrac{4}{3}\\pi r^3"} size={60} />
          </Aparece>
          <Aparece at={u2.at}>
            <Formula tex={"\\dfrac{dV}{dt} = \\dfrac{dV}{dr} \\cdot \\dfrac{dr}{dt}"} size={54} />
          </Aparece>
          <Aparece at={u2.at + u2.frames * 0.5}>
            <Formula tex={"r = 10: \\; \\der{800\\pi \\approx 2513\\ \\text{cm}^3/\\text{s}}"} size={46} />
          </Aparece>
          <Chip bg={C.bg2} color={C.ink} size={26}>
            Ejemplo simplificado · dr/dt = 2 cm/s
          </Chip>
        </>
      }
      right={
        <svg width={520} height={520} viewBox="-260 -260 520 520">
          <circle r={r} fill={`${C.blue}55`} stroke={C.blue} strokeWidth={8} />
          <text y={r + 60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.ink}>
            r = {(10 * p).toFixed(0)} cm
          </text>
        </svg>
      }
    />
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2] = lineas;
  return (
    <Stage gap={34}>
      <PlusDatos />
      <Words text="Un *plus*: cómo aprende una red" size={62} accent={C.purple} delay={k1.at} />
      <Aparece at={k1.at + 40}>
        <Formula tex={"\\dfrac{\\partial L}{\\partial w} = 2(\\sigma - y)\\,\\sigma(1-\\sigma)\\,x"} size={62} />
      </Aparece>
      <Sequence from={k2.at} layout="none">
        <Chip bg={C.purple} color={C.bg} size={30}>
          PyTorch y TensorFlow lo hacen solos, de atrás hacia adelante
        </Chip>
      </Sequence>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1180, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · sympy</span>
        </div>
        <Codigo at={y1.at} texto="sp.diff((3*x + 1)**5, x)" dur={26} />
        <Aparece at={y1.at + 34}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: COL.salida, height: 50 }}>15*(3*x + 1)**4</div>
        </Aparece>
        <Codigo at={y2.at} texto="sp.diff(sp.exp(-x**2), x)" dur={26} />
        <Aparece at={y2.at + 34}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: COL.salida, height: 50 }}>-2*x*exp(-x**2)</div>
        </Aparece>
      </div>
      <Sequence from={y3.at} layout="none">
        <Sticker bg={C.green} size={30}>
          Mismos resultados que a mano
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={34}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      {frame < x2.at ? (
        <Cuidado at={x1.at + 10}>
          <Formula tex={"(3x+1)^5 \\to 5(3x+1)^4 \\; \\boldsymbol{\\times}"} size={60} color={C.coral} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink }}>falta la derivada de adentro</div>
        </Cuidado>
      ) : (
        <Cuidado at={x2.at}>
          <Formula tex={"\\to 15(3x+1)^4 \\;\\checkmark"} size={64} color={C.green} />
          <Formula tex={"(e^{-x^2})' \\neq e^{-x^2} \\;\\; \\boldsymbol{\\times}"} size={50} color={C.coral} />
        </Cuidado>
      )}
    </Stage>
  );
};

const Reto: React.FC<EscenaProps> = ({ lineas }) => {
  const [w1, w2] = lineas;
  return (
    <RetoResumen
      atReto={w1.at}
      atResumen={w2.at}
      durResumen={w2.frames - 20}
      reto={
        <Card accent={C.yellow} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, padding: "30px 60px" }}>
          <Formula tex={"f(\\ent{x}) = (2\\ent{x} + 1)^3"} size={80} />
          <Formula tex={"f'(\\ent{x}) = \\; ? \\qquad f'(\\ent{0}) = \\; ?"} size={80} color={C.yellow} />
        </Card>
      }
      ideas={["Composición: una función dentro de otra", "[f(g(x))]' = f'(g(x)) · g'(x)", "Los ritmos se multiplican, como engranajes"]}
    />
  );
};

export const C08 = leerGuion(guion);

export const C08Cadena: React.FC = () => (
  <VideoLargo
    guion={C08}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={8} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      composicion: Composicion,
      regla: Regla,
      ejemplo1: Ejemplo1,
      ejemplo2: Ejemplo2,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={9} titulo="Máximos y *mínimos*" sub="El punto más alto y el más bajo" />,
    }}
  />
);
