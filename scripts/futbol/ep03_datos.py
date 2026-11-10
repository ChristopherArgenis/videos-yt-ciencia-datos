"""Prepara los datos del episodio 3 de Fútbol con Datos: mapas de tiros (Messi vs Mbappé).

    python3 scripts/futbol/ep03_datos.py

Usa los eventos del Mundial 2022 que ya descargó ep02_datos.py en datos/statsbomb/
(si faltan, córrelo primero) y escribe src/datos/privado/ep03.json. Sin tanda de penales.
Área grande = x ≥ 102 y 18 ≤ y ≤ 62 (coordenadas StatsBomb).
"""
import json, math, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
CACHE = os.path.join(ROOT, "datos", "statsbomb")
JUG = {"Lionel Andrés Messi Cuccittini": "Messi", "Kylian Mbappé Lottin": "Mbappé"}
RIVAL = {"Netherlands": "Países Bajos", "France": "Francia", "Poland": "Polonia", "Croatia": "Croacia",
         "Saudi Arabia": "Arabia Saudita", "Australia": "Australia", "Mexico": "México", "Argentina": "Argentina",
         "Denmark": "Dinamarca", "Tunisia": "Túnez", "England": "Inglaterra", "Morocco": "Marruecos"}


def eventos(mid):
    for f in (f"{mid}.json", f"events_{mid}.json"):
        p = os.path.join(CACHE, f)
        if os.path.exists(p):
            return json.load(open(p, encoding="utf-8"))
    sys.exit(f"Falta el partido {mid}: corre primero scripts/futbol/ep02_datos.py")


def en_area(x, y):
    return x >= 102 and 18 <= y <= 62


def main():
    partidos = json.load(open(os.path.join(CACHE, "matches_43_106.json"), encoding="utf-8"))
    todos, jug = [], {v: [] for v in JUG.values()}
    for m in partidos:
        for e in eventos(m["match_id"]):
            if e["type"]["name"] != "Shot" or e["period"] == 5:
                continue
            s = e["shot"]
            x, y = e["location"]
            gol = s["outcome"]["name"] == "Goal"
            pen = s["type"]["name"] == "Penalty"
            if not pen:
                todos.append([round(x, 1), round(y, 1), int(gol)])
            n = JUG.get(e["player"]["name"])
            if n:
                local = m["home_team"]["home_team_name"]
                rival = m["away_team"]["away_team_name"] if local == e["team"]["name"] else local
                jug[n].append({
                    "x": round(x, 1), "y": round(y, 1), "xg": round(s["statsbomb_xg"], 3), "gol": gol,
                    "penal": pen, "min": e["minute"] + 1, "rival": RIVAL.get(rival, rival),
                    "zurda": s["body_part"]["name"] == "Left Foot", "cabeza": s["body_part"]["name"] == "Head",
                    "dist": round(math.hypot(120 - x, y - 40) * 0.9144, 1),
                })
    resumen = {}
    for n, ts in jug.items():
        jp = [t for t in ts if not t["penal"]]
        pen = [t for t in ts if t["penal"]]
        resumen[n] = {
            "tiros": len(ts), "goles": sum(t["gol"] for t in ts),
            "jp_tiros": len(jp), "jp_goles": sum(t["gol"] for t in jp), "jp_xg": round(sum(t["xg"] for t in jp), 2),
            "area": sum(en_area(t["x"], t["y"]) for t in jp),
            "area_goles": sum(t["gol"] and en_area(t["x"], t["y"]) for t in jp),
            "zurda": sum(t["zurda"] for t in jp),
            "dist_media": round(sum(t["dist"] for t in jp) / len(jp), 1),
            "penales": len(pen), "penales_gol": sum(t["gol"] for t in pen),
        }
    fuera = [p for p in todos if not en_area(p[0], p[1])]
    area = [p for p in todos if en_area(p[0], p[1])]
    chica = [p for p in todos if p[0] >= 114 and 30 <= p[1] <= 50]
    out = {
        "todos": todos,
        "mundial": {"tiros": len(todos), "goles": sum(p[2] for p in todos),
                    "fuera": len(fuera), "fuera_goles": sum(p[2] for p in fuera),
                    "area": len(area), "area_goles": sum(p[2] for p in area),
                    "chica": len(chica), "chica_goles": sum(p[2] for p in chica)},
        "jugadores": jug,
        "resumen": resumen,
        # Contados en ep02/ep03 desde los pases (goal_assist / shot_assist) del Mundial.
        "creacion": {"Messi": {"pases_a_tiro": 19, "asistencias": 3}, "Mbappé": {"pases_a_tiro": 11, "asistencias": 2}},
    }
    dest = os.path.join(ROOT, "src", "datos", "privado", "ep03.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False)
    print(json.dumps({"mundial": out["mundial"], "resumen": resumen}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
