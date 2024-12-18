import React, { useEffect } from "react";
import './NumberInput.css';
import { AiOutlineDownSquare, AiOutlineUpSquare } from "react-icons/ai";

const NumberInput = ({ label, value, setValue, maxVal, minVal, incPerDigit }) => {

	const handleIncrement = (place) => {
		if (value < maxVal) setValue(value + (10**place));
	};

	const handleDecrement = (place) => {
		if (value > minVal) setValue(value - (10**place));
	};

	useEffect(() => {
		// if value is outside of bounds, put it to the closest bound
		if (value < minVal) setValue(minVal);
		else if (value > maxVal) setValue(maxVal);
	}, [value, setValue, maxVal, minVal])

	if (incPerDigit) {
		const maxDigits = Math.ceil(Math.log10(maxVal+1));
		const valueString = value.toString().padStart(maxDigits, '0');

		let digits = []
		for (let i = 0; i < maxDigits; i++) {
			digits.push(
				<div className="number-input-button-container">
					<AiOutlineUpSquare onClick={() => handleIncrement(maxDigits - i - 1)} />
					<div className="number-input-value"> { valueString[i] } </div>
					<AiOutlineDownSquare onClick={() => handleDecrement(maxDigits - i - 1)} />
				</div>
			)
		}

		return (
			<div className="compact-number-inputs">
				<div className="number-input-label">{label}</div>
				{ digits.map((digit) => digit) }
			</div>
		);

	}
	return (
		<div className="compact-number-inputs">
			<div className="number-input-label">{label}</div>
			<div className="number-input-value">{value}</div>
			<div className="number-input-button-container">
				<AiOutlineUpSquare onClick={() => handleIncrement(0)} />
				<AiOutlineDownSquare onClick={() => handleDecrement(0)} />
			</div>
		</div>
	);
};

export default NumberInput;