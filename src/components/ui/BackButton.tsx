import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

import styles from "./sass/BackButton.module.scss";

interface BackButtonProps {
  path: string;
}

function BackButton({ path }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(path)} className={styles.backButton}>
      <FaAngleLeft /> Back
    </button>
  );
}

export default BackButton;
