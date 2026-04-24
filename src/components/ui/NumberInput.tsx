import { useEffect } from "react";
import { AiOutlineDownSquare, AiOutlineUpSquare } from "react-icons/ai";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import styles from "./sass/NumberInput.module.scss";

interface NumberInputProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
  maxVal: number;
  minVal: number;
  incPerDigit?: boolean;
  topLabel?: boolean;
  includePlusMinus?: boolean;
  plusFunc?: () => void;
  minusFunc?: () => void;
}

const NumberInput = ({
  label,
  value,
  setValue,
  maxVal,
  minVal,
  incPerDigit,
  topLabel,
  includePlusMinus = false,
  plusFunc,
  minusFunc,
}: NumberInputProps) => {
  const handleIncrement = (place: number) => {
    if (value < maxVal) setValue(value + 10 ** place);
  };

  const handleDecrement = (place: number) => {
    if (value > minVal) setValue(value - 10 ** place);
  };

  useEffect(() => {
    // if value is outside of bounds, put it to the closest bound
    if (value < minVal) setValue(minVal);
    else if (value > maxVal) setValue(maxVal);
  }, [value, setValue, maxVal, minVal]);

  if (incPerDigit) {
    const maxDigits = Math.ceil(Math.log10(maxVal + 1));
    const valueString = value.toString().padStart(maxDigits, "0");

    let digits = [];
    for (let i = 0; i < maxDigits; i++) {
      digits.push(
        <div className={styles.numberInputContainer} key={i}>
          <AiOutlineUpSquare
            onClick={() => handleIncrement(maxDigits - i - 1)}
          />
          <div className={styles.numberInputValue}> {valueString[i]} </div>
          <AiOutlineDownSquare
            onClick={() => handleDecrement(maxDigits - i - 1)}
          />
        </div>,
      );
    }

    if (includePlusMinus) {
      digits.push(
        <div className={styles.numberInputContainer} key={maxDigits}>
          <button className={styles.failure} onClick={minusFunc}>
            <FaXmark />
          </button>
          <button className={styles.success} onClick={plusFunc}>
            <FaCheck />
          </button>
        </div>,
      );
    }

    if (topLabel) {
      return (
        <div className={styles.compactNumberInputs + " " + styles.topLabel}>
          <div className={styles.numberLabel}>{label}</div>
          <div className={styles.numberInputDigits}>
            {digits.map((digit) => digit)}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.compactNumberInputs}>
        <div className={styles.numberLabel}>{label}</div>
        {digits.map((digit) => digit)}
      </div>
    );
  }
  return (
    <div className={styles.compactNumberInputs}>
      <div className={styles.numberLabel}>{label}</div>
      <div className={styles.numberInputValue}>{value}</div>
      <div className={styles.numberInputContainer}>
        <AiOutlineUpSquare onClick={() => handleIncrement(0)} />
        <AiOutlineDownSquare onClick={() => handleDecrement(0)} />
      </div>
    </div>
  );
};

export default NumberInput;
