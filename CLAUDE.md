# Proyecto: videos para YouTube @UniversoCienciaDatos

Solo se optimiza para YouTube (videos largos horizontales 16:9). Nada de TikTok, Reels ni Shorts salvo que el usuario lo pida.

## Herramientas
- "Skillselion MCP" y "yt-agent-skill" no existen en este entorno (revisado: ni conectores ni skills con esos nombres).
- En su lugar se usa la skill `video-show` del usuario (motor local: Pillow + numpy + ffmpeg, voz espeak-ng, música sintetizada, sin API keys), adaptada a 1920×1080. El motor original es solo 9:16, así que la versión 16:9 vive en este repo.

## Formato de cada video
- Duración: mínimo 3 min, máximo 10 min.
- Resolución 1920×1080, 30 fps. Subtítulos activados (blanco con borde negro).
- Cierre: «¿Te sirvió? Soy Argenis y te enseño Ciencia de Datos» + llamada a suscribirse a @UniversoCienciaDatos.
- Datos inventados siempre marcados como «DATOS DE EJEMPLO». Nada con derechos de autor ni descargado sin licencia.

## Flujo (en orden, sin saltar pasos)
1. Plan del video: público, objetivo, palabra clave principal, gancho de los primeros 30 s, estructura con capítulos y tiempos, estilo visual y música.
2. Guion completo escena por escena (narración + qué se ve en pantalla).
3. **Esperar aprobación explícita del usuario.** No renderizar nada antes.
4. Vista previa (un cuadro por escena), revisar y corregir.
5. Render final + verificación con ffprobe (1920×1080, duración esperada).
6. Miniatura 1280×720 que enganche: máx. 4–5 palabras grandes, alto contraste, un solo foco visual, legible en pequeño.
7. Textos de YouTube:
   - Título: palabra clave al inicio, máx. ~60–70 caracteres, sin clickbait falso. Ofrecer 2–3 variantes.
   - Descripción: primeras 2 líneas con palabra clave y valor; resumen; capítulos con marcas de tiempo (00:00 …); fuentes de datos; suscripción; mención a TikTok @argenis2125 e Instagram @kriz2125.
   - 3–5 hashtags al final (los primeros aparecen sobre el título) + lista de etiquetas.
8. Guardar todo en `videos/<NN>-<slug>/` (guion, miniatura, textos). El MP4 se entrega aparte si pesa mucho.

## Cursos y series
Cuando el usuario pida un curso o serie: proponer listas de reproducción, orden de episodios, nivel por episodio, temas, palabra clave por episodio, cómo se enlazan (pantallas finales, tarjetas) y calendario de publicación. Considerar si conviene serie o video único según el tema.
