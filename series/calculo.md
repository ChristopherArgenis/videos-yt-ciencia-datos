# Curso: Cálculo Diferencial (para Ciencia de Datos)

Títulos: «Tema | Cálculo Diferencial #N», máximo 60 caracteres (todos verificados con `scripts/titulo.py`).
Lista de reproducción: "Cálculo Diferencial para Ciencia de Datos: curso desde cero".

## Decisión: curso (serie ordenada), no videos sueltos
Cada tema necesita el anterior (sin límite no hay derivada; sin derivada no hay gradiente). El curso
termina con el algoritmo con el que se entrenan casi todos los modelos: el **descenso de gradiente**.

- **Público:** bachillerato o primeros semestres, y gente de datos que "usa" modelos sin saber la matemática.
- **Requisito:** álgebra básica (despejar, potencias). Nada más.
- **Promesa del curso:** "Al terminar entiendes cómo aprende un modelo de machine learning, paso a paso."

## Plantilla pedagógica (cada video, ~5:30)
Cambia respecto a la de las series de datos: sigue el ciclo **intuición → fórmula → ejemplo → significado →
aplicación → práctica → resumen**. Las 13 escenas son siempre las mismas, para que el alumno sepa dónde está.

| # | Escena | Qué pasa | Tiempo |
|---|---|---|---|
| 1 | **Gancho** | Pregunta concreta de datos, no una definición ("¿cómo sabe un modelo hacia dónde corregir?") | 0:25 |
| 2 | **Sello del curso** | "Cálculo Diferencial #N" + mapa de los 12 temas con el actual iluminado | 0:05 |
| 3 | **Recuerda + respuesta del reto** | Una idea del video anterior y la solución del reto que quedó pendiente | 0:15 |
| 4 | **Objetivo** | "Al final de este video vas a poder…" (1 frase, en pantalla todo el capítulo) | 0:10 |
| 5 | **¿Qué es?** | Intuición visual, sin fórmulas (gráfica animada, analogía) | 0:40 |
| 6 | **¿Cómo se calcula?** | La fórmula con cada símbolo de un color, y un ejemplo resuelto en 3 pasos | 1:00 |
| 7 | **¿Qué obtenemos?** | Qué significa el resultado: signo, tamaño, unidades | 0:25 |
| 8 | **¿Para qué se usa?** | Un uso fuera de datos (física, economía, día a día) | 0:20 |
| 9 | **En Ciencia de Datos** | En qué algoritmo y en qué paso exacto aparece, con una demo animada | 0:50 |
| 10 | **Código** | 3–5 líneas (NumPy o SymPy); Alex dice solo "Este es el código" | 0:20 |
| 11 | **Error común** | "¡Cuidado!": la confusión más típica, con el ejemplo que la desmiente | 0:15 |
| 12 | **Reto + resumen** | Un ejercicio para comentarios (se resuelve en el siguiente) y 3 ideas en tarjetas | 0:30 |
| 13 | **Cierre** | Próximo tema + cierre del canal | 0:15 |

**Código de colores fijo en todo el curso:** x / entrada = azul · f(x) / salida = verde ·
h, Δ / cambio = amarillo · pendiente, derivada = coral · pérdida / error = morado.
Ejemplos con números inventados se marcan "Ejemplo simplificado".

**Herramientas nuevas (gratis, código abierto, por aprobar):** KaTeX (MIT) para dibujar fórmulas en Remotion;
SymPy (BSD) para verificar cada resultado y para el código en pantalla.

## Los 12 episodios

### 1 · Qué es una función | Cálculo Diferencial #1
- **Estado:** ✅ hecho (6:09, `out/C01-Funcion.mp4`). Guion: `src/guiones/c01-funcion.json`.
- **Gancho:** "Netflix, el banco y el clima usan lo mismo para decidir: una función."
- **Qué es:** una regla que a cada entrada le da una sola salida (una máquina: entra x, sale f(x)).
- **Cómo se calcula:** evaluar. f(x) = 2x + 3 → f(4) = 11. Dominio, rango y gráfica.
- **Qué obtenemos:** la salida y la forma de la relación (lineal, cuadrática, exponencial, sigmoide).
- **Para qué:** modelar relaciones (precio de una casa según su tamaño).
- **En Ciencia de Datos:** un **modelo entrenado es una función** ŷ = f(x). La regresión lineal es f(x) = wx + b.
  Y la **función de pérdida** es una función de los pesos: el resto del curso trata de bajarla.
- **Código:** `f = lambda x: 2*x + 3` y `f(np.array([1, 2, 3]))`.
- **Error común:** f(x) no es "f por x".
- **Reto:** si f(x) = x² − 1, ¿cuánto vale f(3)? (8)

### 2 · Límites: acercarse sin llegar | Cálculo Diferencial #2
- **Gancho:** "Una probabilidad de un modelo nunca llega a 1. ¿Por qué?"
- **Qué es:** el valor al que se acerca f(x) cuando x se acerca a un punto (aunque nunca llegue).
- **Cómo se calcula:** tabla de valores, sustitución directa y factorizar el 0/0:
  lím x→2 de (x² − 4)/(x − 2) = lím (x + 2) = 4.
- **Qué obtenemos:** la tendencia, las asíntotas y los límites laterales.
- **Para qué:** es la base de la derivada; también describe qué pasa "a la larga".
- **En Ciencia de Datos:** la **sigmoide** σ(x) → 1 cuando x → ∞ y → 0 cuando x → −∞: por eso la regresión
  logística da probabilidades entre 0 y 1 sin tocarlos. También la **convergencia**: la pérdida tiende a un valor.
- **Código:** `sp.limit((x**2 - 4)/(x - 2), x, 2)` → 4.
- **Error común:** el límite no es "lo que vale la función en el punto" (aquí f(2) ni existe).
- **Reto:** lím x→3 de (x² − 9)/(x − 3). (6)

### 3 · Continuidad de una función | Cálculo Diferencial #3
- **Gancho:** "¿Por qué una red neuronal no puede aprender con un interruptor de sí o no?"
- **Qué es:** se dibuja sin levantar el lápiz. Tres condiciones: f(a) existe, el límite existe y son iguales.
- **Cómo se calcula:** revisar las 3 condiciones; tipos de discontinuidad: salto, hueco, infinita.
- **Qué obtenemos:** dónde la función no da "brincos" y dónde podrá derivarse.
- **Para qué:** modelos físicos sin saltos; el teorema del valor intermedio.
- **En Ciencia de Datos:** **funciones de activación.** El perceptrón original usaba un escalón (salto: no se
  puede ajustar poco a poco). La sigmoide y ReLU son continuas, y así el modelo corrige en pasos pequeños.
- **Código:** comparar `f(a - 1e-6)`, `f(a)` y `f(a + 1e-6)`.
- **Error común:** continua no es lo mismo que derivable: |x| es continua en 0, pero tiene un pico (ReLU también).
- **Reto:** ¿f(x) = 1/x es continua en x = 0? (No: f(0) no existe.)

### 4 · Qué es la derivada | Cálculo Diferencial #4
- **Gancho:** "Si subo el precio un peso, ¿cuántas ventas pierdo? Eso es una derivada."
- **Qué es:** la tasa de cambio instantánea; la pendiente de la recta tangente (la secante que se encoge).
- **Cómo se calcula:** f'(x) = lím h→0 de [f(x + h) − f(x)] / h. Con f(x) = x²: f'(x) = 2x, y f'(3) = 6.
- **Qué obtenemos:** un número por punto. Signo = sube o baja; tamaño = qué tan rápido.
- **Para qué:** velocidad (derivada de la posición), costo marginal.
- **En Ciencia de Datos:** **cuánto cambia el error si muevo un peso un poquito.** Ese número dice hacia dónde
  corregir el peso durante el entrenamiento (y qué variables pesan más: sensibilidad).
- **Código:** `h = 1e-5; (f(3 + h) - f(3)) / h` → 6.00001 (derivada numérica).
- **Error común:** la derivada no es el valor de la función, es su pendiente.
- **Reto:** derivada de x² en x = 5. (10)

### 5 · Reglas de derivación | Cálculo Diferencial #5
- **Gancho:** "Usar la definición cada vez es lento. Hay atajos, y con ellos sale el error de un modelo."
- **Qué es:** reglas de la constante (0), la potencia (n·xⁿ⁻¹), el múltiplo constante y la suma.
- **Cómo se calcula:** f(x) = 3x⁴ − 5x² + 7 → f'(x) = 12x³ − 10x.
- **Qué obtenemos:** la derivada de cualquier polinomio en segundos.
- **Para qué:** todo modelo polinómico (trayectorias, costos).
- **En Ciencia de Datos:** derivar el **error cuadrático** de la regresión lineal: L(w) = (y − wx)²
  = y² − 2wxy + w²x² → dL/dw = −2x(y − wx). Es exactamente lo que calcula el entrenamiento del MSE.
- **Código:** `sp.diff(3*x**4 - 5*x**2 + 7, x)`.
- **Error común:** la derivada de una constante es 0, y xⁿ → n·xⁿ⁻¹ (no n·xⁿ).
- **Reto:** derivada de 4x³ + 2x. (12x² + 2)

### 6 · Derivada exponencial y logaritmo | Cálculo Diferencial #6
- **Gancho:** "¿Por qué los modelos suman logaritmos en vez de multiplicar probabilidades?"
- **Qué es:** eˣ es su propia derivada; la derivada de ln x es 1/x.
- **Cómo se calcula:** (3eˣ)' = 3eˣ; (ln x)' en x = 2 → 0.5.
- **Qué obtenemos:** el crecimiento que es proporcional a sí mismo; el logaritmo convierte productos en sumas.
- **Para qué:** interés compuesto, crecimiento de poblaciones, decaimiento radiactivo.
- **En Ciencia de Datos:** la **log-loss (entropía cruzada)** de la clasificación:
  L = −[y·ln p + (1 − y)·ln(1 − p)], con dL/dp = −y/p + (1 − y)/(1 − p). Y por qué se usan logaritmos:
  multiplicar 1,000 probabilidades de 0.01 da 0 en la computadora; sumar sus logaritmos da −4,605.2.
- **Código:** `np.prod(np.full(1000, 0.01))` → 0.0 y `np.log(np.full(1000, 0.01)).sum()` → −4605.2.
- **Error común:** ln(a + b) no es ln a + ln b (lo que sí vale: ln(a·b) = ln a + ln b).
- **Reto:** derivada de 5·ln x. (5/x)

### 7 · Regla del producto y cociente | Cálculo Diferencial #7
- **Gancho:** "La derivada de la sigmoide tiene una forma bellísima… y explica por qué las redes profundas se atoran."
- **Qué es:** (f·g)' = f'g + fg' y (f/g)' = (f'g − fg') / g².
- **Cómo se calcula:** [x²(x + 1)]' = 2x(x + 1) + x² = 3x² + 2x; [x/(x + 1)]' = 1/(x + 1)².
- **Qué obtenemos:** derivadas de funciones que se multiplican o se dividen.
- **Para qué:** ingresos = precio × cantidad, densidades, razones.
- **En Ciencia de Datos:** la **sigmoide** σ(x) = eˣ/(1 + eˣ) con la regla del cociente:
  σ'(x) = eˣ/(1 + eˣ)² = σ(x)·(1 − σ(x)). Su valor máximo es 0.25 (en x = 0): al multiplicarse capa tras
  capa, el gradiente se hace diminuto → **desvanecimiento del gradiente**, por eso las redes modernas usan ReLU.
- **Código:** `sp.simplify(sp.diff(sp.exp(x)/(1 + sp.exp(x)), x))`.
- **Error común:** (f·g)' no es f'·g'.
- **Reto:** derivada de x·eˣ. (eˣ + x·eˣ)

### 8 · Regla de la cadena | Cálculo Diferencial #8
- **Gancho:** "Así aprenden las redes neuronales: la regla de la cadena, repetida millones de veces."
- **Qué es:** la derivada de una función dentro de otra: [f(g(x))]' = f'(g(x))·g'(x) (engranajes que se multiplican).
- **Cómo se calcula:** [(3x + 1)⁵]' = 5(3x + 1)⁴·3 = 15(3x + 1)⁴; [e^(−x²)]' = −2x·e^(−x²).
- **Qué obtenemos:** la derivada de procesos encadenados.
- **Para qué:** cambios en cadena (temperatura → presión → volumen).
- **En Ciencia de Datos:** **backpropagation.** Una red es una cadena de capas; el error depende de cada peso a
  través de todas ellas. Con una neurona: L = (σ(wx) − y)² → dL/dw = 2(σ − y)·σ(1 − σ)·x. Las librerías
  (PyTorch, TensorFlow) hacen esto automático: se llama diferenciación automática.
- **Código:** `sp.diff((3*x + 1)**5, x)` y la derivada de una neurona con números.
- **Error común:** olvidar multiplicar por la derivada de "lo de adentro".
- **Reto:** derivada de (2x + 1)³. (6(2x + 1)²)

### 9 · Máximos y mínimos | Cálculo Diferencial #9
- **Gancho:** "El promedio que usas todos los días es, en realidad, la solución de un problema de cálculo."
- **Qué es:** los puntos críticos, donde f'(x) = 0 (la tangente queda horizontal).
- **Cómo se calcula:** f(x) = x² − 6x + 5 → 2x − 6 = 0 → x = 3, f(3) = −4; el signo de f' antes y
  después dice si es mínimo o máximo.
- **Qué obtenemos:** el punto óptimo.
- **Para qué:** el precio que maximiza la ganancia, la forma que minimiza el material.
- **En Ciencia de Datos:** **entrenar = minimizar la pérdida.** Ejemplo: ¿qué número c se equivoca menos con
  los datos? Derivar Σ(xᵢ − c)² e igualar a 0 da c = **el promedio**. (Con el error absoluto sale la mediana:
  Short Mates1.) Y así se obtiene la fórmula de mínimos cuadrados de la regresión lineal.
- **Código:** comparar `np.mean(datos)` con el mínimo numérico de la suma de errores al cuadrado.
- **Error común:** f'(x) = 0 no siempre es un mínimo: puede ser un máximo, o ninguno (x³ en 0).
- **Reto:** ¿en qué x es mínima x² − 4x? (2)

### 10 · Segunda derivada y concavidad | Cálculo Diferencial #10
- **Gancho:** "¿Cómo sabe un modelo que llegó al fondo del valle y no a la cima de una montaña?"
- **Qué es:** la derivada de la derivada: curvatura (forma de sonrisa o de tristeza), aceleración.
- **Cómo se calcula:** f(x) = x³ − 3x → f' = 3x² − 3 → f'' = 6x. En x = 1, f'' = 6 > 0: mínimo;
  en x = −1, f'' = −6: máximo; en x = 0 cambia la concavidad: punto de inflexión.
- **Qué obtenemos:** qué tipo de punto crítico es, y qué tan curva es la función.
- **Para qué:** aceleración, rendimientos decrecientes.
- **En Ciencia de Datos:** **convexidad.** La pérdida de la regresión lineal y la logística es convexa (curva hacia
  arriba en todos lados): un solo mínimo, el entrenamiento siempre lo encuentra. Las redes neuronales no son
  convexas: tienen mínimos locales. La curvatura también decide el tamaño del paso (método de Newton).
- **Código:** `sp.diff(x**3 - 3*x, x, 2)` → 6x.
- **Error común:** f'' = 0 no garantiza un punto de inflexión (x⁴ en 0).
- **Reto:** segunda derivada de x⁴. (12x²)

### 11 · Derivadas parciales y gradiente | Cálculo Diferencial #11
- **Gancho:** "Un modelo real no tiene un peso: tiene miles. ¿Cómo se deriva eso?"
- **Qué es:** derivar respecto a una variable dejando las demás fijas. El gradiente junta todas las parciales en
  un vector que apunta hacia donde la función sube más rápido.
- **Cómo se calcula:** f(x, y) = x² + 3xy + y² → ∂f/∂x = 2x + 3y, ∂f/∂y = 3x + 2y. En (1, 2): ∇f = (8, 7).
- **Qué obtenemos:** una dirección (hacia dónde sube más) y una magnitud (qué tan empinado).
- **Para qué:** mapas de montaña, flujo de calor.
- **En Ciencia de Datos:** la pérdida de la regresión lineal depende de w y de b: su gradiente
  (∂L/∂w, ∂L/∂b) tiene un número por cada peso. En una red: millones de parciales (un vector, Short Mates7).
- **Código:** `[sp.diff(f, v) for v in (x, y)]`.
- **Error común:** el gradiente apunta hacia arriba; para bajar el error se usa el gradiente con signo menos.
- **Reto:** gradiente de x² + y² en (1, 1). ((2, 2))

### 12 · Descenso de gradiente | Cálculo Diferencial #12
- **Gancho:** "Bajar una montaña con niebla, sin ver el fondo: así se entrena casi toda la inteligencia artificial."
- **Qué es:** repetir un paso: w ← w − η·∇L (η = tasa de aprendizaje).
- **Cómo se calcula:** L(w) = (w − 3)², empezando en w = 0 con η = 0.1: w₁ = 0.6, w₂ = 1.08 … → 3.
- **Qué obtenemos:** los pesos que minimizan el error: el modelo entrenado.
- **Para qué:** optimizar cualquier cosa que tenga derivada.
- **En Ciencia de Datos:** entrenar una regresión lineal desde cero con datos (Ejemplo simplificado), y ver que lo
  mismo entrena la regresión logística (Short SUP3, Fútbol con Datos #2) y las redes neuronales. Tasa de
  aprendizaje muy grande: diverge; muy chica: tarda una eternidad. Mención de SGD y lotes.
- **Código:** `for _ in range(100): w -= lr * 2 * (w - 3)`.
- **Error común:** una tasa de aprendizaje demasiado grande hace que el error crezca en vez de bajar.
- **Cierre del curso:** el mapa completo: función → límite → continuidad → derivada → reglas → cadena →
  óptimo → curvatura → gradiente → descenso. "Ya sabes cómo aprende un modelo."
- **Reto final:** ¿qué pasa con η = 1.1? (Diverge: cada paso se aleja más.)

### Extras opcionales (después del curso)
- Aproximación lineal y series de Taylor (por qué funciona el descenso de gradiente).
- Derivada numérica vs. diferenciación automática.

## Enlaces entre videos
- Pantalla final: episodio anterior + lista. Tarjeta del "Recuerda" al episodio anterior.
- Shorts relacionados: Mates1 (mediana, #9), Mates7 (vectores, #11), SUP3 (regresión logística, #7 y #12).
- Cruce con otras series: Fútbol con Datos #2 (el xG es una regresión logística entrenada con descenso de gradiente).
- Comentario fijado en cada video: el reto, con la promesa de la respuesta en el siguiente.

## Calendario sugerido (martes; F1 con Datos va los jueves)
| # | Fecha | # | Fecha |
|---|---|---|---|
| 1 | mar 24 nov 2026 | 7 | mar 12 ene 2027 |
| 2 | mar 1 dic | 8 | mar 19 ene |
| 3 | mar 8 dic | 9 | mar 26 ene |
| 4 | mar 15 dic | 10 | mar 2 feb |
| 5 | mar 22 dic | 11 | mar 9 feb |
| 6 | mar 5 ene 2027 | 12 | mar 16 feb |

## Miniaturas
Formato fijo del curso: número del episodio gigante a la izquierda, el símbolo del tema al centro
(f(x), lím, f'(x), ∇…) y 2–3 palabras ("¿CÓMO APRENDE?"). Mismo fondo de pizarra oscura y el código de colores.
