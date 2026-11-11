"""Prepara los datos del episodio 7 de Fútbol con Datos: el xA (asistencias esperadas).

    python3 scripts/futbol/ep07_datos.py

xA de un pase = xG del tiro que generó (pass.assisted_shot_id). Mundial 2022, sin tanda de penales.
Escribe src/datos/privado/ep07.json.
"""
import collections, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comun import NOMBRES, corto, eventos, guardar, minutos, partidos  # noqa: E402

FINAL = 3869685


def tipo_pase(p):
    if p.get("through_ball"):
        return "filtrado"
    if p.get("cut_back"):
        return "atras"
    if p.get("cross"):
        return "centro"
    return "normal"


def main():
    xa, kp, ast, goles = (collections.Counter() for _ in range(4))
    equipo = {}
    mins = collections.Counter()
    tipos = collections.defaultdict(list)
    jugadas = {"Messi": [], "Griezmann": []}
    final = collections.Counter()
    for m in partidos():
        ev = eventos(m["match_id"])
        for n, v in minutos(ev).items():
            mins[n] += v
        tiros = {e["id"]: e for e in ev if e["type"]["name"] == "Shot"}
        local, visita = m["home_team"]["home_team_name"], m["away_team"]["away_team_name"]
        for e in ev:
            if e["period"] > 4 or "player" not in e:
                continue
            n = e["player"]["name"]
            equipo[n] = e["team"]["name"]
            if e["type"]["name"] == "Shot":
                goles[n] += e["shot"]["outcome"]["name"] == "Goal"
            if e["type"]["name"] != "Pass":
                continue
            p = e["pass"]
            s = tiros.get(p.get("assisted_shot_id"))
            if not s:
                continue
            v = s["shot"]["statsbomb_xg"]
            xa[n] += v
            kp[n] += 1
            ast[n] += bool(p.get("goal_assist"))
            tipos[tipo_pase(p)].append(v)
            if m["match_id"] == FINAL:
                final[n] += v
            c = corto(n)
            if c in jugadas and p.get("goal_assist"):
                rival = visita if local == e["team"]["name"] else local
                jugadas[c].append({
                    "rival": NOMBRES.get(rival, rival), "min": e["minute"] + 1, "receptor": corto(s["player"]["name"]),
                    "de": [round(v_, 1) for v_ in e["location"]], "a": [round(v_, 1) for v_ in p["end_location"]],
                    "tiro": [round(v_, 1) for v_ in s["location"]], "xa": round(v, 2), "filtrado": bool(p.get("through_ball")),
                    "cabeza": s["shot"]["body_part"]["name"] == "Head",
                })
    ranking = [{"jugador": corto(n), "equipo": NOMBRES.get(equipo[n], equipo[n]), "xa": round(v, 2), "kp": kp[n],
                "ast": ast[n], "goles": goles[n], "xa90": round(90 * v / mins[n], 2) if mins[n] else 0}
               for n, v in xa.most_common(8)]
    sin_ast = [(n, v) for n, v in xa.items() if ast[n] == 0]
    sin_ast.sort(key=lambda kv: -kv[1])
    por90 = sorted(((n, 90 * v / mins[n]) for n, v in xa.items() if mins[n] >= 270), key=lambda kv: -kv[1])
    out = {
        "ranking": ranking,
        "tipos": {k: {"n": len(v), "media": round(sum(v) / len(v), 3)} for k, v in tipos.items()},
        "total_pases_tiro": sum(len(v) for v in tipos.values()),
        "jugadas": jugadas,
        "sin_asistencia": [{"jugador": corto(n), "equipo": NOMBRES.get(equipo[n], equipo[n]), "xa": round(v, 2)} for n, v in sin_ast[:2]],
        "lider90": {"jugador": corto(por90[0][0]), "xa90": round(por90[0][1], 2)},
        "final_top": {"jugador": corto(final.most_common(1)[0][0]), "xa": round(final.most_common(1)[0][1], 2)},
        "griezmann_partidos": sum(1 for m in partidos() if any(e.get("player", {}).get("name") == "Antoine Griezmann" for e in eventos(m["match_id"]))),
    }
    guardar("ep07.json", out)
    for r in ranking[:5]:
        print(r)
    print(out["tipos"], out["total_pases_tiro"])
    print(out["sin_asistencia"], out["lider90"], out["final_top"], "partidos Griezmann", out["griezmann_partidos"])
    for k, v in jugadas.items():
        for j in v:
            print(k, j)


if __name__ == "__main__":
    main()
