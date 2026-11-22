import { jeopardyBlue } from "../util/exportedStylingVariables";
import styles from "./sass/SketchInput.module.scss";

import { useRef, useState } from "react";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";

export default function SketchDisplay({
  paths,
  reloadVisible,
}: {
  paths?: CanvasPath[];
  reloadVisible?: boolean;
}) {
  const [hidden, setHidden] = useState(true);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const show = () => {
    if (!paths) return;
    if (!canvasRef.current) return;
    setHidden(false);
    canvasRef.current.clearCanvas();
    canvasRef.current.loadPaths(paths);
  };

  if (!paths) return <></>;
  return (
    <div className={styles.sketchWrapper}>
      <ReactSketchCanvas
        ref={canvasRef}
        className={styles.sketchCanvas}
        width="600"
        height="400"
        strokeWidth={15}
        strokeColor="white"
        canvasColor={jeopardyBlue}
        readOnly
      />
      {hidden && (
        <div className={styles.buttonPositioner}>
          <button className={styles.showCanvas} onClick={show}>
            Show
          </button>
        </div>
      )}
      {reloadVisible && (
        <button className={styles.reloadButton} onClick={show}>
          Reload
        </button>
      )}
    </div>
  );
}
