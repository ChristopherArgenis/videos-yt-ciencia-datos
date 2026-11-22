import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (public/fonts) para que el render no dependa de internet.
// Poppins no trae superíndices (⁴ ⁿ ˣ), √, ≈ ni ≠: "Inter Simbolos" (subconjunto de Inter, OFL) los cubre.
export const FONT = "Poppins, 'Inter Simbolos'";
export const MONO = "JetBrains Mono";

Promise.all([
  loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-600.woff2"), weight: "600" }),
  loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-800.woff2"), weight: "800" }),
  loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-900.woff2"), weight: "900" }),
  loadFont({ family: MONO, url: staticFile("fonts/JetBrainsMono-700.woff2"), weight: "700" }),
  ...(["SemiBold:600", "ExtraBold:800", "Black:900"] as const).map((x) => {
    const [n, w] = x.split(":");
    return loadFont({ family: "Inter Simbolos", url: staticFile(`fonts/InterSimbolos-${n}.woff2`), weight: w });
  }),
]);

export const C = {
  bg: "#0b1020",
  bg2: "#18204a",
  ink: "#ffffff",
  dim: "#a3abd6",
  green: "#3ddc84",
  yellow: "#ffd166",
  coral: "#ff6b5b",
  blue: "#5b8cff",
  purple: "#c792ea",
};

export const HANDLE = "@UniversoCienciaDatos";

/** Tamaño de los videos largos de YouTube (16:9). */
export const W = 1920;
export const H = 1080;
export const FPS = 30;
