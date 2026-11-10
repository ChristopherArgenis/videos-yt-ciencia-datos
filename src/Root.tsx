import { Composition, Folder, Still } from "remotion";
import { FPS, H, W } from "./kit/theme";
import { planificar } from "./kit/largo";
import { MINI_H, MINI_W } from "./kit/miniatura";
import { Plantilla, PLANTILLA } from "./videos/Plantilla";
import { MiniFutbol01, MiniFutbol02, MiniPlantilla } from "./miniaturas/Miniaturas";
import { V01, V01FutbolDatos } from "./videos/V01FutbolDatos";
import { V02, V02Xg } from "./videos/V02Xg";

// Cada video largo: <Composition id="NN-Nombre"> con la duración que sale de su guion.
// Cada miniatura: <Still id="Mini-NN-Nombre"> de 1280×720.

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Videos">
      <Composition
        id="00-Plantilla"
        component={Plantilla}
        durationInFrames={planificar(PLANTILLA).total}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="01-FutbolDatos"
        component={V01FutbolDatos}
        durationInFrames={planificar(V01).total}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="02-Xg"
        component={V02Xg}
        durationInFrames={planificar(V02).total}
        fps={FPS}
        width={W}
        height={H}
      />
    </Folder>
    <Folder name="Miniaturas">
      <Still id="Mini-00-Plantilla" component={MiniPlantilla} width={MINI_W} height={MINI_H} />
      <Still id="Mini-01-FutbolDatos" component={MiniFutbol01} width={MINI_W} height={MINI_H} />
      <Still id="Mini-02-Xg" component={MiniFutbol02} width={MINI_W} height={MINI_H} />
    </Folder>
  </>
);
