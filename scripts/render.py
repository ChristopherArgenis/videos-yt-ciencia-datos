"""Renderiza un video largo solo si su guion está aprobado, y lo verifica.

    python3 scripts/render.py plantilla 00-Plantilla
    python3 scripts/render.py plantilla 00-Plantilla --forzar   # pruebas internas

1. Se niega si src/guiones/<video>.json no tiene "aprobado": true.
2. Se niega si falta la voz de alguna frase.
3. Renderiza out/<composición>.mp4 con Remotion y revisa con ffprobe: 1920×1080 y 3–10 min.
"""
import json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    forzar = "--forzar" in sys.argv
    if len(args) < 2:
        sys.exit(__doc__)
    video, comp = args
    g = json.load(open(os.path.join(ROOT, "src", "guiones", video + ".json"), encoding="utf-8"))
    if not g.get("aprobado") and not forzar:
        sys.exit("El guion no está aprobado. Muéstralo al usuario y espera su visto bueno.")
    d = json.load(open(os.path.join(ROOT, "src", "voz-duraciones.json"))).get(video, {})
    faltan = [k for e in g["escenas"] for k in e["voz"] if k not in d]
    if faltan:
        sys.exit(f"Falta la voz de: {', '.join(faltan)}. Corre scripts/make_voice.py {video}")
    out = os.path.join(ROOT, "out", comp + ".mp4")
    subprocess.run(["npx", "remotion", "render", comp, out], cwd=ROOT, check=True)
    info = json.loads(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration",
         "-of", "json", out], capture_output=True, text=True, check=True).stdout)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    audio = any(s["codec_type"] == "audio" for s in info["streams"])
    dur = float(info["format"]["duration"])
    print(f"\n{out}\n{v['width']}×{v['height']} · {dur / 60:.2f} min · audio: {'sí' if audio else 'NO'}")
    if (v["width"], v["height"]) != (1920, 1080):
        print("AVISO: no es 1920×1080")
    if not 180 <= dur <= 600 and not forzar:
        print("AVISO: debe durar entre 3 y 10 minutos")


if __name__ == "__main__":
    main()
