import React, { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

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
	type?: HTMLInputElement["type"];
	setValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
	style?: React.CSSProperties;
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
	type,
	setValue,
	style,
}) => {
	const inputBoxRef = useRef<HTMLInputElement>(null);
	const [show, setShow] = useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event);
	};

	const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (inputBoxRef.current) {
			inputBoxRef.current.focus();
		}
	};

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
			style={style}
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
				type={
					type === "password"
						? show
							? "text"
							: "password"
						: type || type || "text"
				}
				value={value}
				onChange={handleInputChange}
				ref={inputBoxRef}
				min={minLength || 0}
				minLength={minLength || 0}
				max={maxLength || 256}
				maxLength={maxLength || 256}
			/>
			{type === "password" && (
				<button
					type="button"
					title={show ? `Hide ${label}` : `Show ${label}`}
					className="show-button"
					onClick={() => setShow((prev) => !prev)}
				>
					{show ? (
						<AiFillEye className="icon" />
					) : (
						<AiFillEyeInvisible className="icon" />
					)}
				</button>
			)}
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
