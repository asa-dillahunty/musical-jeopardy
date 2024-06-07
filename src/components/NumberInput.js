import React from "react";
import './NumberInput.css';
import { AiOutlineDownSquare, AiOutlineUpSquare } from "react-icons/ai";

const NumberInput = ({ label, value, setValue, maxVal, minVal }) => {

	const handleIncrement = () => {
		if (value < maxVal) setValue(value + 1);
	};

	const handleDecrement = () => {
		if (value > minVal) setValue(value - 1);
	};

	return (
		<div className="compact-number-inputs">
			<div className="number-input-label">{label}</div>
			<div className="number-input-value">{value}</div>
			<div className="number-input-button-container">
				<AiOutlineUpSquare onClick={handleIncrement} />
				<AiOutlineDownSquare onClick={handleDecrement} />
			</div>
		</div>
	);
};

export default NumberInput;