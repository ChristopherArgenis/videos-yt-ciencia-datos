"""Prepara los datos del episodio 4 de Fútbol con Datos: redes de pases de la final del Mundial 2022.

    python3 scripts/futbol/ep04_datos.py

Lee datos/statsbomb/3869685.json (lo descarga ep01_datos.py) y escribe src/datos/privado/ep04.json.
Pases completos (sin "outcome") con receptor, en el tiempo regular (periodos 1 y 2):
  - Argentina: del inicio a su primer cambio (63:51, Di María).
  - Francia antes: del inicio a su primer cambio (40:32, Dembélé).
  - Francia después: del segundo cambio (41:01, Giroud) a su tercer cambio (70:27, Theo Hernández).
Nodo = posición media desde donde dio sus pases; tamaño = pases dados + recibidos.
Líneas = parejas con al menos 3 pases (en cualquier sentido).
Requiere networkx (intermediación con distancia = 1 / pases).
"""
import collections, json, os, sys

import networkx as nx

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
ARCHIVO = os.path.join(ROOT, "datos", "statsbomb", "3869685.json")
CORTOS = {
    "Damián Emiliano Martínez": "Dibu Martínez", "Nahuel Molina Lucero": "Molina", "Cristian Gabriel Romero": "Romero",
    "Nicolás Hernán Otamendi": "Otamendi", "Nicolás Alejandro Tagliafico": "Tagliafico",
    "Rodrigo Javier De Paul": "De Paul", "Enzo Fernandez": "Enzo", "Alexis Mac Allister": "Mac Allister",
    "Lionel Andrés Messi Cuccittini": "Messi", "Julián Álvarez": "Julián", "Ángel Fabián Di María Hernández": "Di María",
    "Hugo Lloris": "Lloris", "Jules Koundé": "Koundé", "Raphaël Varane": "Varane",
    "Dayotchanculle Upamecano": "Upamecano", "Theo Bernard François Hernández": "Theo",
    "Aurélien Djani Tchouaméni": "Tchouaméni", "Adrien Rabiot": "Rabiot", "Ousmane Dembélé": "Dembélé",
    "Antoine Griezmann": "Griezmann", "Kylian Mbappé Lottin": "Mbappé", "Olivier Giroud": "Giroud",
    "Randal Kolo Muani": "Kolo Muani", "Marcus Thuram": "Thuram",
}
TRAMOS = {
    "argentina": ("Argentina", 0, 63 * 60 + 51),
    "francia_antes": ("France", 0, 40 * 60 + 32),
    "francia_despues": ("France", 41 * 60 + 1, 70 * 60 + 27),
}


def segundos(e):
    return e["minute"] * 60 + e["second"]


def red(eventos, equipo, a, b):
    pases = [e for e in eventos if e["type"]["name"] == "Pass" and e["team"]["name"] == equipo
             and e["period"] <= 2 and a <= segundos(e) < b]
    comp = [e for e in pases if "outcome" not in e["pass"] and "recipient" in e["pass"]]
    locs, dados, recib, par = collections.defaultdict(list), collections.Counter(), collections.Counter(), collections.Counter()
    for e in comp:
        p, r = e["player"]["name"], e["pass"]["recipient"]["name"]
        locs[p].append(e["location"])
        dados[p] += 1
        recib[r] += 1
        par[tuple(sorted((p, r)))] += 1
    G = nx.Graph()
    for (p, r), n in par.items():
        G.add_edge(p, r, dist=1 / n)
    inter = nx.betweenness_centrality(G, weight="dist")
    nodos = []
    for n in set(dados) | set(recib):
        if not locs[n]:
            continue
        xs = [l[0] for l in locs[n]]
        ys = [l[1] for l in locs[n]]
        nodos.append({"nombre": CORTOS.get(n, n), "x": round(sum(xs) / len(xs), 1), "y": round(sum(ys) / len(ys), 1),
                      "pases": dados[n] + recib[n], "inter": round(inter.get(n, 0), 3)})
    lineas = [{"a": CORTOS.get(p, p), "b": CORTOS.get(r, r), "n": n} for (p, r), n in par.items() if n >= 3]
    minutos = (b - a) / 60
    return {
        "minutos": round(minutos, 1), "pases": len(pases), "completos": len(comp),
        "por_minuto": round(len(comp) / minutos, 1), "acierto": round(100 * len(comp) / len(pases)),
        "nodos": sorted(nodos, key=lambda n: -n["pases"]), "lineas": sorted(lineas, key=lambda l: -l["n"]),
    }


def main():
    if not os.path.exists(ARCHIVO):
        sys.exit("Falta la final: corre primero scripts/futbol/ep01_datos.py")
    ev = json.load(open(ARCHIVO, encoding="utf-8"))
    out = {k: red(ev, *v) for k, v in TRAMOS.items()}
    tiros = [e for e in ev if e["type"]["name"] == "Shot" and e["team"]["name"] == "France" and e["period"] < 5]
    out["francia_tiros"] = {"antes": sum(segundos(e) < 41 * 60 for e in tiros), "despues": sum(segundos(e) >= 41 * 60 for e in tiros)}
    dest = os.path.join(ROOT, "src", "datos", "privado", "ep04.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False)
    for k in TRAMOS:
        r = out[k]
        print(k, {c: r[c] for c in ("minutos", "completos", "por_minuto", "acierto")})
        print("   ", [(n["nombre"], n["pases"], n["inter"]) for n in r["nodos"][:5]])
        print("   ", r["lineas"][:3])
    print(out["francia_tiros"])


if __name__ == "__main__":
    main()
