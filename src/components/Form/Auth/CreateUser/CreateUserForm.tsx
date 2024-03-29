import React, { useEffect, useRef, useState } from "react";
import { FiLoader } from "react-icons/fi";
import NameAndPhoto from "./NameAndPhoto";
import BirthdateAndGender from "./BirthdateAndGender";
import Address from "./Address";
import {
	OptionsData,
	getBarangay,
	getCitiesMunicipality,
	getProvinces,
} from "@/lib/api/psgc";
import ReviewProfile from "./ReviewProfile";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { errorModalState } from "@/atoms/modalAtom";
import { validImageTypes } from "@/lib/types/validFiles";
import useInput from "@/hooks/useInput";

type CreateUserFormProps = {};

export type CreateUserType = {
	firstName: string;
	lastName: string;
	middleName?: string;
	profilePhoto: {
		name: string;
		url: string;
		size: number;
		type: string;
		height: number;
		width: number;
	} | null;
	birthdate: Date;
	gender: "male" | "female" | "other" | "none";
	streetAddress: string;
	barangay: string;
	cityOrMunicipality: string;
	stateOrProvince: string;
};

export type CreateUserErrorType = {
	firstName: boolean;
	lastName: boolean;
	middleName: boolean;
};

export const NameRegex =
	/^(?=.{1,49}$)([A-Z][a-z]*(?:[\s'-]([A-Z][a-z]*|[A-Z]?[a-z]+))*)$/;

export const genderOptions = [
	{
		value: "none",
		label: "-- Select --",
	},
	{
		value: "male",
		label: "Male",
	},
	{
		value: "female",
		label: "Female",
	},
	{
		value: "other",
		label: "Other",
	},
];

const CreateUserForm: React.FC<CreateUserFormProps> = () => {
	const { uploadImageOrVideo } = useInput();

	const [creatingUser, setCreatingUser] = useState(false);
	const [createUserForm, setCreateUserForm] = useState<CreateUserType>({
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
	});
	const [createUserFormError, setCreateUserFormError] =
		useState<CreateUserErrorType>({
			firstName: false,
			lastName: false,
			middleName: false,
		});
	const [createUserFormPage, setCreateUserFormPage] = useState(1);
	const profilePhotoRef = useRef<HTMLInputElement>(null);
	const [birthdate, setBirthdate] = useState("");
	const [provinceOptions, setProvinceOptions] = useState<OptionsData[]>([]);
	const [cityOrMunicipalityOptions, setCityOrMunicipalityOptions] = useState<
		OptionsData[]
	>([]);
	const [barangayOptions, setBarangayOptions] = useState<OptionsData[]>([]);
	const { createUser } = useUser();
	const router = useRouter();
	const setErrorModalStateValue = useSetRecoilState(errorModalState);

	const checkIfFormIsValid = () => {
		setCreateUserFormError((prev) => ({
			...prev,
			firstName: !NameRegex.test(createUserForm.firstName),
			lastName: !NameRegex.test(createUserForm.lastName),
			middleName: !NameRegex.test(createUserForm.middleName || ""),
			profilePhoto: !createUserForm.profilePhoto,
			birthdate: !createUserForm.birthdate,
			gender: !createUserForm.gender,
			barangay: !createUserForm.barangay,
			cityOrMunicipality: !createUserForm.cityOrMunicipality,
			stateOrProvince: !createUserForm.stateOrProvince,
		}));
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setCreatingUser(true);
		try {
			await createUser(createUserForm);
			// .then(() => {
			// 	router.push("/");
			// });
		} catch (error: any) {
			console.log("Create User Error!");
		}
		setCreatingUser(false);
	};

	const validateImage = (profilePhoto: File) => {
		if (profilePhoto.size > 1024 * 1024 * 2) {
			setErrorModalStateValue((prev) => ({
				...prev,
				open: true,
				view: "upload",
				message: "Image size is too large. Maximum size is 2MB.",
			}));
			return false;
		}
		if (!validImageTypes.ext.includes(profilePhoto.type)) {
			setErrorModalStateValue((prev) => ({
				...prev,
				open: true,
				view: "upload",
				message: "Invalid image type. Only PNG and JPEG/JPG are allowed.",
			}));
			return false;
		}
		return true;
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			if (e.target.files?.[0]) {
				const profilePhoto = await uploadImageOrVideo(e.target.files[0]);

				if (profilePhoto) {
					setCreateUserForm((prev) => ({
						...prev,
						profilePhoto: profilePhoto,
					}));
				}
			}
		} catch (error: any) {
			console.log(`=>Hook: useInput: uploadImageOrVideo: ${error.message}`);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCreateUserForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBirthdate(e.target.value);
		setCreateUserForm((prev) => ({
			...prev,
			birthdate: new Date(e.target.value),
		}));
	};

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCreateUserForm((prev) => ({
			...prev,
			gender: e.target.value as CreateUserType["gender"],
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
			setCreateUserForm((prev) => ({
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
			setCreateUserForm((prev) => ({
				...prev,
				barangay: "",
			}));
			fetchBarangay(
				cityOrMunicipalityOptions.find(
					(option) => option.name === e.target.value
				)?.code as string
			);
		}

		setCreateUserForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handlePageChange = (page: number) => {
		setCreateUserFormPage((prev) => prev + page);
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

	useEffect(() => {
		checkIfFormIsValid();
	}, [createUserForm]);

	return (
		<div className="w-full max-w-md flex flex-col bg-white shadow-around-sm rounded-xl min-h-[576px]">
			<div className="p-4 bg-logo-300 text-white rounded-t-xl">
				<h1 className="text-center font-bold text-lg">Create User</h1>
			</div>
			<div className="py-4 flex flex-col gap-y-4 flex-1">
				<div className="px-4 flex flex-col w-full flex-1">
					<form
						className="auth-form gap-y-4 flex-1 flex flex-col"
						onSubmit={handleFormSubmit}
					>
						{createUserFormPage === 1 && (
							<NameAndPhoto
								createUserForm={createUserForm}
								createUserFormError={createUserFormError}
								profilePhotoRef={profilePhotoRef}
								handleFileChange={handleFileChange}
								handleInputChange={handleInputChange}
								handleInputTextClick={handleInputTextClick}
							/>
						)}
						{createUserFormPage === 2 && (
							<BirthdateAndGender
								birthdate={birthdate}
								handleBirthdateChange={handleBirthdateChange}
								handleGenderChange={handleGenderChange}
								gender={createUserForm.gender}
							/>
						)}
						{createUserFormPage === 3 && (
							<Address
								createUserForm={createUserForm}
								handleAddressSelect={handleAddressSelect}
								provinceOptions={provinceOptions}
								cityOrMunicipalityOptions={cityOrMunicipalityOptions}
								barangayOptions={barangayOptions}
								handleInputChange={handleInputChange}
							/>
						)}
						{createUserFormPage === 4 && (
							<ReviewProfile createUserForm={createUserForm} />
						)}
						<div className="flex flex-col w-full gap-y-4 mt-auto">
							<div className="divider"></div>
							<div className="pagination-buttons flex flex-row w-full items-center justify-between">
								{createUserFormPage > 1 && (
									<button
										type="button"
										title="Back"
										className="page-button w-24 text-sm h-10 hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400 mr-auto"
										onClick={() => handlePageChange(-1)}
										disabled={createUserFormPage === 1 || creatingUser}
									>
										Back
									</button>
								)}
								{createUserFormPage < 4 && (
									<button
										type="button"
										title="Back"
										className="page-button w-24 text-sm bg-blue-500 border-blue-500 h-10 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600 ml-auto"
										onClick={() => handlePageChange(1)}
										disabled={createUserFormPage === 4 || creatingUser}
									>
										Next
									</button>
								)}
							</div>
						</div>
						{createUserFormPage === 4 && (
							<>
								<div className="divider"></div>
								<div className="h-max">
									<button
										type="submit"
										title="Create Account"
										className="page-button bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 focus:bg-green-600 focus:border-green-600"
										disabled={
											creatingUser ||
											!createUserForm.firstName ||
											!createUserForm.lastName ||
											!createUserForm.birthdate ||
											!createUserForm.gender ||
											!createUserForm.stateOrProvince ||
											!createUserForm.cityOrMunicipality ||
											!createUserForm.barangay
										}
									>
										{!creatingUser ? (
											"Create User"
										) : (
											<FiLoader className="h-6 w-6 text-white animate-spin" />
										)}
									</button>
								</div>
							</>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateUserForm;
