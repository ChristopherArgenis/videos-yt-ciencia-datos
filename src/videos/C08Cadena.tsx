import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { CierreCurso, COL, Cuidado, Curva, Formula, Maquina, Nota, Objetivo, Paso, Plano, Recuerda, RetoResumen, SerieCalculo } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c08-cadena.json";

// Cálculo Diferencial #8 · Regla de la cadena. Énfasis matemático; la Ciencia de Datos es un plus.

/** Engranaje con `n` dientes, radio `r`, girado `ang` grados. */
const Engranaje: React.FC<{ cx: number; cy: number; r: number; n: number; ang: number; color: string; letra: string }> = ({ cx, cy, r, n, ang, color, letra }) => {
  const d: string[] = [];
  const ri = r * 0.82;
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n;
    const w = Math.PI / n;
    const pts = [
      [ri, a0 - w * 0.55],
      [r, a0 - w * 0.3],
      [r, a0 + w * 0.3],
      [ri, a0 + w * 0.55],
    ];
    d.push(pts.map(([rr, a], k) => `${k === 0 && i === 0 ? "M" : "L"} ${rr * Math.cos(a)} ${rr * Math.sin(a)}`).join(" "));
  }
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g transform={`rotate(${ang})`}>
        <path d={d.join(" ") + " Z"} fill={`${color}33`} stroke={color} strokeWidth={6} strokeLinejoin="round" />
        <circle r={r * 0.3} fill="none" stroke={color} strokeWidth={6} />
        <line x1={0} y1={-r * 0.3} x2={0} y2={-ri + 6} stroke={color} strokeWidth={6} />
      </g>
      <text y={r + 56} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={color}>
        {letra}
      </text>
    </g>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const t = frame / 30;
  // C gira 30°/s; B el doble; A seis veces (sentidos alternados).
  const angC = 30 * t;
  const angB = -2 * 30 * t;
  const angA = 6 * 30 * t;
  return (
    <Stage gap={20}>
      <svg width={1500} height={480} viewBox="0 0 1500 480">
        <Engranaje cx={260} cy={200} r={110} n={10} ang={angA} color={C.blue} letra="A" />
        <Engranaje cx={720} cy={200} r={150} n={14} ang={angB} color={C.green} letra="B" />
        <Engranaje cx={1220} cy={200} r={170} n={16} ang={angC} color={C.yellow} letra="C" />
        {frame >= g1.at + 20 && (
          <g>
            <rect x={420} y={30} width={140} height={64} rx={16} fill={C.bg2} stroke={C.coral} strokeWidth={4} />
            <text x={490} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.coral}>
              ×3
            </text>
          </g>
        )}
        {frame >= g1.at + g1.frames * 0.55 && (
          <g>
            <rect x={900} y={30} width={140} height={64} rx={16} fill={C.bg2} stroke={C.coral} strokeWidth={4} />
            <text x={970} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={C.coral}>
              ×2
            </text>
          </g>
        )}
      </svg>
      <div style={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {frame >= g2.at && frame < g3.at && (
          <Aparece at={g2.at}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: C.ink }}>
              ¿<span style={{ color: C.blue }}>A</span> respecto a <span style={{ color: C.yellow }}>C</span>?
            </div>
          </Aparece>
        )}
        {frame >= g3.at && (
          <Aparece at={g3.at}>
            <Formula tex={"\\times 3 \\;\\cdot\\; \\times 2 \\;=\\; \\der{\\times 6}"} size={96} />
          </Aparece>
        )}
        <Sequence from={g4.at} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={36}>
            Los ritmos se MULTIPLICAN
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>Producto: (f · g)' = f'g + fg'</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"(\\ent{x} \\cdot e^{\\ent{x}})' = 1 \\cdot e^{\\ent{x}} + \\ent{x} \\cdot e^{\\ent{x}}"} size={60} />
          <Formula tex={"f'(\\ent{0}) = 1 + 0 = \\der{1}"} size={64} />
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
        { at: o1.at + 2 * t, t: "Aplicarla a potencias, exp y log" },
      ]}
    />
  );
};

const Composicion: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3] = lineas;
  const frame = useCurrentFrame();
  if (frame < a2.at) {
    return (
      <Stage gap={30}>
        <Aparece at={a1.at}>
          <Formula tex={"(3\\ent{x} + 1)^5"} size={130} />
        </Aparece>
        <Aparece at={a1.at + a1.frames * 0.45}>
          <div style={{ opacity: 0.55, position: "relative" }}>
            <Formula tex={"243x^5 + 405x^4 + 270x^3 + 90x^2 + 15x + 1"} size={52} />
            <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 6, background: C.coral, borderRadius: 3 }} />
          </div>
        </Aparece>
        <Sequence from={a1.at + a1.frames * 0.7} layout="none">
          <Chip bg={C.coral} color={C.ink} size={30}>
            6 términos: mejor no
          </Chip>
        </Sequence>
      </Stage>
    );
  }
  return (
    <Stage gap={30}>
      <div style={{ display: "flex", flexDirection: "column", gap: 56, alignItems: "center", marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Chip bg={C.blue} color={C.ink} size={26}>
            ADENTRO
          </Chip>
          <Maquina entrada="1" salidas={["4"]} regla="3x + 1" at={a2.at + 20} ancho={300} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Chip bg={C.green} size={26}>
            AFUERA
          </Chip>
          <Maquina entrada="4" salidas={["1024"]} regla="u⁵" at={a2.at + 70} ancho={300} />
        </div>
      </div>
      <Aparece at={a3.at}>
        <Formula tex={"\\sal{f}\\big(\\ent{g(x)}\\big) = \\big(\\ent{3x + 1}\\big)^{\\sal{5}}"} size={76} />
      </Aparece>
    </Stage>
  );
};

const Regla: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3] = lineas;
  return (
    <Stage gap={30}>
      <Chip bg={C.yellow} size={32}>
        REGLA DE LA CADENA
      </Chip>
      <Aparece at={b1.at}>
        <Formula tex={"\\big[\\sal{f}(\\ent{g(x)})\\big]' = \\sal{f'}(\\ent{g(x)}) \\cdot \\ent{g'(x)}"} size={96} />
      </Aparece>
      <Aparece at={b2.at}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34 }}>
          <Card accent={C.green} style={{ padding: "12px 24px" }}>
            <span style={{ color: COL.salida }}>derivada de AFUERA</span>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>sin tocar lo de adentro</div>
          </Card>
          <span style={{ fontSize: 60, color: C.yellow }}>×</span>
          <Card accent={C.blue} style={{ padding: "12px 24px" }}>
            <span style={{ color: COL.entrada }}>derivada de ADENTRO</span>
          </Card>
        </div>
      </Aparece>
      <Aparece at={b3.at}>
        <Formula tex={"\\dfrac{dy}{d\\ent{x}} = \\dfrac{dy}{\\reg{du}} \\cdot \\dfrac{\\reg{du}}{d\\ent{x}}"} size={80} />
      </Aparece>
      <Sequence from={b3.at + b3.frames * 0.55} layout="none">
        <Chip bg={C.bg2} color={C.ink} size={28}>
          como los engranajes: ×3 · ×2 = ×6
        </Chip>
      </Sequence>
    </Stage>
  );
};

const Ejemplo1: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4] = lineas;
  const frame = useCurrentFrame();
  if (frame >= e4.at) {
    return (
      <Stage gap={30}>
        <Chip bg={C.green} size={32}>
          ¿FUNCIONA? COMPRUÉBALO CON EL CUADRADO
        </Chip>
        <div style={{ display: "flex", gap: 30 }}>
          <Aparece at={e4.at + 20}>
            <Card accent={C.dim} style={{ width: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.dim }}>Desarrollando</div>
              <Formula tex={"(3x + 1)^2 = 9x^2 + 6x + 1"} size={50} />
              <Formula tex={"\\to \\; \\der{18x + 6}"} size={58} />
            </Card>
          </Aparece>
          <Aparece at={e4.at + e4.frames * 0.6}>
            <Card accent={C.green} style={{ width: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: C.green }}>Con la cadena</div>
              <Formula tex={"2(3x + 1) \\cdot 3"} size={50} />
              <Formula tex={"= \\der{18x + 6} \\;\\; \\checkmark"} size={58} />
            </Card>
          </Aparece>
        </div>
      </Stage>
    );
  }
  return (
    <Stage gap={28}>
      <Formula tex={"\\big(\\ent{3x + 1}\\big)^{\\sal{5}}"} size={110} />
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Paso at={e1.at + e1.frames * 0.35} n={1} tex={"\\sal{5}\\big(\\ent{3x + 1}\\big)^{4}"} nota="afuera: u⁵ → 5u⁴" on={frame < e2.at} ancho={620} size={64} />
        <Paso at={e2.at} n={2} tex={"\\ent{(3x + 1)'} = \\ent{3}"} nota="adentro" on={frame >= e2.at && frame < e3.at} ancho={620} size={64} />
        <Paso at={e3.at} n={3} tex={"\\sal{5}(3x + 1)^4 \\cdot \\ent{3} = \\der{15(3x + 1)^4}"} on={frame >= e3.at} ancho={980} size={60} />
      </div>
    </Stage>
  );
};

const Ejemplo2: React.FC<EscenaProps> = ({ lineas }) => {
  const [f1, f2, f3] = lineas;
  const frame = useCurrentFrame();
  const tarjeta = (at: number, on: boolean, f: string, afuera: string, adentro: string, res: string) => (
    <Aparece at={at}>
      <Card accent={on ? C.yellow : C.dim} style={{ width: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: on ? 1 : 0.55 }}>
        <Formula tex={f} size={76} />
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ whiteSpace: "nowrap" }}>
            <Chip bg={C.green} size={22}>
              afuera: {afuera}
            </Chip>
          </span>
          <span style={{ whiteSpace: "nowrap" }}>
            <Chip bg={C.blue} color={C.ink} size={22}>
              adentro: {adentro}
            </Chip>
          </span>
        </div>
        <Formula tex={res} size={62} color={COL.derivada} />
      </Card>
    </Aparece>
  );
  return (
    <Stage gap={30}>
      <Words text="Con exponenciales y *logaritmos*" size={64} accent={C.yellow} delay={f1.at} />
      <div style={{ display: "flex", gap: 30 }}>
        {tarjeta(f2.at, frame < f3.at, "e^{\\ent{-x^2}}", "eᵘ → eᵘ", "−x² → −2x", "-2x\\,e^{-x^2}")}
        {tarjeta(f3.at, frame >= f3.at, "\\ln\\big(\\ent{x^2 + 1}\\big)", "ln u → 1/u", "x² + 1 → 2x", "\\dfrac{2x}{x^2 + 1}")}
      </div>
      {frame >= f2.at && frame < f3.at && (
        <Aparece at={f2.at + 30}>
          <Plano w={520} h={150} x={[-3, 3]} y={[0, 1.2]} paso={1} pasoY={1} etiquetaY="">
            {(e) => <Curva e={e} f={(x) => Math.exp(-x * x)} x={[-3, 3]} ancho={5} />}
          </Plano>
        </Aparece>
      )}
    </Stage>
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  const frame = useCurrentFrame();
  const r = 70 + 90 * Math.min(1, Math.max(0, (frame - u1.at) / (u1.frames + u2.frames * 0.5)));
  return (
    <Stage direction="row" gap={80}>
      <svg width={440} height={560} viewBox="0 0 440 560">
        <ellipse cx={220} cy={240} rx={r} ry={r * 1.12} fill={`${C.coral}cc`} stroke={C.ink} strokeWidth={4} />
        <path d={`M ${220 - 10} ${240 + r * 1.12} L 220 ${240 + r * 1.12 + 16} L ${220 + 10} ${240 + r * 1.12} Z`} fill={C.coral} />
        <path d={`M 220 ${240 + r * 1.12 + 16} C 200 ${330 + r}, 240 ${380 + r * 0.6}, 220 540`} fill="none" stroke={C.dim} strokeWidth={3} />
        <line x1={220} y1={240} x2={220 + r} y2={240} stroke={C.ink} strokeWidth={4} strokeDasharray="8 6" />
        <text x={220 + r / 2} y={226} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.ink}>
          r
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 1000 }}>
        <Words text="¿Para qué se *usa*?" size={68} align="left" accent={C.blue} delay={u1.at} />
        <Aparece at={u1.at + 40}>
          <Formula tex={"V = \\tfrac{4}{3}\\pi \\ent{r}^3 \\qquad \\dfrac{d\\ent{r}}{dt} = 2 \\ \\text{cm/s}"} size={56} />
        </Aparece>
        <Aparece at={u2.at}>
          <Formula tex={"\\dfrac{dV}{dt} = \\sal{\\dfrac{dV}{d\\ent{r}}} \\cdot \\reg{\\dfrac{d\\ent{r}}{dt}} = \\sal{4\\pi \\ent{r}^2} \\cdot \\reg{2}"} size={56} />
        </Aparece>
        <Aparece at={u2.at + u2.frames * 0.55}>
          <Card accent={C.green} style={{ padding: "12px 30px" }}>
            <Formula tex={"\\ent{r} = 10: \\quad 800\\pi \\approx \\der{2513 \\ \\text{cm}^3\\text{/s}}"} size={56} />
          </Card>
        </Aparece>
      </div>
      <Nota>Ejemplo simplificado</Nota>
    </Stage>
  );
};

const CAPAS = ["x", "capa 1", "capa 2", "capa 3", "error"];

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2] = lineas;
  const frame = useCurrentFrame();
  const pF = useP(k1.at + 20, k1.at + k1.frames);
  const pB = useP(k2.at + 10, k2.at + k2.frames * 0.6);
  return (
    <Stage gap={34}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: así aprende una red neuronal" size={58} accent={C.purple} delay={k1.at} />
      <svg width={1500} height={250} viewBox="0 0 1500 250">
        {CAPAS.map((c, i) => {
          const x = 120 + i * 315;
          const on = pF * 4 >= i;
          const back = frame >= k2.at && pB * 4 >= 4 - i;
          return (
            <g key={c}>
              {i < 4 && <line x1={x + 100} y1={80} x2={x + 215} y2={80} stroke={pF * 4 > i ? C.green : `${C.dim}55`} strokeWidth={6} markerEnd="" />}
              {i < 4 && back && (
                <g>
                  <line x1={x + 215} y1={170} x2={x + 100} y2={170} stroke={C.coral} strokeWidth={6} />
                  <text x={x + 157} y={215} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill={C.coral}>
                    × derivada
                  </text>
                </g>
              )}
              <rect x={x - 100} y={30} width={200} height={100} rx={20} fill={on ? (i === 4 ? `${C.purple}55` : `${C.blue}44`) : C.bg2} stroke={i === 4 ? C.purple : C.blue} strokeWidth={4} />
              <text x={x} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={C.ink}>
                {c}
              </text>
            </g>
          );
        })}
      </svg>
      <Aparece at={k2.at + k2.frames * 0.45}>
        <Formula tex={"\\dfrac{d\\,\\text{error}}{dw} = \\der{2(\\sigma - y)} \\cdot \\reg{\\sigma(1 - \\sigma)} \\cdot \\ent{x}"} size={56} />
      </Aparece>
      <Sequence from={k2.at + k2.frames * 0.7} layout="none">
        <Sticker bg={C.purple} size={30}>
          Retropropagación: PyTorch lo hace solo
        </Sticker>
      </Sequence>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1200, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · sympy</span>
        </div>
        <Codigo at={y1.at} texto="sp.diff((3*x + 1)**5, x)" dur={20} />
        <Aparece at={y2.at}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>15*(3*x + 1)**4</div>
        </Aparece>
        <Codigo at={y3.at} texto="sp.diff(sp.exp(-x**2), x)" dur={20} />
        <Aparece at={y3.at + 28}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>-2*x*exp(-x**2)</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  return (
    <Stage gap={30}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      <div style={{ display: "flex", gap: 30 }}>
        <Cuidado at={x1.at + 10}>
          <div style={{ width: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.ink }}>Olvidar la derivada de adentro</div>
            <Formula tex={"5(3x + 1)^4 \\;\\; \\boldsymbol{\\times}"} size={56} color={C.coral} />
            <Formula tex={"5(3x + 1)^4 \\cdot \\reg{3} = 15(3x + 1)^4 \\;\\checkmark"} size={42} color={C.green} />
          </div>
        </Cuidado>
        <Cuidado at={x2.at}>
          <div style={{ width: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.ink }}>Solo eˣ sola es su propia derivada</div>
            <Formula tex={"(e^{-x^2})' = e^{-x^2} \\;\\; \\boldsymbol{\\times}"} size={52} color={C.coral} />
            <Formula tex={"(e^{-x^2})' = -2x\\,e^{-x^2} \\;\\checkmark"} size={52} color={C.green} />
          </div>
        </Cuidado>
      </div>
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
          <Formula tex={"f(\\ent{x}) = (2\\ent{x} + 1)^3"} size={90} />
          <Formula tex={"f'(\\ent{x}) = \\; ? \\qquad f'(\\ent{0}) = \\; ?"} size={84} color={C.yellow} />
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
