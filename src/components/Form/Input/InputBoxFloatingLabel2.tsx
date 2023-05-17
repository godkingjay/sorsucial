import { title } from "process";
import React, { useRef, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type InputBoxFloatingLabel2Props = {
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	title: string;
	placeholder?: string;
	name: string;
	type: HTMLInputElement["type"];
	regex?: RegExp;
	required?: boolean;
	disabled?: boolean;
	minLength?: number;
	maxLength?: number;
	isError?: boolean;
	message?: {
		info?: string;
		error?: string;
	};
	style?: {
		size?: "xs" | "sm" | "md" | "lg" | "xl";
		boxStyle?: React.CSSProperties;
	};
};

const InputBoxFloatingLabel2: React.FC<InputBoxFloatingLabel2Props> = ({
	value,
	setValue,
	title = "Title",
	placeholder,
	name,
	type = "text",
	regex,
	required = false,
	disabled = false,
	minLength,
	maxLength,
	isError = false,
	message = {
		error: "Something is wrong with the input.",
	},
	style = {
		size: "md",
	},
}) => {
	const [show, setShow] = useState(false);
	const [error, setError] = useState(false);

	const inputBoxRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!disabled) {
			const { value: input } = event.target;

			setValue(input);
			setError(
				input
					? ((regex ? !regex.test(input) : false) ||
							(minLength ? minLength > input.length : false) ||
							(maxLength ? input.length > maxLength : false)) &&
							input !== ""
					: false
			);
		}
	};

	const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (inputBoxRef.current) {
			inputBoxRef.current.focus();
		}
	};

	return (
		<>
			<div
				className="
          flex flex-row items-center gap-x-2 relative p-2 border border-transparent rounded-md text-gray-700
          bg-gray-100 w-full cursor-text
          group/input-box
          data-[error=true]:!border-red-500
        "
				data-filled={value !== ""}
				data-required={required || false}
				data-error={error || isError || false}
				onClick={handleContainerClick}
				style={style.boxStyle}
			>
				<label
					className={`
            absolute transition-all left-1 px-1 pointer-events-none font-bold uppercase duration-300
            text-gray-500 top-[50%] translate-y-[-50%] text-xs
            group-data-[filled=true]/input-box:top-1 group-data-[filled=true]/input-box:translate-y-0 group-data-[filled=true]/input-box:text-3xs
            group-hover/input-box:top-1 group-hover/input-box:translate-y-0 group-hover/input-box:text-3xs
            group-focus-within/input-box:top-1 group-focus-within/input-box:translate-y-0 group-focus-within/input-box:text-3xs
            group-data-[error=true]/input-box:text-red-500
          `}
					htmlFor={name}
				>
					{title}
					{required && <span className="text-red-500 pl-1">*</span>}
				</label>
				<input
					name={name}
					required={required || false}
					title={placeholder}
					className="
            flex-1 outline-none duration-300 px-1 origin-bottom text-sm pt-3
            group-data-[error=true]/input-box:text-red-500
          "
					type={
						type === "password" ? (show ? "text" : "password") : type || "text"
					}
					value={value}
					onChange={handleInputChange}
					ref={inputBoxRef}
					min={minLength || 0}
					minLength={minLength || 0}
					max={maxLength || 256}
					maxLength={maxLength || 256}
					disabled={disabled}
					pattern={regex ? regex.source : undefined}
					role="textbox"
				/>
				{type === "password" && (
					<button
						type="button"
						title={show ? `Hide ${title}` : `Show ${title}`}
						className="aspect-square h-5 w-5 text-gray-500 text-opacity-50"
						onClick={() => setShow((prev) => !prev)}
						role="button"
					>
						{show ? (
							<AiFillEye className="h-full w-full" />
						) : (
							<AiFillEyeInvisible className="h-full w-full" />
						)}
					</button>
				)}
				<div
					className="
          z-10 absolute p-3 text-xs -translate-y-2 opacity-0 duration-100 text-white w-full top-[110%] left-0 rounded-md bg-red-500
          whitespace-pre-wrap break-words pointer-events-none
          group-data-[error=true]/input-box:group-focus-within/input-box:opacity-100 group-data-[error=true]/input-box:group-focus-within/input-box:translate-y-0
        "
				>
					<p>{message.error}</p>
				</div>
			</div>
		</>
	);
};

export default InputBoxFloatingLabel2;
