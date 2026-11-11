# Serie: Fútbol con Datos (10 partes)

**Estado:** plan aprobado. Episodios 1 a 8 con StatsBomb (Mundial 2022). #1 a #6 renderizados; guiones del #7 y #8 en `src/guiones/`. Voz desde el #3: `alex_nicola`. Nada se renderiza hasta aprobar cada guion.

## Idea
Aprender ciencia de datos analizando fútbol real: de "qué es un evento" a analizar un partido
completo con Python. Cada video explica un concepto, lo muestra con datos reales y enseña el
código mínimo para hacerlo (Python + `statsbombpy` + `mplsoccer`, gratis).

- **Público:** aficionados al fútbol que quieren aprender datos, y estudiantes de ciencia de datos.
  Nivel principiante → intermedio.
- **Por qué esta serie:** el mejor Short del canal ("3 métricas… analistas de fútbol") hizo 11,8×
  la mediana, y hay poca competencia en español.
- **Formato:** ~5 min de media (los más técnicos, hasta 6–7), 1920×1080, voz de Alex, subtítulos, capítulos.
- **Lista de reproducción:** "Fútbol con Datos: curso de análisis de datos en el fútbol".
- **Patrón de títulos:** «Tema | Fútbol con Datos #N» (palabra clave al inicio, ≤ 60 caracteres). El sello "FÚTBOL CON DATOS #N" va también en pantalla y en la miniatura.

## Datos: fuentes comparadas (revisado el 9 nov 2026)
| Fuente | Qué trae | Licencia | ¿Monetizar? |
|---|---|---|---|
| **Wyscout público** (Pappalardo et al., 2019) | 1,941 partidos: 5 grandes ligas 2017/18, Mundial 2018, Euro 2016. Eventos con x/y (pases, tiros, duelos), jugadores y equipos. Sin xG. | CC BY 4.0 (visto en el repo espejo octosport; figshare no abrió desde aquí) | Sí, citando la fuente |
| **SkillCorner Open Data** | 10 partidos de la A-League 2024/25 con tracking (posición de todos los jugadores) y eventos dinámicos | MIT; piden dar crédito a SkillCorner | Sí, dando crédito |
| **StatsBomb Open Data** | La mejor: xG por tiro, presiones, conducciones, datos 360. Mundial 2022, Euro 2020/2024, Messi en La Liga… | Acuerdo propio: prohíbe uso comercial (1.2.2) y exige su logo (1.4) | No, salvo permiso por escrito |
| Metrica Sports (muestra) | 3 partidos anónimos con tracking y eventos | Sin licencia formal; piden citar la fuente | Dudoso |
| openfootball | Solo resultados y calendarios | CC0 (dominio público) | Sí |
| PFF FC Mundial 2022 | Eventos + tracking de los 64 partidos | Términos no encontrados | Sin confirmar |

**Decisión:** la serie se basa en **Wyscout (CC BY 4.0)** y **SkillCorner (MIT)**, que permiten monetizar
citando la fuente. StatsBomb solo entra si responden con permiso por escrito (correo en borrador en Gmail).
Sin xG en Wyscout se convierte en ventaja: en el #2 construimos nuestro propio modelo de xG.

Atribución en pantalla y descripción:
- "Datos: Wyscout, vía Pappalardo et al. (2019), Scientific Data. CC BY 4.0."
- "Tracking: SkillCorner Open Data."

Reglas extra para esta serie: sin fotos, escudos ni imágenes de jugadores o clubes (solo nombres
y gráficas propias). Antes del primer video, confirmar la licencia en la página de figshare.

## Episodios
| # | Título (≤ 60, con «\| Fútbol con Datos #N») | Palabra clave | Datos | Min (objetivo ~5) |
|---|---|---|---|---|
| 1 | Cómo un partido se convierte en datos \| Fútbol con Datos #1 | datos en el fútbol | StatsBomb: final del Mundial 2022 | 5 |
| 2 | Qué es el xG (goles esperados) \| Fútbol con Datos #2 | xG fútbol | StatsBomb: 1,453 tiros del Mundial 2022, creamos el modelo | 5 |
| 3 | Mapa de tiros con Python \| Fútbol con Datos #3 | mapa de tiros python | StatsBomb: Messi vs Mbappé, Mundial 2022 | 5 |
| 4 | Redes de pases: el cerebro del equipo \| Fútbol con Datos #4 | red de pases | StatsBomb: final del Mundial 2022 | 5 |
| 5 | Cómo medir la presión en el fútbol \| Fútbol con Datos #5 | presión fútbol datos | StatsBomb: presiones de los 64 partidos del Mundial 2022 | 5 |
| 6 | Mapas de calor con Python \| Fútbol con Datos #6 | mapa de calor fútbol | StatsBomb: España 0–0 Marruecos, octavos del Mundial 2022 | 5 |
| 7 | xA: el jugador que crea los goles \| Fútbol con Datos #7 | asistencias esperadas | StatsBomb: los 1,039 pases a tiro del Mundial 2022 | 5 |
| 8 | Comparar jugadores con radares \| Fútbol con Datos #8 | radar de jugadores | StatsBomb: Julián vs Giroud, 20 delanteros centro del Mundial 2022 | 5 |
| 9 | Cómo fichan los clubes con datos \| Fútbol con Datos #9 | scouting con datos | 5 ligas 2017/18 | 9 |
| 10 | Analizo la final del Mundial \| Fútbol con Datos #10 | análisis de partido | Francia–Croacia (o Mundial 2022 si StatsBomb da permiso) | 10 |

## Detalle por episodio
**1 · Del partido a los datos.** Gancho: "Esta final tuvo miles de momentos registrados. Te enseño a leerlos."
Qué es un evento (tipo, minuto, ubicación x/y, jugador), la cancha como plano de coordenadas,
cómo se ven los datos en Python. Short relacionado: StatsBomb (Short 6).

**2 · xG.** Gancho: "¿Ese tiro era gol seguro o un milagro?" Con miles de tiros reales entrenamos nuestro
propio modelo de xG (distancia y ángulo → regresión logística) y lo comparamos con los goles reales.
Enlaza con la serie de Mates (probabilidad y regresión logística).

**3 · Mapa de tiros.** Gancho: "¿Desde dónde anota Messi?" (temporada 2017/18). Dibujar la cancha con `mplsoccer`,
puntos por tiro con tamaño = xG y color = gol. Código paso a paso.

**4 · Redes de pases.** Gancho: "El jugador más importante no siempre es el que anota."
Posición media + líneas por número de pases; grafos (enlaza con Algoritmos #8 Grafos).

**5 · Presión.** Gancho: "¿Qué equipo incomoda más al rival?" Presiones por zona, recuperaciones
en campo rival, PPDA explicado simple.

**6 · Mapas de calor.** Gancho: "Dónde vive un mediocampista durante 90 minutos."
Agrupar acciones en una cuadrícula, densidad (KDE), comparar dos jugadores.

**7 · xA.** Gancho: "Este jugador no metió goles, pero creó los más claros."
Pases clave, xG del tiro que generó cada pase, ranking de creadores.

**8 · Radares.** Gancho: "Dos delanteros, mismos goles. ¿Quién es mejor?" Métricas por 90 minutos,
percentiles, por qué normalizar (enlaza con Mates #2 y #3).

**9 · Scouting.** Gancho: "Busco un reemplazo con datos, sin ver un solo partido."
Filtrar por posición y minutos, similitud entre jugadores (enlaza con Mates #7 similitud coseno).

**10 · Final del Mundial (final de la serie).** Gancho: "Una final entera, contada solo con datos."
Francia–Croacia 2018 con nuestro xG, redes de pases y mapas de calor. Si StatsBomb da permiso,
se cambia a Argentina–Francia 2022 con datos 360. Une todo lo aprendido.

## Cómo se enlazan
- **Pantalla final (últimos 20 s):** siguiente episodio + lista de reproducción. Ya prevista en el `Cierre`.
- **Tarjeta** hacia el episodio anterior cuando se usa un concepto suyo (por ejemplo, xG en el #3, #7 y #10).
- **Descripción:** enlace a la lista y al episodio anterior/siguiente; capítulos con `scripts/capitulos.py`.
- **Comentario fijado:** pregunta que invita a pedir un jugador o partido para el siguiente video.
- **Shorts:** 2 Shorts por episodio, cortados del mismo tema (en `shorts-ciencia-datos`), con el
  video largo como "video relacionado".
- **Miniaturas:** misma plantilla en toda la serie: cancha verde de fondo, un número o palabra grande,
  chip "FÚTBOL CON DATOS #N". Máximo 3–4 palabras.

## Calendario sugerido
Un episodio por semana (los videos largos tardan más) y 2 Shorts entre semana.
| Semana | Fecha | Video largo |
|---|---|---|
| 1 | jue 19 nov 2026 | #1 Del partido a los datos |
| 2 | jue 26 nov | #2 xG |
| 3 | jue 3 dic | #3 Mapa de tiros |
| 4 | jue 10 dic | #4 Redes de pases |
| 5 | jue 17 dic | #5 Presión |
| 6 | jue 7 ene 2027 | #6 Mapas de calor (pausa por fiestas) |
| 7 | jue 14 ene | #7 xA |
| 8 | jue 21 ene | #8 Radares |
| 9 | jue 28 ene | #9 Scouting |
| 10 | jue 4 feb | #10 Final del Mundial 2022 |

Ajustar el día y la hora con YouTube Studio → Estadísticas → "Cuándo está conectada tu audiencia".

## Qué medir
- **CTR de la miniatura** (meta: ≥ 4–5 % en un canal pequeño).
- **Retención a los 30 s** (si cae mucho, el gancho no funciona).
- **% de espectadores que pasan al siguiente episodio** (si es bajo, revisar pantallas finales).

## Shorts relacionados (repo shorts-ciencia-datos)
| Episodio | Short | Por qué |
|---|---|---|
| #1 Del partido a los datos | Short6-StatsBomb | la misma fuente de datos |
| #2 xG | SUP3-Logística | el modelo de xG es una regresión logística |
| #3 Mapa de tiros | — | (se apoya en el #2) |
| #4 Redes de pases | Algo8-Grafos | una red de pases es un grafo |
| #5 Presión | Mates5-Correlación | posesión vs presiones (−0.66): correlación ≠ causalidad |
| #6 Mapas de calor | Mates3-Normal | cada acción es una campana normal (KDE) |
| #7 xA | — | (se apoya en el #2: el xA es el xG del tiro que generó el pase) |
| #8 Radares | Mates1-Mediana | percentil 50 = mediana |
