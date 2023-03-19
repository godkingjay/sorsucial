import { UserState } from "@/atoms/userAtom";
import { SitePost } from "@/lib/interfaces/post";
import Image from "next/image";
import React from "react";
import { FaPollH, FaUserCircle } from "react-icons/fa";
import { CiBullhorn } from "react-icons/ci";
import { BsImages } from "react-icons/bs";
import Link from "next/link";
import { MdPoll, MdPostAdd } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useRecoilState } from "recoil";
import {
	PostCreationModalState,
	postCreationModalState,
} from "@/atoms/modalAtom";

type PostCreationListenerProps = {
	useStateValue: UserState;
	postType: SitePost["postType"];
};

const PostCreationListener: React.FC<PostCreationListenerProps> = ({
	useStateValue: userStateValue,
	postType,
}) => {
	const [postCreationModalStateValue, setPostCreationModalStateValue] =
		useRecoilState(postCreationModalState);

	const handlePostCreationModal = (tab: PostCreationModalState["tab"]) => {
		setPostCreationModalStateValue((prev) => ({
			...prev,
			open: true,
			postType,
			tab,
		}));
	};

	return (
		<div className="post-creation-listener">
			<div className="post-creation-listener-head">
				<Link
					href={`/user/${userStateValue.user.uid}`}
					className="image-icon-container"
				>
					{userStateValue.user.imageURL ? (
						<Image
							src={userStateValue.user.imageURL}
							alt="User Profile Picture"
							width={64}
							height={64}
							loading="lazy"
							className="image"
						/>
					) : (
						<FaUserCircle className="icon" />
					)}
				</Link>
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
								{postType === "announcement" && "Create an announcement..."}
								{postType === "feed" && "Create a post..."}
								{postType === "group" && "Create a group post..."}
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
						onClick={() => handlePostCreationModal("image&video")}
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
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostCreationListener;
