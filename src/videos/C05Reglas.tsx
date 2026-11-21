import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo } from "../kit/futbol";
import {
  CierreCurso,
  COL,
  Cuidado,
  Curva,
  Formula,
  Nota,
  Objetivo,
  Paso,
  Plano,
  PlusDatos,
  Recuerda,
  RetoResumen,
  SerieCalculo,
  type Ejes,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c05-reglas.json";

// Cálculo Diferencial #5 · Reglas de derivación. Énfasis matemático; la Ciencia de Datos es un plus.

/** Recta que pasa por (x0, y0) con pendiente m, entre xa y xb. */
const Recta: React.FC<{ e: Ejes; x0: number; y0: number; m: number; xa: number; xb: number; color: string; ancho?: number }> = ({
  e,
  x0,
  y0,
  m,
  xa,
  xb,
  color,
  ancho = 5,
}) => <line x1={e.X(xa)} y1={e.Y(y0 + m * (xa - x0))} x2={e.X(xb)} y2={e.Y(y0 + m * (xb - x0))} stroke={color} strokeWidth={ancho} strokeLinecap="round" />;

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  if (frame < g2.at) {
    return (
      <Stage gap={20}>
        <Chip bg={C.bg2} color={C.dim} size={28}>
          episodio 4 · la definición
        </Chip>
        {[
          "f(\\ent{x}+h) = \\ent{x}^2 + 2\\ent{x}h + h^2",
          "f(\\ent{x}+h) - f(\\ent{x}) = 2\\ent{x}h + h^2",
          "\\dfrac{2\\ent{x}h + h^2}{h} = 2\\ent{x} + h",
          "h \\to 0: \\; f'(\\ent{x}) = 2\\ent{x}",
        ].map((t, i) => (
          <Aparece key={i} at={g1.at + i * 12}>
            <div style={{ opacity: 0.55 }}>
              <Formula tex={t} size={52} />
            </div>
          </Aparece>
        ))}
        <Aparece at={g1.at + 60}>
          <Chip bg={C.yellow} size={34}>
            4 pasos para x²
          </Chip>
        </Aparece>
      </Stage>
    );
  }
  if (frame < g3.at) {
    return (
      <Stage gap={30}>
        <Formula tex={"f(\\ent{x}) = \\ent{x}^{10}"} size={110} />
        <Aparece at={g2.at + 30}>
          <div style={{ width: 1500, overflow: "hidden", opacity: 0.6 }}>
            <Formula
              tex={"(\\ent{x}+h)^{10} = \\ent{x}^{10} + 10\\ent{x}^9h + 45\\ent{x}^8h^2 + 120\\ent{x}^7h^3 + 210\\ent{x}^6h^4 + 252\\ent{x}^5h^5 + \\cdots"}
              size={46}
            />
          </div>
        </Aparece>
        <Sequence from={g2.at + g2.frames * 0.5} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={40}>
            11 términos: una pesadilla
          </Sticker>
        </Sequence>
      </Stage>
    );
  }
  return (
    <Stage gap={34}>
      <Formula tex={"f(\\ent{x}) = \\ent{x}^{10}"} size={80} color={C.dim} />
      <Aparece at={g3.at + 20}>
        <Card accent={C.yellow} style={{ padding: "20px 60px" }}>
          <Formula tex={"f'(\\ent{x}) = \\der{10\\ent{x}^9}"} size={140} />
        </Card>
      </Aparece>
      <Sequence from={g4.at} layout="none">
        <Sticker bg={C.green} size={38}>
          ⚡ En una sola línea
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
      idea={
        <>
          Derivada = pendiente de la tangente · para x², f'(x) = <span style={{ color: COL.derivada }}>2x</span>
        </>
      }
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Formula tex={"f'(\\ent{5}) = 2 \\cdot 5 = \\der{10} \\;\\; \\text{sube}"} size={64} />
          <Formula tex={"f'(\\ent{-1}) = 2 \\cdot (-1) = \\der{-2} \\;\\; \\text{baja}"} size={64} />
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
        { at: o1.at + 10, t: "Usar la regla de la potencia" },
        { at: o1.at + t, t: "Derivar sumas y constantes" },
        { at: o1.at + 2 * t, t: "Derivar cualquier polinomio" },
      ]}
    />
  );
};

const FILAS = [
  { f: "\\ent{x}", d: "1" },
  { f: "\\ent{x}^2", d: "2\\ent{x}" },
  { f: "\\ent{x}^3", d: "3\\ent{x}^2" },
];

const Patron: React.FC<EscenaProps> = ({ lineas }) => {
  const [a1, a2, a3, a4] = lineas;
  const frame = useCurrentFrame();
  const t = a2.frames / 3;
  const flechas = frame >= a3.at;
  return (
    <Stage gap={30}>
      <Words text="Aparece un *patrón*" size={74} accent={C.yellow} delay={a1.at} />
      <Card accent={C.dim} style={{ display: "flex", flexDirection: "column", gap: 14, padding: "24px 60px" }}>
        <div style={{ display: "flex", gap: 120, fontFamily: MONO, fontSize: 30, color: C.dim }}>
          <span style={{ width: 240, textAlign: "center" }}>f(x)</span>
          <span style={{ width: 320, textAlign: "center" }}>f'(x)</span>
        </div>
        {FILAS.map((r, i) => (
          <Aparece key={i} at={a2.at + i * t}>
            <div style={{ display: "flex", gap: 120, alignItems: "center" }}>
              <div style={{ width: 240, textAlign: "center" }}>
                <Formula tex={r.f} size={70} />
              </div>
              <div style={{ width: 320, textAlign: "center" }}>
                <Formula tex={r.d} size={70} color={COL.derivada} />
              </div>
            </div>
          </Aparece>
        ))}
        <Aparece at={a4.at}>
          <div style={{ display: "flex", gap: 120, alignItems: "center" }}>
            <div style={{ width: 240, textAlign: "center" }}>
              <Formula tex={"\\ent{x}^4"} size={70} />
            </div>
            <div style={{ width: 320, textAlign: "center" }}>
              <Formula tex={frame >= a4.at + a4.frames * 0.45 ? "\\reg{4}\\ent{x}^{\\der{3}}" : "?"} size={70} color={C.yellow} />
            </div>
          </div>
        </Aparece>
      </Card>
      <div style={{ height: 70 }}>
        {flechas && (
          <Aparece at={a3.at}>
            <div style={{ display: "flex", gap: 30 }}>
              <Chip bg={C.yellow} size={32}>
                ① el exponente baja al frente
              </Chip>
              <Chip bg={C.coral} color={C.ink} size={32}>
                ② al exponente se le resta 1
              </Chip>
            </div>
          </Aparece>
        )}
      </div>
    </Stage>
  );
};

const Potencia: React.FC<EscenaProps> = ({ lineas }) => {
  const [b1, b2, b3, b4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={18}>
      <Chip bg={C.yellow} size={32}>
        REGLA DE LA POTENCIA
      </Chip>
      <Aparece at={b1.at}>
        <Formula tex={"\\dfrac{d}{d\\ent{x}}\\left(\\ent{x}^{\\reg{n}}\\right) = \\reg{n}\\,\\ent{x}^{\\der{n-1}}"} size={84} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 300 }}>
        <Paso at={b2.at} n={1} tex={"\\ent{x}^{10} \\;\\to\\; 10\\ent{x}^{9}"} on={frame < b3.at} ancho={1000} size={58} />
        <Paso at={b3.at} n={2} tex={"\\dfrac{1}{\\ent{x}} = \\ent{x}^{-1} \\;\\to\\; -1\\cdot\\ent{x}^{-2} = -\\dfrac{1}{\\ent{x}^2}"} on={frame >= b3.at && frame < b4.at} ancho={1000} size={54} />
        <Paso at={b4.at} n={3} tex={"\\sqrt{\\ent{x}} = \\ent{x}^{1/2} \\;\\to\\; \\tfrac{1}{2}\\ent{x}^{-1/2} = \\dfrac{1}{2\\sqrt{\\ent{x}}}"} on={frame >= b4.at} ancho={1000} size={54} />
      </div>
    </Stage>
  );
};

const Regla: React.FC<{ at: number; titulo: string; tex: string; ej: string; on: boolean; children: (e: Ejes) => React.ReactNode; y: [number, number] }> = ({
  at,
  titulo,
  tex,
  ej,
  on,
  children,
  y,
}) => (
  <Aparece at={at}>
    <Card accent={on ? C.yellow : C.dim} style={{ width: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: on ? 1 : 0.6 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: on ? C.yellow : C.ink }}>{titulo}</div>
      <Formula tex={tex} size={46} />
      <Plano w={360} h={200} x={[-2, 2]} y={y} paso={1} pasoY={y[1] > 20 ? 20 : y[1] > 10 ? 10 : 4} etiquetaY="">
        {children}
      </Plano>
      <Formula tex={ej} size={40} color={COL.derivada} />
    </Card>
  </Aparece>
);

const Otras: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4] = lineas;
  const frame = useCurrentFrame();
  const cur = frame >= c4.at ? 2 : frame >= c3.at ? 1 : frame >= c2.at ? 0 : -1;
  return (
    <Stage gap={26}>
      <Words text="Tres reglas *más*" size={70} accent={C.yellow} delay={c1.at} />
      <div style={{ display: "flex", gap: 24 }}>
        <Regla at={c2.at} titulo="CONSTANTE" tex={"(c)' = 0"} ej={"(7)' = 0"} on={cur === 0} y={[0, 9]}>
          {(e) => (
            <>
              <line x1={e.X(-2)} y1={e.Y(7)} x2={e.X(2)} y2={e.Y(7)} stroke={C.yellow} strokeWidth={6} />
              <text x={e.X(1)} y={e.Y(7) - 14} fontFamily={MONO} fontWeight={700} fontSize={24} fill={C.yellow}>
                y = 7
              </text>
            </>
          )}
        </Regla>
        <Regla at={c3.at} titulo="MÚLTIPLO" tex={"(c\\,f)' = c\\,f'"} ej={"(5x^3)' = 5 \\cdot 3x^2 = 15x^2"} on={cur === 1} y={[-40, 40]}>
          {(e) => <Curva e={e} f={(x) => 5 * x ** 3} x={[-1.9, 1.9]} ancho={5} />}
        </Regla>
        <Regla at={c4.at} titulo="SUMA" tex={"(f \\pm g)' = f' \\pm g'"} ej={"(x^2 + x^3)' = 2x + 3x^2"} on={cur === 2} y={[-4, 12]}>
          {(e) => <Curva e={e} f={(x) => x ** 2 + x ** 3} x={[-1.9, 2]} ancho={5} />}
        </Regla>
      </div>
    </Stage>
  );
};

const Termino: React.FC<{ tex: string; color: string; tachado?: boolean }> = ({ tex, color, tachado }) => (
  <div style={{ border: `4px solid ${color}`, borderRadius: 16, padding: "6px 16px", opacity: tachado ? 0.4 : 1, textDecoration: tachado ? "line-through" : undefined }}>
    <Formula tex={tex} size={70} />
  </div>
);

const Ejemplo: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4, e5] = lineas;
  const frame = useCurrentFrame();
  const f = (x: number) => 3 * x ** 4 - 5 * x ** 2 + 7;
  if (frame >= e5.at + e5.frames * 0.5) {
    return (
      <Split
        ratio={0.45}
        left={
          <>
            <Formula tex={"f'(\\ent{x}) = 12\\ent{x}^3 - 10\\ent{x}"} size={64} color={COL.derivada} />
            <Card accent={C.green} style={{ padding: "14px 30px" }}>
              <Formula tex={"f'(\\ent{1}) = 12 - 10 = \\der{2}"} size={64} />
            </Card>
          </>
        }
        right={
          <Plano w={620} h={480} x={[-1.6, 1.6]} y={[0, 12]} paso={1} pasoY={3} etiquetaY="y">
            {(e) => (
              <>
                <Curva e={e} f={f} x={[-1.55, 1.55]} />
                <Recta e={e} x0={1} y0={f(1)} m={2} xa={0.2} xb={1.6} color={C.coral} ancho={6} />
                <circle cx={e.X(1)} cy={e.Y(f(1))} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                <text x={e.X(1) + 14} y={e.Y(f(1)) + 44} fontFamily={MONO} fontWeight={700} fontSize={26} fill={C.coral}>
                  pendiente 2
                </text>
              </>
            )}
          </Plano>
        }
      />
    );
  }
  return (
    <Stage gap={34}>
      <Aparece at={e1.at}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Formula tex={"f(\\ent{x}) ="} size={70} />
          <Termino tex={"3\\ent{x}^4"} color={C.blue} />
          <Termino tex={"-\\,5\\ent{x}^2"} color={C.green} />
          <Termino tex={"+\\,7"} color={C.purple} tachado={frame >= e4.at + 30} />
        </div>
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso at={e2.at} n={1} tex={"3\\ent{x}^4 \\to 3 \\cdot 4\\ent{x}^3 = \\der{12\\ent{x}^3}"} on={frame < e3.at} ancho={900} size={58} />
        <Paso at={e3.at} n={2} tex={"-5\\ent{x}^2 \\to -5 \\cdot 2\\ent{x} = \\der{-10\\ent{x}}"} on={frame >= e3.at && frame < e4.at} ancho={900} size={58} />
        <Paso at={e4.at} n={3} tex={"7 \\to \\der{0}"} on={frame >= e4.at && frame < e5.at} ancho={900} size={58} />
      </div>
      <Sequence from={e5.at} layout="none">
        <Card accent={C.green} style={{ padding: "12px 40px" }}>
          <Formula tex={"f'(\\ent{x}) = \\der{12\\ent{x}^3 - 10\\ent{x}}"} size={72} />
        </Card>
      </Sequence>
    </Stage>
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2, u3] = lineas;
  const frame = useCurrentFrame();
  const t = Math.min(2, Math.max(0, (frame - u1.at - 20) / 45));
  const caida = 4.9 * t * t;
  return (
    <Stage direction="row" gap={90}>
      <svg width={260} height={600} viewBox="0 0 260 600">
        <line x1={60} y1={20} x2={60} y2={580} stroke={`${C.dim}55`} strokeWidth={3} />
        {[0, 5, 10, 15, 20].map((m) => (
          <g key={m}>
            <line x1={50} y1={40 + m * 26} x2={70} y2={40 + m * 26} stroke={C.dim} strokeWidth={3} />
            <text x={84} y={48 + m * 26} fontFamily={MONO} fontSize={22} fill={C.dim}>
              {m} m
            </text>
          </g>
        ))}
        <circle cx={60} cy={40 + caida * 26} r={26} fill={C.coral} stroke={C.bg} strokeWidth={4} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, width: 1000 }}>
        <Words text="¿Para qué se *usa*?" size={70} align="left" accent={C.blue} delay={u1.at} />
        <Aparece at={u1.at + 30}>
          <Formula tex={"s(t) = 4.9\\,t^2 \\quad \\text{(metros)}"} size={64} />
        </Aparece>
        <Aparece at={u2.at}>
          <Formula tex={"v(t) = s'(t) = \\der{9.8\\,t} \\quad \\text{(m/s)}"} size={64} />
        </Aparece>
        <Aparece at={u2.at + u2.frames * 0.45}>
          <div style={{ display: "flex", gap: 20 }}>
            <Chip bg={C.bg2} color={C.ink} size={30}>
              t = 1 s → 9.8 m/s
            </Chip>
            <Chip bg={C.bg2} color={C.ink} size={30}>
              t = 2 s → 19.6 m/s
            </Chip>
          </div>
        </Aparece>
        <Sequence from={u3.at} layout="none">
          <Sticker bg={C.coral} color={C.ink} size={36}>
            9.8 = la aceleración de la gravedad
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const frame = useCurrentFrame();
  const L = (w: number) => (6 - 2 * w) ** 2;
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Words text="Un *plus*: el error de un modelo" size={58} align="left" accent={C.purple} delay={p1.at} />
          <Aparece at={p1.at + 30}>
            <Formula tex={"\\err{L(w)} = (y - w\\,x)^2 = y^2 - 2wxy + w^2x^2"} size={44} />
          </Aparece>
          <Aparece at={p2.at}>
            <Formula tex={"\\dfrac{d\\err{L}}{dw} = -2xy + 2wx^2 = -2x(y - wx)"} size={44} />
          </Aparece>
          <Aparece at={p2.at + p2.frames * 0.4}>
            <Chip bg={C.purple} size={30}>
              x = 2, y = 6, w = 1 → dL/dw = −16
            </Chip>
          </Aparece>
          <Sequence from={p2.at + p2.frames * 0.65} layout="none">
            <Sticker bg={C.purple} size={30}>
              Negativa → conviene subir w
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <>
          <Plano w={560} h={440} x={[0, 4]} y={[0, 40]} paso={1} pasoY={10} etiquetaX="w" etiquetaY="error">
            {(e) => (
              <>
                <Curva e={e} f={L} x={[0, 4]} color={C.purple} />
                {frame >= p2.at && <Recta e={e} x0={1} y0={16} m={-16} xa={0.3} xb={1.7} color={C.yellow} />}
                <circle cx={e.X(1)} cy={e.Y(16)} r={13} fill={C.ink} stroke={C.bg} strokeWidth={4} />
              </>
            )}
          </Plano>
          <PlusDatos />
          <Nota>Ejemplo simplificado</Nota>
        </>
      }
    />
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
        <Codigo at={y1.at} texto="f = 3*x**4 - 5*x**2 + 7" dur={20} />
        <Codigo at={y2.at} texto="d = sp.diff(f, x)" dur={16} />
        <Aparece at={y2.at + 28}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>12*x**3 - 10*x</div>
        </Aparece>
        <Codigo at={y3.at} texto="d.subs(x, 1)" dur={12} />
        <Aparece at={y3.at + 22}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>2</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2, x3] = lineas;
  const errores = [
    { at: x1.at, mal: "(7)' = 7", bien: "(7)' = 0" },
    { at: x2.at, mal: "(x^3)' = 3x^3", bien: "(x^3)' = 3x^2" },
    { at: x3.at, mal: "(2^x)' = x \\cdot 2^{x-1}", bien: "\\text{otra regla: \\#6}" },
  ];
  return (
    <Stage gap={30}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      <div style={{ display: "flex", gap: 24 }}>
        {errores.map((x, i) => (
          <Cuidado key={i} at={x.at + 10}>
            <div style={{ width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Formula tex={`${x.mal} \\;\\; \\boldsymbol{\\times}`} size={46} color={C.coral} />
              <Formula tex={x.bien} size={46} color={C.green} />
            </div>
          </Cuidado>
        ))}
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
          <Formula tex={"f(\\ent{x}) = 4\\ent{x}^3 + 2\\ent{x} - 9"} size={84} />
          <Formula tex={"f'(\\ent{x}) = \\; ? \\qquad f'(\\ent{1}) = \\; ?"} size={84} color={C.yellow} />
        </Card>
      }
      ideas={["Potencia: (xⁿ)' = n·xⁿ⁻¹", "Constante → 0; el número que multiplica se queda", "Suma: término por término"]}
    />
  );
};

export const C05 = leerGuion(guion);

export const C05Reglas: React.FC = () => (
  <VideoLargo
    guion={C05}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={5} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      patron: Patron,
      potencia: Potencia,
      otras: Otras,
      ejemplo: Ejemplo,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={6} titulo="Exponencial y *logaritmo*" sub="La función que es su propia derivada" />,
    }}
  />
);
