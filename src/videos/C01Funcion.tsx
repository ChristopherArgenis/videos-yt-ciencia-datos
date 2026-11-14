import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Card, Sfx, Split, Stage, Sticker, Words } from "../kit/kit";
import { leerGuion, VideoLargo, type EscenaProps } from "../kit/largo";
import { Aparece, Chip, Codigo, useP } from "../kit/futbol";
import {
  CierreCurso,
  COL,
  Cuidado,
  Curva,
  Formula,
  Maquina,
  Nota,
  Objetivo,
  Plano,
  PlusDatos,
  RetoResumen,
  SerieCalculo,
} from "../kit/curso";
import { C, FONT, MONO } from "../kit/theme";
import guion from "../guiones/c01-funcion.json";

// Cálculo Diferencial #1 · Qué es una función. Énfasis matemático; la Ciencia de Datos es un plus.

const f = (x: number) => 2 * x + 3;
const TABLA = [0, 1, 2, 3];

const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2, g3, g4] = lineas;
  const frame = useCurrentFrame();
  return (
    <Stage gap={40}>
      {frame < g2.at ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <Maquina entrada="3" salidas={["9"]} regla="?" at={g1.at + 5} />
          <Maquina entrada="−3" salidas={["9"]} regla="?" at={g1.at + g1.frames / 2} />
        </div>
      ) : frame < g3.at ? (
        <Maquina entrada="9" salidas={["3", "−3"]} regla="?" at={g2.at + 5} mala />
      ) : (
        <>
          <div style={{ display: "flex", gap: 60, alignItems: "center", scale: "0.62" }}>
            <Card accent={C.blue}>
              <Maquina entrada="±3" salidas={["9"]} regla="A" at={-100} />
            </Card>
            <Card accent={C.coral}>
              <Maquina entrada="9" salidas={["3", "−3"]} regla="B" at={-100} mala />
            </Card>
          </div>
          <Words text="¿Cuál es una *función*?" size={96} accent={C.yellow} delay={g3.at} />
          <Sequence from={g4.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={36}>
              La idea sobre la que se construye todo el cálculo
            </Sticker>
          </Sequence>
        </>
      )}
      <Sfx src="whoosh.wav" at={g3.at} volume={0.3} />
    </Stage>
  );
};

const ObjetivoEsc: React.FC<EscenaProps> = ({ lineas }) => {
  const [o1, o2] = lineas;
  const t = o2.frames / 3;
  return (
    <Objetivo
      at={o1.at}
      metas={[
        { at: o2.at, t: "Decir qué es una función" },
        { at: o2.at + t, t: "Evaluarla (calcular su resultado)" },
        { at: o2.at + 2 * t, t: "Reconocerla en una gráfica" },
      ]}
    />
  );
};

const QueEs: React.FC<EscenaProps> = ({ lineas }) => {
  const [q1, q2, q3, q4, q5] = lineas;
  const frame = useCurrentFrame();
  const ejemplos = [
    { a: "lado del cuadrado", b: "área" },
    { a: "hora del día", b: "temperatura" },
    { a: "minutos de llamada", b: "lo que pagas" },
  ];
  return (
    <Stage gap={36}>
      <Words text="¿Qué es una *función*?" size={80} accent={C.blue} delay={q1.at} />
      {frame < q4.at ? (
        <>
          <div style={{ display: "flex", gap: 40, fontFamily: FONT, fontWeight: 900, fontSize: 40 }}>
            <Aparece at={q2.at}>
              <span style={{ color: COL.entrada }}>entrada</span>
            </Aparece>
            <Aparece at={q2.at + 15}>
              <span style={{ color: C.dim }}>→</span> <span style={{ color: COL.cambio }}>regla</span> <span style={{ color: C.dim }}>→</span>
            </Aparece>
            <Aparece at={q2.at + 30}>
              <span style={{ color: COL.salida }}>salida</span>
            </Aparece>
          </div>
          <Aparece at={q3.at}>
            <Card accent={C.yellow} style={{ textAlign: "center", padding: "26px 50px" }}>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink, lineHeight: 1.25 }}>
                A cada <span style={{ color: COL.entrada }}>entrada</span> le corresponde
                <br />
                <span style={{ color: C.yellow }}>exactamente UNA</span> <span style={{ color: COL.salida }}>salida</span>
              </div>
            </Card>
          </Aparece>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {ejemplos.map((e, i) => (
            <Aparece key={e.a} at={q4.at + 20 + i * ((q4.frames - 30) / 3)}>
              <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: FONT, fontWeight: 800, fontSize: 48 }}>
                <span style={{ width: 520, textAlign: "right", color: COL.entrada }}>{e.a}</span>
                <span style={{ color: C.yellow }}>⟶</span>
                <span style={{ color: COL.salida }}>{e.b}</span>
              </div>
            </Aparece>
          ))}
          <Sequence from={q5.at} layout="none">
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <Sticker bg={C.yellow} size={38}>
                Si una cantidad depende de otra → hay una función
              </Sticker>
            </div>
          </Sequence>
        </div>
      )}
    </Stage>
  );
};

const Etiqueta: React.FC<{ at: number; color: string; t: string; abajo?: boolean }> = ({ at, color, t, abajo }) => (
  <Aparece at={at}>
    <div style={{ fontFamily: MONO, fontSize: 36, color, textAlign: "center", marginTop: abajo ? 10 : 0 }}>{t}</div>
  </Aparece>
);

const Notacion: React.FC<EscenaProps> = ({ lineas }) => {
  const [n1, n2, n3, n4, n5] = lineas;
  const frame = useCurrentFrame();
  const t = n2.frames / 3;
  return (
    <Stage gap={40}>
      <Aparece at={n1.at}>
        <Formula tex={"f(\\ent{x}) = \\reg{2x + 3}"} size={150} />
      </Aparece>
      {frame < n4.at ? (
        <div style={{ display: "flex", gap: 50 }}>
          <Etiqueta at={n2.at} color={C.ink} t="f = el nombre" />
          <Etiqueta at={n2.at + t} color={COL.entrada} t="x = la entrada" />
          <Etiqueta at={n2.at + 2 * t} color={COL.salida} t="f(x) = la salida" />
          <Etiqueta at={n3.at} color={COL.cambio} t="2x + 3 = la regla" />
        </div>
      ) : (
        <>
          <Aparece at={n4.at + 40}>
            <Card accent={C.yellow} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.dim, marginBottom: 8 }}>Taxi: 30 por subirte + 10 por km</div>
              <Formula tex={"C(\\ent{k}) = \\reg{30 + 10k}"} size={100} />
            </Card>
          </Aparece>
          <Sequence from={n5.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={34}>
              Otra letra, la misma idea: entrada → regla → salida
            </Sticker>
          </Sequence>
          <Nota>Ejemplo simplificado</Nota>
        </>
      )}
    </Stage>
  );
};

const Paso: React.FC<{ at: number; n: number; tex: string; nota: string; on: boolean }> = ({ at, n, tex, nota, on }) => (
  <Aparece at={at}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: on ? 1 : 0.45 }}>
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          background: on ? C.yellow : C.bg2,
          color: C.bg,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div style={{ width: 720 }}>
        <Formula tex={tex} size={76} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dim }}>{nota}</span>
    </div>
  </Aparece>
);

const Evaluar: React.FC<EscenaProps> = ({ lineas }) => {
  const [e1, e2, e3, e4, e5, e6] = lineas;
  const frame = useCurrentFrame();
  if (frame >= e6.at) {
    return (
      <Stage gap={30}>
        <Words text="Evaluar muchas entradas = una *tabla*" size={66} accent={C.yellow} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: MONO, fontSize: 56, fontWeight: 700 }}>
          <div style={{ display: "flex", gap: 0, borderBottom: `3px solid ${C.dim}55` }}>
            <span style={{ width: 240, color: COL.entrada, textAlign: "center" }}>x</span>
            <span style={{ width: 240, color: COL.salida, textAlign: "center" }}>f(x)</span>
          </div>
          {TABLA.map((x, i) => (
            <Aparece key={x} at={e6.at + 20 + i * ((e6.frames - 30) / 4)}>
              <div style={{ display: "flex" }}>
                <span style={{ width: 240, color: COL.entrada, textAlign: "center" }}>{x}</span>
                <span style={{ width: 240, color: COL.salida, textAlign: "center" }}>{f(x)}</span>
              </div>
            </Aparece>
          ))}
        </div>
      </Stage>
    );
  }
  if (frame >= e5.at) {
    return (
      <Stage gap={30}>
        <Formula tex={"C(\\ent{5}) = 30 + 10 \\cdot \\ent{5} = \\sal{80}"} size={110} />
        <Aparece at={e5.at + 60}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink }}>
            Un viaje de 5 km cuesta <span style={{ color: COL.salida }}>80 pesos</span>
          </div>
        </Aparece>
        <Nota>Ejemplo simplificado</Nota>
      </Stage>
    );
  }
  return (
    <Stage gap={34}>
      <Words text="Cómo se calcula: *evaluar*" size={72} accent={C.yellow} delay={e1.at} />
      <Aparece at={e1.at + 20}>
        <Formula tex={"f(\\ent{x}) = 2\\ent{x} + 3"} size={70} color={C.dim} />
      </Aparece>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Paso at={e2.at} n={1} tex={"f(\\ent{4}) = 2 \\cdot \\ent{4} + 3"} nota="cambia la x por 4" on={frame < e3.at} />
        <Paso at={e3.at} n={2} tex={"= 8 + 3"} nota="haz las operaciones" on={frame >= e3.at && frame < e4.at} />
        <Paso at={e4.at} n={3} tex={"f(\\ent{4}) = \\sal{11}"} nota="el resultado" on={frame >= e4.at} />
      </div>
    </Stage>
  );
};

const Grafica: React.FC<EscenaProps> = ({ lineas }) => {
  const [r1, r2, r3] = lineas;
  const frame = useCurrentFrame();
  const pC = useP(r2.at + 10, r2.at + 70);
  return (
    <Split
      ratio={0.38}
      left={
        <>
          <Words text="La *gráfica*" size={80} align="left" accent={C.yellow} delay={r1.at} />
          <Aparece at={r1.at + 30}>
            <div style={{ fontFamily: FONT, fontSize: 36, color: C.ink, lineHeight: 1.35 }}>
              Cada fila de la tabla es un punto: <b style={{ color: COL.entrada }}>(entrada</b>, <b style={{ color: COL.salida }}>salida)</b>
            </div>
          </Aparece>
          <Aparece at={r2.at + 60}>
            <Formula tex={"f(x) = 2x + 3"} size={64} color={C.yellow} />
          </Aparece>
          <Sequence from={r3.at} layout="none">
            <Sticker bg={C.blue} color={C.ink} size={30}>
              La función entera, en un dibujo
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <Plano w={760} h={600} x={[-1, 4]} y={[0, 11]} paso={1}>
          {(e) => (
            <>
              <Curva e={e} f={f} x={[-1, 4]} p={pC} />
              {TABLA.map((x, i) =>
                frame >= r1.at + 20 + i * 15 ? (
                  <g key={x}>
                    <circle cx={e.X(x)} cy={e.Y(f(x))} r={13} fill={C.ink} stroke={C.bg} strokeWidth={4} />
                    <text x={e.X(x) - 18} y={e.Y(f(x)) - 20} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={26} fill={C.ink}>
                      ({x}, {f(x)})
                    </text>
                  </g>
                ) : null,
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const LineaVertical: React.FC<EscenaProps> = ({ lineas }) => {
  const [v1, v2, v3, v4, v5] = lineas;
  const frame = useCurrentFrame();
  // Barrido de la línea vertical: parábola en v2, círculo en v3.
  const circulo = frame >= v3.at + 40;
  const pB = useP(circulo ? v3.at + 50 : v2.at + 10, circulo ? v3.at + 110 : v2.at + v2.frames - 10, false);
  if (frame >= v4.at) {
    const ok = frame < v5.at;
    return (
      <Stage gap={36}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ opacity: ok ? 1 : 0.35, display: "flex", alignItems: "center", gap: 40 }}>
            <Maquina entrada="±3" salidas={["9"]} regla="x²" at={-100} ancho={300} />
            <Chip bg={C.green} size={36}>
              ✓ SÍ es función
            </Chip>
          </div>
          <div style={{ opacity: ok ? 0.35 : 1, display: "flex", alignItems: "center", gap: 40 }}>
            <Maquina entrada="9" salidas={["3", "−3"]} regla="?" at={-100} ancho={300} mala />
            <Chip bg={C.coral} size={36}>
              ✕ NO es función
            </Chip>
          </div>
        </div>
        <Aparece at={ok ? v4.at + 60 : v5.at + 20}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.ink, textAlign: "center" }}>
            {ok ? "Dos entradas con la misma salida: permitido" : "Una entrada con dos salidas: rompe la regla"}
          </div>
        </Aparece>
      </Stage>
    );
  }
  const xl = circulo ? -3 + 3 * pB : -3 + 6 * pB;
  const toca = circulo ? (Math.abs(xl) < 3 ? [Math.sqrt(9 - xl * xl), -Math.sqrt(9 - xl * xl)] : []) : [xl * xl];
  return (
    <Split
      ratio={0.4}
      left={
        <>
          <Words text="Prueba de la *línea vertical*" size={66} align="left" accent={C.yellow} delay={v1.at} />
          <Aparece at={v2.at}>
            <div style={{ fontFamily: FONT, fontSize: 34, color: C.ink, lineHeight: 1.35 }}>
              Si la línea toca <b style={{ color: C.coral }}>dos puntos</b> en algún lugar, <b>no es función</b>
            </div>
          </Aparece>
          <Aparece at={v3.at}>
            <div style={{ display: "flex", gap: 20 }}>
              <Chip bg={C.green} size={30}>
                parábola ✓
              </Chip>
              {circulo && (
                <Chip bg={C.coral} size={30}>
                  círculo ✕
                </Chip>
              )}
            </div>
          </Aparece>
        </>
      }
      right={
        <Plano w={680} h={620} x={[-4, 4]} y={circulo ? [-4, 4] : [-1, 9]} paso={circulo ? 1 : 2} etiquetaY="y">
          {(e) => (
            <>
              {circulo ? (
                <circle cx={e.X(0)} cy={e.Y(0)} r={e.X(3) - e.X(0)} fill="none" stroke={C.yellow} strokeWidth={6} />
              ) : (
                <Curva e={e} f={(x) => x * x} x={[-3, 3]} />
              )}
              {frame >= v2.at + 10 && (
                <>
                  <line x1={e.X(xl)} y1={-20} x2={e.X(xl)} y2={640} stroke={C.coral} strokeWidth={5} strokeDasharray="12 8" />
                  {toca.map((y, i) => (
                    <circle key={i} cx={e.X(xl)} cy={e.Y(y)} r={14} fill={toca.length > 1 ? C.coral : C.green} stroke={C.bg} strokeWidth={4} />
                  ))}
                </>
              )}
              {circulo && pB >= 1 && (
                <text x={e.X(0) + 24} y={e.Y(0) + 10} fontFamily={MONO} fontWeight={700} fontSize={28} fill={C.coral}>
                  x = 0 → y = 3 y y = −3
                </text>
              )}
            </>
          )}
        </Plano>
      }
    />
  );
};

const Dominio: React.FC<EscenaProps> = ({ lineas }) => {
  const [d1, d2, d3] = lineas;
  const t = d2.frames / 2;
  return (
    <Stage gap={34}>
      <Words text="*Dominio* y *rango*" size={80} accent={C.blue} delay={d1.at} />
      <div style={{ display: "flex", gap: 40 }}>
        <Aparece at={d2.at}>
          <Card accent={COL.entrada} style={{ width: 760, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.entrada }}>DOMINIO</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dim }}>las entradas permitidas</div>
            <Aparece at={d2.at + 40}>
              <Formula tex={"\\dfrac{1}{\\ent{x}} \\;\\rightarrow\\; \\ent{x} \\neq 0"} size={64} />
            </Aparece>
            <Aparece at={d2.at + t}>
              <Formula tex={"\\sqrt{\\ent{x}} \\;\\rightarrow\\; \\ent{x} \\geq 0"} size={64} />
            </Aparece>
          </Card>
        </Aparece>
        <Aparece at={d3.at}>
          <Card accent={COL.salida} style={{ width: 760, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: COL.salida }}>RANGO</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dim }}>las salidas posibles</div>
            <Formula tex={"\\ent{x}^2 \\;\\rightarrow\\; \\sal{f(x)} \\geq 0"} size={64} />
            <Plano w={420} h={170} x={[-3, 3]} y={[-1, 9]} paso={3} etiquetaY="">
              {(e) => (
                <>
                  <rect x={0} y={e.Y(9)} width={420} height={e.Y(0) - e.Y(9)} fill={`${COL.salida}22`} />
                  <Curva e={e} f={(x) => x * x} x={[-3, 3]} ancho={5} />
                </>
              )}
            </Plano>
          </Card>
        </Aparece>
      </div>
    </Stage>
  );
};

const Tipos: React.FC<EscenaProps> = ({ lineas }) => {
  const [t1, t2, t3, t4, t5] = lineas;
  const frame = useCurrentFrame();
  const tipos = [
    { at: t2.at, n: "LINEAL", tex: "f(x) = 2x + 3", f: (x: number) => 2 * x + 3, d: "crece siempre igual", uso: "el taxi", x: [-2, 3] as [number, number], y: [-1, 9] as [number, number] },
    { at: t3.at, n: "CUADRÁTICA", tex: "f(x) = x^2", f: (x: number) => x * x, d: "curva que baja y sube", uso: "áreas, un balón en el aire", x: [-3, 3] as [number, number], y: [-1, 9] as [number, number] },
    { at: t4.at, n: "EXPONENCIAL", tex: "f(x) = 2^x", f: (x: number) => 2 ** x, d: "crece cada vez más rápido", uso: "intereses, contagios", x: [-2, 3.2] as [number, number], y: [-1, 9] as [number, number] },
  ];
  return (
    <Stage gap={30}>
      <Words text="Para qué se usan: *familias*" size={70} accent={C.yellow} delay={t1.at} />
      <div style={{ display: "flex", gap: 30 }}>
        {tipos.map((t) => {
          const p = Math.min(1, Math.max(0, (frame - t.at - 10) / 40));
          return (
            <Aparece key={t.n} at={t.at}>
              <Card accent={C.yellow} style={{ width: 500, padding: "24px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.yellow }}>{t.n}</div>
                <Formula tex={t.tex} size={50} />
                <Plano w={360} h={230} x={t.x} y={t.y} paso={2} etiquetaY="">
                  {(e) => <Curva e={e} f={t.f} x={t.x} p={p} ancho={5} />}
                </Plano>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.ink }}>{t.d}</div>
                <div style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>{t.uso}</div>
              </Card>
            </Aparece>
          );
        })}
      </div>
      <div style={{ height: 60 }}>
        <Sequence from={t5.at} layout="none">
          <Sticker bg={C.blue} color={C.ink} size={30}>
            La forma ya te dice mucho de lo que describe
          </Sticker>
        </Sequence>
      </div>
    </Stage>
  );
};

// Puntos de casas: tamaño (m²) vs precio (millones). Ejemplo simplificado (inventado).
const CASAS = [
  [50, 1.3],
  [65, 1.5],
  [80, 2.1],
  [95, 2.2],
  [110, 2.9],
  [130, 3.2],
  [150, 3.9],
];

const Plus: React.FC<EscenaProps> = ({ lineas }) => {
  const [p1, p2, p3] = lineas;
  const frame = useCurrentFrame();
  const pR = useP(p2.at + 40, p2.at + 90);
  const modelo = (x: number) => 0.0255 * x + 0.03;
  return (
    <Split
      ratio={0.42}
      left={
        <>
          <Words text="Un *plus*: en Ciencia de Datos" size={62} align="left" accent={C.purple} delay={p1.at} />
          <Aparece at={p2.at}>
            <div style={{ fontFamily: FONT, fontSize: 36, color: C.ink, lineHeight: 1.35 }}>
              Un modelo es una función: entra el <b style={{ color: COL.entrada }}>tamaño</b>, sale el <b style={{ color: COL.salida }}>precio estimado</b>
            </div>
          </Aparece>
          <Aparece at={p2.at + 50}>
            <Formula tex={"\\sal{\\hat{y}} = f(\\ent{x})"} size={80} />
          </Aparece>
          <Sequence from={p3.at} layout="none">
            <Sticker bg={C.purple} size={30}>
              Entrenar = buscar la mejor función (con derivadas)
            </Sticker>
          </Sequence>
        </>
      }
      right={
        <>
          <Plano w={700} h={520} x={[40, 160]} y={[0, 4.5]} paso={20} etiquetaX="m²" etiquetaY="precio">
            {(e) => (
              <>
                <Curva e={e} f={modelo} x={[40, 160]} p={pR} color={C.purple} />
                {CASAS.map(([x, y], i) =>
                  frame >= p1.at + i * 5 ? <circle key={i} cx={e.X(x)} cy={e.Y(y)} r={12} fill={C.ink} stroke={C.bg} strokeWidth={4} /> : null,
                )}
              </>
            )}
          </Plano>
          <PlusDatos />
          <Nota>Ejemplo simplificado · precio en millones</Nota>
        </>
      }
    />
  );
};

const Python: React.FC<EscenaProps> = ({ lineas }) => {
  const [y1, y2, y3] = lineas;
  return (
    <Stage gap={30}>
      <div style={{ width: 1100, background: "#060a16", border: `3px solid ${C.dim}44`, borderRadius: 24, padding: "22px 30px 28px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[C.coral, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
          ))}
          <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, marginLeft: 12 }}>python · numpy</span>
        </div>
        <Codigo at={y1.at} texto="def f(x): return 2*x + 3" dur={24} />
        <Codigo at={y2.at} texto="f(4)" dur={8} />
        <Aparece at={y2.at + 20}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>11</div>
        </Aparece>
        <Codigo at={y3.at} texto="f(np.array([0, 1, 2, 3]))" dur={22} />
        <Aparece at={y3.at + 35}>
          <div style={{ fontFamily: MONO, fontSize: 32, color: COL.salida, height: 50 }}>array([3, 5, 7, 9])</div>
        </Aparece>
      </div>
      <Sequence from={y3.at + 60} layout="none">
        <Sticker bg={C.green} size={30}>
          La regla se escribe una vez y se evalúa en muchos valores
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
        <Cuidado at={x1.at + 20}>
          <Formula tex={"f(x) \\;\\neq\\; f \\cdot x"} size={110} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink }}>El paréntesis dice a qué valor se le aplica la regla</div>
        </Cuidado>
      ) : (
        <Cuidado at={x2.at}>
          <Formula tex={"f(2 + 3) = f(5) = \\sal{13}"} size={84} />
          <Aparece at={x2.at + 60}>
            <Formula tex={"f(2) + f(3) = 7 + 9 = \\der{16}"} size={84} />
          </Aparece>
          <Aparece at={x2.at + 120}>
            <Formula tex={"f(2 + 3) \\;\\neq\\; f(2) + f(3)"} size={64} color={C.coral} />
          </Aparece>
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
        <Card accent={C.yellow} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20, padding: "30px 60px" }}>
          <Formula tex={"\\text{Si } f(\\ent{x}) = \\ent{x}^2 - 1"} size={84} />
          <Formula tex={"f(\\ent{3}) = \\; ?"} size={110} color={C.yellow} />
        </Card>
      }
      ideas={[
        "Función: a cada entrada, una sola salida",
        "Evaluar: cambiar la x por el número y operar",
        "Gráfica: la prueba de la línea vertical",
      ]}
    />
  );
};

export const C01 = leerGuion(guion);

export const C01Funcion: React.FC = () => (
  <VideoLargo
    guion={C01}
    escenas={{
      gancho: Gancho,
      serie: () => <SerieCalculo n={1} />,
      objetivo: ObjetivoEsc,
      que_es: QueEs,
      notacion: Notacion,
      evaluar: Evaluar,
      grafica: Grafica,
      linea_vertical: LineaVertical,
      dominio: Dominio,
      tipos: Tipos,
      plus: Plus,
      python: Python,
      error: ErrorComun,
      reto: Reto,
      cierre: (p) => <CierreCurso {...p} n={2} titulo="*Límites*" sub="Acercarse a un valor… sin llegar nunca" />,
    }}
  />
);
