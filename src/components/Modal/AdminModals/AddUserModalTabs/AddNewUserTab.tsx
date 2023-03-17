import React, { useState } from "react";
import { NewUserType } from "../AddUserModal";
import {
	NameRegex,
	genderOptions,
} from "@/components/Form/Auth/CreateUser/CreateUserForm";
import { SignInRegex } from "@/components/Form/Auth/SignInForm";
import { Timestamp } from "firebase/firestore";

type AddNerUserTabProps = {
	addNewUser: (newUser: NewUserType) => void;
};

export type NewUserErrorType = {
	email: boolean;
	firstName: boolean;
	lastName: boolean;
	middleName: boolean;
};

const AddNewUserTab: React.FC<AddNerUserTabProps> = ({ addNewUser }) => {
	const [newUserForm, setNewUserForm] = useState<NewUserType>({
		email: "",
		password: "",
	});

	const [newUserFormError, setNewUserFormError] = useState<NewUserErrorType>({
		email: false,
		firstName: false,
		lastName: false,
		middleName: false,
	});

	const [birthdate, setBirthdate] = useState("");

	console.log(newUserForm);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;

		setNewUserForm((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "email") {
			setNewUserFormError((prev) => ({
				...prev,
				email: !SignInRegex.email.test(value),
			}));
		}

		if (name === "firstName" || name === "lastName" || name === "middleName") {
			setNewUserFormError((prev) => ({
				...prev,
				email: !NameRegex.test(value),
			}));
		}
	};

	const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBirthdate(e.target.value);
		setNewUserForm((prev) => ({
			...prev,
			birthdate: Timestamp.fromDate(new Date(e.target.value)),
		}));
	};

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setNewUserForm((prev) => ({
			...prev,
			gender: e.target.value as NewUserType["gender"],
		}));
	};

	return (
		<div className="flex flex-col gap-y-2">
			<div className="p-2 border-2 border-gray-500 rounded-lg flex flex-col gap-y-2">
				<div className="p-2 px-4 bg-logo-300 rounded-lg">
					<p className="font-bold text-lg text-white text-center break-words">
						Authentication
					</p>
				</div>
				<div className="user-form w-full flex flex-col gap-y-4">
					<div
						className={`auth-input-container
										${newUserForm.email ? "auth-input-container-filled" : ""}
									`}
						data-error={newUserFormError.email && newUserForm.email !== ""}
					>
						<div className="auth-input-text required-field">
							<label
								htmlFor="email"
								className="label"
							>
								Email
							</label>
							<input
								required
								type="email"
								name="email"
								title="Email"
								className="input-field"
								onChange={handleInputChange}
								value={newUserForm.email}
							/>
						</div>
					</div>
				</div>
				<div className="w-full flex flex-col relative z-10 gap-y-2">
					<div
						className={`auth-input-container
										${newUserForm.password ? "auth-input-container-filled" : ""}
									`}
					>
						<div className="auth-input-text required-field">
							<label
								htmlFor="password"
								className="label"
							>
								Password
							</label>
							<input
								required
								type="password"
								name="password"
								title="Password"
								className="input-field"
								onChange={handleInputChange}
								value={newUserForm.password}
								min={8}
								max={256}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="p-2 border-2 border-gray-500 rounded-lg flex flex-col gap-y-2">
				<div className="p-2 px-4 bg-cyan-500 rounded-lg">
					<p className="font-bold text-lg text-white text-center break-words">
						Name
					</p>
				</div>
				<div className="w-full flex flex-col relative z-10 gap-y-2">
					<div
						className={`auth-input-container
										${newUserForm.firstName ? "auth-input-container-filled" : ""}
									`}
						data-error={
							newUserFormError.firstName && newUserForm.firstName !== ""
						}
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
								value={newUserForm.firstName}
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
										${newUserForm.lastName ? "auth-input-container-filled" : ""}
									`}
						data-error={
							newUserFormError.lastName && newUserForm.lastName !== ""
						}
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
								value={newUserForm.lastName}
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
										${newUserForm.middleName ? "auth-input-container-filled" : ""}
									`}
						data-error={
							newUserFormError.middleName && newUserForm.middleName !== ""
						}
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
								value={newUserForm.middleName}
								min={1}
								pattern={NameRegex.source}
								max={48}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="p-2 border-2 border-gray-500 rounded-lg flex flex-col gap-y-2">
				<div className="p-2 px-4 bg-purple-700 rounded-lg">
					<p className="font-bold text-lg text-white text-center break-words">
						Gender and Birthdate
					</p>
				</div>
				<div className="flex flex-col w-full gap-y-4">
					<div className="create-user-dropdown-group">
						<label
							htmlFor="birthdate"
							className="create-user-field-title create-user-field-title-required"
						>
							Birthdate
						</label>
						<input
							required
							type="date"
							name="birthdate"
							id="birthdate"
							value={birthdate}
							onChange={handleBirthdateChange}
							className="create-user-dropdown"
						/>
					</div>
					<div className="create-user-dropdown-group">
						<label
							htmlFor="gender"
							className="create-user-field-title create-user-field-title-required"
						>
							Gender
						</label>
						<select
							required
							name="gender"
							id="gender"
							value={newUserForm.gender as string}
							onChange={handleGenderChange}
							className="create-user-dropdown"
						>
							{genderOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddNewUserTab;
