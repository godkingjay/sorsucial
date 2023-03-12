import React from "react";
import { CreateUserType } from "./CreateUserForm";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

type ReviewProfileProps = {
	createUserForm: CreateUserType;
};

const ReviewProfile: React.FC<ReviewProfileProps> = ({ createUserForm }) => {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-col gap-y-4">
				<div className="flex flex-row gap-x-4">
					<div
						className={`h-20 w-20 aspect-square rounded-full overflow-hidden border-2 ${
							createUserForm.profilePhoto?.url
								? "border-blue-500"
								: "border-transparent"
						}`}
					>
						{createUserForm.profilePhoto?.url ? (
							<Image
								src={createUserForm.profilePhoto?.url}
								alt="Profile Photo"
								width={256}
								height={256}
								className="object-cover h-full w-full"
							/>
						) : (
							<FaUserCircle className="h-full w-full" />
						)}
					</div>
				</div>
				<div className="divider"></div>
			</div>
		</div>
	);
};

export default ReviewProfile;
