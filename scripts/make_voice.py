"""Genera la narración de Alex (Kokoro, local y gratis) para un video largo.

    python3 scripts/make_voice.py plantilla          # todo el video
    python3 scripts/make_voice.py plantilla g1 c2    # solo esas frases

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
VOZ = "em_alex"
VELOCIDAD = 0.88  # más lento = menos robótico
FILTRO = ("highpass=f=70,equalizer=f=220:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.5:g=-2.5,"
          "highshelf=f=7000:g=-4,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,"
          "aecho=0.8:0.5:35:0.12,loudnorm=I=-16:TP=-1.5")


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
        s, sr = k.create(texto, voice=VOZ, speed=VELOCIDAD, lang="es")
        crudo = os.path.join(carpeta, id_ + ".raw.wav")
        sf.write(crudo, s, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", crudo, "-af", FILTRO, "-ar", "44100", final], check=True)
        os.remove(crudo)
        info = sf.info(final)
        dur[video][id_] = round(info.frames / info.samplerate, 3)
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
