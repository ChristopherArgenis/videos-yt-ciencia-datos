import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import {
  CierreCurso,
  COL,
  Cuidado,
  Curva,
  Flecha,
  Formula,
  Mapa,
  Nota,
  Objetivo,
  Paso,
  Plano,
  Recuerda,
  RetoResumen,
  SerieCalculo,
  type Ejes,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c11-gradiente.json";

// Cálculo Diferencial #11 · Derivadas parciales y gradiente. Énfasis matemático; la Ciencia de Datos es un plus.

/** La colina del episodio: f(x, y) = x² + 3xy + y². En (1, 2): ∇f = (8, 7). */
const F = (x: number, y: number) => x * x + 3 * x * y + y * y;
const MX: [number, number] = [-0.2, 2.2];
const MY: [number, number] = [0.8, 3.2];
const ESC = 0.1; // metros → unidades del mapa para dibujar las flechas

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

const Punto: React.FC<{ e: Ejes; x: number; y: number; color?: string; r?: number }> = ({ e, x, y, color = C.ink, r = 14 }) => (
  <circle cx={e.X(x)} cy={e.Y(y)} r={r} fill={color} stroke={C.bg} strokeWidth={5} />
);

const Etiqueta: React.FC<{ x: number; y: number; color: string; children: React.ReactNode; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  color,
  children,
  anchor = "start",
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={900} fontSize={32} fill={color} stroke={C.bg} strokeWidth={8} paintOrder="stroke">
    {children}
  </text>
);

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3] = lineas;
  const frame = useCurrentFrame();
  const pE = useP(g1.at + 10, g1.at + 40);
  const pN = useP(g1.at + g1.frames * 0.55, g1.at + g1.frames * 0.55 + 30);
  const pD = useP(g3.at + 10, g3.at + 50);
  return (
    <Split
      ratio={0.44}
      left={
        <>
          <Words text="¿Hacia dónde sube *más rápido*?" size={64} align="left" accent={C.yellow} delay={g1.at} />
          <Aparece at={g1.at + 20}>
            <Chip bg={C.blue} color={C.ink} size={34}>
              al este: +8 m por paso
            </Chip>
          </Aparece>
          <Aparece at={g1.at + g1.frames * 0.55}>
            <Chip bg={C.green} size={34}>
              al norte: +7 m por paso
            </Chip>
          </Aparece>
          {frame >= g2.at + g2.frames * 0.6 && frame < g3.at && (
            <Aparece at={g2.at + g2.frames * 0.6}>
              <Sticker bg={C.coral} color={C.ink} size={36}>
                ¿Al este? No.
              </Sticker>
            </Aparece>
          )}
          <Sequence from={g3.at} layout="none">
            <Aparece at={0}>
              <Chip bg={C.yellow} size={34}>
                en diagonal: +10.6 m por paso
              </Chip>
            </Aparece>
          </Sequence>
        </>
      }
      right={
        <>
          <Mapa w={620} h={620} x={MX} y={MY} f={F} nivel={2}>
            {(e) => (
              <>
                <Flecha e={e} x0={1} y0={2} x1={1 + 8 * ESC} y1={2} color={C.blue} p={pE} />
                <Flecha e={e} x0={1} y0={2} x1={1} y1={2 + 7 * ESC} color={C.green} p={pN} />
                {frame >= g3.at && <Flecha e={e} x0={1} y0={2} x1={1 + 8 * ESC} y1={2 + 7 * ESC} color={C.yellow} ancho={12} p={pD} />}
                <Punto e={e} x={1} y={2} />
                <Etiqueta x={e.X(1) - 20} y={e.Y(2) + 50} color={C.ink} anchor="end">
                  estás aquí
                </Etiqueta>
              </>
            )}
          </Mapa>
          <Nota>Ejemplo simplificado · mapa de una colina vista desde arriba</Nota>
        </>
      }
    />
  );
};

const RecuerdaEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2] = lineas;
  return (
    <Recuerda
      at={r1.at}
      idea={<>f'' mide cómo cambia la pendiente · inflexión: f'' cambia de signo</>}
      atReto={r2.at}
      reto={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Formula tex={"f(\\ent{x}) = \\ent{x}^3 - 6\\ent{x}^2 \\;\\Rightarrow\\; f''(\\ent{x}) = 6\\ent{x} - 12"} size={56} />
          <Formula tex={"6\\ent{x} - 12 = 0 \\;\\Rightarrow\\; \\der{\\ent{x} = 2} \\;\\; \\text{(cambia de signo)}"} size={56} />
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
        { at: o1.at + 10, t: "Calcular derivadas parciales" },
        { at: o1.at + t, t: "Armar el gradiente" },
        { at: o1.at + 2 * t, t: "Saber hacia dónde sube más una función" },
      ]}
    />
  );
};

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3] = lineas;
  const frame = useCurrentFrame();
  const enY = frame >= q3.at; // segunda rebanada
  const pC = useP(enY ? q3.at + 10 : q2.at + 10, (enY ? q3.at : q2.at) + 50);
  const corte = (
    <Mapa w={520} h={520} x={MX} y={MY} f={F} nivel={2}>
      {(e) => (
        <>
          {frame >= q2.at && !enY && <line x1={e.X(MX[0])} y1={e.Y(2)} x2={e.X(MX[0]) + (e.X(MX[1]) - e.X(MX[0])) * pC} y2={e.Y(2)} stroke={C.blue} strokeWidth={9} />}
          {enY && <line x1={e.X(1)} y1={e.Y(MY[0])} x2={e.X(1)} y2={e.Y(MY[0]) + (e.Y(MY[1]) - e.Y(MY[0])) * pC} stroke={C.green} strokeWidth={9} />}
          <Punto e={e} x={1} y={2} />
          {frame >= q2.at && !enY && (
            <Etiqueta x={e.X(MX[0]) + 14} y={e.Y(2) - 18} color={C.blue}>
              y = 2 (fija)
            </Etiqueta>
          )}
          {enY && (
            <Etiqueta x={e.X(1) + 18} y={e.Y(MY[0]) - 20} color={C.green}>
              x = 1 (fija)
            </Etiqueta>
          )}
        </>
      )}
    </Mapa>
  );
  if (frame < q2.at) {
    return (
      <Stage gap={30}>
        <Words text="Una *rebanada* a la vez" size={72} accent={C.yellow} delay={q1.at} />
        <Aparece at={q1.at + 30}>
          <Formula tex={"f(\\ent{x}, \\sal{y}) = \\ent{x}^2 + 3\\ent{x}\\sal{y} + \\sal{y}^2"} size={72} />
        </Aparece>
        <Aparece at={q1.at + q1.frames * 0.6}>
          <Sticker bg={C.yellow} size={34}>
            el truco: congelar la otra variable
          </Sticker>
        </Aparece>
      </Stage>
    );
  }
  const fx = (x: number) => x * x + 6 * x + 4;
  const fy = (y: number) => y * y + 3 * y + 1;
  return (
    <Split
      ratio={0.46}
      left={corte}
      right={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Aparece at={enY ? q3.at : q2.at}>
            <Formula
              tex={enY ? "f(1, \\sal{y}) = \\sal{y}^2 + 3\\sal{y} + 1" : "f(\\ent{x}, 2) = \\ent{x}^2 + 6\\ent{x} + 4"}
              size={54}
            />
          </Aparece>
          <Plano w={560} h={400} x={[0, 3]} y={[0, 26]} paso={1} pasoY={5} etiquetaX={enY ? "y" : "x"} etiquetaY="altura">
            {(e) => (
              <>
                <Curva e={e} f={enY ? fy : fx} x={enY ? [0.3, 3] : [0, 2.5]} color={enY ? C.green : C.blue} p={pC} />
                {pC > 0.95 && (
                  <>
                    <Recta e={e} x0={enY ? 2 : 1} y0={11} m={enY ? 7 : 8} xa={(enY ? 2 : 1) - 0.6} xb={(enY ? 2 : 1) + 0.6} color={C.yellow} ancho={6} />
                    <circle cx={e.X(enY ? 2 : 1)} cy={e.Y(11)} r={13} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                  </>
                )}
              </>
            )}
          </Plano>
          <Aparece at={(enY ? q3.at : q2.at) + 60}>
            <Card accent={C.yellow} style={{ padding: "10px 26px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink }}>
                pendiente: <span style={{ color: C.yellow }}>{enY ? "7 (al norte)" : "8 (al este)"}</span>
              </div>
            </Card>
          </Aparece>
        </div>
      }
    />
  );
};

const Calcula: React.FC<EscenaProps> = ({ lineas }) => {
  const [c1, c2, c3, c4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={22}>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <Aparece at={c1.at}>
          <Formula tex={"\\dfrac{\\partial f}{\\partial \\ent{x}}"} size={80} color={C.coral} />
        </Aparece>
        <Aparece at={c1.at + 20}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.ink, maxWidth: 820, lineHeight: 1.3 }}>
            derivada parcial de f respecto a x: <span style={{ color: C.yellow }}>las demás variables son números fijos</span>
          </div>
        </Aparece>
      </div>
      <Aparece at={c1.at + c1.frames * 0.5}>
        <Formula tex={"f(\\ent{x}, \\sal{y}) = \\ent{x}^2 + 3\\ent{x}\\sal{y} + \\sal{y}^2"} size={60} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Paso
          at={c2.at}
          n={1}
          tex={"\\dfrac{\\partial f}{\\partial \\ent{x}} = 2\\ent{x} + 3\\sal{y} + 0"}
          nota="y es un número fijo: y² no cambia → 0"
          on={frame < c3.at}
          ancho={720}
          size={48}
        />
        <Paso at={c3.at} n={2} tex={"\\dfrac{\\partial f}{\\partial \\sal{y}} = 0 + 3\\ent{x} + 2\\sal{y}"} nota="ahora x es el número fijo" on={frame >= c3.at && frame < c4.at} ancho={720} size={48} />
        <Paso
          at={c4.at}
          n={3}
          tex={"(1, 2):\\;\\; 2 + 6 = \\der{8},\\;\\; 3 + 4 = \\der{7}"}
          nota="las mismas pendientes de las rebanadas"
          on={frame >= c4.at}
          ancho={720}
          size={48}
        />
      </div>
    </Stage>
  );
};

const Gradiente: React.FC<EscenaProps> = ({ lineas }) => {
  const [d1, d2, d3] = lineas;
  const frame = useCurrentFrame();
  const pA = useP(d1.at + d1.frames * 0.6, d1.at + d1.frames * 0.6 + 40);
  return (
    <Split
      ratio={0.5}
      left={
        <>
          <Words text="El *gradiente*" size={72} align="left" accent={C.yellow} delay={d1.at} />
          <Aparece at={d1.at + 20}>
            <Formula tex={"\\nabla f = \\left( \\dfrac{\\partial f}{\\partial \\ent{x}},\\; \\dfrac{\\partial f}{\\partial \\sal{y}} \\right)"} size={54} />
          </Aparece>
          <Aparece at={d1.at + d1.frames * 0.5}>
            <Formula tex={"\\nabla f(1, 2) = (\\der{8},\\, \\der{7})"} size={60} />
          </Aparece>
          <Aparece at={d2.at}>
            <Chip bg={C.yellow} size={30}>
              apunta hacia donde sube más rápido
            </Chip>
          </Aparece>
          <Aparece at={d3.at}>
            <Formula tex={"|\\nabla f| = \\sqrt{8^2 + 7^2} = \\sqrt{113} \\approx \\reg{10.6}"} size={50} />
          </Aparece>
          {frame >= d3.at + d3.frames * 0.6 && (
            <Aparece at={d3.at + d3.frames * 0.6}>
              <Sticker bg={C.green} size={30}>
                la diagonal del inicio
              </Sticker>
            </Aparece>
          )}
        </>
      }
      right={
        <Mapa w={600} h={600} x={MX} y={MY} f={F} nivel={2}>
          {(e) => (
            <>
              <Flecha e={e} x0={1} y0={2} x1={1 + 8 * ESC} y1={2 + 7 * ESC} color={C.yellow} ancho={12} p={pA} />
              {frame >= d2.at && (
                <>
                  {/* Dirección de la curva de nivel: perpendicular al gradiente, (7, −8) */}
                  <line
                    x1={e.X(1 - 7 * 0.05)}
                    y1={e.Y(2 + 8 * 0.05)}
                    x2={e.X(1 + 7 * 0.05)}
                    y2={e.Y(2 - 8 * 0.05)}
                    stroke={C.ink}
                    strokeWidth={4}
                    strokeDasharray="10 8"
                  />
                  <Etiqueta x={e.X(1 + 7 * 0.05) + 10} y={e.Y(2 - 8 * 0.05) + 10} color={C.ink}>
                    curva de nivel
                  </Etiqueta>
                  <Etiqueta x={e.X(1 + 8 * ESC) + 14} y={e.Y(2 + 7 * ESC) - 6} color={C.yellow}>
                    ∇f
                  </Etiqueta>
                </>
              )}
              <Punto e={e} x={1} y={2} />
            </>
          )}
        </Mapa>
      }
    />
  );
};

const Ejemplo2: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2] = lineas;
  const frame = useCurrentFrame();
  const G = (x: number, y: number) => x * x * y + 5 * y;
  const pA = useP(e2.at + 20, e2.at + 60);
  return (
    <Split
      ratio={0.56}
      left={
        <>
          <Aparece at={e1.at}>
            <Formula tex={"g(\\ent{x}, \\sal{y}) = \\ent{x}^2\\sal{y} + 5\\sal{y}"} size={62} />
          </Aparece>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Paso at={e1.at + e1.frames * 0.3} n={1} tex={"\\dfrac{\\partial g}{\\partial \\ent{x}} = 2\\ent{x}\\sal{y}"} on={frame < e1.at + e1.frames * 0.65} ancho={620} size={50} />
            <Paso at={e1.at + e1.frames * 0.65} n={2} tex={"\\dfrac{\\partial g}{\\partial \\sal{y}} = \\ent{x}^2 + 5"} on={frame >= e1.at + e1.frames * 0.65 && frame < e2.at} ancho={620} size={50} />
            <Paso at={e2.at} n={3} tex={"\\nabla g(2, 1) = (\\der{4},\\, \\der{9})"} on={frame >= e2.at} ancho={620} size={50} />
          </div>
        </>
      }
      right={
        <Mapa w={460} h={460} x={[1, 3]} y={[0, 2]} f={G} nivel={1}>
          {(e) => (
            <>
              <Flecha e={e} x0={2} y0={1} x1={2 + 4 * 0.08} y1={1 + 9 * 0.08} color={C.yellow} ancho={11} p={pA} />
              <Punto e={e} x={2} y={1} />
            </>
          )}
        </Mapa>
      }
    />
  );
};

const ParaQue: React.FC<EscenaProps> = ({ lineas }) => {
  const [u1, u2] = lineas;
  const frame = useCurrentFrame();
  const H = (x: number, y: number) => 10 - x * x - y * y;
  const pts: [number, number][] = [];
  for (const a of [-1.5, -0.75, 0.75, 1.5]) for (const b of [-1.5, -0.75, 0.75, 1.5]) pts.push([a, b]);
  const pG = useP(u1.at + 30, u1.at + 70);
  const pA = useP(u1.at + u1.frames * 0.6, u1.at + u1.frames * 0.6 + 40);
  return (
    <Split
      ratio={0.46}
      left={
        <>
          <Words text="¿Para qué se *usa*?" size={68} align="left" accent={C.blue} delay={u1.at} />
          <Aparece at={u1.at + 30}>
            <Chip bg={C.yellow} size={30}>
              montaña: la ruta más empinada
            </Chip>
          </Aparece>
          <Aparece at={u1.at + u1.frames * 0.6}>
            <Chip bg={C.blue} color={C.ink} size={30}>
              el agua baja en sentido contrario: −∇h
            </Chip>
          </Aparece>
          <Aparece at={u2.at}>
            <Chip bg={C.coral} color={C.ink} size={30}>
              física: el calor va de caliente a frío (−∇T)
            </Chip>
          </Aparece>
        </>
      }
      right={
        <Mapa w={560} h={560} x={[-2, 2]} y={[-2, 2]} f={H} nivel={1}>
          {(e) => (
            <>
              {pts.map(([a, b]) => (
                <g key={`${a},${b}`}>
                  <Flecha e={e} x0={a} y0={b} x1={a - 0.2 * a} y1={b - 0.2 * b} color={C.yellow} ancho={6} p={pG} />
                  {frame >= u1.at + u1.frames * 0.6 && <Flecha e={e} x0={a} y0={b} x1={a + 0.2 * a} y1={b + 0.2 * b} color={C.blue} ancho={5} p={pA} />}
                </g>
              ))}
              <Punto e={e} x={0} y={0} color={C.yellow} />
              <Etiqueta x={e.X(0)} y={e.Y(0) + 52} color={C.yellow} anchor="middle">
                cima
              </Etiqueta>
            </>
          )}
        </Mapa>
      }
    />
  );
};

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2] = lineas;
  const frame = useCurrentFrame();
  const datos: [number, number][] = [
    [1, 2.2],
    [2, 2.9],
    [3, 4.6],
    [4, 4.9],
    [5, 6.4],
  ];
  const capas = [3, 5, 5, 2];
  return (
    <Stage gap={24}>
      <Chip bg={C.purple} color={C.bg} size={28}>
        PLUS · CIENCIA DE DATOS
      </Chip>
      <Words text="Un *plus*: un número por cada peso" size={58} accent={C.purple} delay={p1.at} />
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <Aparece at={p1.at + 20}>
          <Card accent={C.blue} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Plano w={420} h={250} x={[0, 6]} y={[0, 8]} paso={1} pasoY={2} etiquetaY="y">
              {(e) => (
                <>
                  <line x1={e.X(0)} y1={e.Y(1.2)} x2={e.X(6)} y2={e.Y(1.2 + 0.85 * 6)} stroke={C.yellow} strokeWidth={6} />
                  {datos.map(([a, b]) => (
                    <circle key={a} cx={e.X(a)} cy={e.Y(b)} r={10} fill={C.blue} stroke={C.bg} strokeWidth={3} />
                  ))}
                </>
              )}
            </Plano>
            <Formula tex={"\\nabla L = \\left( \\dfrac{\\partial L}{\\partial w},\\; \\dfrac{\\partial L}{\\partial b} \\right)"} size={42} />
          </Card>
        </Aparece>
        {frame >= p2.at && (
          <Aparece at={p2.at}>
            <Card accent={C.purple} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <svg width={420} height={250} viewBox="0 0 420 250">
                {capas.slice(0, -1).map((n, i) =>
                  Array.from({ length: n }).flatMap((_, a) =>
                    Array.from({ length: capas[i + 1] }).map((__, b) => (
                      <line
                        key={`${i}-${a}-${b}`}
                        x1={40 + i * 113}
                        y1={125 + (a - (n - 1) / 2) * 46}
                        x2={40 + (i + 1) * 113}
                        y2={125 + (b - (capas[i + 1] - 1) / 2) * 46}
                        stroke={C.purple}
                        strokeOpacity={0.55}
                        strokeWidth={2.5}
                      />
                    )),
                  ),
                )}
                {capas.map((n, i) =>
                  Array.from({ length: n }).map((_, a) => <circle key={`${i}-${a}`} cx={40 + i * 113} cy={125 + (a - (n - 1) / 2) * 46} r={13} fill={C.ink} />),
                )}
              </svg>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.ink }}>millones de pesos → ∇L con millones de números</div>
            </Card>
          </Aparece>
        )}
      </div>
      <Aparece at={p1.at + p1.frames * 0.45}>
        <Formula tex={"L(w, b) = \\sum (w x_i + b - y_i)^2"} size={44} />
      </Aparece>
      <Nota>Ejemplo simplificado</Nota>
    </Stage>
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1240, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · sympy</span>
        </div>
        <Codigo at={y1.at} texto="f = x**2 + 3*x*y + y**2" dur={22} />
        <Codigo at={y1.at + 26} texto="grad = [sp.diff(f, v) for v in (x, y)]" dur={26} />
        <Aparece at={y2.at + 10}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>[2*x + 3*y, 3*x + 2*y]</div>
        </Aparece>
        <Codigo at={y3.at} texto="[g.subs({x: 1, y: 2}) for g in grad]" dur={24} />
        <Aparece at={y3.at + 32}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>[8, 7]</div>
        </Aparece>
      </div>
    </Stage>
  );
};

const ErrorComun: React.FC<EscenaProps> = ({ lineas }) => {
  const [x1, x2] = lineas;
  const fila = (at: number, mal: string, bien: string) => (
    <Aparece at={at}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", opacity: 0.85 }}>
          <Formula tex={mal} size={54} color={C.coral} />
          <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 6, background: C.coral, rotate: "-6deg" }} />
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.coral }}>✗</span>
        <Formula tex={bien} size={54} color={C.green} />
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.green }}>✓</span>
      </div>
    </Aparece>
  );
  return (
    <Stage gap={36}>
      <Sticker bg={C.coral} color={C.ink} size={48}>
        ¡CUIDADO!
      </Sticker>
      <Cuidado at={x1.at + 10}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: C.ink }}>derivar también la variable congelada</div>
      </Cuidado>
      {fila(x1.at + x1.frames * 0.5, "\\dfrac{\\partial}{\\partial x}\\left(y^2\\right) = 2y", "\\dfrac{\\partial}{\\partial x}\\left(y^2\\right) = 0")}
      {fila(x2.at, "\\dfrac{\\partial}{\\partial x}(3xy) = 3y + 3x", "\\dfrac{\\partial}{\\partial x}(3xy) = 3y")}
      <Sequence from={x2.at + x2.frames * 0.5} layout="none">
        <Chip bg={C.yellow} size={30}>
          si no es la variable, es un número
        </Chip>
      </Sequence>
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
          <Formula tex={"f(\\ent{x}, \\sal{y}) = \\ent{x}^2 + \\sal{y}^2"} size={90} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.yellow }}>¿Cuánto vale su gradiente en (1, 1)?</div>
        </Card>
      }
      ideas={["Parcial: derivar una variable, las demás fijas", "Gradiente: el vector de las parciales", "Apunta hacia donde la función sube más rápido"]}
    />
  );
};

export const C11 = leerGuion(guion);

export const C11Gradiente: React.FC = () => (
  <VideoLargo
    guion={C11}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={11} />,
      recuerda: RecuerdaEsc,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      calcula: Calcula,
      gradiente: Gradiente,
      ejemplo2: Ejemplo2,
      para_que: ParaQue,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={12} titulo="Descenso de *gradiente*" sub="El final del curso: así aprende un modelo" />,
    }}
  />
);
