import React, { useRef } from "react";

type InputBoxFloatingLabelProps = {
	name: string;
	label: string;
	placeholder: string;
	required?: boolean;
	error?: boolean;
	info?: string;
	infoHidden?: boolean;
	value: string;
	minLength?: number;
	maxLength?: number;
	setValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputBoxFloatingLabel: React.FC<InputBoxFloatingLabelProps> = ({
	name,
	label,
	placeholder,
	required,
	error,
	info,
	infoHidden,
	value,
	minLength,
	maxLength,
	setValue,
}) => {
	const inputBoxRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event);
	};

	const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (inputBoxRef.current) {
			inputBoxRef.current.focus();
		}
	};

	console.log({
		value,
		infoHidden,
	});

	return (
		<div
			className="input-box-with-label"
			data-filled={value !== ""}
			data-required={required || false}
			data-error={
				error ||
				(value.trim().length < (minLength || 0) &&
					value.trim().length !== 0 &&
					value)
					? true
					: false || false
			}
			onClick={handleContainerClick}
		>
			<label
				className="label"
				htmlFor={name}
			>
				{label}
			</label>
			<input
				name={name}
				required={required || false}
				title={placeholder}
				className="input-box"
				type="text"
				value={value}
				onChange={handleInputChange}
				ref={inputBoxRef}
				min={minLength || 0}
				minLength={minLength || 0}
				max={maxLength || 256}
				maxLength={maxLength || 256}
			/>
			{info && !infoHidden && (
				<div
					className="input-info"
					data-error={infoHidden || !infoHidden}
				>
					<p className="text">{info}</p>
				</div>
			)}
		</div>
	);
};

export default InputBoxFloatingLabel;
