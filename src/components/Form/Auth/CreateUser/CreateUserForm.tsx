import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

type CreateUserFormProps = {};

export type CreateUserType = {
	firstName: string;
	lastName: string;
	middleName?: string;
	phoneNumber: string;
	role: "student" | "staff" | "instructor" | "user";
	imageURL: string;
	birthDate: Timestamp | null;
	gender: "male" | "female" | "other" | null;
	streetAddress: string;
	cityOrMunicipality: string;
	stateOrProvince: string;
	postalCode: string;
};

const CreateUserForm: React.FC<CreateUserFormProps> = () => {
	const [creatingUser, setCreatingUser] = useState(false);
	const [createUserForm, setCreateUserForm] = useState<CreateUserType>({
		firstName: "",
		lastName: "",
		middleName: "",
		phoneNumber: "",
		role: "user",
		imageURL: "",
		birthDate: null,
		gender: null,
		streetAddress: "",
		cityOrMunicipality: "",
		stateOrProvince: "",
		postalCode: "",
	});
	const [createUserFormPage, setCreateUserFormPage] = useState(1);

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<div className="w-full max-w-md flex flex-col bg-white shadow-shadow-around-sm rounded-xl">
			<div className="p-4 bg-logo-300 text-white rounded-t-xl">
				<h1 className="text-center font-bold text-lg">Create User</h1>
			</div>
			<div className="py-4 flex flex-col gap-y-4">
				<div className="px-4">
					<form
						className="auth-form gap-y-8"
						onSubmit={handleFormSubmit}
					>
						{createUserFormPage === 1 && (
							<div>
								<button
									type="submit"
									title="Create Account"  
									className="page-button bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
								>
									{!creatingUser ? (
										"Create User"
									) : (
										<FiLoader className="h-6 w-6 text-white animate-spin" />
									)}
								</button>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateUserForm;
