import { useRef, useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface AddTagsProps {
	title?: string;
	items: string[];
	setItems: React.Dispatch<React.SetStateAction<string[]>>;
	itemName: string;
	disabled?: boolean;
}

const AddTags: React.FC<AddTagsProps> = ({
	title,
	items,
	setItems,
	itemName,
	disabled = false,
}) => {
	const [inputItem, setInputItem] = useState<string>("");
	const inputItemRef = useRef<HTMLInputElement>(null);

	const handleItemInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputItem(event.target.value);
	};

	const handleAddItem = () => {
		if (inputItem.trim() !== "") {
			const formattedInput = inputItem
				.toLowerCase()
				.replace(/[^\w.,_\-\/\s]/g, "")
				.replace(/[^a-zA-Z0-9]+/g, "-")
				.replace(/-+/g, "-")
				.replace(/(^-|-$)/g, "")
				.trim();

			if (
				formattedInput === "" ||
				items.find((item) => item === formattedInput)
			) {
				return;
			}

			setItems([...items, formattedInput]);
			setInputItem("");
			inputItemRef.current?.focus();
		}
	};

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddItem();
		}
	};

	const handleRemoveItem = (itemToRemove: string) => {
		setItems(items.filter((item) => item !== itemToRemove));
	};

	return (
		<div className="flex w-full flex-col gap-y-2 p-2 relative border border-gray-200 bg-gray-50 rounded-lg">
			{title && (
				<div>
					<p className="font-semibold text-sm text-gray-500">{title}</p>
				</div>
			)}
			<div className="flex flex-wrap gap-2">
				{items.map((item, index) => (
					<div
						key={index}
						className="flex items-center space-x-2 bg-blue-100 rounded-full px-2 py-1"
					>
						<span className="text-sm px-1 flex-1 truncate">{item}</span>
						<button
							type="button"
							title={`Remove ${itemName}`}
							className="text-gray-500 hover:text-red-500 focus:text-red-500"
							onClick={() => !disabled && handleRemoveItem(item)}
							disabled={disabled}
						>
							<div className="h-6 w-6 aspect-square">
								<IoRemoveCircleOutline className="h-full w-full" />
							</div>
						</button>
					</div>
				))}
				<div className="relative">
					<input
						name={`add-${itemName}`}
						type="text"
						placeholder={`Add ${itemName}`}
						value={inputItem}
						onChange={(event) => !disabled && handleItemInputChange(event)}
						onKeyDown={(event) => !disabled && handleInputKeyDown(event)}
						className="border border-gray-400 rounded-full px-4 pr-8 py-2 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={disabled}
						ref={inputItemRef}
					/>
					<button
						title="Add"
						type="button"
						className="absolute right-2 top-[50%] translate-y-[-50%] text-gray-300 rounded-full text-sm font-medium hover:text-blue-500 focus:text-blue-500"
						onClick={() => !disabled && handleAddItem()}
						disabled={disabled}
					>
						<div className="h-6 w-6 aspect-square">
							<IoAddCircleOutline className="h-full w-full" />
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddTags;
