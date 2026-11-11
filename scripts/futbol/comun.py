"""Funciones comunes para los scripts de datos de Fútbol con Datos (StatsBomb Open Data, Mundial 2022)."""
import json, os, sys

import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
CACHE = os.path.join(ROOT, "datos", "statsbomb")

NOMBRES = {
    "Japan": "Japón", "Morocco": "Marruecos", "Iran": "Irán", "Costa Rica": "Costa Rica", "Ecuador": "Ecuador",
    "Netherlands": "Países Bajos", "Australia": "Australia", "United States": "EE. UU.", "Spain": "España",
    "England": "Inglaterra", "Portugal": "Portugal", "Belgium": "Bélgica", "Switzerland": "Suiza",
    "Germany": "Alemania", "Argentina": "Argentina", "France": "Francia", "Croatia": "Croacia", "Brazil": "Brasil",
    "Mexico": "México", "Serbia": "Serbia", "South Korea": "Corea del Sur", "Poland": "Polonia", "Denmark": "Dinamarca",
    "Tunisia": "Túnez", "Saudi Arabia": "Arabia Saudita", "Senegal": "Senegal", "Cameroon": "Camerún",
    "Ghana": "Ghana", "Uruguay": "Uruguay", "Canada": "Canadá", "Wales": "Gales", "Qatar": "Catar",
}


def partidos():
    p = os.path.join(CACHE, "matches_43_106.json")
    if not os.path.exists(p):
        sys.exit("Faltan los partidos del Mundial: corre primero scripts/futbol/ep02_datos.py")
    return json.load(open(p, encoding="utf-8"))


def eventos(mid):
    for f in (f"{mid}.json", f"events_{mid}.json"):
        p = os.path.join(CACHE, f)
        if os.path.exists(p):
            return json.load(open(p, encoding="utf-8"))
    sys.exit(f"Falta el partido {mid}: corre primero scripts/futbol/ep02_datos.py")


def guardar(nombre, datos):
    dest = os.path.join(ROOT, "src", "datos", "privado", nombre)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    json.dump(datos, open(dest, "w", encoding="utf-8"), ensure_ascii=False)
    return dest


def densidad(puntos, ancho=3.0, nx=60, ny=40):
    """Mapa de calor (KDE gaussiana) en una rejilla nx × ny sobre la cancha 120 × 80, normalizado a 0–1."""
    if not puntos:
        return [[0] * ny for _ in range(nx)]
    p = np.array(puntos, dtype=float)
    xs = (np.arange(nx) + 0.5) * 120 / nx
    ys = (np.arange(ny) + 0.5) * 80 / ny
    gx, gy = np.meshgrid(xs, ys, indexing="ij")
    d = np.zeros_like(gx)
    for x, y in p:
        d += np.exp(-((gx - x) ** 2 + (gy - y) ** 2) / (2 * ancho ** 2))
    d /= d.max()
    return np.round(d, 3).tolist()


def minutos(ev):
    """Minutos jugados por jugador en un partido (titulares desde 0, cambios y expulsiones), sin tanda de penales."""
    fin = max(e["minute"] + e["second"] / 60 for e in ev if e["period"] <= 4)
    dentro, mins = {}, {}
    for e in ev:
        if e["type"]["name"] == "Starting XI":
            for p in e["tactics"]["lineup"]:
                dentro[p["player"]["name"]] = 0.0
    for e in ev:
        t = e["minute"] + e["second"] / 60
        if e["type"]["name"] == "Substitution":
            sale, entra = e["player"]["name"], e["substitution"]["replacement"]["name"]
            if sale in dentro:
                mins[sale] = mins.get(sale, 0) + t - dentro.pop(sale)
            dentro[entra] = t
        tarjeta = e.get("bad_behaviour", {}).get("card", {}).get("name", "") or e.get("foul_committed", {}).get("card", {}).get("name", "")
        if tarjeta in ("Red Card", "Second Yellow") and e.get("player", {}).get("name") in dentro:
            n = e["player"]["name"]
            mins[n] = mins.get(n, 0) + t - dentro.pop(n)
    for n, t in dentro.items():
        mins[n] = mins.get(n, 0) + fin - t
    return mins


CORTOS = {
    "Antoine Griezmann": "Griezmann", "Lionel Andrés Messi Cuccittini": "Messi", "Leroy Sané": "Sané",
    "Raphael Dias Belloli": "Raphinha", "Harry Kane": "Kane", "Ousmane Dembélé": "Dembélé",
    "Mateo Kovačić": "Kovačić", "Bruno Miguel Borges Fernandes": "Bruno Fernandes", "Ivan Perišić": "Perišić",
    "Nahuel Molina Lucero": "Molina", "Enzo Fernandez": "Enzo", "Julián Álvarez": "Julián Álvarez",
    "Aurélien Djani Tchouaméni": "Tchouaméni", "Olivier Giroud": "Giroud", "Kylian Mbappé Lottin": "Mbappé",
    "Alexis Mac Allister": "Mac Allister", "Ángel Fabián Di María Hernández": "Di María",
    "Cody Mathès Gakpo": "Gakpo", "Richarlison de Andrade": "Richarlison", "Youssef En-Nesyri": "En-Nesyri",
    "Mehdi Taremi": "Taremi", "Kingsley Coman": "Coman", "Paulo Bruno Exequiel Dybala": "Dybala",
    "Leandro Daniel Paredes": "Paredes", "Randal Kolo Muani": "Kolo Muani", "Gonzalo Ariel Montiel": "Montiel",
    "Lautaro Javier Martínez": "Lautaro", "Marcus Thuram": "Thuram", "Emiliano Martínez": "Dibu Martínez", "Alvaro Borja Morata Martín": "Morata", "Gonçalo Matias Ramos": "Gonçalo Ramos",
}


def corto(n):
    return CORTOS.get(n, n)
