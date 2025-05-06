import "./sass/SketchInput.css";

import { useRef } from "react";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FaEraser } from "react-icons/fa6";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

export function SketchInput() {
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const onFinishSketch = () => {
    if (!canvasRef.current) return;
    // right now this just downloads the image.
    // eventually we want this to do something else
    canvasRef.current.exportPaths().then((val) => {
      console.log(val);
    });
    canvasRef.current
      .exportImage("png")
      .then((data) => {
        const link = document.createElement("a");
        link.href = data;
        link.download = "drawing";
        link.click();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="sketch-wrapper">
      <div className="button-toolbar">
        <button
          className="clear-sketch"
          onClick={() => canvasRef.current?.clearCanvas()}
        >
          <FaEraser />
        </button>
        <button
          className="undo-sketch"
          onClick={() => canvasRef.current?.undo()}
        >
          <FaUndo />
        </button>
        <button
          className="redo-sketch"
          onClick={() => canvasRef.current?.redo()}
        >
          <FaRedo />
        </button>
      </div>
      <ReactSketchCanvas
        ref={canvasRef}
        className="sketch-canvas"
        style={styles}
        width="600"
        height="400"
        strokeWidth={15}
        strokeColor="white"
        canvasColor="rgb(0, 0, 137)"
      />
      <button className="done" onClick={onFinishSketch}>
        Done
      </button>
    </div>
  );
}
