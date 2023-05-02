import CustomDropdown from "@/components/Controls/CustomDropdown";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { UserState } from "@/atoms/userAtom";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { discussionPrivacyOptions } from "../DiscussionCreationModal";
import useGroup from "@/hooks/useGroup";

type DiscussionCreationModalFormHeadProps = {
	userStateValue: UserState;
	discussionType: SiteDiscussion["discussionType"];
	disabled?: boolean;
	handleClose: () => void;
	handleSelectPrivacy: (value: string) => void;
};

const DiscussionCreationModalFormHead: React.FC<
	DiscussionCreationModalFormHeadProps
> = ({
	userStateValue,
	discussionType,
	disabled = false,
	handleClose,
	handleSelectPrivacy,
}) => {
	const { groupStateValue } = useGroup();

	return (
		<div className="discussion-creation-modal-form-head">
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
						options={
							discussionType === "discussion"
								? discussionPrivacyOptions.slice(0, 1)
								: discussionType === "group"
								? [
										discussionPrivacyOptions.find(
											(privacy) =>
												privacy.label ===
												groupStateValue.currentGroup?.group.privacy
										) || discussionPrivacyOptions[0],
								  ]
								: discussionPrivacyOptions
						}
						onSelect={handleSelectPrivacy}
						defaultValue={discussionPrivacyOptions[0]}
						disabled={disabled}
					/>
				</div>
			</div>
		</div>
	);
};

export default DiscussionCreationModalFormHead;
