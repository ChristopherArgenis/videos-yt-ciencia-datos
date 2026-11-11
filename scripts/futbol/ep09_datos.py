"""Prepara los datos del episodio 9 de Fútbol con Datos: scouting (el gemelo estadístico de Enzo Fernández).

    python3 scripts/futbol/ep09_datos.py

Grupo: mediocampistas (posición más frecuente en sus eventos) con al menos 270 minutos en el Mundial 2022,
sin tanda de penales. 12 estadísticas por 90 minutos, puntaje z y similitud coseno con Enzo.
Pase hacia adelante = pase completo que avanza 10+ yardas y termina en campo rival (x >= 60).
Escribe src/datos/privado/ep09.json.
"""
import collections, os, sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import NOMBRES, corto, eventos, guardar, minutos, partidos  # noqa: E402

MED = {"Center Midfield", "Left Center Midfield", "Right Center Midfield", "Center Defensive Midfield",
       "Left Defensive Midfield", "Right Defensive Midfield", "Center Attacking Midfield"}
F = ["pases", "prog", "ult_tercio", "kp", "xa", "cond_prog", "pres", "recup", "intercep", "entradas", "tiros", "regates"]
NOMBRE_F = ["Pases", "Pases hacia adelante", "Pases al último tercio", "Pases a tiro", "xA", "Conducciones que avanzan",
            "Presiones", "Recuperaciones", "Intercepciones", "Entradas", "Tiros", "Regates"]
ENZO = "Enzo Fernandez"
CORTO = {"Frenkie de Jong": "De Jong", "Lucas Tolentino Coelho de Lima": "Paquetá", "Pablo Martín Páez Gavira": "Gavi",
         "Wataru Endo": "Endo", "Hidemasa Morita": "Morita"}


def main():
    mins, pos = collections.Counter(), collections.defaultdict(collections.Counter)
    st, eq = collections.defaultdict(collections.Counter), {}
    for m in partidos():
        ev = eventos(m["match_id"])
        for n, v in minutos(ev).items():
            mins[n] += v
        tiros = {e["id"]: e for e in ev if e["type"]["name"] == "Shot"}
        for e in ev:
            if e["period"] > 4 or "player" not in e:
                continue
            n, t, s = e["player"]["name"], e["type"]["name"], st[e["player"]["name"]]
            eq[n] = e["team"]["name"]
            if "position" in e:
                pos[n][e["position"]["name"]] += 1
            if t == "Pass":
                p = e["pass"]
                ok = "outcome" not in p
                s["pases"] += 1
                x0, x1 = e["location"][0], p["end_location"][0]
                s["prog"] += ok and x1 - x0 >= 10 and x1 >= 60
                s["ult_tercio"] += ok and x1 >= 80
                if p.get("assisted_shot_id") in tiros:
                    s["kp"] += 1
                    s["xa"] += tiros[p["assisted_shot_id"]]["shot"]["statsbomb_xg"]
            elif t == "Carry":
                s["cond_prog"] += e["carry"]["end_location"][0] - e["location"][0] >= 10
            elif t == "Pressure":
                s["pres"] += 1
            elif t == "Ball Recovery":
                s["recup"] += not e.get("ball_recovery", {}).get("recovery_failure")
            elif t == "Interception":
                s["intercep"] += 1
            elif t == "Duel":
                s["entradas"] += e.get("duel", {}).get("type", {}).get("name") == "Tackle"
            elif t == "Shot":
                s["tiros"] += 1
            elif t == "Dribble":
                s["regates"] += e["dribble"]["outcome"]["name"] == "Complete"
    grupo = [n for n in st if mins[n] >= 270 and pos[n] and pos[n].most_common(1)[0][0] in MED]
    X = np.array([[90 * st[n][k] / mins[n] for k in F] for n in grupo])
    Z = (X - X.mean(0)) / X.std(0)
    t = grupo.index(ENZO)
    sim = Z @ Z[t] / (np.linalg.norm(Z, axis=1) * np.linalg.norm(Z[t]))
    orden = [i for i in np.argsort(-sim) if i != t]
    nombre = lambda n: CORTO.get(n, corto(n))
    jug = lambda i: {"nombre": nombre(grupo[i]), "equipo": NOMBRES.get(eq[grupo[i]], eq[grupo[i]]),
                     "sim": round(float(sim[i]), 2), "minutos": round(mins[grupo[i]])}
    perfil = lambda n: {k: round(90 * st[n][k] / mins[n], 1) for k in F}
    rank_pases = sorted(grupo, key=lambda n: -st[n]["pases"] / mins[n]).index(ENZO) + 1
    kov = grupo[orden[0]]
    out = {
        "grupo": len(grupo), "metricas": [{"k": k, "nombre": v} for k, v in zip(F, NOMBRE_F)],
        "enzo": {"nombre": "Enzo", "minutos": round(mins[ENZO]), "por90": perfil(ENZO), "z": dict(zip(F, np.round(Z[t], 2).tolist()))},
        "kovacic": {"nombre": nombre(kov), "minutos": round(mins[kov]), "por90": perfil(kov),
                    "z": dict(zip(F, np.round(Z[orden[0]], 2).tolist()))},
        "top": [jug(i) for i in orden[:4]], "ultimo": jug(orden[-1]),
        "todos": sorted([round(float(sim[i]), 2) for i in orden]),
        "rank_pases": rank_pases,
        "pases90_grupo": sorted(round(float(v), 1) for v in X[:, 0]),
    }
    guardar("ep09.json", out)
    print("grupo", len(grupo), "| rank pases Enzo", rank_pases)
    print("top", out["top"], "| último", out["ultimo"])
    print("Enzo", out["enzo"]["por90"], out["enzo"]["minutos"])
    print("Kovačić", out["kovacic"]["por90"], out["kovacic"]["minutos"])


if __name__ == "__main__":
    main()
