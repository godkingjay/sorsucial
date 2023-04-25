import { DiscussionCreationModalState } from "@/atoms/modalAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";
import { FiLoader } from "react-icons/fi";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import DiscussionCreationTabs from "./DiscussionCreationModal/DiscussionCreationTabs";
import DiscussionTab from "./DiscussionCreationModal/DiscussionCreationTabs/DiscussionTab";
import { DropdownOption } from "../Controls/CustomDropdown";
import { MdPublic } from "react-icons/md";
import { FaEye, FaLock } from "react-icons/fa";
import DiscussionCreationModalFormHead from "./DiscussionCreationModal/DiscussionCreationModalFormHead";
import useDiscussion from "@/hooks/useDiscussion";
import AddTags from "../Form/Tag/AddTags";

type DiscussionCreationModalProps = {
	discussionCreationModalStateValue: DiscussionCreationModalState;
	setDiscussionCreationModalStateValue: SetterOrUpdater<DiscussionCreationModalState>;
	userStateValue: UserState;
};

export type CreateDiscussionType = {
	groupId?: SiteDiscussion["groupId"];
	creatorId?: SiteDiscussion["creatorId"];
	discussionTitle: SiteDiscussion["discussionTitle"];
	discussionBody: SiteDiscussion["discussionBody"];
	discussionTags: SiteDiscussion["discussionTags"];
	discussionType: SiteDiscussion["discussionType"];
	isOpen: SiteDiscussion["isOpen"];
	privacy: SiteDiscussion["privacy"];
};

export const discussionPrivacyOptions: DropdownOption[] = [
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

const DiscussionCreationModal: React.FC<DiscussionCreationModalProps> = ({
	discussionCreationModalStateValue,
	setDiscussionCreationModalStateValue,
	userStateValue,
}) => {
	const { createDiscussion } = useDiscussion();
	const defaultCreateDiscussionForm: CreateDiscussionType = {
		discussionTitle: "",
		discussionBody: "",
		discussionTags: [],
		discussionType: discussionCreationModalStateValue.discussionType,
		privacy: "public",
		isOpen: true,
	};
	const [discussionTags, setDiscussionTags] = useState<string[]>([]);

	const [creatingDiscussion, setCreatingDiscussion] = useState(false);
	const [createDiscussionForm, setCreateDiscussionForm] =
		useState<CreateDiscussionType>(defaultCreateDiscussionForm);
	const handleCreateDiscussionSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		setCreatingDiscussion(true);
		try {
			await createDiscussion({
				...createDiscussionForm,
				discussionTags: discussionTags,
			})
				.then(() => {
					setCreateDiscussionForm(defaultCreateDiscussionForm);
					setDiscussionCreationModalStateValue((prev) => ({
						...prev,
						open: false,
						tab: "discussion",
					}));
				})
				.catch((error) => {
					throw new Error(error);
				});
		} catch (error: any) {
			console.log("Hook: Discussion Creation Error", error.message);
		}
		setCreatingDiscussion(false);
	};

	const handleClose = () => {
		setDiscussionCreationModalStateValue((prev) => ({
			...prev,
			open: false,
		}));
	};

	const handleSelectPrivacy = (value: string) => {
		setCreateDiscussionForm((prev) => ({
			...prev,
			privacy: value as CreateDiscussionType["privacy"],
		}));
	};

	const handleFormTabChange = (tab: DiscussionCreationModalState["tab"]) => {
		setDiscussionCreationModalStateValue((prev) => ({
			...prev,
			tab,
		}));
	};

	const handleTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setCreateDiscussionForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] flex flex-col items-center px-8 py-16 overflow-y-auto scroll-y-style overflow-x-hidden">
			<div className="modal-container">
				<div className="p-4 px-16 w-full rounded-t-xl flex flex-row justify-center items-center relative">
					<p className="font-bold text-lg text-black truncate">
						{discussionCreationModalStateValue.discussionType === "discussion" &&
							"Create a Discussion"}
						{discussionCreationModalStateValue.discussionType === "group" &&
							"Create a Group Discussion"}
					</p>
					<button
						type="button"
						title="Close"
						className="h-8 w-8 aspect-square bg-gray-200 rounded-full p-1 text-gray-400 absolute top-[50%] right-4 translate-y-[-50%] hover:bg-red-100 hover:text-red-500 disabled:pointer-events-none"
						onClick={() => (creatingDiscussion ? null : handleClose())}
						disabled={creatingDiscussion}
					>
						<IoClose className="h-full w-full" />
					</button>
				</div>
				<div className="h-[1px] bg-black bg-opacity-10"></div>
				<form
					className="post-creation-modal-form"
					onSubmit={handleCreateDiscussionSubmit}
				>
					<DiscussionCreationModalFormHead
						userStateValue={userStateValue}
						handleClose={handleClose}
						handleSelectPrivacy={handleSelectPrivacy}
						discussionType={discussionCreationModalStateValue.discussionType}
					/>
					<div className="discussion-creation-modal-form-content">
						<div className="discussion-creation-form-title-container">
							<textarea
								required
								name="discussionTitle"
								title="Discussion Title"
								placeholder="Title"
								className="discussion-creation-form-title-input-field"
								minLength={1}
								maxLength={300}
								onChange={(e) => {
									handleTextChange(e);
									e.currentTarget.style.height = "0px";
									e.currentTarget.style.height =
										e.currentTarget.scrollHeight + "px";
								}}
								rows={1}
								value={createDiscussionForm.discussionTitle}
								disabled={creatingDiscussion}
							/>
							<p
								className={`mt-auto text-2xs font-semibold
									${
										300 - createDiscussionForm.discussionTitle.length === 0
											? "text-red-500"
											: "text-gray-400"
									}
								`}
							>
								{300 - createDiscussionForm.discussionTitle.length}/300
							</p>
						</div>
						<div className="discussion-creation-form-pages">
							<div className="discussion-creation-form-body-container">
								<div
									className={`
									flex-1 h-full flex-row
									${discussionCreationModalStateValue.tab === "discussion" ? "flex" : "hidden"}
								`}
								>
									<DiscussionTab
										handleTextChange={handleTextChange}
										createDiscussionForm={createDiscussionForm}
										creatingDiscussion={creatingDiscussion}
									/>
								</div>
							</div>
							<DiscussionCreationTabs
								handleFormTabChange={handleFormTabChange}
								discussionCreationModalStateValue={
									discussionCreationModalStateValue
								}
							/>
						</div>
						<AddTags
							items={discussionTags}
							setItems={setDiscussionTags}
							itemName="Tag"
						/>
					</div>
					<div>
						<button
							type="submit"
							title={`${
								discussionCreationModalStateValue.discussionType === "group"
									? "Create a group discussion"
									: "Create a discussion"
							}`}
							className="page-button h-max py-2 px-4 text-sm bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							disabled={
								!createDiscussionForm.discussionTitle.trim() ||
								creatingDiscussion
							}
						>
							{!creatingDiscussion ? (
								<>
									{discussionCreationModalStateValue.discussionType ===
										"discussion" && "Create Discussion"}
									{discussionCreationModalStateValue.discussionType ===
										"group" && "Create Group Discussion"}
								</>
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

export default DiscussionCreationModal;
