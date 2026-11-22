import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const B = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const [comp, out, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const c = await selectComposition({ serveUrl, id: comp, browserExecutable: B });
for (const f of frames) {
  await renderStill({ composition: c, serveUrl, frame: +f, output: `${out}/f${f}.png`, scale: 0.5, browserExecutable: B });
  console.log("ok", f);
}
