import { PostCreationModalState } from "@/atoms/modalAtom";
import { UserState } from "@/atoms/userAtom";
import { PollItem, SitePost } from "@/lib/interfaces/post";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaLock, FaUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";
import CustomDropdown, { DropdownOption } from "../Controls/CustomDropdown";
import { MdPublic } from "react-icons/md";
import PostCreationModalFormHead from "./PostCreationModal/PostCreationModalFormHead";

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
					<div className="flex flex-col w-full gap-y-2 mb-4 z-40">
						<div className="relative flex flex-row py-2 px-2 rounded-md border border-transparent hover:bg-gray-100 focus-within:!bg-transparent focus-within:border-blue-500 gap-x-2">
							<textarea
								required
								name="postTitle"
								title="Post Title"
								placeholder="Title"
								className="flex-1 min-w-0 outline-none bg-transparent font-semibold break-words resize-none"
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
						<div className="flex flex-row gap-x-2 gap-y-2">
							<div className="relative h-max flex-1 flex flex-col border gap-x-2 border-transparent rounded-lg hover:bg-gray-100 focus-within:!bg-transparent focus-within:border-blue-500">
								<textarea
									name="postBody"
									placeholder="Text(optional)"
									title="Body"
									onChange={(e) => {
										handleTextChange(e);
										e.currentTarget.style.height = "0px";
										e.currentTarget.style.height =
											e.currentTarget.scrollHeight + "px";
									}}
									className={`
										min-w-0 outline-none text-sm bg-transparent break-words min-h-[128px] px-2 py-2 resize-none
									`}
									rows={1}
									minLength={0}
									maxLength={40000}
									value={createPostForm.postBody}
									disabled={creatingPost}
								/>
							</div>
							<div className="sticky -top-14 h-max">
								<div className="rounded-md border border-gray-300 shadow-around-sm h-max w-14 bg-white"></div>
							</div>
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
