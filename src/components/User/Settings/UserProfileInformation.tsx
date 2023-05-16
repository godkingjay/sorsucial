import { UserData } from "@/atoms/userAtom";
import InputEditable from "@/components/Form/Input/InputEditable";
import useUser from "@/hooks/useUser";
import { SiteUser } from "@/lib/interfaces/user";
import React, { useCallback, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { MdSave } from "react-icons/md";
import { RiRestartLine } from "react-icons/ri";

type UserProfileInformationProps = {
	userData: UserData;
};

const UserProfileInformation: React.FC<UserProfileInformationProps> = ({
	userData,
}) => {
	const { updateUser } = useUser();

	const [firstName, setFirstName] = useState(userData.user.firstName);
	const [lastName, setLastName] = useState(userData.user.lastName);
	const [middleName, setMiddleName] = useState(userData.user.middleName || "");

	const [updating, setUpdating] = useState(false);

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			try {
				if (!updating) {
					setUpdating(true);
					await updateUser({
						firstName,
						lastName,
						middleName,
					});
					setUpdating(false);
				}
			} catch (error: any) {
				console.log(`=>Hook: Updating user error:\n${error.message}`);
				setUpdating(false);
			}
		},
		[firstName, lastName, middleName, updateUser, updating]
	);

	const resetForm = () => {
		setFirstName(userData.user.firstName);
		setLastName(userData.user.lastName);
		setMiddleName(userData.user.middleName || "");
	};

	return (
		<>
			<div className="page-wrapper">
				<div className="flex flex-col gap-y-4">
					<div className="shadow-page-box-1 page-box-1 p-4 flex flex-col">
						<h1 className="font-bold text-xl text-gray-700 text-center sm:text-left">
							Profile Information
						</h1>
						<div className="divider my-2"></div>
						<form
							className="flex flex-col gap-y-2 mt-2 group"
							onSubmit={(event) => !updating && handleSubmit(event)}
							data-updating={updating}
						>
							<div className="grid p-4 sm:p-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 gap-y-4">
								<InputEditable
									value={firstName}
									setValue={setFirstName}
									title="First Name"
									placeholder={userData.user.firstName}
									name="firstName"
									type="text"
								/>
								<InputEditable
									value={lastName}
									setValue={setLastName}
									title="Last Name"
									placeholder={userData.user.lastName}
									name="lastName"
									type="text"
								/>
								<InputEditable
									value={middleName}
									setValue={setMiddleName}
									title="Middle Name"
									placeholder={userData.user.middleName}
									name="middleName"
									type="text"
								/>
							</div>

							{/* <div className="flex flex-col gap-y-2">
								<div>
									<h2 className="font-semibold text-logo-300">Address</h2>
									<div className="divider my-1"></div>
								</div>
							</div> */}

							<div className="divider mt-2 mb-1"></div>
							<div className="flex flex-row justify-end items-center gap-x-2">
								<button
									type="submit"
									title="Save Changes"
									className="flex flex-row w-36 gap-x-2 text-sm items-center px-2 py-1.5 bg-green-500 text-white border-2 border-green-500 rounded-md shadow-md disabled:grayscale"
									disabled={
										firstName === userData.user.firstName &&
										lastName === userData.user.lastName &&
										middleName === userData.user.middleName
									}
								>
									<div className="h-5 w-5">
										{updating ? (
											<FiLoader className="h-full w-full animate-spin" />
										) : (
											<MdSave className="h-full w-full" />
										)}
									</div>
									<div className="group-data-[updating=true]:hidden">
										<p>{updating ? "Updating..." : "Save Changes"}</p>
									</div>
								</button>
								<button
									type="button"
									title="Save Changes"
									className="flex flex-row gap-x-2 text-sm items-center px-2 py-1.5 border-2 border-red-500 text-red-500 rounded-md shadow-md"
									onClick={() => !updating && resetForm()}
									disabled={updating}
								>
									<div className="h-5 w-5">
										<RiRestartLine className="h-full w-full" />
									</div>
									<div>
										<p>Reset</p>
									</div>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserProfileInformation;
