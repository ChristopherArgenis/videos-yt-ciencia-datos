"""Prepara los datos del episodio 2 de Fútbol con Datos: el xG (goles esperados).

    python3 scripts/futbol/ep02_datos.py

Descarga los eventos de los 64 partidos del Mundial 2022 de StatsBomb Open Data a
datos/statsbomb/ (si no están) y escribe src/datos/privado/ep02.json. Ambas carpetas están
en .gitignore: la licencia de StatsBomb prohíbe redistribuir sus datos.

Además entrena un modelo de xG propio y sencillo (regresión logística con distancia, ángulo
y si fue de cabeza) con los tiros del Mundial, sin penales ni tanda de penales.
Requiere scikit-learn.
"""
import collections, json, math, os, urllib.request

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
BASE = "https://raw.githubusercontent.com/hudl/open-data/master/data"
CACHE = os.path.join(ROOT, "datos", "statsbomb")
FINAL = 3869685
YARDA = 0.9144


def bajar(ruta):
    local = os.path.join(CACHE, ruta.replace("/", "_"))
    if not os.path.exists(local):
        os.makedirs(CACHE, exist_ok=True)
        urllib.request.urlretrieve(f"{BASE}/{ruta}", local)
    return json.load(open(local, encoding="utf-8"))


def eventos(mid):
    viejo = os.path.join(CACHE, f"{mid}.json")  # caché del episodio 1
    if os.path.exists(viejo):
        return json.load(open(viejo, encoding="utf-8"))
    return bajar(f"events/{mid}.json")


def geometria(x, y):
    """Distancia (m) al centro de la portería y ángulo (grados) que se ve entre los postes."""
    dx, dy = 120 - x, y - 40
    dist = math.hypot(dx, dy) * YARDA
    ang = math.atan2(8 * dx, dx * dx + dy * dy - 16)
    return dist, math.degrees(ang if ang >= 0 else ang + math.pi)


CORTOS = {
    "Lionel Andrés Messi Cuccittini": "Messi", "Kylian Mbappé Lottin": "Mbappé",
    "Julián Álvarez": "Julián Álvarez", "Olivier Giroud": "Giroud",
    "Ángel Fabián Di María Hernández": "Di María", "Randal Kolo Muani": "Kolo Muani",
    "Alexis Mac Allister": "Mac Allister", "Enzo Fernandez": "Enzo Fernández",
    "Lautaro Javier Martínez": "Lautaro", "Marcus Thuram": "Thuram",
    "Antoine Griezmann": "Griezmann", "Rodrigo Javier De Paul": "De Paul",
    "Alvaro Borja Morata Martín": "Morata", "Cody Mathès Gakpo": "Gakpo",
    "Bukayo Saka": "Saka", "Enner Remberto Valencia Lastra": "Enner Valencia",
    "Marcus Rashford": "Rashford", "Richarlison de Andrade": "Richarlison",
}
corto = lambda n: CORTOS.get(n, n)


def main():
    partidos = bajar("matches/43/106.json")
    tiros = []
    for p in partidos:
        for e in eventos(p["match_id"]):
            if e["type"]["name"] != "Shot" or e["period"] == 5:
                continue
            s = e["shot"]
            x, y = e["location"]
            d, a = geometria(x, y)
            tiros.append({
                "partido": p["match_id"], "min": e["minute"], "seg": e["second"],
                "equipo": e["team"]["name"], "jugador": e["player"]["name"],
                "x": x, "y": y, "dist": d, "ang": a,
                "cabeza": s["body_part"]["name"] == "Head",
                "tipo": s["type"]["name"], "gol": s["outcome"]["name"] == "Goal",
                "xg_sb": s["statsbomb_xg"],
            })

    penales = [t for t in tiros if t["tipo"] == "Penalty"]
    juego = [t for t in tiros if t["tipo"] != "Penalty"]

    # Modelo propio: distancia, ángulo y cabeza.
    X = np.array([[t["dist"], t["ang"], float(t["cabeza"])] for t in juego])
    yv = np.array([t["gol"] for t in juego], dtype=int)
    m = LogisticRegression(max_iter=1000).fit(X, yv)
    prob = m.predict_proba(X)[:, 1]
    for t, pr in zip(juego, prob):
        t["xg_nuestro"] = float(pr)
    sb = np.array([t["xg_sb"] for t in juego])

    # Probabilidad del modelo en una rejilla (mitad de ataque), tiros con el pie.
    rejilla = []
    for gx in range(60, 120, 2):
        fila = []
        for gy in range(0, 80, 2):
            d, a = geometria(gx + 1, gy + 1)
            fila.append(round(float(m.predict_proba([[d, a, 0.0]])[0, 1]), 3))
        rejilla.append(fila)

    # Conversión por distancia (sin penales).
    cortes = [(0, 6), (6, 11), (11, 16), (16, 22), (22, 99)]
    por_dist = []
    for a, b in cortes:
        g = [t for t in juego if a <= t["dist"] < b]
        por_dist.append({"de": a, "a": b, "tiros": len(g), "goles": sum(t["gol"] for t in g)})

    # La final.
    final = sorted([t for t in tiros if t["partido"] == FINAL], key=lambda t: (t["min"], t["seg"]))
    final_out = [{"min": t["min"] + 1, "equipo": t["equipo"], "jugador": corto(t["jugador"]),
                  "x": t["x"], "y": t["y"], "xg": round(t["xg_sb"], 3), "gol": t["gol"],
                  "tipo": t["tipo"]} for t in final]
    mayor_fallo = max((t for t in final if not t["gol"]), key=lambda t: t["xg_sb"])

    # Jugadores del Mundial: goles y xG de StatsBomb (sin tanda de penales).
    jug = collections.defaultdict(lambda: {"goles": 0, "xg": 0.0, "tiros": 0, "penales": 0})
    for t in tiros:
        j = jug[t["jugador"]]
        j["goles"] += t["gol"]; j["xg"] += t["xg_sb"]; j["tiros"] += 1
        j["penales"] += t["gol"] and t["tipo"] == "Penalty"
    top = sorted(jug.items(), key=lambda kv: (-kv[1]["goles"], -kv[1]["xg"]))[:6]

    cab = [t for t in juego if t["cabeza"]]
    pie = [t for t in juego if not t["cabeza"]]
    out = {
        "partidos": len(partidos),
        "tiros": len(tiros), "goles": sum(t["gol"] for t in tiros),
        "juego": {"tiros": len(juego), "goles": int(yv.sum())},
        "penales": {"tiros": len(penales), "goles": sum(t["gol"] for t in penales),
                    "xg": round(float(np.mean([t["xg_sb"] for t in penales])), 2)},
        "cabeza": {"tiros": len(cab), "goles": sum(t["gol"] for t in cab)},
        "pie": {"tiros": len(pie), "goles": sum(t["gol"] for t in pie)},
        "por_dist": por_dist,
        "modelo": {
            "coef": [round(float(c), 4) for c in m.coef_[0]], "intercepto": round(float(m.intercept_[0]), 4),
            "auc_nuestro": round(float(roc_auc_score(yv, prob)), 3),
            "auc_sb": round(float(roc_auc_score(yv, sb)), 3),
            "corr_sb": round(float(np.corrcoef(prob, sb)[0, 1]), 3),
            "suma_nuestro": round(float(prob.sum()), 1), "suma_sb": round(float(sb.sum()), 1),
        },
        "rejilla": rejilla,
        "puntos": [[round(t["x"], 1), round(t["y"], 1), int(t["gol"])] for t in juego],
        "final": final_out,
        "mayor_fallo": {"min": mayor_fallo["min"] + 1, "jugador": corto(mayor_fallo["jugador"]),
                        "xg": round(mayor_fallo["xg_sb"], 2)},
        "top": [{"jugador": corto(n), **{k: (round(v, 2) if k == "xg" else v) for k, v in d.items()}} for n, d in top],
    }
    dest = os.path.join(ROOT, "src", "datos", "privado", "ep02.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False)
    for k in ("rejilla", "puntos"):
        out.pop(k)
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
