import styles from "./sass/SketchInput.module.scss";

import { useRef } from "react";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FaEraser } from "react-icons/fa6";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { jeopardyBlue } from "../util/exportedStylingVariables";

export function SketchInput({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (val: CanvasPath[]) => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const onFinishSketch = () => {
    if (!canvasRef.current) return;
    canvasRef.current.exportPaths().then((val) => {
      onSubmit(val);
    });
    // right now this just downloads the image.
    // eventually we want this to do something else
    // canvasRef.current
    //   .exportImage("png")
    //   .then((data) => {
    //     const link = document.createElement("a");
    //     link.href = data;
    //     link.download = "drawing";
    //     link.click();
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  return (
    <div className={styles.sketchWrapper}>
      <div className={styles.buttonToolbar}>
        <button
          onClick={() => canvasRef.current?.clearCanvas()}
          disabled={disabled}
        >
          <FaEraser />
        </button>
        <button onClick={() => canvasRef.current?.undo()} disabled={disabled}>
          <FaUndo />
        </button>
        <button onClick={() => canvasRef.current?.redo()} disabled={disabled}>
          <FaRedo />
        </button>
      </div>
      <ReactSketchCanvas
        ref={canvasRef}
        className={styles.sketchCanvas}
        width="600"
        height="400"
        strokeWidth={15}
        strokeColor="white"
        canvasColor={jeopardyBlue}
      />
      {!disabled && (
        <button
          className={styles.submitButton}
          onClick={onFinishSketch}
          disabled={disabled}
        >
          Submit
        </button>
      )}
    </div>
  );
}
