"""Prepara los datos del episodio 1 de Fútbol con Datos (final del Mundial 2022).

    python3 scripts/futbol/ep01_datos.py

Descarga los eventos del partido 3869685 de StatsBomb Open Data a datos/statsbomb/ y escribe
src/datos/privado/ep01.json. Las dos carpetas están en .gitignore: la licencia de StatsBomb
prohíbe redistribuir sus datos, así que cada quien los descarga de su repositorio.
"""
import collections, json, os, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
PARTIDO = 3869685
URL = f"https://raw.githubusercontent.com/hudl/open-data/master/data/events/{PARTIDO}.json"


def eventos():
    cache = os.path.join(ROOT, "datos", "statsbomb", f"{PARTIDO}.json")
    if not os.path.exists(cache):
        os.makedirs(os.path.dirname(cache), exist_ok=True)
        urllib.request.urlretrieve(URL, cache)
    return json.load(open(cache, encoding="utf-8"))


def main():
    todos = eventos()
    jugados = [e for e in todos if e["period"] <= 4]  # sin tanda de penales
    tipo = lambda e: e["type"]["name"]
    conteo = collections.Counter(tipo(e) for e in jugados)

    # Puntos para la cancha del gancho: cada evento con ubicación.
    puntos = [[round(e["location"][0], 1), round(e["location"][1], 1), tipo(e)]
              for e in jugados if "location" in e]

    pase = next(e for e in jugados if tipo(e) == "Pass" and e["minute"] == 0 and e["second"] == 39)
    penales = [{"jugador": e["player"]["name"], "minuto": e["minute"] + 1, "x": e["location"][0], "y": e["location"][1]}
               for e in jugados if tipo(e) == "Shot" and e["shot"]["type"]["name"] == "Penalty"]

    equipos = {}
    for t in ("Argentina", "France"):
        p = [e for e in jugados if e["team"]["name"] == t and tipo(e) == "Pass"]
        s = [e for e in jugados if e["team"]["name"] == t and tipo(e) == "Shot"]
        equipos[t] = {
            "pases": len(p),
            "completados": sum("outcome" not in e["pass"] for e in p),
            "tiros": len(s),
            "goles": sum(e["shot"]["outcome"]["name"] == "Goal" for e in s),
            "xg": round(sum(e["shot"]["statsbomb_xg"] for e in s), 2),
        }

    messi = [e for e in jugados if e.get("player", {}).get("name", "").startswith("Lionel Andrés Messi")]
    cm = collections.Counter(tipo(e) for e in messi)

    cortos = {"Antoine Griezmann": "Griezmann", "Aurélien Djani Tchouaméni": "Tchouaméni", "Olivier Giroud": "Giroud",
              "Nahuel Molina Lucero": "Molina", "Adrien Rabiot": "Rabiot", "Rodrigo Javier De Paul": "De Paul",
              "Cristian Gabriel Romero": "Romero"}
    inicio = [{"t": f"{e['minute']}:{e['second']:02d}", "tipo": tipo(e),
               "jugador": cortos.get(e.get("player", {}).get("name"), e.get("player", {}).get("name")),
               "x": e["location"][0], "y": e["location"][1]}
              for e in [e for e in jugados if "location" in e][:12]]

    out = {
        "inicio": inicio,
        "total": len(todos),
        "jugados": len(jugados),
        "conteo": {k: conteo[k] for k in ("Pass", "Ball Receipt*", "Carry", "Pressure", "Shot")},
        "puntos": puntos,
        "pase": {
            "de": pase["player"]["name"], "a": pase["pass"]["recipient"]["name"],
            "inicio": pase["location"], "fin": pase["pass"]["end_location"],
            "largo": round(pase["pass"]["length"], 1), "altura": pase["pass"]["height"]["name"],
            "pie": pase["pass"]["body_part"]["name"],
        },
        "penales": penales,
        "equipos": equipos,
        "messi": {
            "eventos": len(messi),
            "recepciones": cm["Ball Receipt*"], "pases": cm["Pass"], "conducciones": cm["Carry"],
            "presiones": cm["Pressure"],
            "puntos": [[round(e["location"][0], 1), round(e["location"][1], 1)] for e in messi if "location" in e],
        },
    }
    dest = os.path.join(ROOT, "src", "datos", "privado", "ep01.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False)
    resumen = {k: v for k, v in out.items() if k not in ("puntos", "messi")}
    resumen["messi"] = {k: v for k, v in out["messi"].items() if k != "puntos"}
    print(json.dumps(resumen, ensure_ascii=False, indent=1))
    print(f"{len(puntos)} puntos con ubicación; Messi {len(out['messi']['puntos'])}")


if __name__ == "__main__":
    main()
