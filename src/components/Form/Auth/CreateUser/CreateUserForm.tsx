import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";

type CreateUserFormProps = {};

const CreateUserForm: React.FC<CreateUserFormProps> = () => {
	const [creatingUser, setCreatingUser] = useState(false);

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<div className="w-full max-w-md flex flex-col bg-white shadow-shadow-around-sm rounded-xl">
			<div className="p-4 bg-logo-300 text-white rounded-t-xl">
				<h1 className="text-center font-bold text-lg">Create User</h1>
			</div>
			<div className="py-4 flex flex-col gap-y-4">
				{/* <div className="flex flex-col mx-4">
					<div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-100 p-4 rounded-lg">
						<div className="h-16 w-16 aspect-square">
							<SorSUcialLogo className="h-full w-full [&_path]:fill-logo-300" />
						</div>
						<div className="flex flex-col gap-y-2 flex-1">
							<p className="break-words text-center sm:text-left">
								Create an account for{" "}
								<span className="font-bold text-logo-300">
									{createAccount.email}
								</span>
							</p>
						</div>
					</div>
				</div> */}
				<div className="px-4">
					<div className="divider my-4"></div>
				</div>
				<div className="px-4">
					<form
						className="auth-form gap-y-8"
						onSubmit={handleFormSubmit}
					>
						<div>
							<button
								type="submit"
								title="Create Account"
								className="page-button bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
								disabled={creatingUser}
							>
								{!creatingUser ? (
									"Create User"
								) : (
									<FiLoader className="h-6 w-6 text-white animate-spin" />
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateUserForm;
