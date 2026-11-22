import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import { CierreCurso, COL, Cuidado, Formula, Objetivo, Paso, PlusDatos, Recuerda, RetoResumen, SerieCalculo } from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c07-producto.json";

// Cálculo Diferencial #7 · Regla del producto y cociente. Énfasis matemático; la Ciencia de Datos es un plus.

/** Rectángulo f × g que crece: franja derecha (f'·g), franja superior (f·g') y esquina casi nula. */
const Rectangulo: React.FC<{ p: number }> = ({ p }) => {
  const W = 300;
  const H = 220;
  const dw = 70 * p;
  const dh = 60 * p;
  return (
    <svg width={W + 120} height={H + 120} viewBox={`-30 -90 ${W + 120} ${H + 120}`} style={{ overflow: "visible" }}>
      <rect x={0} y={dh} width={W} height={H} rx={6} fill={`${C.bg2}cc`} stroke={C.dim} strokeWidth={4} />
      <rect x={W} y={dh} width={dw} height={H} fill={`${C.yellow}bb`} />
      <rect x={0} y={0} width={W} height={dh} fill={`${C.coral}bb`} />
      <rect x={W} y={0} width={dw} height={dh} fill={`${C.dim}66`} opacity={p} />
      <text x={W / 2} y={dh + H / 2} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={COL.entrada}>
        f · g
      </text>
      <text x={W + dw + 14} y={dh + H / 2} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.yellow}>
        g · f'
      </text>
    </svg>
  );
};

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  return (
    <Stage gap={36}>
      <Aparece at={g1.at}>
        <Formula tex={"\\ent{x}^2 \\cdot \\ent{x}^3"} size={110} />
      </Aparece>
      <div style={{ display: "flex", gap: 60 }}>
        <Aparece at={g2.at}>
          <Card accent={C.coral} style={{ textAlign: "center" }}>
            <Formula tex={"2\\ent{x} \\cdot 3\\ent{x}^2 = \\der{6\\ent{x}^3}"} size={56} />
          </Card>
        </Aparece>
        <Aparece at={g3.at}>
          <Card accent={C.green} style={{ textAlign: "center" }}>
            <Formula tex={"\\ent{x}^5 \\to 5\\ent{x}^4 = \\sal{5\\ent{x}^4}"} size={56} />
          </Card>
        </Aparece>
      </div>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.yellow} size={40}>
          ¿Cuál está bien?
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
      idea={<>(e^x)' = e^x · (ln x)' = 1/x</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"f'(\\ent{x}) = \\der{\\dfrac{5}{\\ent{x}} + e^{\\ent{x}}}"} size={60} />
          <Formula tex={"f'(\\ent{1}) = 5 + e \\approx \\der{7.72}"} size={60} />
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
  const p = useP(i2.at, i3.at);
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="¿Por qué no basta *multiplicar*?" size={58} align="left" accent={C.yellow} delay={i1.at} />
          <Aparece at={i1.at + 40}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
              Un rectángulo de lados <b style={{ color: COL.entrada }}>f</b> y <b style={{ color: COL.salida }}>g</b>: su área es f · g
            </div>
          </Aparece>
          <Aparece at={i3.at}>
            <Chip bg={C.yellow} size={28}>
              franja derecha: f' · g
            </Chip>
          </Aparece>
          <Aparece at={i3.at + 20}>
            <Chip bg={C.coral} color={C.ink} size={28}>
              franja de arriba: f · g'
            </Chip>
          </Aparece>
          <Sequence from={i4.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={30}>
              La esquina casi desaparece: suma las franjas
            </Sticker>
          </Sequence>
        </>
      }
      right={<Rectangulo p={p} />}
    />
  );
};

const Producto: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3, p4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Words text="La regla del *producto*" size={70} accent={C.yellow} delay={p1.at} />
      <Aparece at={p1.at + 20}>
        <Formula tex={"(f \\cdot g)' = \\reg{f'} \\cdot g + f \\cdot \\reg{g'}"} size={84} />
      </Aparece>
      <Aparece at={p2.at}>
        <Chip bg={C.bg2} color={C.ink} size={28}>
          derivas el primero, dejas el segundo · más · dejas el primero, derivas el segundo
        </Chip>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={p3.at} n={1} tex={"2x \\cdot x^3 + x^2 \\cdot 3x^2"} on={frame < p4.at} ancho={800} size={60} />
        <Paso at={p4.at} n={2} tex={"= 2x^4 + 3x^4 = \\sal{5x^4}"} on={frame >= p4.at} ancho={800} size={60} />
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
        <Formula tex={"f(x) = x^2 \\cdot e^{x}"} size={84} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={e2.at} n={1} tex={"f' = 2x, \\quad g' = e^{x}"} on={frame < e3.at} ancho={800} size={60} />
        <Paso at={e3.at} n={2} tex={"2x \\cdot e^{x} + x^2 \\cdot e^{x}"} on={frame >= e3.at && frame < e4.at} ancho={800} size={60} />
        <Paso at={e4.at} n={3} tex={"= e^{x}(x^2 + 2x) = \\sal{x(x+2)\\,e^{x}}"} on={frame >= e4.at} ancho={800} size={60} />
      </div>
    </Stage>
  );
};

const Cociente: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={30}>
      <Aparece at={c1.at}>
        <Formula tex={"\\left(\\dfrac{f}{g}\\right)' = \\dfrac{\\reg{f'} g - f \\reg{g'}}{g^2}"} size={80} />
      </Aparece>
      <Aparece at={c2.at}>
        <Chip bg={C.bg2} color={C.ink} size={28}>
          abajo × derivada de arriba, menos arriba × derivada de abajo, entre abajo al cuadrado
        </Chip>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={c3.at} n={1} tex={"\\left(\\dfrac{x}{x+1}\\right)' = \\dfrac{1 \\cdot (x+1) - x \\cdot 1}{(x+1)^2}"} on={frame < c4.at} ancho={1000} size={54} />
        <Paso at={c4.at} n={2} tex={"= \\dfrac{\\sal{1}}{(x+1)^2}"} on={frame >= c4.at} ancho={1000} size={54} />
      </div>
    </Stage>
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  return (
    <Stage gap={30}>
      <Words text="¿Para qué se *usa*?" size={70} accent={C.blue} delay={u1.at} />
      <Aparece at={u1.at + 30}>
        <Formula tex={"I = p \\cdot q"} size={84} />
      </Aparece>
      <Aparece at={u1.at + 80}>
        <Formula tex={"I' = \\reg{p'} \\, q + p \\, \\reg{q'}"} size={84} color={COL.derivada} />
      </Aparece>
      <div style={{ display: "flex", gap: 30 }}>
        <Aparece at={u2.at}>
          <Chip bg={C.green} color={C.bg} size={34}>
            cobrar más (efecto precio)
          </Chip>
        </Aparece>
        <Aparece at={u2.at + 40}>
          <Chip bg={C.coral} color={C.ink} size={34}>
            vender menos (efecto ventas)
          </Chip>
        </Aparece>
      </div>
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [k1, k2] = lineas;
  return (
    <Stage gap={34}>
      <PlusDatos />
      <Words text="Un *plus*: la sigmoide es una división" size={60} accent={C.purple} delay={k1.at} />
      <Aparece at={k1.at + 40}>
        <Formula tex={"\\sigma'(x) = \\sigma(x)\\,(1 - \\sigma(x))"} size={80} />
      </Aparece>
      <Sequence from={k2.at} layout="none">
        <Sticker bg={C.coral} color={C.ink} size={34}>
          Su máximo es 0.25: en redes con muchas capas, se desvanece
        </Sticker>
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
        <Codigo at={y1.at} texto="sp.diff(x**2 * sp.exp(x), x)" dur={26} />
        <Aparece at={y1.at + 34}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: COL.salida, height: 50 }}>x**2*exp(x) + 2*x*exp(x)</div>
        </Aparece>
        <Codigo at={y2.at} texto="sp.simplify(sp.diff(x/(x + 1), x))" dur={26} />
        <Aparece at={y2.at + 34}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: COL.salida, height: 50 }}>(x + 1)**(-2)</div>
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
          <Formula tex={"(f \\cdot g)' \\neq f' \\cdot g'"} size={72} color={C.coral} />
          <Formula tex={"\\ent{x}^2 \\cdot \\ent{x}^3 \\to 6\\ent{x}^3 \\; \\boldsymbol{\\times}"} size={50} color={C.coral} />
        </Cuidado>
      ) : (
        <Cuidado at={x2.at}>
          <Formula tex={"\\reg{f'} g - f \\reg{g'} \\;\\; \\checkmark"} size={66} color={C.green} />
          <Formula tex={"f \\reg{g'} - \\reg{f'} g \\;\\; \\boldsymbol{\\times} \\text{ (signo al revés)}"} size={50} color={C.coral} />
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
          <Formula tex={"f(\\ent{x}) = \\ent{x} \\cdot e^{\\ent{x}}"} size={80} />
          <Formula tex={"f'(\\ent{x}) = \\; ? \\qquad f'(\\ent{0}) = \\; ?"} size={80} color={C.yellow} />
        </Card>
      }
      ideas={["(f·g)' = f'g + fg'", "(f/g)' = (f'g − fg') / g²", "La derivada de un producto NO es el producto de derivadas"]}
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
