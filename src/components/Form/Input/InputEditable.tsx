import React, { useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";

type InputEditableProps = {
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	title: string;
	placeholder?: string;
	name: string;
	type: HTMLInputElement["type"];
	regex?: RegExp;
	disabled?: boolean;
	message?: {
		errorRegex?: string;
	};
	onError?: () => void;
};

const InputEditable: React.FC<InputEditableProps> = ({
	value,
	setValue,
	title = "Title",
	placeholder,
	name,
	type = "text",
	regex,
	disabled = false,
	message,
	onError,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [errorRegex, setErrorRegex] = useState(false);

	const inputBoxRef = useRef<HTMLInputElement>(null);

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);

		if (regex) {
			setErrorRegex(
				event.target.value ? !regex.test(event.target.value) : false
			);
		}
	};

	useEffect(() => {
		if (inputBoxRef.current && isEditing) {
			inputBoxRef.current.focus();
		}
	}, [isEditing]);

	useEffect(() => {
		if (onError) {
			onError();
		}
	}, [errorRegex]);

	return (
		<>
			<div
				className="
          py-2 px-4 relative flex flex-row items-center gap-x-4 rounded-md border border-transparent text-gray-700 group
          data-[edit=true]:bg-gray-100 data-[edit=true]:focus-within:border-blue-500
					data-[error=true]:!border-red-500 data-[error=true]:!text-red-500
        "
				data-edit={isEditing}
				data-error={errorRegex}
				data-error-regex={errorRegex}
			>
				<p className="absolute top-0 left-1 text-2xs -translate-y-[50%] font-semibold group-data-[edit=true]:bg-gray-100 group-data-[error=true]:bg-red-100 px-1 rounded-sm">
					{title}
				</p>
				<p className="group-data-[edit=true]:hidden text-sm truncate">{value}</p>
				<input
					type={type}
					title={title}
					value={value}
					name={name}
					onChange={handleChange}
					ref={inputBoxRef}
					placeholder={placeholder}
					pattern={regex?.source}
					className="group-data-[edit=false]:hidden min-w-0 w-auto text-sm outline-none disabled:pointer-events-none"
					disabled={disabled}
				/>
				<button
					type="button"
					title="Edit"
					className="text-blue-500 group-data-[edit=true]:hidden hover:text-blue-700 focus:text-blue-700 disabled:grayscale disabled:pointer-events-none"
					onClick={() => !isEditing && !disabled && handleEdit()}
					disabled={disabled}
				>
					<FiEdit className="h-full w-full" />
				</button>
				{regex && (
					<>
						<div className="z-[1] duration-200 opacity-0 -translate-y-1 group-data-[error-regex=true]:opacity-100 group-data-[error-regex=true]:translate-y-0 absolute w-full top-[105%] rounded-md left-0 p-2 bg-red-500 text-white text-xs">
							<p className="whitespace-pre-wrap">{message?.errorRegex}</p>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default InputEditable;
