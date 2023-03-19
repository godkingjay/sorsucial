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
					<div className="post-creation-modal-form-head">
						<Link
							href={`/user/${userStateValue.user.uid}`}
							className="image-icon-container"
							onClick={handleClose}
						>
							{userStateValue.user.imageURL ? (
								<Image
									src={userStateValue.user.imageURL}
									alt="User Profile Picture"
									width={128}
									height={128}
									loading="lazy"
									className="image"
								/>
							) : (
								<FaUserCircle className="icon" />
							)}
						</Link>
						<div className="head-right">
							<div className="user-name">
								<Link
									href={`users/${userStateValue.user.uid}`}
									className="user-name-link"
								>{`${userStateValue.user.firstName} ${userStateValue.user.lastName}`}</Link>
							</div>
							<div className="privacy-type-wrapper">
								<CustomDropdown
									options={postPrivacyOptions}
									onSelect={handleSelectPrivacy}
									defaultValue={postPrivacyOptions[0]}
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostCreationModal;
