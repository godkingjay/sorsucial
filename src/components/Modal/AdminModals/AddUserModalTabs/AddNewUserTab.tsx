import React, { useEffect, useState } from "react";
import { NewUserType } from "../AddUserModal";
import {
	NameRegex,
	genderOptions,
} from "@/components/Form/Auth/CreateUser/CreateUserForm";
import {
	OptionsData,
	getBarangay,
	getCitiesMunicipality,
	getProvinces,
} from "@/lib/api/psgc";
import { FiLoader } from "react-icons/fi";
import { EmailRegex, PasswordRegex } from "@/lib/input/regex";

type AddNewUserTabProps = {
	addNewUser: (newUser: NewUserType) => void;
	checkUserEmailExists: (string: string) => Promise<boolean>;
};

export type NewUserErrorType = {
	email: boolean;
	password: boolean;
	firstName: boolean;
	lastName: boolean;
	middleName: boolean;
};

export const userRoles = [
	{
		label: "User",
		value: "user",
	},
	{
		label: "Admin",
		value: "admin",
	},
	{
		label: "Student",
		value: "student",
	},
	{
		label: "Instructor",
		value: "instructor",
	},
	{
		label: "Staff",
		value: "staff",
	},
];

const newUserFormInitialState: NewUserType = {
	email: "",
	password: "",
	roles: ["user"],
	firstName: "",
	lastName: "",
	middleName: "",
	profilePhoto: null,
	birthdate: new Date(),
	gender: "none",
	streetAddress: "",
	barangay: "",
	cityOrMunicipality: "",
	stateOrProvince: "",
};

const AddNewUserTab: React.FC<AddNewUserTabProps> = ({
	addNewUser,
	checkUserEmailExists,
}) => {
	const [newUserForm, setNewUserForm] = useState<NewUserType>(
		newUserFormInitialState
	);

	const [newUserFormError, setNewUserFormError] = useState<NewUserErrorType>({
		email: false,
		password: false,
		firstName: false,
		lastName: false,
		middleName: false,
	});

	const [birthdate, setBirthdate] = useState("");

	const [provinceOptions, setProvinceOptions] = useState<OptionsData[]>([]);
	const [cityOrMunicipalityOptions, setCityOrMunicipalityOptions] = useState<
		OptionsData[]
	>([]);
	const [barangayOptions, setBarangayOptions] = useState<OptionsData[]>([]);

	const [userExists, setUserExists] = useState(false);
	const [checkingUserExists, setCheckingUserExists] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;

		setNewUserForm((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "email") {
			setUserExists(false);
			setNewUserFormError((prev) => ({
				...prev,
				email: !EmailRegex.test(value),
			}));
		}

		if (name === "password") {
			setNewUserFormError((prev) => ({
				...prev,
				password: !PasswordRegex.test(value),
			}));
		}

		if (name === "firstName" || name === "lastName" || name === "middleName") {
			setNewUserFormError((prev) => ({
				...prev,
				[name]: !NameRegex.test(value),
			}));
		}
	};

	const handleUserRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;
		if (!newUserForm.roles?.includes(value as keyof NewUserType["roles"])) {
			setNewUserForm((prev) => ({
				...prev,
				roles: [...(prev.roles ?? []), value as keyof NewUserType["roles"]],
			}));
		} else {
			setNewUserForm((prev) => ({
				...prev,
				roles: prev.roles?.filter((role) => role !== value),
			}));
		}
	};

	const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBirthdate(e.target.value);
		setNewUserForm((prev) => ({
			...prev,
			birthdate: new Date(e.target.value),
		}));
	};

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setNewUserForm((prev) => ({
			...prev,
			gender: e.target.value as NewUserType["gender"],
		}));
	};

	const fetchProvinces = async () => {
		await getProvinces()
			.then((data) => setProvinceOptions(data))
			.catch((error) => console.log(error));
	};

	const fetchCitiesMunicipality = async (province: string) => {
		await getCitiesMunicipality(province)
			.then((data) => setCityOrMunicipalityOptions(data))
			.catch((error) => console.log(error));
	};

	const fetchBarangay = async (cityOrMunicipality: string) => {
		await getBarangay(cityOrMunicipality)
			.then((data) => setBarangayOptions(data))
			.catch((error) => console.log(error));
	};

	const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.name === "stateOrProvince" && e.target.value) {
			setNewUserForm((prev) => ({
				...prev,
				cityOrMunicipality: "",
				barangay: "",
			}));
			fetchCitiesMunicipality(
				provinceOptions.find((option) => option.name === e.target.value)
					?.code as string
			);
		}

		if (e.target.name === "cityOrMunicipality" && e.target.value) {
			setNewUserForm((prev) => ({
				...prev,
				barangay: "",
			}));
			fetchBarangay(
				cityOrMunicipalityOptions.find(
					(option) => option.name === e.target.value
				)?.code as string
			);
		}

		setNewUserForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleAddUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
		setCheckingUserExists(true);
		try {
			if (!(await checkUserEmailExists(newUserForm.email))) {
				addNewUser(newUserForm);
				setNewUserForm(newUserFormInitialState);
				setBirthdate("");
				setProvinceOptions([]);
				setCityOrMunicipalityOptions([]);
				setBarangayOptions([]);
				setUserExists(false);
			} else {
				console.log("User already exists!");
				setUserExists(true);
			}
		} catch (error: any) {
			console.log("Error adding user: ", error);
		}
		setCheckingUserExists(false);
	};

	/**
	 * Handles the click event of the input text div to focus the input element inside it when clicked.
	 *
	 * @param {React.MouseEvent<HTMLDivElement>} e - The click event.
	 */
	const handleInputTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
		(
			(e.currentTarget as HTMLInputElement).querySelector(
				"input"
			) as HTMLInputElement
		).focus();
	};

	useEffect(() => {
		fetchProvinces();
	}, []);

	return (
		<div className="flex flex-col gap-y-2">
			<div className="p-2 border-2 border-gray-500 rounded-lg flex flex-col gap-y-4">
				<div className="p-2 px-4 bg-logo-300 rounded-lg">
					<p className="font-bold text-lg text-white text-center break-words">
						Authentication
					</p>
				</div>
				<div className="user-form w-full flex flex-col gap-y-2">
					<div
						className={`auth-input-container
										${newUserForm.email ? "auth-input-container-filled" : ""}
									`}
						data-error={newUserFormError.email && newUserForm.email !== ""}
						onClick={handleInputTextClick}
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
					<div
						className={`${
							!newUserFormError.email ? "h-0 py-0" : "h-max py-4"
						} px-4 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
					>
						<p>Please input a school provided email address.</p>
					</div>
				</div>
				<div className="w-full flex flex-col relative z-10 gap-y-2">
					<div
						className={`auth-input-container
										${newUserForm.password ? "auth-input-container-filled" : ""}
									`}
						data-error={newUserFormError.password && newUserForm.password !== ""}
						onClick={handleInputTextClick}
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
					<div
						className={`${
							!newUserFormError.password ? "h-0 py-0" : "h-max py-4"
						} px-4 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
					>
						<ul className="flex flex-col gap-y-1">
							<li>
								<p>1. Password must be at least 8 characters long.</p>
							</li>
							<li>
								<p>
									2. Password should only contain A-Z, a-z, 0-9, or special
									characters(@, $, !, %, *, ?, &), and no spaces.
								</p>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col gap-y-2">
					<div className="flex flex-row items-center">
						<p className="font-bold text-logo-300">User Roles</p>
					</div>
					<ul className="flex flex-col gap-y-2">
						{userRoles.map((role) => (
							<li
								className="flex flex-row items-center gap-x-2"
								key={role.value}
							>
								<input
									type="checkbox"
									name="roles"
									value={role.value}
									onChange={handleUserRolesChange}
									title="roles"
									checked={newUserForm.roles?.includes(
										role.value as keyof NewUserType["roles"]
									)}
									disabled={role.value === "user"}
									className="w-4 h-4"
								/>
								<div className="label-container">
									<p className="label font-semibold">{role.label}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="p-2 border-2 border-gray-500 rounded-lg flex flex-col gap-y-4">
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
						data-error={newUserFormError.lastName && newUserForm.lastName !== ""}
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
			<div className="p-2 border-2 border-gray-500 rounded-lg flex flex-col gap-y-2">
				<div className="p-2 px-4 bg-orange-500 rounded-lg">
					<p className="font-bold text-lg text-white text-center break-words">
						Address
					</p>
				</div>
				<div className="flex flex-col w-full gap-y-4">
					<div className="create-user-dropdown-group">
						<label
							htmlFor="stateOrProvince"
							className="create-user-field-title create-user-field-title-required"
						>
							Province
						</label>
						<select
							required
							name="stateOrProvince"
							id="stateOrProvince"
							value={newUserForm.stateOrProvince}
							onChange={(e) => handleAddressSelect(e)}
							className="create-user-dropdown"
						>
							<option
								key={""}
								value={""}
							>
								-- Select --
							</option>
							{provinceOptions.map((option) => (
								<option
									key={option.code}
									value={option.name}
								>
									{option.name}
								</option>
							))}
						</select>
					</div>
					<div className="create-user-dropdown-group">
						<label
							htmlFor="cityOrMunicipality"
							className="create-user-field-title create-user-field-title-required"
						>
							City or Municipality
						</label>
						<select
							required
							name="cityOrMunicipality"
							id="cityOrMunicipality"
							value={newUserForm.cityOrMunicipality}
							onChange={(e) => handleAddressSelect(e)}
							className="create-user-dropdown"
							disabled={!newUserForm.stateOrProvince}
						>
							<option
								key={""}
								value={""}
							>
								-- Select --
							</option>
							{cityOrMunicipalityOptions.map((option) => (
								<option
									key={option.code}
									value={option.name}
								>
									{option.name}
								</option>
							))}
						</select>
					</div>
					<div className="create-user-dropdown-group">
						<label
							htmlFor="barangay"
							className="create-user-field-title create-user-field-title-required"
						>
							Barangay
						</label>
						<select
							required
							name="barangay"
							id="barangay"
							value={newUserForm.barangay}
							onChange={(e) => handleAddressSelect(e)}
							className="create-user-dropdown"
							disabled={
								!newUserForm.stateOrProvince || !newUserForm.cityOrMunicipality
							}
						>
							<option
								key={""}
								value={""}
							>
								-- Select --
							</option>
							{barangayOptions.map((option) => (
								<option
									key={option.code}
									value={option.name}
								>
									{option.name}
								</option>
							))}
						</select>
					</div>
					<div className="create-user-input-group z-10 relative">
						<label
							htmlFor="streetAddress"
							className="create-user-field-title"
						>
							Street Address
						</label>
						<div
							className={`create-user-container create-user-container-filled`}
						>
							<div className="create-user-input-text required-field">
								<input
									type="streetAddress"
									name="streetAddress"
									title="First Name"
									className="input-field"
									onChange={handleInputChange}
									value={newUserForm.streetAddress}
									placeholder="Street Address"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{userExists && (
				<div className="flex flex-col items-center w-full bg-red-500 p-4 rounded-md text-center break-words text-sm text-white">
					<p>
						A user with the email{" "}
						<span className="font-bold text-purple-800 underline">
							{newUserForm.email}
						</span>{" "}
						already exists!
					</p>
				</div>
			)}
			<button
				type="button"
				title="Add User"
				className="page-button bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 focus:bg-green-600 focus:border-green-600"
				onClick={handleAddUser}
				disabled={
					(!newUserForm.email && !newUserFormError.email) ||
					!newUserForm.password ||
					newUserForm.password.length < 8 ||
					newUserFormError.password ||
					!newUserForm.firstName ||
					!newUserForm.lastName ||
					!newUserForm.roles?.length ||
					(newUserFormError.middleName && newUserForm.middleName?.length) ||
					!newUserForm.birthdate ||
					!newUserForm.gender ||
					newUserForm.gender === "none" ||
					!newUserForm.stateOrProvince ||
					!newUserForm.cityOrMunicipality ||
					!newUserForm.barangay ||
					checkingUserExists
						? true
						: false
				}
			>
				{!checkingUserExists ? (
					"Add User"
				) : (
					<div className="h-6 w-6 aspect-square animate-spin text-white">
						<FiLoader className="h-full w-full" />
					</div>
				)}
			</button>
		</div>
	);
};

export default AddNewUserTab;
