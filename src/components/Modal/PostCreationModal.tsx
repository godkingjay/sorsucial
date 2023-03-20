import { PostCreationModalState } from "@/atoms/modalAtom";
import { UserState } from "@/atoms/userAtom";
import { PollItem, SitePost } from "@/lib/interfaces/post";
import React, { useState } from "react";
import { FaEye, FaLock, FaPollH } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";
import { DropdownOption } from "../Controls/CustomDropdown";
import { MdPublic } from "react-icons/md";
import PostCreationModalFormHead from "./PostCreationModal/PostCreationModalFormHead";
import { HiDocumentText } from "react-icons/hi";
import { BsFillFileEarmarkPlusFill, BsImages } from "react-icons/bs";
import { RiLinkM } from "react-icons/ri";
import PostTab from "./PostCreationModal/PostCreationTabs/PostTab";
import PostTabs from "./PostCreationModal/PostCreationTabs";
import PostCreationTabs from "./PostCreationModal/PostCreationTabs";

type PostCreationModalProps = {
	postCreationModalStateValue: PostCreationModalState;
	setPostCreationModalStateValue: SetterOrUpdater<PostCreationModalState>;
	userStateValue: UserState;
};

export type PostPollItemType = {
	postItemTitle: string;
	logoType?: PollItem["logoType"];
	emoji?: string;
	image?: {
		name: string;
		url: string;
		size: number;
		type: string;
	};
};

export type CreatePostType = {
	postTitle: SitePost["postTitle"];
	postBody: SitePost["postBody"];
	postTags: SitePost["postTags"];
	postType: SitePost["postType"];
	hasImageOrVideo: SitePost["hasImageOrVideo"];
	hasFile: SitePost["hasFile"];
	hasLink: SitePost["hasLink"];
	hasPoll: SitePost["hasPoll"];
	isCommentable: SitePost["isCommentable"];
	privacy: SitePost["privacy"];
	imageOrVideo: {
		name: string;
		url: string;
		size: number;
		type: string;
	} | null;
	file: {
		name: string;
		url: string;
		size: number;
		type: string;
	} | null;
	link: {
		linkTitle?: string;
		linkDescription?: string;
		url: string;
	} | null;
	poll: {
		pollTitle: string;
		pollDescription?: string;
		maxVotes?: number;
		isActive: boolean;
		postItems: PostPollItemType[];
	} | null;
};

export const postPrivacyOptions: DropdownOption[] = [
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

const PostCreationModal: React.FC<PostCreationModalProps> = ({
	postCreationModalStateValue,
	setPostCreationModalStateValue,
	userStateValue,
}) => {
	const [createPostForm, setCreatePostForm] = useState<CreatePostType>({
		postTitle: "",
		postBody: "",
		postTags: [],
		postType: postCreationModalStateValue.postType,
		hasImageOrVideo: false,
		hasFile: false,
		hasLink: false,
		hasPoll: false,
		isCommentable: true,
		privacy: "public",
		imageOrVideo: null,
		file: null,
		link: null,
		poll: null,
	});
	const [creatingPost, setCreatingPost] = useState(false);

	const handleCreatePostSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
	};

	const handleSelectPrivacy = (value: string) => {
		setCreatePostForm((prev) => ({
			...prev,
			privacy: value as CreatePostType["privacy"],
		}));
	};

	const handleClose = () => {
		setPostCreationModalStateValue((prev) => ({
			...prev,
			open: false,
			postType: "feed",
			tab: "post",
		}));
	};

	const handleFormTabChange = (tab: PostCreationModalState["tab"]) => {
		setPostCreationModalStateValue((prev) => ({
			...prev,
			tab,
		}));
	};

	const handleTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setCreatePostForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] flex flex-col items-center px-8 py-16 overflow-y-auto scroll-y-style overflow-x-hidden">
			<div className="w-full max-w-xl bg-white flex flex-col rounded-xl shadow-around-lg pointer-events-auto">
				<div className="p-4 px-16 w-full rounded-t-xl flex flex-row justify-center items-center relative">
					<p className="font-bold text-lg text-black truncate">
						{postCreationModalStateValue.postType === "announcement" &&
							"Create Announcement"}
						{postCreationModalStateValue.postType === "feed" && "Create Post"}
						{postCreationModalStateValue.postType === "group" &&
							"Create Group Post"}
					</p>
					<button
						type="button"
						title="Close"
						className="h-8 w-8 aspect-square bg-gray-200 rounded-full p-1 text-gray-400 absolute top-[50%] right-4 translate-y-[-50%] hover:bg-red-100 hover:text-red-500"
						onClick={handleClose}
					>
						<IoClose className="h-full w-full" />
					</button>
				</div>
				<div className="h-[1px] bg-black bg-opacity-10"></div>
				<form className="post-creation-modal-form">
					<PostCreationModalFormHead
						userStateValue={userStateValue}
						handleClose={handleClose}
						handleSelectPrivacy={handleSelectPrivacy}
					/>
					<div className="post-creation-modal-form-content">
						<div className="post-creation-form-title-container">
							<textarea
								required
								name="postTitle"
								title="Post Title"
								placeholder="Title"
								className="post-creation-form-title-input-field"
								minLength={1}
								maxLength={300}
								onChange={(e) => {
									handleTextChange(e);
									e.currentTarget.style.height = "0px";
									e.currentTarget.style.height =
										e.currentTarget.scrollHeight + "px";
								}}
								rows={1}
								value={createPostForm.postTitle}
								disabled={creatingPost}
							/>
							<p
								className={`mt-auto text-2xs font-semibold
									${
										300 - createPostForm.postTitle.length === 0
											? "text-red-500"
											: "text-gray-400"
									}
								`}
							>
								{300 - createPostForm.postTitle.length}/300
							</p>
						</div>
						<div className="post-creation-form-pages">
							<div className="post-creation-form-body-container">
								{postCreationModalStateValue.tab === "post" && (
									<PostTab
										handleTextChange={handleTextChange}
										createPostForm={createPostForm}
										creatingPost={creatingPost}
									/>
								)}
							</div>
							<PostCreationTabs
								handleFormTabChange={handleFormTabChange}
								postCreationModalStateValue={postCreationModalStateValue}
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							title={`${
								postCreationModalStateValue.postType === "announcement"
									? "Create an announcement"
									: postCreationModalStateValue.postType === "group"
									? "Create a group post"
									: "Create a post"
							}`}
							className="page-button h-max py-2 px-4 text-sm bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							disabled={!createPostForm.postTitle}
						>
							{postCreationModalStateValue.postType === "announcement" &&
								"Create Announcement"}
							{postCreationModalStateValue.postType === "feed" && "Create Post"}
							{postCreationModalStateValue.postType === "group" &&
								"Create Group Post"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostCreationModal;
