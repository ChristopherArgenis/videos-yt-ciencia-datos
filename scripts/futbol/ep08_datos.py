"""Prepara los datos del episodio 8 de Fútbol con Datos: radares (Julián Álvarez vs Giroud).

    python3 scripts/futbol/ep08_datos.py

Grupo de comparación: delanteros centro (posición más frecuente en sus eventos) con al menos 270 minutos
en el Mundial 2022, sin tanda de penales. Estadísticas por 90 minutos y percentil = % del grupo con valor
menor o igual. Escribe src/datos/privado/ep08.json.
"""
import collections, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import corto, eventos, guardar, minutos, partidos  # noqa: E402

DELANTEROS = {"Center Forward", "Left Center Forward", "Right Center Forward", "Striker", "Secondary Striker"}
METRICAS = [  # clave, nombre en pantalla
    ("goles", "Goles"), ("npxg", "xG sin penales"), ("tiros", "Tiros"), ("area", "Balones en el área"),
    ("cabeza", "Cabezazos"), ("pres", "Presiones"), ("kp", "Pases a tiro"), ("xa", "xA"),
]
JUGADORES = {"julian": "Julián Álvarez", "giroud": "Olivier Giroud"}


def main():
    mins, pos = collections.Counter(), collections.defaultdict(collections.Counter)
    st = collections.defaultdict(collections.Counter)
    for m in partidos():
        ev = eventos(m["match_id"])
        for n, v in minutos(ev).items():
            mins[n] += v
        tiros = {e["id"]: e for e in ev if e["type"]["name"] == "Shot"}
        for e in ev:
            if e["period"] > 4 or "player" not in e:
                continue
            n, t, s = e["player"]["name"], e["type"]["name"], st[e["player"]["name"]]
            if "position" in e:
                pos[n][e["position"]["name"]] += 1
            if t == "Shot":
                gol = e["shot"]["outcome"]["name"] == "Goal"
                s["tiros"] += 1
                s["goles"] += gol
                s["cabeza"] += e["shot"]["body_part"]["name"] == "Head"
                if e["shot"]["type"]["name"] != "Penalty":
                    s["npxg"] += e["shot"]["statsbomb_xg"]
            elif t == "Pass" and e["pass"].get("assisted_shot_id") in tiros:
                s["xa"] += tiros[e["pass"]["assisted_shot_id"]]["shot"]["statsbomb_xg"]
                s["kp"] += 1
            elif t == "Pressure":
                s["pres"] += 1
            elif t == "Ball Receipt*" and "outcome" not in e.get("ball_receipt", {}):
                x, y = e["location"]
                s["area"] += x >= 102 and 18 <= y <= 62
    grupo = [n for n in st if mins[n] >= 270 and pos[n] and pos[n].most_common(1)[0][0] in DELANTEROS]
    p90 = lambda n, k: 90 * st[n][k] / mins[n]
    out = {"grupo": len(grupo), "metricas": [{"k": k, "nombre": nom} for k, nom in METRICAS]}
    for clave, n in JUGADORES.items():
        out[clave] = {
            "nombre": corto(n), "minutos": round(mins[n]),
            "total": {k: round(st[n][k], 2) for k, _ in METRICAS},
            "por90": {k: round(p90(n, k), 2) for k, _ in METRICAS},
            "pct": {k: round(100 * sum(p90(o, k) <= p90(n, k) for o in grupo) / len(grupo)) for k, _ in METRICAS},
        }
    # Goles por 90 del grupo, ordenados (para explicar el percentil).
    out["goles90_grupo"] = sorted(round(p90(o, "goles"), 2) for o in grupo)
    out["mas_presiones"] = corto(max(grupo, key=lambda o: p90(o, "pres")))
    out["mas_cabeza"] = corto(max(grupo, key=lambda o: p90(o, "cabeza")))
    guardar("ep08.json", out)
    print("grupo", len(grupo), "| más presiones", out["mas_presiones"], "| más cabezazos", out["mas_cabeza"])
    for clave in JUGADORES:
        print(clave, out[clave]["minutos"], out[clave]["total"], out[clave]["pct"])
    print([round(v, 2) for v in [p90(JUGADORES[c] if False else n, "goles") for c, n in JUGADORES.items()]])


if __name__ == "__main__":
    main()
