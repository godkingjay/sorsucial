import { GroupCreationModalState } from "@/atoms/modalAtom";
import React from "react";
import { BiPlus } from "react-icons/bi";

type CreateNewGroupButtonProps = {
	handleGroupCreationModal: (tab: GroupCreationModalState["tab"]) => void;
};

const CreateNewGroupButton: React.FC<CreateNewGroupButtonProps> = ({
	handleGroupCreationModal,
}) => {
	return (
		<button
			type="button"
			title="Create New Group"
			className="flex flex-row items-center px-3 py-2 rounded-lg gap-x-2 text-sm shadow-page-box-1 bg-green-500 text-white hover:bg-green-600"
			onClick={() => handleGroupCreationModal("group")}
		>
			<div className="h-6 w-6 aspect-square">
				<BiPlus className="h-full w-full" />
			</div>
			<div>
				<p className="font-semibold">Create Group</p>
			</div>
		</button>
	);
};

export default CreateNewGroupButton;
