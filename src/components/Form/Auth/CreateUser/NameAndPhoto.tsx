import React from "react";
import {
	CreateUserErrorType,
	CreateUserType,
	NameRegex,
} from "./CreateUserForm";
import Image from "next/image";
import { HiOutlineUpload } from "react-icons/hi";
import { validImageTypes } from "@/lib/types/validFiles";

type NameAndPhotoProps = {
	createUserForm: CreateUserType;
	createUserFormError: CreateUserErrorType;
	profilePhotoRef: React.RefObject<HTMLInputElement>;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleInputTextClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const NameAndPhoto: React.FC<NameAndPhotoProps> = ({
	createUserForm,
	createUserFormError,
	profilePhotoRef,
	handleFileChange,
	handleInputChange,
	handleInputTextClick,
}) => {
	return (
		<div className="flex w-full flex-col gap-y-8 items-center">
			<div className="w-full flex flex-col items-center">
				<button
					type="button"
					title="Add Photo"
					className={`
										w-40 h-40 border-2 border-gray-500 z-20 rounded-full flex flex-col items-center justify-center text-xs text-gray-500 font-bold hover:text-blue-500 focus:text-blue-500 hover:border-blue-500 focus:border-blue-500 gap-y-2 relative
										${createUserForm.profilePhoto ? " border-solid" : " border-dashed"}
									`}
					onClick={() => profilePhotoRef.current?.click()}
				>
					{createUserForm.profilePhoto ? (
						<>
							<div className="-z-0 absolute right-0 top-[50%] translate-y-[-50%] h-full w-full grid place-items-center rounded-full overflow-hidden bg-gray-300">
								<Image
									src={createUserForm.profilePhoto.url}
									alt="Profile Photo"
									width={256}
									height={256}
									className="object-cover h-full w-full"
									loading="lazy"
								/>
							</div>
						</>
					) : (
						<>
							<div className="h-6 w-6 aspect-square">
								<HiOutlineUpload className="h-full w-full" />
							</div>
							<p>Upload Image</p>
						</>
					)}
				</button>
				<input
					required
					type="file"
					title="Profile Photo"
					ref={profilePhotoRef}
					accept={validImageTypes.ext.join(",")}
					onChange={handleFileChange}
					hidden
				/>
			</div>
			<div className="user-form w-full flex flex-col gap-y-4">
				<div className="w-full flex flex-col relative z-10 gap-y-2">
					<div
						className={`auth-input-container
										${createUserForm.firstName ? "auth-input-container-filled" : ""}
									`}
						data-error={
							createUserFormError.firstName && createUserForm.firstName !== ""
						}
						onClick={handleInputTextClick}
					>
						<div className="auth-input-text required-field">
							<label
								htmlFor="firstName"
								className="label"
							>
								First Name
							</label>
							<input
								required
								type="firstName"
								name="firstName"
								title="First Name"
								className="input-field"
								onChange={handleInputChange}
								value={createUserForm.firstName}
								min={1}
								pattern={NameRegex.source}
								max={48}
							/>
						</div>
					</div>
				</div>
				<div className="w-full flex flex-col relative z-10 gap-y-2">
					<div
						className={`auth-input-container
										${createUserForm.lastName ? "auth-input-container-filled" : ""}
									`}
						data-error={
							createUserFormError.lastName && createUserForm.lastName !== ""
						}
						onClick={handleInputTextClick}
					>
						<div className="auth-input-text required-field">
							<label
								htmlFor="lastName"
								className="label"
							>
								Last Name
							</label>
							<input
								required
								type="lastName"
								name="lastName"
								title="Last Name"
								className="input-field"
								onChange={handleInputChange}
								value={createUserForm.lastName}
								min={1}
								pattern={NameRegex.source}
								max={48}
							/>
						</div>
					</div>
				</div>
				<div className="w-full flex flex-col relative z-10 gap-y-2">
					<div
						className={`auth-input-container
										${createUserForm.middleName ? "auth-input-container-filled" : ""}
									`}
						data-error={
							createUserFormError.middleName && createUserForm.middleName !== ""
						}
						onClick={handleInputTextClick}
					>
						<div className="auth-input-text">
							<label
								htmlFor="middleName"
								className="label"
							>
								Middle Name
							</label>
							<input
								required
								type="middleName"
								name="middleName"
								title="Name"
								className="input-field"
								onChange={handleInputChange}
								value={createUserForm.middleName}
								min={1}
								pattern={NameRegex.source}
								max={48}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NameAndPhoto;
