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
