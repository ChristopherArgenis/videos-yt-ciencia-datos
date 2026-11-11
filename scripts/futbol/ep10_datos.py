"""Prepara los datos del episodio 10 de Fútbol con Datos: la final del Mundial 2022 por fases.

    python3 scripts/futbol/ep10_datos.py

Tiros sin tanda (period < 5), xG por fases [0,36) [36,81) [81,fin) como en el código del video,
presiones y pases por tramo, y la tanda de penales. Escribe src/datos/privado/ep10.json.
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import corto, eventos, guardar  # noqa: E402

FINAL = 3869685
FASES = [(0, 36), (36, 81), (81, 999)]
EQ = {"Argentina": "arg", "France": "fra"}


def main():
    ev = eventos(FINAL)
    juego = [e for e in ev if e["period"] < 5]
    tiros = []
    for e in juego:
        if e["type"]["name"] != "Shot":
            continue
        s = e["shot"]
        tiros.append({"t": round(e["minute"] + e["second"] / 60, 2), "min": e["minute"], "eq": EQ[e["team"]["name"]],
                      "jugador": corto(e["player"]["name"]), "xg": round(s["statsbomb_xg"], 3),
                      "gol": s["outcome"]["name"] == "Goal", "penal": s["type"]["name"] == "Penalty",
                      "atajado": s["outcome"]["name"] == "Saved", "x": e["location"][0], "y": e["location"][1]})
    fases = []
    for a, b in FASES:
        f = {"de": a, "a": b}
        for nom, k in EQ.items():
            ts = [t for t in tiros if t["eq"] == k and a <= t["min"] < b]
            f[k] = {"xg": round(sum(t["xg"] for t in ts), 2), "tiros": len(ts)}
        fases.append(f)
    cuenta = lambda tipo, a, b, k: sum(1 for e in juego if e["type"]["name"] == tipo and EQ.get(e["team"]["name"]) == k and a <= e["minute"] < b)
    tanda = [{"eq": EQ[e["team"]["name"]], "jugador": corto(e["player"]["name"]), "gol": e["shot"]["outcome"]["name"] == "Goal",
              "res": e["shot"]["outcome"]["name"]} for e in ev if e["period"] == 5 and e["type"]["name"] == "Shot"]
    out = {
        "tiros": tiros, "fases": fases, "fin": max(e["minute"] + e["second"] / 60 for e in juego),
        "total": {k: round(sum(t["xg"] for t in tiros if t["eq"] == k), 2) for k in EQ.values()},
        "presiones_0_36": {k: cuenta("Pressure", 0, 36, k) for k in EQ.values()},
        "pases_36_80": {k: cuenta("Pass", 36, 80, k) for k in EQ.values()},
        "tanda": tanda,
    }
    guardar("ep10.json", out)
    print("fases", fases)
    print("total", out["total"], "| presiones", out["presiones_0_36"], "| pases", out["pases_36_80"])
    print("goles", [(t["min"], t["jugador"], t["xg"]) for t in tiros if t["gol"]])
    print("lautaro ET", [(t["min"], t["xg"]) for t in tiros if t["jugador"].startswith("Lautaro") and t["min"] >= 90])
    print("tanda", [(t["eq"], t["jugador"], t["res"]) for t in tanda], "| fin", out["fin"])


if __name__ == "__main__":
    main()
