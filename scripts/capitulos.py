"""Imprime la duración del video y los capítulos con marca de tiempo para la descripción.

    python3 scripts/capitulos.py plantilla

Usa la misma cuenta que src/kit/largo.tsx (tiempos en src/kit/tiempos.json).
Si falta la voz de alguna frase, estima su duración y lo avisa.
Reglas de YouTube para capítulos: el primero en 00:00, al menos 3, cada uno de 10 s o más.
"""
import json, math, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def cargar(video):
    g = json.load(open(os.path.join(ROOT, "src", "guiones", video + ".json"), encoding="utf-8"))
    t = json.load(open(os.path.join(ROOT, "src", "kit", "tiempos.json")))
    d = json.load(open(os.path.join(ROOT, "src", "voz-duraciones.json"))).get(video, {})
    return g, t, d


def planificar(g, t, d):
    fps = t["fps"]
    f = lambda s: math.ceil(s * fps)
    desde, escenas, estimadas = 0, [], 0
    for e in g["escenas"]:
        x = f(t["inicio"])
        ids = list(e["voz"])
        for i, id_ in enumerate(ids):
            if id_ in d:
                s = d[id_]
            else:
                estimadas += 1
                s = max(1, len(e["voz"][id_].split()) / t["palabrasPorSegundo"])
            x += f(s) + (f(t["entre"]) if i < len(ids) - 1 else 0)
        x += f(e.get("pausa", t["pausa"]))
        x = max(x, f(e.get("min", 0)))
        escenas.append((e, desde))
        desde += x
    return escenas, desde, fps, estimadas


def mmss(seg):
    seg = int(seg)
    return f"{seg // 3600}:{seg % 3600 // 60:02d}:{seg % 60:02d}" if seg >= 3600 else f"{seg // 60:02d}:{seg % 60:02d}"


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    escenas, total, fps, estimadas = planificar(*cargar(sys.argv[1]))
    caps = []
    for e, desde in escenas:
        if e.get("capitulo") or not caps:
            caps.append((desde / fps, e.get("capitulo", "Inicio")))
    print(f"Duración: {mmss(total / fps)} ({total} frames)")
    if estimadas:
        print(f"AVISO: {estimadas} frases sin voz; tiempos estimados.")
    if not 180 <= total / fps <= 600:
        print("AVISO: el video debe durar entre 3 y 10 minutos.")
    print("\nCapítulos:")
    for i, (s, nombre) in enumerate(caps):
        fin = caps[i + 1][0] if i + 1 < len(caps) else total / fps
        nota = "   <- menos de 10 s: YouTube no lo acepta" if fin - s < 10 else ""
        print(f"{mmss(s)} {nombre}{nota}")
    if len(caps) < 3:
        print("AVISO: YouTube pide al menos 3 capítulos.")


if __name__ == "__main__":
    main()
