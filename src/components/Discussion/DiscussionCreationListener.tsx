import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { GoCommentDiscussion } from "react-icons/go";
import { useSetRecoilState } from "recoil";
import {
	DiscussionCreationModalState,
	discussionCreationModalState,
} from "@/atoms/modalAtom";

type DiscussionCreationListenerProps = {
	useStateValue: UserState;
	discussionType: SiteDiscussion["discussionType"];
};

const DiscussionCreationListener: React.FC<DiscussionCreationListenerProps> = ({
	useStateValue: userStateValue,
	discussionType,
}) => {
	const setDiscussionCreationModalStateValue = useSetRecoilState(
		discussionCreationModalState
	);

	const handleDiscussionCreationModal = (
		tab: DiscussionCreationModalState["tab"]
	) => {
		setDiscussionCreationModalStateValue((prev) => ({
			...prev,
			open: true,
			discussionType,
			tab,
		}));
	};

	return (
		<div className="discussion-creation-listener page-box-1 entrance-animation-slide-from-right">
			<div className="discussion-creation-listener-head">
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
							discussionType === "group"
								? "Create a group discussion"
								: "Create a discussion"
						}`}
						className="input-box-container"
						onClick={() => handleDiscussionCreationModal("discussion")}
					>
						<div className="icon-container">
							<GoCommentDiscussion className="icon" />
						</div>
						<div className="label-container">
							<p className="label">
								{discussionType === "discussion" &&
									"What are your thoughts on this topic?"}
								{discussionType === "group" &&
									"Want to discuss this topic together?"}
							</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

export default DiscussionCreationListener;
