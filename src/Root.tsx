import { Composition, Folder, Still } from "remotion";
import { FPS, H, W } from "./kit/theme";
import { planificar } from "./kit/largo";
import { MINI_H, MINI_W } from "./kit/miniatura";
import { Plantilla, PLANTILLA } from "./videos/Plantilla";
import { MiniPlantilla } from "./miniaturas/Miniaturas";

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
    </Folder>
    <Folder name="Miniaturas">
      <Still id="Mini-00-Plantilla" component={MiniPlantilla} width={MINI_W} height={MINI_H} />
    </Folder>
  </>
);
