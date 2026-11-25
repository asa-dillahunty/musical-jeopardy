import { useNavigate } from "react-router-dom";

import styles from "./sass/TestPage.module.scss";
import SketchDisplay, { SketchDisplayDTO } from "../components/SketchDisplay";
import { SketchInput } from "../components/SketchInput";
import { useState } from "react";

function TestPage() {
  const navigate = useNavigate();
  const [testSketch, setTestSketch] = useState<SketchDisplayDTO | undefined>();
  const onFinishSketch = (testPath: SketchDisplayDTO) => {
    setTestSketch(testPath);
  };

  return (
    <div className={styles.pageContainer}>
      <button className={styles.menuButton} onClick={() => navigate("/menu")}>
        Menu
      </button>
      <div className={styles.sketchInputContainer}>
        <SketchInput onSubmit={onFinishSketch} disabled={false} />
      </div>

      <div className={styles.sketchDisplayContainer}>
        <SketchDisplay sketch={testSketch} reloadVisible={true} />
      </div>
    </div>
  );
}

export default TestPage;
