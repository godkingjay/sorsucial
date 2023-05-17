import React, { useState } from "react";

export type RadioSelectionOption = {
	icon?: React.ReactElement;
	label: string;
	value: string;
};

type RadioSelectionProps = {
	title?: string;
	options: (RadioSelectionOption & any)[];
	selected: string;
	disabled?: boolean;
	required?: boolean;
	onChange: (value: string) => void;
};

const RadioSelection: React.FC<RadioSelectionProps> = ({
	title,
	options,
	selected,
	disabled = false,
	required = false,
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
							required={required}
							type="radio"
							className="radio-button"
							value={option.value}
							checked={selected === option.value}
							disabled={disabled}
							onChange={() => handleOptionChange(option.value)}
						/>
						<div className="info-container">
							<div className="item-label-container">
								{option.icon && (
									<div className="icon-container">{option.icon}</div>
								)}
								<p className="label">{option.label}</p>
							</div>
							{option.description && (
								<p className="description">{option.description}</p>
							)}
						</div>
					</label>
				))}
			</div>
		</div>
	);
};

export default RadioSelection;
