import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface AddTagsProps {
	items: string[];
	setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddTags: React.FC<AddTagsProps> = ({ items, setItems }) => {
	const [inputItem, setInputItem] = useState<string>("");

	const handleItemInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputItem(event.target.value);
	};

	const handleAddItem = () => {
		if (inputItem.trim() !== "") {
			setItems([...items, inputItem.trim()]);
			setInputItem("");
		}
	};

	const handleRemoveItem = (itemToRemove: string) => {
		setItems(items.filter((item) => item !== itemToRemove));
	};

	return (
		<div className="flex flex-wrap gap-2">
			{items.map((item, index) => (
				<div
					key={index}
					className="flex items-center space-x-2 bg-blue-100 rounded-full px-2 py-1"
				>
					<span className="text-sm px-1">{item}</span>
					<button
						type="button"
						title="Remove"
						className="text-gray-500 hover:text-red-500 focus:text-red-500"
						onClick={() => handleRemoveItem(item)}
					>
						<div className="h-6 w-6 aspect-square">
							<IoRemoveCircleOutline className="h-full w-full" />
						</div>
					</button>
				</div>
			))}
			<div className="relative">
				<input
					type="text"
					placeholder="Add a item"
					value={inputItem}
					onChange={handleItemInputChange}
					className="border border-gray-400 rounded-full px-4 pr-16 py-2 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					title="Add"
					type="button"
					className="absolute right-2 top-[50%] translate-y-[-50%] text-gray-300 rounded-full text-sm font-medium hover:text-blue-500 focus:text-blue-500"
					onClick={handleAddItem}
				>
					<div className="h-6 w-6 aspect-square">
						<IoAddCircleOutline className="h-full w-full" />
					</div>
				</button>
			</div>
		</div>
	);
};

export default AddTags;
