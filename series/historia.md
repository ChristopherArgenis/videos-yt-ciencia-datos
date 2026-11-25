# Serie: Historia de la Computación

Títulos: «Tema | Historia de la Computación #N», máximo 60 caracteres (verificados con `scripts/titulo.py`).
Lista de reproducción: "Historia de la Computación: de contar con piedras a la Ciencia de Datos".

## Decisión: serie ordenada (12 episodios), no videos sueltos
Cada invento usa una idea anterior (sin binario no hay lógica de circuitos; sin programa almacenado no hay
lenguajes). La serie va **por bloques de ideas, no estrictamente por fechas**: la línea del tiempo siempre
está en pantalla, así que el espectador sabe en qué año está aunque saltemos de 1936 a 1642.

- **Público:** cualquiera con curiosidad (bachillerato en adelante) y gente de datos que quiere saber de dónde
  viene su herramienta. **Nivel:** divulgación; sin matemática pesada (una cuenta sencilla por video, como mucho).
- **Promesa de la serie:** "Al terminar sabes por qué tu celular funciona como funciona, y de dónde salió la
  ciencia de datos."
- **Énfasis:** la historia y cómo funciona cada invento (demostración animada). La ciencia de datos es un
  **plus** corto (~30 s, chip "Plus: Ciencia de Datos") en cada episodio, y el protagonista del episodio final.

## Bloques y episodios
| Bloque | # | Título | Años | Palabra clave |
|---|---|---|---|---|
| I · Las ideas (matemática) | 1 | El cero y los números | ~2000 a.C.–628 | historia de los números |
| | 2 | ¿Qué es un algoritmo? | ~300 a.C.–820 | qué es un algoritmo |
| | 3 | Binario y lógica de Boole | 1703–1854 | sistema binario |
| | 4 | La máquina de Turing | 1936 | máquina de Turing |
| II · Las máquinas (hardware) | 5 | Máquinas de engranajes | 1642–1822 | calculadora mecánica |
| | 6 | Ada Lovelace y su programa | 1837–1843 | Ada Lovelace |
| | 7 | Tarjetas perforadas | 1804–1890 | tarjetas perforadas |
| | 8 | Relés, válvulas y ENIAC | 1941–1946 | primera computadora |
| | 9 | Transistor y Ley de Moore | 1947–1971 | ley de Moore |
| III · El cómputo (software y redes) | 10 | Lenguajes de programación | 1945–1959 | lenguajes de programación |
| | 11 | La PC e internet | 1969–1991 | historia de internet |
| IV · El plus | 12 | Nace la Ciencia de Datos | 1890–hoy | qué es la ciencia de datos |

## Plantilla de cada episodio (~5:00)
| # | Escena | Qué pasa | Tiempo |
|---|---|---|---|
| 1 | **Gancho** | Paradoja o pregunta concreta ("Tu celular hace en 1 segundo lo que ENIAC hacía en…") | 0:25 |
| 2 | **Sello + línea del tiempo** | "Historia de la Computación #N" y la línea del tiempo con el año del episodio iluminado | 0:08 |
| 3 | **Recuerda + respuesta del quiz** | Una idea del episodio anterior y la respuesta de su pregunta | 0:15 |
| 4 | **El problema** | Qué no se podía hacer antes y a quién le dolía (comerciantes, astrónomos, el censo, la guerra) | 0:35 |
| 5 | **La idea** | Cómo funciona el invento: reconstrucción animada (engranajes que giran, cinta que avanza) | 1:00 |
| 6 | **Hazlo como la máquina** | Demostración paso a paso: hacer una cuenta igual que la máquina (sumar con acarreo, una compuerta, una cinta de Turing) | 0:50 |
| 7 | **Las personas** | Quién, dónde, con qué; tarjeta con nombre, años y lugar (sin retratos de internet) | 0:30 |
| 8 | **Mito vs. realidad** | Un mito popular desmentido con fuente ("Grace Hopper inventó la palabra *bug*": no) | 0:20 |
| 9 | **¿Qué queda hoy?** | Dónde está ese invento en tu celular o tu computadora | 0:20 |
| 10 | **Plus: Ciencia de Datos** | La conexión con los datos (~30 s, chip morado) | 0:30 |
| 11 | **Quiz + resumen** | Una pregunta para los comentarios (respuesta en el siguiente) y 3 ideas | 0:20 |
| 12 | **Cierre** | Próximo episodio + cierre estándar | 0:15 |

Reglas de siempre: fechas y cifras con **fuente en pantalla**; reconstrucciones marcadas "Reconstrucción
animada"; fotos del dueño marcadas "Foto: @UniversoCienciaDatos"; nada de imágenes ni audio de internet.

## Estilo visual y música
- **Look "archivo":** fondo oscuro del canal con textura de papel muy sutil en las tarjetas históricas; tono
  sepia para lo anterior a 1900, azul del canal para lo moderno. Línea del tiempo fija abajo de la pantalla.
- **Reconstrucciones en Remotion (SVG):** engranajes de la Pascalina, telar y tarjetas, relé que hace clic,
  válvula que se enciende, transistor, cinta de Turing. Todo dibujado por código: nada copiado.
- **Personas:** tarjeta tipográfica (nombre grande, años, lugar, una frase) con una silueta o un objeto
  icónico dibujado. Sin retratos.
- **Fotos y videos reales del dueño** (ver abajo): con movimiento lento (zoom y paneo), marco fino y crédito.
- **Música:** pista nueva y tranquila hecha con `scripts/make_audio.py` (piano/cuerdas sintetizados, gratis).
  Efectos: clic de relé, engranaje, tecla, beep; idealmente **grabados por el dueño** (más reales).
- **Fórmulas** con KaTeX y cuentas verificadas con SymPy cuando haya números (binario, Moore).

## Episodios en detalle

### 1 · El cero y los números | Historia de la Computación #1
- **Gancho:** "Antes de las computadoras, el invento más importante para calcular fue… un símbolo que significa *nada*."
- **El problema:** contar y comerciar con números romanos: intenta multiplicar XLVII × XII.
- **La idea:** sistema posicional (Babilonia, base 60: por eso la hora tiene 60 minutos) y el cero como número
  (Brahmagupta, India, 628).
- **Hazlo como la máquina:** sumar en el ábaco con acarreo.
- **Mito:** "Los árabes inventaron los números" → los numerales vienen de la India; llegaron a Europa por el mundo árabe.
- **Hoy:** cada número en tu celular es posicional.
- **Plus:** sin el cero no hay "datos faltantes" bien representados: el 0 no es lo mismo que el vacío (NaN).
- **Quiz:** ¿en qué base cuenta tu reloj los minutos? (60)

### 2 · ¿Qué es un algoritmo? | Historia de la Computación #2
- **Gancho:** "La palabra *algoritmo* es el nombre de una persona."
- **La idea:** al-Juarismi (Bagdad, ~820) → "algoritmo". El algoritmo de Euclides (~300 a.C.) para el máximo común divisor.
- **Hazlo como la máquina:** MCD(48, 18) paso a paso (verificado con SymPy).
- **Mito:** "Algoritmo = algo de computadoras" → una receta de cocina es un algoritmo.
- **Plus:** un modelo de machine learning es un algoritmo que escribe otro algoritmo.
- **Quiz:** ¿MCD(21, 14)? (7)

### 3 · Binario y lógica de Boole | Historia de la Computación #3
- **Gancho:** "Con solo dos dígitos se puede escribir cualquier número… y cualquier canción."
- **La idea:** Leibniz publica el binario (1703); Boole, la lógica como álgebra (1854); Shannon une ambas con
  circuitos (1937).
- **Hazlo como la máquina:** 13 en binario (1101) y una compuerta AND/OR con interruptores.
- **Mito:** "Leibniz inventó el binario para las computadoras" → 240 años antes de que existieran.
- **Plus:** un bit, un byte… y cuánto pesa un dato (una foto, una tabla).
- **Quiz:** ¿cuánto es 1010 en decimal? (10)

### 4 · La máquina de Turing | Historia de la Computación #4
- **Gancho:** "Antes de construir la primera computadora, alguien demostró qué es lo que *nunca* podrá calcular."
- **La idea:** Turing (1936): una cinta, un cabezal y reglas. Todo lo computable cabe ahí. El problema de la parada.
- **Hazlo como la máquina:** una máquina de Turing que suma 1 a un número binario, animada casilla por casilla.
- **Mito:** "Turing inventó la computadora" → inventó la idea matemática; las máquinas vinieron después.
- **Plus:** el "test de Turing" y la pregunta de si una máquina piensa.
- **Quiz:** ¿qué tres partes tiene una máquina de Turing? (cinta, cabezal, reglas)

### 5 · Máquinas de engranajes | Historia de la Computación #5
- **Gancho:** "Un joven que no llegaba a los 20 años construyó una calculadora para ayudar a su papá a cobrar impuestos."
- **La idea:** Pascalina (Pascal, 1642, sumas con acarreo), la máquina de Leibniz (multiplica), la máquina
  diferencial de Babbage (1822).
- **Hazlo como la máquina:** el acarreo mecánico: el engranaje que da la vuelta empuja al siguiente.
- **Mito:** "La máquina de Babbage nunca funcionó" → no se terminó en su época; el Museo de Ciencias de Londres
  la construyó con sus planos en 1991 y funciona.
- **Plus:** las tablas de números impresas (logaritmos, navegación) eran los "datasets" de la época… y tenían errores.
- **Quiz:** ¿qué operación hacía la Pascalina? (sumar y restar)

### 6 · Ada Lovelace y su programa | Historia de la Computación #6
- **Gancho:** "El primer programa de la historia se escribió para una máquina que nunca se construyó."
- **La idea:** la Máquina Analítica (Babbage, 1837) y la Nota G de Ada Lovelace (1843): calcular números de Bernoulli.
- **Hazlo como la máquina:** los primeros números de Bernoulli paso a paso (SymPy) y el "diagrama" de la Nota G simplificado.
- **Mito:** el debate de si fue "la primera programadora": qué dicen los documentos.
- **Plus:** Lovelace ya decía que la máquina "no puede originar nada": el debate actual sobre la IA.
- **Quiz:** ¿qué calculaba el programa de la Nota G? (números de Bernoulli)

### 7 · Tarjetas perforadas | Historia de la Computación #7
- **Gancho:** "El censo de EE. UU. de 1880 tardó años en contarse. El de 1890, con agujeros en cartón, mucho menos."
- **La idea:** el telar de Jacquard (1804) y la tabuladora de Hollerith (censo de 1890), cuya empresa terminó siendo IBM.
- **Hazlo como la máquina:** una tarjeta: cada agujero es una respuesta; un circuito se cierra y un contador avanza.
- **Mito:** fechas y cifras del censo con fuente (U.S. Census Bureau, historia del censo de 1890).
- **Plus:** **el primer "big data"**: una fila por persona, una columna por pregunta. Una tabla, igual que hoy.
- **Quiz:** ¿qué máquina usaba tarjetas perforadas antes que las computadoras? (el telar)

### 8 · Relés, válvulas y ENIAC | Historia de la Computación #8
- **Gancho:** "La primera computadora electrónica ocupaba un cuarto entero, y la programaban seis mujeres casi olvidadas."
- **La idea:** relés (Z3 de Zuse, 1941), válvulas (Colossus, 1944; ENIAC, presentada en 1946).
- **Hazlo como la máquina:** un relé como interruptor que mueve otro interruptor; un sumador con dos relés.
- **Mito:** "ENIAC fue la primera computadora" → depende de cómo la definas (Z3, Colossus, Atanasoff-Berry).
- **Plus:** las primeras tablas de tiro y de clima: modelos numéricos con datos.
- **Quiz:** ¿por qué se quemaban tanto las válvulas? (calor, filamento)

### 9 · Transistor y Ley de Moore | Historia de la Computación #9
- **Gancho:** "En tu bolsillo hay más transistores que personas en la Tierra."
- **La idea:** transistor (Bell Labs, 1947), circuito integrado (Kilby 1958, Noyce 1959), Ley de Moore (1965),
  Intel 4004 (1971, unos 2,300 transistores).
- **Hazlo como la máquina:** duplicar cada dos años: 2,300 → … (gráfica en escala logarítmica, cuentas en SymPy).
- **Mito:** "La Ley de Moore es una ley física" → es una observación económica.
- **Plus (datos reales):** gráfica de transistores por chip a lo largo de los años, con fuente (fichas técnicas
  de los fabricantes), y por qué se usa escala logarítmica.
- **Quiz:** si se duplica cada 2 años, ¿cuántas veces más en 10 años? (32)

### 10 · Lenguajes de programación | Historia de la Computación #10
- **Gancho:** "El primer *bug* de la historia fue un insecto de verdad… pero la palabra ya existía."
- **La idea:** programa almacenado (von Neumann, 1945; Manchester Baby, 1948), compilador (Grace Hopper, A-0, 1952),
  FORTRAN (1957), COBOL (1959).
- **Hazlo como la máquina:** la misma suma en binario, en ensamblador y en un lenguaje de alto nivel (3 líneas en pantalla).
- **Mito:** "Grace Hopper inventó la palabra *bug*" → la polilla de 1947 es real; la palabra ya se usaba antes.
- **Plus:** de FORTRAN a Python: por qué la ciencia de datos usa lenguajes de alto nivel.
- **Quiz:** ¿qué traduce un compilador? (un lenguaje humano a instrucciones de máquina)

### 11 · La PC e internet | Historia de la Computación #11
- **Gancho:** "El primer mensaje de internet fue *LO*… porque la computadora se cayó al escribir *LOGIN*."
- **La idea:** ARPANET (1969), computadoras personales (Altair 1975, Apple II 1977, IBM PC 1981), la Web
  (Berners-Lee, propuesta 1989, pública 1991).
- **Hazlo como la máquina:** un mensaje partido en paquetes que viajan por caminos distintos y se rearman.
- **Mito:** "Internet y la Web son lo mismo" → la Web es un servicio que corre sobre internet.
- **Plus:** la Web es la fuente de datos más grande de la historia (y por qué hay que limpiarlos).
- **Quiz:** ¿cuál fue el primer mensaje de ARPANET? (LO)

### 12 · Nace la Ciencia de Datos | Historia de la Computación #12
- **Gancho:** "La ciencia de datos no nació con la IA: nació con un censo, un cartón y un agujero."
- **La idea:** el hilo completo: Hollerith (datos en tabla) → estadística (Tukey, *The Future of Data
  Analysis*, 1962) → perceptrón (Rosenblatt, 1958) → "machine learning" (Samuel, 1959) → GPUs y datos masivos (2012).
- **Hazlo como la máquina:** un perceptrón de dos entradas que aprende una compuerta AND (enlaza con el #3 y
  con el curso de Cálculo #12).
- **Mito:** "La IA es nueva" → la idea tiene más de 65 años; lo nuevo son los datos y el cómputo.
- **Cierre de la serie:** la línea del tiempo completa se enciende de punta a punta.
- **Quiz final** (respuesta fijada en comentarios).

## Enlaces entre videos
- Pantalla final: episodio anterior + lista. Tarjeta del "Recuerda" al episodio anterior.
- Cruces: #3 (binario) ↔ Cálculo #1; #12 (perceptrón) ↔ Cálculo #12 (descenso de gradiente); #7 (tablas) ↔ Fútbol con Datos.
- Comentario fijado en cada video: el quiz, con la promesa de la respuesta en el siguiente.

## Calendario sugerido (martes; toma el lugar de Cálculo, que termina el 16 feb 2027)
| # | Fecha | # | Fecha |
|---|---|---|---|
| 1 | mar 23 feb 2027 | 7 | mar 6 abr |
| 2 | mar 2 mar | 8 | mar 13 abr |
| 3 | mar 9 mar | 9 | mar 20 abr |
| 4 | mar 16 mar | 10 | mar 27 abr |
| 5 | mar 23 mar | 11 | mar 4 may |
| 6 | mar 30 mar | 12 | mar 11 may |

## Miniaturas
Estilo de las del curso (#7 en adelante): pizarra oscura con brillo, el objeto del episodio dibujado grande
(o la foto real del dueño recortada), 2–4 palabras y el chip "HISTORIA DE LA COMPUTACIÓN #N". Acento sepia.

---

# Materiales reales que puede mandar el dueño

La regla del canal sigue igual: **nada de imágenes, videos ni audio bajados de internet**. Lo que hace que la
serie se sienta real es **material propio**: fotos, videos y sonidos grabados por el dueño. Las personas no
salen (canal sin cara), pero **las manos sí**.

## Qué sirve más (en orden)
1. **Objetos reales fotografiados por ti**: lo que tengas en casa, en la escuela o en un mercado de pulgas.
2. **Videos cortos de manos usando esos objetos** (b-roll): dan muchísima vida.
3. **Sonidos grabados por ti** (clic de un relé, teclado mecánico, disquetera, engranajes).
4. **Fotos que tomes en un museo** de ciencia o tecnología (solo si el museo permite fotografiar).
5. **Papel y lápiz**: tus cuentas a mano, una tira de papel como cinta de Turing, una tarjeta perforada hecha por ti.

## Lista de tomas por episodio
| # | Fotos (horizontales) | Videos cortos (manos, 5–15 s) | Sonido |
|---|---|---|---|
| 1 | Ábaco (general y detalle); reloj de manecillas; números escritos a mano | Contar con el ábaco; escribir 0, 1, 2… en papel | Cuentas del ábaco |
| 2 | Receta de cocina escrita a mano; una división larga en papel | Hacer la división paso a paso con lápiz | Lápiz en papel |
| 3 | Apagador de luz; LEDs en protoboard; Arduino si tienes | Prender/apagar LEDs contando en binario | Clic del apagador |
| 4 | Tira de papel cuadriculado con 0 y 1 y un lápiz encima | Mover el lápiz casilla por casilla y borrar/escribir | — |
| 5 | Calculadora vieja o sumadora mecánica; engranajes (reloj desarmado, juguete); regla de cálculo | Girar engranajes; usar la sumadora | Engranajes |
| 6 | Un cuaderno con notas a mano y un diagrama (tú lo escribes) | Escribir la tabla de la Nota G a mano | Pluma |
| 7 | Tarjeta perforada real si consigues; un tejido o telar; un formulario en papel | Perforar una tarjeta de cartulina con perforadora | Perforadora |
| 8 | Un relé (tienda de electrónica, muy barato); un foco incandescente | El relé haciendo clic con una pila | **Clic del relé** |
| 9 | Transistores sueltos; una placa de PC o celular viejo; un procesador viejo (macro) | Lupa recorriendo el chip | — |
| 10 | Tu pantalla con código (grábala tú); una polilla… dibujada | Teclear en tu teclado | Teclado |
| 11 | PC vieja, disquete, CD, cable de red, router | Meter un disquete/CD; conectar el cable | Disquetera, ventilador |
| 12 | Tu laptop con un notebook abierto; tus apuntes | Teclear y ver una gráfica aparecer | — |

No hace falta todo: con **3–5 fotos y 2–3 videos por episodio** el video cambia muchísimo. Lo que no llegue,
lo cubro con reconstrucciones animadas.

## Especificaciones técnicas
- **Fotos:** JPG o PNG, **horizontales**, 1920 px o más del lado largo, luz natural, sin flash, fondo limpio
  (mesa de madera, tela lisa). Dos tomas de cada objeto: una general y una de detalle.
- **Videos:** horizontales, 1080p o 4K, 30 fps, celular apoyado (sin temblor), 5–20 s por toma, sin voz ni
  música de fondo, sin caras. Si se oye ruido de la calle, no pasa nada: le quito el audio.
- **Sonidos:** grábalos aparte con el celular cerca del objeto, en un cuarto en silencio, 3–5 repeticiones.
- **Evita:** logos o marcas grandes, portadas de libros y pantallas de otros (tienen derechos), personas en el fondo.
- **Nombres de archivo:** `h07_tarjeta_general.jpg`, `h07_perforar.mp4`, `h08_rele_clic.m4a`
  (h + número de episodio + qué es).

## Cómo mandarlos
- **Fotos:** súbelas directamente al chat.
- **Videos y sonidos:** una carpeta de Google Drive (por ejemplo "Historia Computación – material") y me dices
  el nombre: puedo leerla desde aquí. Los videos no se suben a git (pesan); se guardan fuera del repositorio.
- En el video aparecen con zoom/paneo lento, marco fino y el crédito "Foto: @UniversoCienciaDatos".

## Pendiente de decisión del dueño
- **Documentos de archivo de dominio público** (por ejemplo, fotos del gobierno de EE. UU. de ENIAC, o
  publicaciones de hace más de 100 años como el libro de Boole de 1854). Harían la serie más documental, pero la
  regla actual dice "nada de imágenes de internet". Opción: permitir **solo dominio público verificado**, con
  fuente y licencia en pantalla. Si no se aprueba, se reconstruye todo con animación.
