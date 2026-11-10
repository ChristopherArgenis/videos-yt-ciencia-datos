"""Prepara los datos del episodio 5 de Fútbol con Datos: la presión.

    python3 scripts/futbol/ep05_datos.py

Lee los 64 partidos del Mundial 2022 (descargados por ep02_datos.py) y escribe src/datos/privado/ep05.json.
Sin tanda de penales. Por equipo: presiones por 90 min, % en campo rival (x ≥ 60), % de contrapresión
(campo `counterpress` de StatsBomb), recuperaciones altas por 90 (Ball Recovery exitosa con x ≥ 80)
y posesión (% de los pases del partido).
"""
import collections, os, sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import NOMBRES, eventos, guardar, partidos  # noqa: E402

FINAL = 3869685


def main():
    c = collections.defaultdict(collections.Counter)
    minutos = collections.Counter()
    puntos = {"Germany": [], "Morocco": []}
    for m in partidos():
        ev = [e for e in eventos(m["match_id"]) if e["period"] <= 4]
        dur = max(e["minute"] for e in ev) + 1
        equipos = [m["home_team"]["home_team_name"], m["away_team"]["away_team_name"]]
        pases = collections.Counter(e["team"]["name"] for e in ev if e["type"]["name"] == "Pass")
        for t in equipos:
            minutos[t] += dur
            c[t]["pases"] += pases[t]
            c[t]["pases_partido"] += sum(pases.values())
        for e in ev:
            t, tipo, loc = e["team"]["name"], e["type"]["name"], e.get("location")
            if tipo == "Pressure":
                c[t]["pres"] += 1
                c[t]["rival"] += loc[0] >= 60
                c[t]["contra"] += bool(e.get("counterpress"))
                if t in puntos:
                    puntos[t].append([round(loc[0], 1), round(loc[1], 1)])
            if tipo == "Ball Recovery" and loc and loc[0] >= 80 and not e.get("ball_recovery", {}).get("recovery_failure"):
                c[t]["recup_alta"] += 1
    equipos = []
    for t, v in c.items():
        f = 90 / minutos[t]
        equipos.append({
            "equipo": NOMBRES.get(t, t), "en": t,
            "pres90": round(v["pres"] * f, 1), "rival": round(100 * v["rival"] / v["pres"]),
            "contra": round(100 * v["contra"] / v["pres"]), "recup_alta90": round(v["recup_alta"] * f, 1),
            "posesion": round(100 * v["pases"] / v["pases_partido"]),
        })
    equipos.sort(key=lambda e: -e["pres90"])
    pos = np.array([e["posesion"] for e in equipos])
    p90 = np.array([e["pres90"] for e in equipos])
    final = {}
    ev = [e for e in eventos(FINAL) if e["period"] <= 4]
    for t in ("Argentina", "France"):
        pr = [e for e in ev if e["type"]["name"] == "Pressure" and e["team"]["name"] == t]
        final[t] = {"pres": len(pr), "rival": round(100 * sum(e["location"][0] >= 60 for e in pr) / len(pr)),
                    "contra": sum(bool(e.get("counterpress")) for e in pr)}
    pases = collections.Counter(e["team"]["name"] for e in ev if e["type"]["name"] == "Pass")
    final["posesion_arg"] = round(100 * pases["Argentina"] / sum(pases.values()))
    total = sum(v["pres"] for v in c.values())
    out = {"equipos": equipos, "correlacion": round(float(np.corrcoef(pos, p90)[0, 1]), 2), "final": final,
           "total": total, "por_partido": round(total / 64), "puntos": puntos}
    guardar("ep05.json", out)
    for e in equipos[:4] + equipos[-3:]:
        print(e)
    print("correlación", out["correlacion"], "| total", total, "| final", final)
    for t in ("Germany", "Morocco", "Spain", "Japan"):
        print([e for e in equipos if e["en"] == t][0])


if __name__ == "__main__":
    main()
