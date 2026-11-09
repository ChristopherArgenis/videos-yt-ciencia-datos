# Videos largos de Ciencia de Datos (@UniversoCienciaDatos)

Videos horizontales para YouTube (1920×1080, 3–10 min) sin cara, hechos con
[Remotion](https://remotion.dev). Usa el mismo estilo, voz y kit que
[shorts-ciencia-datos](https://github.com/ChristopherArgenis/shorts-ciencia-datos), adaptado a 16:9.
Todo es gratis y local: Remotion, voz Kokoro (Alex), música hecha con código y ffmpeg.

## Videos
| ID | Tema |
| --- | --- |
| `00-Plantilla` | Video de prueba del motor (no se publica) |
| `01-FutbolDatos` | Fútbol con Datos #1: cómo un partido se convierte en datos (StatsBomb, final Mundial 2022) |

## Cómo se hace un video
```bash
npm i
cp src/guiones/plantilla.json src/guiones/01-tema.json   # 1. guion (plan + narración)
python3 scripts/capitulos.py 01-tema                       #    duración estimada y capítulos
#   → mostrar el guion y esperar aprobación; luego "aprobado": true
python3 scripts/make_voice.py 01-tema                      # 2. voz de Alex
#   3. src/videos/V01Tema.tsx (una escena por id) y registrarlo en src/Root.tsx
npm run dev                                                #    vista previa en Remotion Studio
npx remotion still 01-Tema out/f.png --frame=300           #    revisar un fotograma
python3 scripts/render.py 01-tema 01-Tema                  # 4. render + verificación
npx remotion still Mini-01-Tema out/miniaturas/Mini-01-Tema.png   # 5. miniatura 1280×720
python3 scripts/capitulos.py 01-tema                       # 6. capítulos para la descripción
python3 scripts/titulo.py "Título 1" "Título 2"            #    revisar títulos
```

## Datos de fútbol (StatsBomb)
Su licencia prohíbe redistribuir los datos, así que no están en git. Antes de abrir o renderizar
un episodio de la serie, genera sus datos: `python3 scripts/futbol/ep01_datos.py`
(descarga a `datos/` y escribe `src/datos/privado/`). El logo oficial está en `public/logos/`.

## Estructura
- `src/guiones/<video>.json` guion: escenas, capítulo, qué se ve y frases de Alex. Es la única fuente
  del texto: de aquí salen la voz, los subtítulos, los tiempos y los capítulos.
- `src/kit/largo.tsx` motor: acomoda cada escena a la duración de la voz, subtítulos, barra de
  capítulos, música en bucle que baja cuando habla Alex, `TituloCapitulo` y `Cierre`.
- `src/kit/kit.tsx` piezas visuales 16:9 (`Bg`, `Words`, `Counter`, `Stage`, `Split`, `Card`,
  `Sticker`, `Fuente`, `Sfx`). `src/kit/theme.ts` colores y fuentes (los mismos de los Shorts).
- `src/kit/miniatura.tsx` piezas de miniatura (`FondoMini`, `Grande`, `ChipMini`, `MiniSplit`).
- `src/videos/` un archivo por video. `src/miniaturas/` una miniatura por video.
- `src/kit/tiempos.json` pausas entre frases (compartido por Remotion y `capitulos.py`).
- `public/musica/` bucles originales (`explica`, `curiosa`, `tranquila`, `tension`),
  `public/sfx/` efectos, `public/voz/<video>/` narración, `public/fonts/` fuentes locales.
- `scripts/` `make_voice.py`, `make_audio.py`, `capitulos.py`, `titulo.py`, `render.py`.
- `PUBLICAR.md` título, descripción, hashtags y comentario fijado de cada video.

## Escribir una escena
Cada escena recibe `lineas` (sus frases, con `at` = frame en que empieza a hablar Alex) y `frames`.
Así las animaciones caen justo cuando se dice cada cosa:
```tsx
const Gancho: React.FC<EscenaProps> = ({ lineas }) => {
  const [g1, g2] = lineas;
  return (
    <Stage>
      <Words text="¿Solo *23* personas?" />
      <Sequence from={g2.at} layout="none"><Sticker>Pista</Sticker></Sequence>
    </Stage>
  );
};
```

Fuera de este sandbox, borra la línea `Config.setBrowserExecutable(...)` de `remotion.config.ts`
(Remotion descarga su propio navegador).
