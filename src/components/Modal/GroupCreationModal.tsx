import { GroupCreationModalState } from "@/atoms/modalAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";
import { FiLoader } from "react-icons/fi";
import { DropdownOption } from "../Controls/CustomDropdown";
import { MdPublic } from "react-icons/md";
import { FaEye, FaLock } from "react-icons/fa";
import AddTags from "../Form/Tag/AddTags";
import InputBoxFloatingLabel from "../Form/Input/InputBoxFloatingLabel";
import { SiteGroup } from "@/lib/interfaces/group";
import TextArea from "../Form/Input/TextArea";

type GroupCreationModalProps = {
	groupCreationModalStateValue: GroupCreationModalState;
	setGroupCreationModalStateValue: SetterOrUpdater<GroupCreationModalState>;
	userStateValue: UserState;
};
export type CreateGroupType = {
	name: string;
	description?: string;
	groupTags?: string[];
	privacy: SiteGroup["privacy"];
	image: {
		name: string;
		url: string;
		size: number;
		type: string;
		height: number;
		width: number;
	} | null;
};

export const groupPrivacyOptions: DropdownOption[] = [
	{
		label: "Public",
		value: "public",
		icon: <MdPublic className="w-full h-full" />,
	},
	{
		label: "Restricted",
		value: "restricted",
		icon: <FaEye className="w-full h-full" />,
	},
	{
		label: "Private",
		value: "private",
		icon: <FaLock className="w-full h-full" />,
	},
];

const GroupCreationModal: React.FC<GroupCreationModalProps> = ({
	groupCreationModalStateValue,
	setGroupCreationModalStateValue,
	userStateValue,
}) => {
	const defaultCreateGroupForm: CreateGroupType = {
		name: "",
		description: "",
		groupTags: [],
		privacy: "public",
		image: null,
	};

	const [groupTags, setGroupTags] = useState<string[]>([]);

	const [creatingGroup, setCreatingGroup] = useState(false);
	const [createGroupForm, setCreateGroupForm] = useState<CreateGroupType>(
		defaultCreateGroupForm
	);

	const setGroupName = (name: string) => {
		setCreateGroupForm((prev) => ({
			...prev,
			name,
		}));
	};

	const handleCreateGroupSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		setCreatingGroup(true);
		try {
		} catch (error: any) {
			console.log("Hook: Group Creation Error", error.message);
		}
		setCreatingGroup(false);
	};

	const handleClose = () => {
		setGroupCreationModalStateValue((prev) => ({
			...prev,
			open: false,
		}));
	};

	const handleSelectPrivacy = (value: string) => {
		setCreateGroupForm((prev) => ({
			...prev,
			privacy: value as CreateGroupType["privacy"],
		}));
	};

	const handleFormTabChange = (tab: GroupCreationModalState["tab"]) => {
		setGroupCreationModalStateValue((prev) => ({
			...prev,
			tab,
		}));
	};

	const handleTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setCreateGroupForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] flex flex-col items-center px-8 py-16 overflow-y-auto scroll-y-style overflow-x-hidden">
			<div className="modal-container">
				<div className="p-4 px-16 w-full rounded-t-xl flex flex-row justify-center items-center relative">
					<p className="font-bold text-lg text-black truncate">Create a Group</p>
					<button
						type="button"
						title="Close"
						className="h-8 w-8 aspect-square bg-gray-200 rounded-full p-1 text-gray-400 absolute top-[50%] right-4 translate-y-[-50%] hover:bg-red-100 hover:text-red-500 disabled:pointer-events-none"
						onClick={() => (creatingGroup ? null : handleClose())}
						disabled={creatingGroup}
					>
						<IoClose className="h-full w-full" />
					</button>
				</div>
				<div className="h-[1px] bg-black bg-opacity-10"></div>
				<form
					className="group-creation-modal-form"
					onSubmit={handleCreateGroupSubmit}
				>
					<div className="z-100 flex flex-col pb-4 gap-y-4">
						<InputBoxFloatingLabel
							name="name"
							label="Group Name"
							placeholder="Group Name"
							required={true}
							info={`
								Group name must be between 3 and 128 characters long.
							`}
							infoHidden={
								createGroupForm.name.trim().length >= 3 &&
								createGroupForm.name.trim().length <= 128
							}
							value={createGroupForm.name}
							minLength={3}
							maxLength={128}
							onChange={handleTextChange}
						/>
						<div className="h-[1px] w-full bg-gray-500 bg-opacity-10"></div>
						<TextArea
							name="description"
							title="Group Description"
							placeholder="Description(Optional)"
							value={createGroupForm.description || ""}
							maxLength={1500}
							onChange={handleTextChange}
							textBoxStyle={{
								minHeight: "128px",
							}}
						/>
						<div className="flex w-full flex-col gap-y-2 p-2 relative border border-gray-200 bg-gray-50 rounded-lg">
							<div>
								<p className="font-semibold text-sm text-gray-500">Group Tags</p>
							</div>
							<AddTags
								itemName="Group Tag"
								items={groupTags}
								setItems={setGroupTags}
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							title="Create a Group"
							className="page-button h-max py-2 px-4 text-sm bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							disabled={!createGroupForm.name.trim() || creatingGroup}
						>
							{!creatingGroup ? (
								<p>Create Group</p>
							) : (
								<FiLoader className="h-5 w-5 text-white animate-spin" />
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default GroupCreationModal;
