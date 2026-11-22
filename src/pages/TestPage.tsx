import { useNavigate } from "react-router-dom";

import styles from "./sass/TestPage.module.scss";
import SketchDisplay from "../components/SketchDisplay";
import { SketchInput } from "../components/SketchInput";
import { useState } from "react";
import { CanvasPath } from "react-sketch-canvas";

function TestPage() {
  const navigate = useNavigate();
  const [testCanvasPath, setTestCanvasPath] = useState<CanvasPath[]>([]);
  const onFinishSketch = (testPath: CanvasPath[]) => {
    setTestCanvasPath(testPath);
  };

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => navigate("/menu")}>
        Menu
      </button>
      <div className={styles.sketchInputContainer}>
        <SketchInput onSubmit={onFinishSketch} disabled={false} />
      </div>

      <div className={styles.sketchDisplayContainer}>
        <SketchDisplay paths={testCanvasPath} reloadVisible={true} />
      </div>
    </div>
  );
}

export default TestPage;
