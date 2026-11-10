"""Prepara los datos del episodio 6 de Fútbol con Datos: mapas de calor (España 0–0 Marruecos).

    python3 scripts/futbol/ep06_datos.py

Partido 3869220 (octavos del Mundial 2022). Escribe src/datos/privado/ep06.json.
Acciones con balón = Pass, Ball Receipt*, Carry, Dribble y Shot. Mapas de calor con KDE gaussiana
(ancho 3 yardas) en una rejilla 60 × 40. Sin tanda de penales salvo la lista de penales.
"""
import collections, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import densidad, eventos, guardar  # noqa: E402

PARTIDO = 3869220
CON_BALON = {"Pass", "Ball Receipt*", "Carry", "Dribble", "Shot"}
CORTOS = {"Pablo Sarabia García": "Sarabia", "Carlos Soler Barragán": "Soler", "Sergio Busquets i Burgos": "Busquets",
          "Abdelhamid Sabiri": "Sabiri", "Hakim Ziyech": "Ziyech", "Badr Banoun": "Banoun",
          "Achraf Hakimi Mouh": "Hakimi", "Nayef Aguerd": "Aguerd"}


def main():
    todo = eventos(PARTIDO)
    ev = [e for e in todo if e["period"] <= 4]
    out = {"duracion": max(e["minute"] for e in ev) + 1}
    pases_tot = sum(e["type"]["name"] == "Pass" for e in ev)
    for t, clave in (("Spain", "espana"), ("Morocco", "marruecos")):
        mio = [e for e in ev if e["team"]["name"] == t]
        bal = [e["location"] for e in mio if e["type"]["name"] in CON_BALON and "location" in e]
        pas = [e for e in mio if e["type"]["name"] == "Pass"]
        tir = [e for e in mio if e["type"]["name"] == "Shot"]
        pre = [e["location"] for e in mio if e["type"]["name"] == "Pressure"]
        mejor = max(tir, key=lambda e: e["shot"]["statsbomb_xg"])
        out[clave] = {
            "acciones": len(bal), "rival": round(100 * sum(l[0] >= 60 for l in bal) / len(bal)),
            "ultimo_tercio": round(100 * sum(l[0] >= 80 for l in bal) / len(bal)),
            "pases": len(pas), "acierto": round(100 * sum("outcome" not in e["pass"] for e in pas) / len(pas)),
            "posesion": round(100 * len(pas) / pases_tot),
            "tiros": len(tir), "xg": round(sum(e["shot"]["statsbomb_xg"] for e in tir), 2),
            "mejor": {"jugador": CORTOS.get(mejor["player"]["name"], mejor["player"]["name"]), "min": mejor["minute"] + 1,
                      "xg": round(mejor["shot"]["statsbomb_xg"], 2), "resultado": mejor["shot"]["outcome"]["name"]},
            "presiones": len(pre), "pres_propio": round(100 * sum(l[0] < 60 for l in pre) / len(pre)),
            "calor": densidad(bal), "calor_presion": densidad(pre), "calor_suave": densidad(bal, ancho=7),
            "puntos": [[round(l[0], 1), round(l[1], 1)] for l in bal],
        }
    acc = collections.Counter(e["player"]["name"] for e in ev if "player" in e and "location" in e)
    pres = collections.Counter(e["player"]["name"] for e in ev if e["type"]["name"] == "Pressure")
    out["rodri"] = acc["Rodrigo Hernández Cascante"]
    out["mas_acciones"] = acc.most_common(1)[0][0]
    out["amrabat_presiones"] = pres["Sofyan Amrabat"]
    out["mas_presiones"] = pres.most_common(1)[0][0]
    for clave, nombre in (("pedri", "Pedro González López"), ("hakimi", "Achraf Hakimi Mouh")):
        loc = [e["location"] for e in ev if e.get("player", {}).get("name") == nombre and e["type"]["name"] in CON_BALON and "location" in e]
        out[clave] = {"acciones": acc[nombre], "presiones": pres[nombre], "calor": densidad(loc, ancho=4)}
    espanoles = {e["player"]["name"] for e in ev if e["team"]["name"] == "Spain" and "player" in e}
    out["pedri_top_espana"] = max((n for n in pres if n in espanoles), key=pres.get) == "Pedro González López"
    out["penales"] = [{"equipo": e["team"]["name"], "jugador": CORTOS.get(e["player"]["name"], e["player"]["name"]),
                       "resultado": e["shot"]["outcome"]["name"]} for e in todo if e["period"] == 5 and e["type"]["name"] == "Shot"]
    guardar("ep06.json", out)
    for k in ("espana", "marruecos"):
        print(k, {a: b for a, b in out[k].items() if a not in ("calor", "calor_presion", "puntos")})
    print({k: out[k] for k in ("duracion", "rodri", "mas_acciones", "amrabat_presiones", "mas_presiones", "pedri_top_espana")})
    print("pedri", out["pedri"]["acciones"], out["pedri"]["presiones"], "| hakimi", out["hakimi"]["acciones"], out["hakimi"]["presiones"])
    print(out["penales"])


if __name__ == "__main__":
    main()
