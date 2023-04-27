import React, { ChangeEvent } from "react";

type TextAreaProps = {
	name: string;
	title: string;
	showLabel?: boolean;
	placeholder: string;
	required?: boolean;
	error?: boolean;
	info?: string;
	infoHidden?: boolean;
	minLength?: number;
	maxLength?: number;
	value: string;
	disabled?: boolean;
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	style?: React.CSSProperties;
	textBoxStyle?: React.CSSProperties;
};

const TextArea = ({
	name,
	title,
	showLabel,
	placeholder,
	required,
	error,
	info,
	infoHidden,
	value,
	minLength,
	maxLength,
	disabled = false,
	onChange,
	style,
	textBoxStyle,
}: TextAreaProps) => {
	const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		if (!disabled) {
			onChange(event);
			event.currentTarget.style.height = "0px";
			event.currentTarget.style.height = event.currentTarget.scrollHeight + "px";
		}
	};

	return (
		<div
			className="input-text-area"
			data-required={required || false}
		>
			{title && showLabel && (
				<div className="label-container">
					<label
						htmlFor={title}
						className="label"
					>
						{title}
					</label>
				</div>
			)}
			<div
				className="text-area-container"
				style={style}
			>
				<textarea
					required={required || false}
					id={name}
					name={name}
					placeholder={placeholder}
					className="text-area"
					value={value}
					title={title}
					minLength={minLength || 0}
					maxLength={maxLength || Number.MAX_SAFE_INTEGER}
					disabled={disabled}
					onChange={handleTextChange}
					style={textBoxStyle}
					role="textbox"
				/>
				{maxLength && (
					<div className="limit-container">
						<p
							className="text"
							data-limit={value.length === maxLength}
						>
							{maxLength - value.length}/{maxLength}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TextArea;
