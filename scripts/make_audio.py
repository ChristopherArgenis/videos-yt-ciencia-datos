"""Genera música en bucle y efectos originales (sin copyright) para los videos largos.

    python3 scripts/make_audio.py

Igual que en shorts-ciencia-datos, pero la música es un bucle exacto de 16 compases
(Remotion lo repite con `loop`), más suave para escuchar varios minutos.
Salida: public/musica/*.wav (mono) y public/sfx/*.wav.
"""
import numpy as np, wave, os

SR = 44100
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")


def save(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(out, start, sig):
    """Suma `sig` en `out` desde `start`, dando la vuelta al final (bucle sin cortes)."""
    n = len(out)
    idx = (start + np.arange(len(sig))) % n
    np.add.at(out, idx, sig)


def loop(bpm, chords, seed, compases=16, bateria=0.6):
    rng = np.random.default_rng(seed)
    beat = 60 / bpm
    bar = beat * 4
    n = int(round(compases * bar * SR))
    out = np.zeros(n)
    for i in range(compases):
        ch = chords[i % len(chords)]
        s = int(i * bar * SR)
        L = int(bar * SR) + int(0.4 * SR)
        t = np.arange(L) / SR
        pad = sum(np.sin(2 * np.pi * note(m) * t) + 0.3 * np.sin(2 * np.pi * note(m) * 2.003 * t) for m in ch)
        fade = np.minimum(1, t / 0.4) * np.clip((bar + 0.4 - t) / 0.4, 0, 1)
        add(out, s, 0.05 * pad * fade)
        for k in range(4):  # bajo en cada tiempo
            L2 = int(beat * SR); t2 = np.arange(L2) / SR
            add(out, s + int(k * beat * SR), 0.14 * np.sin(2 * np.pi * note(ch[0] - 12) * t2) * np.exp(-t2 / 0.5))
        for k in range(8):  # arpegio
            m = ch[(k * 2 + i) % len(ch)] + 12
            L3 = int(0.35 * SR); t3 = np.arange(L3) / SR
            add(out, s + int(k * beat / 2 * SR), 0.04 * np.sin(2 * np.pi * note(m) * t3) * env(L3, 0.002, 0.12))
    for k in range(compases * 4):  # batería suave
        s = int(k * beat * SR)
        if k % 2 == 0:
            L = int(0.3 * SR); t = np.arange(L) / SR
            f = 50 + 90 * np.exp(-t * 30)
            add(out, s, bateria * 0.45 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9))
        else:
            L = int(0.2 * SR); t = np.arange(L) / SR
            add(out, s, bateria * 0.08 * rng.standard_normal(L) * np.exp(-t * 22))
        for h in (0, 0.5):
            L = int(0.05 * SR)
            hn = rng.standard_normal(L); hn = hn - np.convolve(hn, np.ones(4) / 4, "same")
            add(out, int((k + h) * beat * SR), bateria * 0.035 * hn * np.exp(-np.arange(L) / SR * 80))
    return out / max(1e-9, np.abs(out).max()) * 0.8


M = os.path.join(ROOT, "musica")
save(os.path.join(M, "explica.wav"), loop(92, [[62, 65, 69], [58, 62, 65], [60, 64, 67], [57, 60, 64]], 4))
save(os.path.join(M, "curiosa.wav"), loop(96, [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], 1))
save(os.path.join(M, "tranquila.wav"), loop(84, [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]], 3, bateria=0.35))
save(os.path.join(M, "tension.wav"), loop(104, [[50, 53, 57], [46, 50, 53], [53, 57, 60], [52, 56, 59]], 2))
print("música ok")
