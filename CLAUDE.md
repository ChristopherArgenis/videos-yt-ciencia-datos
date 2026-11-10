# Proyecto: videos largos de YouTube para @UniversoCienciaDatos

Solo se optimiza para YouTube: videos horizontales 16:9 de **~5 minutos de media** (3 a 10).

## Recursos: adaptados de `ChristopherArgenis/shorts-ciencia-datos`
Este repo ya tiene el motor de los Shorts adaptado a 16:9 (ver `README.md`). No usar la skill
`video-show` (el dueño pidió no usarla).
- **Remotion 4.0.541**. Guion en `src/guiones/<video>.json` (única fuente del texto), escenas en
  `src/videos/<Video>.tsx`, motor en `src/kit/largo.tsx`, piezas en `src/kit/kit.tsx`.
- **Voz:** Kokoro local: `python3 scripts/make_voice.py <video>`. Narración con números escritos con letra.
  **Voz del canal desde el episodio 3: `alex_nicola`** (70 % Alex + 30 % Nicola, pausas naturales). Cada guion
  nuevo lleva `"voz": "alex_nicola"`; si falta el campo, también se usa esa. Los episodios 1, 2 y la plantilla
  quedan fijados en `"voz": "alex"` (el Alex original). Perfiles en `PERFILES` de `make_voice.py`:
  `alex` (em_alex), variantes de Alex para sonar menos robótico (`alex_pausas`, `alex_nicola`,
  `alex_portugues`, `alex_santa`, `alex_michael`, `alex_calido`: mezclas de estilo + pausas naturales) y
  `dora_latino_suave_calida` / `dora_espana_suave_calida` (descartadas por el dueño).
  Muestras para comparar: `python3 scripts/muestra_voz.py <perfil>` → `muestras/voz/<perfil>.mp3`.
- **Música** en bucle (`public/musica/`) y efectos (`public/sfx/`), hechos con `scripts/make_audio.py`.
- **Miniaturas** 1280×720 como `<Still>` en `src/miniaturas/Miniaturas.tsx` con `src/kit/miniatura.tsx`.
- `scripts/render.py` se niega a renderizar si el guion no tiene `"aprobado": true`.
  Solo se pone `true` después de que el usuario apruebe el guion.
- `scripts/capitulos.py` da duración y capítulos; `scripts/titulo.py` revisa títulos y descripción.
- Chromium del entorno: `remotion.config.ts` usa `Config.setBrowserExecutable(...)`.
- Modelo de Kokoro: si falta, descargar a `~/.cache/hyperframes/tts` (ver cabecera de `make_voice.py`).

## Reglas del dueño (heredadas)
- **Todo 100 % gratuito.** Nada con costo, créditos o prueba que luego cobra. Si hay duda, preguntar.
  Aprobadas: Remotion, Kokoro local, Whisper local, ffmpeg, Python (numpy/scipy, scikit-learn).
  No usar: ElevenLabs, HeyGen, Remotion Lambda, servicios en la nube de pago.
- Sin cara. Datos reales con fuente en pantalla; ejemplos marcados como "Ejemplo simplificado".
- Nada con derechos de autor ni imágenes/audio de internet.

## Formato del video largo
- 1920×1080, 30 fps. **Duración media: ~5 min** (rango permitido 3–10). Subtítulos en pantalla. Capítulos claros.
- Medir la duración con la voz real (`make_voice.py` + `capitulos.py`): Alex habla más rápido que la estimación.
- Cifras: Alex las dice con letra (`voz`); el subtítulo las muestra con números (`sub`).
- Gancho en los primeros 30 s (pregunta o paradoja concreta, no una definición).
- Cierre: «¿Te sirvió? Ve más videos en @UniversoCienciaDatos» + «Suscríbete y sigue aprendiendo».
  Alex dice: «¿Te sirvió? Ve más videos en Universo Ciencia de Datos, y suscríbete.» (componente `Cierre`).
- Aprovechar los Shorts ya hechos: el video largo profundiza un tema y se enlaza con su Short.
- **Código:** solo en pantalla, corto y sencillo (unas 3–5 líneas, sin capturas largas: no es el punto).
  La narración solo dice algo como «este es el código»: no pide pausar ni copiar (no son tutoriales)
  y nunca dice «está en la descripción».
  **Nada de código en la descripción**: YouTube rechaza símbolos como `<` y `>`. La descripción solo
  indica el minuto donde aparece el código.

## Flujo (en orden, sin saltar pasos)
1. **Plan:** público y nivel, palabra clave, gancho, capítulos con tiempos, estilo visual y música.
2. **Guion** escena por escena (narración de Alex + qué se ve).
3. **Esperar aprobación explícita del usuario. No renderizar antes.**
4. Voz → composición Remotion → revisar fotogramas clave (`npx remotion still`).
5. Render final + `ffprobe` (1920×1080, duración esperada).
6. **Miniatura 1280×720**: máximo 3–4 palabras grandes, distintas al título, alto contraste,
   un solo foco visual, legible en pequeño.
7. **Entregar en el chat, listo para copiar:**
   - **Título** ≤ 60 caracteres, palabra clave al inicio (2–3 variantes).
     Si el video es de una serie o curso: «Tema | Nombre de la serie #N» en TODOS los episodios.
   - **Descripción**: 2 primeras líneas dicen qué da el video con las palabras que la gente busca;
     resumen; capítulos `00:00`; minuto del código; fuentes; suscripción; mención a TikTok @argenis2125 e Instagram @kriz2125.
     Sin código ni `<` `>` (revisar con `python3 scripts/titulo.py --desc`).
   - **#**: 3 a 5 hashtags (los 3 primeros salen sobre el título).
   - Comentario fijado sugerido.
8. Registrar todo en `PUBLICAR.md`.

## Cursos y series
Cuando se pida un curso o serie: decidir si conviene serie o video único; proponer episodios,
orden, nivel, palabra clave por episodio, lista de reproducción, enlaces entre videos
(pantalla final, tarjetas, Shorts relacionados) y calendario de publicación.
