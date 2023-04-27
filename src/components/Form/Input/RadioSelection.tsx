import React, { useState } from "react";

export type RadioSelectionOption = {
	icon?: React.ReactElement;
	label: string;
	value: string;
};

type RadioSelectionProps = {
	title?: string;
	options: RadioSelectionOption[];
	selected: string;
	disabled?: boolean;
	onChange: (value: string) => void;
};

const RadioSelection: React.FC<RadioSelectionProps> = ({
	title,
	options,
	selected,
	disabled = false,
	onChange,
}) => {
	const handleOptionChange = (value: string) => {
		if (!disabled) {
			onChange(value);
		}
	};

	return (
		<div className="radio-selection">
			{title && (
				<div className="title-container">
					<p className="title">{title}</p>
				</div>
			)}
			<div className="selection-container">
				{options.map((option) => (
					<label
						key={option.value}
						className="selection-item"
						title={option.label}
						data-selected={selected === option.value}
					>
						<input
							type="radio"
							className="radio-button"
							value={option.value}
							checked={selected === option.value}
							disabled={disabled}
							onChange={() => handleOptionChange(option.value)}
						/>
						{option.icon && <div className="icon-container">{option.icon}</div>}
						<span className="label">{option.label}</span>
					</label>
				))}
			</div>
		</div>
	);
};

export default RadioSelection;
