import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { CierreCurso, COL, Cuidado, Curva, Formula, Objetivo, Paso, Plano, Recuerda, RetoResumen, SerieCalculo } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c07-producto.json";

// Cálculo Diferencial #7 · Regla del producto y del cociente. Énfasis matemático; la Ciencia de Datos es un plus.

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  const camino = (at: number, color: string, titulo: string, pasos: string[], resultado: string) => (
    <Aparece at={at}>
      <Card accent={color} style={{ width: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color }}>{titulo}</div>
        {pasos.map((p, i) => (
          <Formula key={i} tex={p} size={50} color={C.dim} />
        ))}
        <Formula tex={resultado} size={92} color={color} />
      </Card>
    </Aparece>
  );
  return (
    <Stage gap={30}>
      <Aparece at={g1.at}>
        <Formula tex={"\\left(\\ent{x}^2 \\cdot \\ent{x}^3\\right)' = \\; ?"} size={100} />
      </Aparece>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {camino(g2.at, C.coral, "Derivar cada parte", ["(x^2)' \\cdot (x^3)' = 2x \\cdot 3x^2"], "6x^3")}
        {frame >= g3.at + g3.frames * 0.6 && (
          <Aparece at={g3.at + g3.frames * 0.6}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.yellow }}>≠</div>
          </Aparece>
        )}
        {camino(g3.at, C.green, "Multiplicar primero", ["x^2 \\cdot x^3 = x^5 \\;\\to\\; (x^5)'"], "5x^4")}
      </div>
      <div style={{ height: 70 }}>
        <Sequence from={g4.at} layout="none">
          <Sticker bg={C.yellow} size={40}>
            ¿Cuál está bien?
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
      idea={<>(eˣ)' = eˣ · (ln x)' = 1/x</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"f(\\ent{x}) = 5\\ln \\ent{x} + e^{\\ent{x}}"} size={54} color={C.dim} />
          <Formula tex={"f'(\\ent{x}) = \\der{\\dfrac{5}{\\ent{x}} + e^{\\ent{x}}} \\qquad f'(\\ent{1}) = 5 + e \\approx \\der{7.72}"} size={62} />
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
        { at: o1.at + 10, t: "Derivar un producto" },
        { at: o1.at + t, t: "Derivar un cociente" },
        { at: o1.at + 2 * t, t: "Evitar el error más común" },
      ]}
    />
  );
};

const Intuicion: React.FC<EscenaProps> = ({ lineas }) => {
  const [i1, i2, i3, i4] = lineas;
  const frame = useCurrentFrame();
  const pG = useP(i2.at + 10, i2.at + 60);
  const W0 = 520;
  const H0 = 340;
  const dw = 90 * pG;
  const dh = 70 * pG;
  const x0 = 120;
  const y0 = 120;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="¿Por qué no basta *multiplicar*?" size={62} align="left" accent={C.yellow} delay={i1.at} />
          <Aparece at={i1.at + 30}>
            <Formula tex={"\\text{área} = \\ent{f} \\cdot \\sal{g}"} size={62} />
          </Aparece>
          <Aparece at={i2.at + 40}>
            <Formula tex={"\\text{crece: } \\reg{f' \\cdot g} \\;+\\; \\der{f \\cdot g'} \\;+\\; \\text{esquinita}"} size={46} />
          </Aparece>
          <Sequence from={i4.at} layout="none">
            <Sticker bg={C.yellow} size={32}>
              Es la suma de las dos franjas
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <svg width={860} height={640} viewBox="0 0 860 640">
          <rect x={x0} y={y0 + dh} width={W0} height={H0} fill={`${C.blue}33`} stroke={C.blue} strokeWidth={5} />
          {pG > 0 && <rect x={x0 + W0} y={y0 + dh} width={dw} height={H0} fill={`${C.yellow}88`} stroke={C.yellow} strokeWidth={3} />}
          {pG > 0 && <rect x={x0} y={y0} width={W0} height={dh} fill={`${C.coral}88`} stroke={C.coral} strokeWidth={3} />}
          {pG > 0 && (
            <rect
              x={x0 + W0}
              y={y0}
              width={dw}
              height={dh}
              fill={frame >= i3.at ? `${C.dim}22` : `${C.dim}66`}
              stroke={C.dim}
              strokeWidth={2}
              strokeDasharray={frame >= i3.at ? "6 6" : undefined}
            />
          )}
          <text x={x0 + W0 / 2} y={y0 + dh + H0 / 2 + 14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={48} fill={C.ink}>
            f · g
          </text>
          <text x={x0 + W0 / 2} y={y0 + dh + H0 + 50} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={34} fill={COL.entrada}>
            f
          </text>
          <text x={x0 - 30} y={y0 + dh + H0 / 2 + 12} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={34} fill={COL.salida}>
            g
          </text>
          {pG > 0.8 && (
            <>
              <text
                x={x0 + W0 + dw / 2}
                y={y0 + dh + H0 / 2 + 10}
                textAnchor="middle"
                fontFamily={FONT}
                fontWeight={900}
                fontSize={30}
                fill={C.bg}
                transform={`rotate(-90 ${x0 + W0 + dw / 2} ${y0 + dh + H0 / 2})`}
              >
                f' · g
              </text>
              <text x={x0 + W0 / 2} y={y0 + dh / 2 + 10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.bg}>
                f · g'
              </text>
            </>
          )}
          {frame >= i3.at && (
            <text x={x0 + W0 + dw + 16} y={y0 + dh / 2 + 8} fontFamily={MONO} fontWeight={700} fontSize={24} fill={C.dim}>
              ≈ 0
            </text>
          )}
        </svg>
      }
    />
  );
};

const Producto: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3, p4] = lineas;
  return (
    <Stage gap={28}>
      <Chip bg={C.yellow} size={32}>
        REGLA DEL PRODUCTO
      </Chip>
      <Aparece at={p1.at}>
        <Formula tex={"(\\ent{f} \\cdot \\sal{g})' = \\reg{f'} \\cdot \\sal{g} + \\ent{f} \\cdot \\der{g'}"} size={100} />
      </Aparece>
      <Aparece at={p2.at}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.dim, textAlign: "center" }}>
          deriva el primero, deja el segundo · <span style={{ color: C.ink }}>más</span> · deja el primero, deriva el segundo
        </div>
      </Aparece>
      <Aparece at={p3.at}>
        <Card accent={C.green} style={{ padding: "16px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"(x^2 \\cdot x^3)' = \\reg{2x} \\cdot x^3 + x^2 \\cdot \\der{3x^2}"} size={56} />
          <Aparece at={p3.at + p3.frames * 0.55}>
            <Formula tex={"= 2x^4 + 3x^4 = \\sal{5x^4} \\;\\; \\checkmark"} size={56} />
          </Aparece>
        </Card>
      </Aparece>
      <div style={{ height: 70 }}>
        <Sequence from={p4.at} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={32}>
            Multiplicar las derivadas NO funciona
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const Ejemplo1: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Aparece at={e1.at}>
        <Formula tex={"f(\\ent{x}) = \\ent{x}^2 \\cdot e^{\\ent{x}}"} size={90} />
      </Aparece>
      <Aparece at={e2.at}>
        <div style={{ display: "flex", gap: 40 }}>
          <Card accent={C.blue} style={{ padding: "10px 30px" }}>
            <Formula tex={"\\ent{x}^2 \\to \\reg{2\\ent{x}}"} size={54} />
          </Card>
          <Card accent={C.green} style={{ padding: "10px 30px" }}>
            <Formula tex={"e^{\\ent{x}} \\to \\reg{e^{\\ent{x}}}"} size={54} />
          </Card>
        </div>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={e3.at} n={1} tex={"f'(\\ent{x}) = \\reg{2\\ent{x}} \\cdot e^{\\ent{x}} + \\ent{x}^2 \\cdot \\reg{e^{\\ent{x}}}"} on={frame < e4.at} ancho={900} size={58} />
        <Paso at={e4.at} n={2} tex={"f'(\\ent{x}) = \\der{e^{\\ent{x}}\\left(\\ent{x}^2 + 2\\ent{x}\\right)}"} nota="factor común" on={frame >= e4.at} ancho={760} size={58} />
      </div>
    </Stage>
  );
};

const Cociente: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={26}>
      <Chip bg={C.yellow} size={32}>
        REGLA DEL COCIENTE
      </Chip>
      <Aparece at={c1.at}>
        <Formula tex={"\\left(\\dfrac{\\ent{f}}{\\sal{g}}\\right)' = \\dfrac{\\reg{f'} \\cdot \\sal{g} - \\ent{f} \\cdot \\der{g'}}{\\sal{g}^2}"} size={90} />
      </Aparece>
      {frame < c3.at ? (
        <Aparece at={c2.at}>
          <Card accent={C.dim} style={{ padding: "14px 30px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, textAlign: "center", lineHeight: 1.4 }}>
              <span style={{ color: COL.salida }}>abajo</span> × derivada de <span style={{ color: COL.entrada }}>arriba</span> <span style={{ color: C.coral }}>−</span>{" "}
              <span style={{ color: COL.entrada }}>arriba</span> × derivada de <span style={{ color: COL.salida }}>abajo</span>
              <br />
              todo entre <span style={{ color: COL.salida }}>abajo²</span>
            </div>
          </Card>
        </Aparece>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Paso at={c3.at} n={1} tex={"\\left(\\dfrac{\\ent{x}}{\\ent{x}+1}\\right)': \\quad f' = 1, \\;\\; g' = 1"} on={frame < c4.at} ancho={900} size={52} />
          <Paso at={c4.at} n={2} tex={"\\dfrac{1\\cdot(\\ent{x}+1) - \\ent{x}\\cdot 1}{(\\ent{x}+1)^2} = \\der{\\dfrac{1}{(\\ent{x}+1)^2}}"} on={frame >= c4.at} ancho={900} size={52} />
        </div>
      )}
    </Stage>
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  return (
    <Stage gap={30}>
      <Words text="¿Para qué se *usa*?" size={70} accent={C.blue} delay={u1.at} />
      <Aparece at={u1.at + 30}>
        <Formula tex={"\\text{INGRESO} = \\ent{\\text{precio}} \\times \\sal{\\text{cantidad}}"} size={70} />
      </Aparece>
      <Aparece at={u2.at}>
        <Formula tex={"I' = \\reg{p' \\cdot q} + \\der{p \\cdot q'}"} size={80} />
      </Aparece>
      <div style={{ display: "flex", gap: 30 }}>
        <Aparece at={u2.at + u2.frames * 0.35}>
          <Card accent={C.yellow} style={{ width: 560, textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.yellow }}>p' · q</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink }}>lo que ganas por cobrar más</div>
          </Card>
        </Aparece>
        <Aparece at={u2.at + u2.frames * 0.6}>
          <Card accent={C.coral} style={{ width: 560, textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.coral }}>p · q'</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink }}>lo que pierdes por vender menos</div>
          </Card>
        </Aparece>
      </div>
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2] = lineas;
  const frame = useCurrentFrame();
  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  const dsig = (x: number) => sig(x) * (1 - sig(x));
  const pS = useP(k2.at, k2.at + 50);
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <div style={{ alignSelf: "flex-start" }}>
            <Chip bg={C.purple} color={C.bg} size={26}>
              PLUS · CIENCIA DE DATOS
            </Chip>
          </div>
          <Words text="Un *plus*: la sigmoide" size={60} align="left" accent={C.purple} delay={k1.at} />
          <Aparece at={k1.at + 30}>
            <Formula tex={"\\sigma(\\ent{x}) = \\dfrac{e^{\\ent{x}}}{1 + e^{\\ent{x}}}"} size={60} />
          </Aparece>
          <Aparece at={k1.at + k1.frames * 0.6}>
            <Formula tex={"\\sigma'(\\ent{x}) = \\der{\\sigma(\\ent{x})\\,\\big(1 - \\sigma(\\ent{x})\\big)}"} size={56} />
          </Aparece>
          <Sequence from={k2.at + k2.frames * 0.45} layout="none">
            <Card accent={C.purple} style={{ padding: "10px 24px" }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.ink }}>0.25 × 0.25 × 0.25 × … → casi 0</div>
            </Card>
          </Sequence>
        </>
      }
      right={
        <Plano w={600} h={440} x={[-6, 6]} y={[-0.05, 0.3]} paso={2} pasoY={0.05} etiquetaY="σ'(x)">
          {(e) => (
            <>
              <Curva e={e} f={dsig} x={[-6, 6]} p={pS} color={C.purple} />
              {frame >= k2.at + 40 && (
                <g>
                  <circle cx={e.X(0)} cy={e.Y(0.25)} r={12} fill={C.yellow} stroke={C.bg} strokeWidth={4} />
                  <text x={e.X(0) + 20} y={e.Y(0.25) - 14} fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.yellow}>
                    máx 0.25
                  </text>
                </g>
              )}
            </>
          )}
        </Plano>
      }
    />
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
        <Codigo at={y1.at} texto="sp.diff(x**2 * sp.exp(x), x)" dur={22} />
        <Aparece at={y2.at}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>x**2*exp(x) + 2*x*exp(x)</div>
        </Aparece>
        <Codigo at={y3.at} texto="sp.simplify(sp.diff(x/(x + 1), x))" dur={24} />
        <Aparece at={y3.at + 32}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>(x + 1)**(-2)</div>
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
          <div style={{ width: 620, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Formula tex={"(f \\cdot g)' \\neq f' \\cdot g' \\;\\; \\boldsymbol{\\times}"} size={56} color={C.coral} />
            <Formula tex={"(x^2 x^3)': \\; 6x^3 \\;\\boldsymbol{\\times} \\quad 5x^4 \\;\\checkmark"} size={44} color={C.ink} />
          </div>
        </Cuidado>
        <Cuidado at={x2.at}>
          <div style={{ width: 620, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Formula tex={"\\dfrac{f'g - fg'}{g^2} \\;\\; \\checkmark"} size={52} color={C.green} />
            <Formula tex={"\\dfrac{fg' - f'g}{g^2} \\;\\; \\text{signo al revés} \\;\\boldsymbol{\\times}"} size={44} color={C.coral} />
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
          <Formula tex={"f(\\ent{x}) = \\ent{x} \\cdot e^{\\ent{x}}"} size={90} />
          <Formula tex={"f'(\\ent{x}) = \\; ? \\qquad f'(\\ent{0}) = \\; ?"} size={84} color={C.yellow} />
        </Card>
      }
      ideas={["(f·g)' = f'g + fg'", "(f/g)' = (f'g − fg') / g²", "Nunca multipliques las derivadas"]}
    />
  );
};

export const C07 = leerGuion(guion);

export const C07Producto: React.FC = () => (
  <VideoLargo
    guion={C07}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={7} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      intuicion: Intuicion,
      producto: Producto,
      ejemplo1: Ejemplo1,
      cociente: Cociente,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={8} titulo="Regla de la *cadena*" sub="Una función dentro de otra" />,
    }}
  />
);
