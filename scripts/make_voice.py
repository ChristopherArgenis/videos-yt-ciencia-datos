"""Genera la narración (Kokoro, local y gratis) para un video largo.

    python3 scripts/make_voice.py plantilla          # todo el video
    python3 scripts/make_voice.py plantilla g1 c2    # solo esas frases

La voz sale del campo "voz" del guion (un perfil de PERFILES); si no está, se usa Alex.

Lee src/guiones/<video>.json y escribe public/voz/<video>/<frase>.wav más
src/voz-duraciones.json (segundos de cada frase; el video se acomoda a ellos).
Misma voz y filtro que shorts-ciencia-datos.
Requiere: pip install kokoro-onnx soundfile numpy, y ffmpeg.
Modelo: kokoro-v1.0.onnx y voices-v1.0.bin en $KOKORO_DIR, ~/.cache/hyperframes/tts o ./models.
Descarga: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
"""
import json, os, subprocess, sys
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Filtro de Alex (el de shorts-ciencia-datos).
FILTRO_ALEX = ("highpass=f=70,equalizer=f=220:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.5:g=-2.5,"
               "highshelf=f=7000:g=-4,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,"
               "aecho=0.8:0.5:35:0.12,loudnorm=I=-16:TP=-1.5")
# Filtro "suave y cálido" para Dora, ajustado a la muestra de referencia que aprobó el dueño
# (muestras/voz/referencia_dora_espana_claude_chat.mp3): graves medios con cuerpo, agudos
# bastante recortados (≈ −6 dB a 3 kHz y −9 dB a 6 kHz respecto a Dora sin filtro), compresión
# ligera y un toque de sala (≈ −17 LUFS ya con pausas, como la referencia). Coincide con la referencia en ±0.7 dB por banda.
FILTRO_CALIDO = ("highpass=f=70,equalizer=f=160:t=q:w=1:g=1.5,equalizer=f=1500:t=q:w=1:g=1.5,"
                 "highshelf=f=1200:g=-1.5,highshelf=f=2600:g=-6.5,lowpass=f=5800,"
                 "acompressor=threshold=-22dB:ratio=2:attack=15:release=200,"
                 "aecho=0.8:0.4:30:0.06,loudnorm=I=-16:TP=-1.5")

# Perfiles de voz. lang: "es" = España (z de "cinco"), "es-419" = Latinoamérica (s).
PERFILES = {
    "alex": {"voz": "em_alex", "lang": "es", "velocidad": 0.88, "filtro": FILTRO_ALEX},
    "dora_latino_suave_calida": {"voz": "ef_dora", "lang": "es-419", "velocidad": 0.91, "filtro": FILTRO_CALIDO},
    "dora_espana_suave_calida": {"voz": "ef_dora", "lang": "es", "velocidad": 0.91, "filtro": FILTRO_CALIDO},
}


def sintetizar(k, texto, perfil, destino):
    """Escribe `destino` (wav 44.1 kHz) con `texto` dicho por el perfil dado. Devuelve los segundos."""
    pf = PERFILES[perfil]
    s, sr = k.create(texto, voice=pf["voz"], speed=pf["velocidad"], lang=pf["lang"])
    crudo = destino + ".raw.wav"
    sf.write(crudo, s, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", crudo, "-af", pf["filtro"], "-ar", "44100", destino], check=True)
    os.remove(crudo)
    info = sf.info(destino)
    return info.frames / info.samplerate


def modelo():
    for d in [os.environ.get("KOKORO_DIR", ""), os.path.expanduser("~/.cache/hyperframes/tts"),
              os.path.join(ROOT, "models")]:
        m, v = os.path.join(d, "kokoro-v1.0.onnx"), os.path.join(d, "voices-v1.0.bin")
        if d and os.path.exists(m) and os.path.exists(v):
            return m, v
    sys.exit("No encuentro el modelo de Kokoro. Lee la cabecera de este script.")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    video, solo = sys.argv[1], set(sys.argv[2:])
    guion = json.load(open(os.path.join(ROOT, "src", "guiones", video + ".json"), encoding="utf-8"))
    frases = {k: v for e in guion["escenas"] for k, v in e["voz"].items()}
    perfil = guion.get("voz", "alex")
    if perfil not in PERFILES:
        sys.exit(f"Voz desconocida: {perfil}. Opciones: {', '.join(PERFILES)}")
    print(f"Voz: {perfil}")
    k = Kokoro(*modelo())
    carpeta = os.path.join(ROOT, "public", "voz", video)
    os.makedirs(carpeta, exist_ok=True)
    dur_path = os.path.join(ROOT, "src", "voz-duraciones.json")
    dur = json.load(open(dur_path)) if os.path.exists(dur_path) else {}
    previas = dur.get(video, {})
    dur[video] = {}
    for id_, texto in frases.items():
        final = os.path.join(carpeta, id_ + ".wav")
        if solo and id_ not in solo and id_ in previas and os.path.exists(final):
            dur[video][id_] = previas[id_]
            continue
        dur[video][id_] = round(sintetizar(k, texto, perfil, final), 3)
        print(f"{id_}: {dur[video][id_]:.2f}s  {texto}")
    # Borra audios de frases que ya no están en el guion.
    for f in os.listdir(carpeta):
        if f.endswith(".wav") and f[:-4] not in frases:
            os.remove(os.path.join(carpeta, f))
    json.dump(dur, open(dur_path, "w"), indent=1, ensure_ascii=False)
    total = sum(dur[video].values())
    print(f"Voz total: {total / 60:.1f} min ({len(frases)} frases)")


if __name__ == "__main__":
    main()
