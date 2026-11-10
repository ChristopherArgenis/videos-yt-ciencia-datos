"""Genera una muestra en MP3 de un perfil de voz, para comparar antes de cambiar la voz del canal.

    python3 scripts/muestra_voz.py dora_latino_suave_calida dora_espana_suave_calida

Escribe muestras/voz/<perfil>.mp3 con un texto típico del canal (gancho + cierre),
frase por frase con pausas cortas, como suena en un video.
"""
import os, subprocess, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_voice import PERFILES, ROOT, modelo, sintetizar  # noqa: E402
from kokoro_onnx import Kokoro  # noqa: E402

FRASES = [
    "Minuto ochenta y uno de la final del Mundial. Mbappé remata de volea y empata el partido.",
    "Ese tiro tenía solo un diez por ciento de probabilidad de ser gol.",
    "¿Cómo sabemos si un tiro era gol seguro, o un milagro? Con un número: el equis ge.",
    "Hoy lo entiendes. Y hasta construimos el nuestro con Python.",
    "Hagamos la cuenta: son unos treinta y cinco eventos por minuto. Casi uno cada dos segundos.",
    "¿Te sirvió? Ve más videos en Universo Ciencia de Datos, y suscríbete.",
]
PAUSA = 0.45  # segundos entre frases


def main():
    perfiles = sys.argv[1:] or [p for p in PERFILES if p != "alex"]
    k = Kokoro(*modelo())
    salida = os.path.join(ROOT, "muestras", "voz")
    os.makedirs(salida, exist_ok=True)
    for perfil in perfiles:
        with tempfile.TemporaryDirectory() as tmp:
            partes = []
            for i, f in enumerate(FRASES):
                w = os.path.join(tmp, f"{i}.wav")
                sintetizar(k, f, perfil, w)
                partes.append(w)
            silencio = os.path.join(tmp, "pausa.wav")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
                            "-t", str(PAUSA), silencio], check=True)
            lista = os.path.join(tmp, "lista.txt")
            with open(lista, "w") as fh:
                for w in partes:
                    fh.write(f"file '{w}'\nfile '{silencio}'\n")
            mp3 = os.path.join(salida, perfil + ".mp3")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista,
                            "-ac", "1", "-ar", "48000", "-c:a", "libmp3lame", "-b:a", "160k", mp3], check=True)
            print(mp3)


if __name__ == "__main__":
    main()
