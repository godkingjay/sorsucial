import CustomDropdown from "@/components/Controls/CustomDropdown";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { postPrivacyOptions } from "../PostCreationModal";
import { UserState } from "@/atoms/userAtom";
import { SitePost } from "@/lib/interfaces/post";

type PostCreationModalFormHeadProps = {
	userStateValue: UserState;
	handleClose: () => void;
	handleSelectPrivacy: (value: string) => void;
	postType: SitePost["postType"];
};

const PostCreationModalFormHead: React.FC<PostCreationModalFormHeadProps> = ({
	userStateValue,
	handleClose,
	handleSelectPrivacy,
	postType,
}) => {
	return (
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
						options={
							postType === "announcement"
								? postPrivacyOptions.slice(0, 1)
								: postPrivacyOptions
						}
						onSelect={handleSelectPrivacy}
						defaultValue={postPrivacyOptions[0]}
					/>
				</div>
			</div>
		</div>
	);
};

export default PostCreationModalFormHead;
