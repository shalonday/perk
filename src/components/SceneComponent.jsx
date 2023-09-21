import { Engine, Scene } from "@babylonjs/core";
import { useEffect, useRef } from "react";

export default function SceneComponent({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  ...rest
}) {
  const reactCanvasRef = useRef(null);

  // set up basic engine and scene
  useEffect(
    function () {
      const canvas = reactCanvasRef.current;
      if (!canvas) return;

      const engine = new Engine(
        canvas,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );
      const scene = new Scene(engine, sceneOptions);

      if (scene.isReady()) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") onRender(scene);
        scene.render();
      });

      function resize() {
        scene.getEngine().resize();
      }

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        scene.getEngine().dispose();
        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    },
    [
      antialias,
      engineOptions,
      adaptToDeviceRatio,
      sceneOptions,
      onRender,
      onSceneReady,
    ]
  );

  return <canvas ref={reactCanvasRef} {...rest} />;
}
