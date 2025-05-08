import "./sass/SketchInput.css";

import { useRef, useState } from "react";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";

export default function SketchDisplay({ paths }: { paths?: CanvasPath[] }) {
  const [hidden, setHidden] = useState(true);

  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };

  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const show = () => {
    if (!paths) return;
    setHidden(false);
    canvasRef.current?.loadPaths(paths);
  };

  if (!paths) return <></>;
  return (
    <div className="sketch-wrapper">
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
      {hidden && (
        <button className="show-canvas" onClick={show}>
          Show
        </button>
      )}
    </div>
  );
}
