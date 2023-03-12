import React from "react";
import { CreateUserType } from "./CreateUserForm";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import moment from "moment";

type ReviewProfileProps = {
	createUserForm: CreateUserType;
};

const ReviewProfile: React.FC<ReviewProfileProps> = ({ createUserForm }) => {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-col gap-y-4">
				<div className="flex flex-row gap-x-4 items-start">
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
							<FaUserCircle className="h-full w-full text-gray-300" />
						)}
					</div>
					<div className="flex-1 flex flex-col">
						<p className="font-bold uppercase text-2xl text-logo-300 whitespace-normal">
							{createUserForm.lastName
								? createUserForm.lastName
								: "[Last Name!]"}
							,
						</p>
						<p className="font-semibold text-black ">
							{createUserForm.firstName
								? createUserForm.firstName
								: "[First Name!]"}
						</p>
						<p className="text-gray font-thin text-xs">
							{createUserForm.middleName
								? createUserForm.middleName
								: "[Middle Name]"}
						</p>
					</div>
				</div>
				<div className="divider"></div>
			</div>
			<div className="flex flex-col gap-y-4">
				<div className="flex flex-col gap-y-4">
					<div className="flex flex-col gap-2">
						<p className="create-user-field-title underline underline-offset-2">
							Details
						</p>
					</div>
					<div className="flex flex-col gap-y-2">
						<div className="text-xs font-bold flex flex-row gap-x-4">
							<p>Birthdate:</p>
							<p className="text-logo-300 break-words">
								{createUserForm.birthdate
									? moment(createUserForm.birthdate?.toDate()).format(
											"MMMM DD, YYYY"
									  )
									: "[BIRTHDATE!]"}
							</p>
						</div>
						<div className="text-xs font-bold flex flex-row gap-x-4">
							<p>Gender:</p>
							<p className="text-logo-300 break-words">
								{createUserForm.gender === "none"
									? "[GENDER!]"
									: createUserForm.gender.toString().slice(0, 1).toUpperCase() +
									  createUserForm.gender
											.toString()
											.slice(1, createUserForm.gender.length)}
							</p>
						</div>
					</div>
				</div>
				<div className="divider"></div>
			</div>
			<div className="flex flex-col gap-y-4">
				<div className="flex flex-col gap-y-4">
					<div className="flex flex-col gap-2">
						<p className="create-user-field-title underline underline-offset-2">
							Address
						</p>
					</div>
					<div className="flex flex-col gap-y-2">
						<div className="text-xs font-bold flex flex-row gap-x-4">
							<p>Province:</p>
							<p className="text-logo-300 break-words">
								{createUserForm.stateOrProvince
									? createUserForm.stateOrProvince
									: "[PROVINCE!]"}
							</p>
						</div>
						<div className="text-xs font-bold flex flex-row gap-x-4">
							<p>City or Municipality:</p>
							<p className="text-logo-300 break-words">
								{createUserForm.cityOrMunicipality
									? createUserForm.cityOrMunicipality
									: "[CITY_OR_MUNICIPALITY!]"}
							</p>
						</div>
						<div className="text-xs font-bold flex flex-row gap-x-4">
							<p>Barangay:</p>
							<p className="text-logo-300 break-words">
								{createUserForm.barangay
									? createUserForm.barangay
									: "[BARANGAY!]"}
							</p>
						</div>
						<div className="text-xs font-bold flex flex-row gap-x-4">
							<p>Street Address:</p>
							<p className="text-logo-300 break-words">
								{createUserForm.streetAddress
									? createUserForm.streetAddress
									: "[STREET_ADDRESS]"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewProfile;
