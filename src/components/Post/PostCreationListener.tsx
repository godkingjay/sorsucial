import { UserState } from "@/atoms/userAtom";
import { SitePost } from "@/lib/interfaces/post";
import Image from "next/image";
import React from "react";
import { FaPollH, FaUserCircle } from "react-icons/fa";
import { CiBullhorn } from "react-icons/ci";
import { BsImages } from "react-icons/bs";
import Link from "next/link";
import { MdPoll } from "react-icons/md";

type PostCreationListenerProps = {
	useStateValue: UserState;
	postType: SitePost["postType"];
};

const PostCreationListener: React.FC<PostCreationListenerProps> = ({
	useStateValue: userStateValue,
	postType,
}) => {
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
					>
						<div className="icon-container">
							{postType === "announcement" && <CiBullhorn className="icon" />}
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
