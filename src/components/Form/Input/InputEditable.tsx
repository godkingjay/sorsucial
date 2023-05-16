import React, { useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";

type InputEditableProps = {
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	title: string;
	placeholder?: string;
	name: string;
	type: HTMLInputElement["type"];
};

const InputEditable: React.FC<InputEditableProps> = ({
	value,
	setValue,
	title = "Title",
	placeholder,
	name,
	type = "text",
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const inputBoxRef = useRef<HTMLInputElement>(null);

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	useEffect(() => {
		if (inputBoxRef.current && isEditing) {
			inputBoxRef.current.focus();
		}
	}, [isEditing]);

	return (
		<>
			<div
				className="
          py-2 px-4 relative flex flex-row items-center gap-x-4 rounded-md border border-transparent text-gray-700 group
          data-[edit=true]:bg-gray-100 data-[edit=true]:focus-within:border-blue-500
        "
				data-edit={isEditing}
			>
				<p className="absolute top-0 left-1 text-2xs -translate-y-[50%] font-semibold group-data-[edit=true]:group-focus-within:bg-gray-100 px-1 rounded-sm">
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
					className="group-data-[edit=false]:hidden min-w-0 w-auto text-sm outline-none"
				/>
				<button
					type="button"
					title="Edit"
					className="text-blue-500 group-data-[edit=true]:hidden hover:text-blue-700 focus:text-blue-700"
					onClick={() => !isEditing && handleEdit()}
				>
					<FiEdit className="h-full w-full" />
				</button>
			</div>
		</>
	);
};

export default InputEditable;
