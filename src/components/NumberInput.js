import React, { useEffect } from "react";
import './NumberInput.css';
import { AiOutlineDownSquare, AiOutlineUpSquare } from "react-icons/ai";

const NumberInput = ({ label, value, setValue, maxVal, minVal }) => {

	const handleIncrement = () => {
		if (value < maxVal) setValue(value + 1);
	};

	const handleDecrement = () => {
		if (value > minVal) setValue(value - 1);
	};

	useEffect(() => {
		// if value is outside of bounds, put it to the closest bound
		if (value < minVal) setValue(minVal);
		else if (value > maxVal) setValue(maxVal);
	}, [value, setValue, maxVal, minVal])

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