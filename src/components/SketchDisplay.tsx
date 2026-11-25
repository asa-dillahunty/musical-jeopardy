import { jeopardyBlue } from "../util/exportedStylingVariables";
import styles from "./sass/SketchInput.module.scss";

import { useEffect, useRef, useState } from "react";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";

export type SketchDisplayDTO = {
  paths: CanvasPath[];
  width: number;
  height: number;
};

export default function SketchDisplay({
  sketch,
  reloadVisible,
}: {
  sketch?: SketchDisplayDTO;
  reloadVisible?: boolean;
}) {
  const [hidden, setHidden] = useState(true);
  const boundaryRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const show = () => {
    if (!sketch?.paths) return;
    if (!canvasRef.current) return;
    setHidden(false);
    canvasRef.current.clearCanvas();
    canvasRef.current.loadPaths(sketch.paths);
  };

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (!boundaryRef.current) return;
    if (!sketch) return;
    wrapperRef.current.style.width = `${sketch.width}px`;
    wrapperRef.current.style.height = `${sketch.height}px`;

    const widthScale =
      boundaryRef.current?.getBoundingClientRect().width / sketch.width;
    const heightScale =
      boundaryRef.current?.getBoundingClientRect().height / sketch.height;

    wrapperRef.current.style.scale =
      widthScale < heightScale ? widthScale.toString() : heightScale.toString();

    // console.log(widthScale < heightScale, wrapperRef.current.style.scale);
  }, [wrapperRef.current, sketch]);

  // sketch display should fill it's parent as well as it can, then normalize the picture so that it can be displayed inside
  if (!sketch?.paths) return <></>;
  return (
    <div ref={boundaryRef} className={styles.sketchDisplayBoundary}>
      <div ref={wrapperRef} className={styles.sketchDisplayWrapper}>
        <ReactSketchCanvas
          ref={canvasRef}
          className={styles.sketchCanvas}
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
    </div>
  );
}
