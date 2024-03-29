import { UserState } from "@/atoms/userAtom";
import { SitePost } from "@/lib/interfaces/post";
import Image from "next/image";
import React from "react";
import { FaPollH, FaUserCircle } from "react-icons/fa";
import { CiBullhorn } from "react-icons/ci";
import { BsFileEarmarkPlusFill, BsImages } from "react-icons/bs";
import Link from "next/link";
import { MdPostAdd } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import {
	PostCreationModalState,
	postCreationModalState,
} from "@/atoms/modalAtom";
import { RiLinkM } from "react-icons/ri";
import UserIcon from "../Icons/UserIcon";

type PostCreationListenerProps = {
	useStateValue: UserState;
	postType: SitePost["postType"];
};

const PostCreationListener: React.FC<PostCreationListenerProps> = ({
	useStateValue: userStateValue,
	postType,
}) => {
	const setPostCreationModalStateValue = useSetRecoilState(
		postCreationModalState
	);

	const handlePostCreationModal = (tab: PostCreationModalState["tab"]) => {
		setPostCreationModalStateValue((prev) => ({
			...prev,
			open: true,
			postType,
			tab,
		}));
	};

	return (
		<div className="post-creation-listener page-box-1 entrance-animation-slide-from-right">
			<div className="post-creation-listener-head">
				<div className="image-icon-container flex">
					<UserIcon user={userStateValue.user} />
				</div>
				<div className="input-box-wrapper">
					<button
						type="button"
						title={`${
							postType === "announcement"
								? "Create an announcement"
								: postType === "group"
								? "Create a group post"
								: "Create a post"
						}`}
						className="input-box-container"
						onClick={() => handlePostCreationModal("post")}
					>
						<div className="icon-container">
							{postType === "announcement" && <CiBullhorn className="icon" />}
							{postType === "feed" && (
								<div className="h-full w-full p-[1px]">
									<FiEdit className="icon stroke-1" />
								</div>
							)}
							{postType === "group" && <MdPostAdd className="icon" />}
						</div>
						<div className="label-container">
							<p className="label">
								{postType === "announcement" && "What's happening?"}
								{postType === "feed" && "What's on your mind?"}
								{postType === "group" && "Want to share something?"}
							</p>
						</div>
					</button>
				</div>
			</div>
			<div className="h-[1px] bg-black bg-opacity-20"></div>
			<div className="post-creation-listener-buttons-wrapper">
				<div className="post-creation-listener-buttons-container">
					<button
						type="button"
						title="Add Photo/Video"
						className="button"
						onClick={() => handlePostCreationModal("image/video")}
					>
						<div className="icon-container text-green-500">
							<BsImages className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Add Photo/Video</p>
						</div>
					</button>
					<button
						type="button"
						title="Add File"
						className="button !hidden md:!flex"
						onClick={() => handlePostCreationModal("file")}
					>
						<div className="icon-container text-purple-500">
							<BsFileEarmarkPlusFill className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Add File</p>
						</div>
					</button>
					<button
						type="button"
						title="Add Link"
						className="button"
						onClick={() => handlePostCreationModal("link")}
					>
						<div className="icon-container text-cyan-500">
							<RiLinkM className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Add Link</p>
						</div>
					</button>
					{/* <button
						type="button"
						title="Create a Poll"
						className="button"
						onClick={() => handlePostCreationModal("poll")}
					>
						<div className="icon-container text-yellow-500">
							<FaPollH className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Create a Poll</p>
						</div>
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default PostCreationListener;
