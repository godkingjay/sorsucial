import React, { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

export type DropdownOption = {
	label: string;
	value: string;
	icon?: React.ReactElement;
};

type CustomDropdownProps = {
	options: DropdownOption[];
	defaultValue?: DropdownOption;
	disabled?: boolean;
	onSelect: (value: string) => void;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
	options,
	defaultValue,
	disabled = false,
	onSelect,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
		defaultValue || null
	);

	const handleOptionSelect = (option: DropdownOption) => {
		setSelectedOption(option);
		setIsOpen(false);
		onSelect(option.value);
	};

	return (
		<div className="relative flex flex-col w-full max-w-[128px] h-8 justify-center">
			<div>
				<button
					type="button"
					className="flex flex-row items-center gap-x-2 w-full h-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-100 focus-within:bg-gray-100 focus:outline-1 focus:outline focus:outline-indigo-500"
					onClick={() => setIsOpen(!isOpen)}
					disabled={disabled}
				>
					<div className="h-4 w-4 aspect-square">{selectedOption?.icon}</div>
					<div className="flex-1 flex-row flex items-center truncate">
						{selectedOption?.label || "Select an option"}
					</div>
					<div
						className={`
              h-4 w-4 aspect-square duration-100
              ${isOpen ? "transform rotate-180" : ""}
            `}
					>
						<RiArrowDownSLine className="h-full w-full" />
					</div>
				</button>
			</div>
			{isOpen && (
				<div className="origin-top-right absolute left-0 top-[110%] rounded-md w-full shadow-md bg-white ring-1 ring-black ring-opacity-5">
					<div
						className="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						{options.map((option) => (
							<button
								key={option.value}
								type="button"
								title={option.label}
								className="flex flex-row items-center w-full gap-x-4 h-full p-2 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								role="menuitem"
								onClick={() => handleOptionSelect(option)}
								disabled={disabled}
							>
								<div className="h-5 w-5 aspect-square">{option.icon}</div>
								<div className="flex-1 flex-row flex items-center truncate">
									{option.label || "Select an option"}
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomDropdown;
