import styles from "./sass/SketchInput.module.scss";

import { useRef } from "react";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FaEraser } from "react-icons/fa6";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { jeopardyBlue } from "../util/exportedStylingVariables";
import { SketchDisplayDTO } from "./SketchDisplay";

export function SketchInput({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (val: SketchDisplayDTO) => void;
  disabled?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const onFinishSketch = () => {
    if (!wrapperRef.current) return;
    if (!canvasRef.current) return;

    const h = wrapperRef.current.getBoundingClientRect().height;
    const w = wrapperRef.current.getBoundingClientRect().width;

    canvasRef.current.exportPaths().then((val) => {
      const sketch = { height: h, width: w, paths: val };
      console.log(sketch);
      onSubmit(sketch);
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
    <div ref={wrapperRef} className={styles.sketchWrapper}>
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
