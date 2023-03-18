import { Timestamp } from "firebase/firestore";
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
import { errorUploadModalState } from "@/atoms/modalAtom";

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
	} | null;
	birthdate: Timestamp | null;
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

export const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];

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
	const [creatingUser, setCreatingUser] = useState(false);
	const [createUserForm, setCreateUserForm] = useState<CreateUserType>({
		firstName: "",
		lastName: "",
		middleName: "",
		profilePhoto: null,
		birthdate: null,
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
	const setUploadErrorModal = useSetRecoilState(errorUploadModalState);

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
			await createUser(createUserForm).then(() => {
				router.push("/");
			});
		} catch (error: any) {
			console.log("Create User Error!");
		}
		setCreatingUser(false);
	};

	const validateImage = (profilePhoto: File) => {
		if (profilePhoto.size > 1024 * 1024 * 2) {
			setUploadErrorModal((prev) => ({
				...prev,
				open: true,
				message: "Image size is too large. Maximum size is 2MB.",
			}));
			return false;
		}
		if (!validImageTypes.includes(profilePhoto.type)) {
			setUploadErrorModal((prev) => ({
				...prev,
				open: true,
				message: "Invalid image type. Only PNG and JPEG/JPG are allowed.",
			}));
			return false;
		}
		return true;
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			const profilePhoto = e.target.files[0];
			if (validateImage(profilePhoto)) {
				const reader = new FileReader();

				reader.onload = (readerEvent) => {
					const result = readerEvent.target?.result;
					if (result) {
						const img = new Image();

						img.onload = () => {
							const canvas = document.createElement("canvas");
							const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

							let width, height;

							if (img.width > img.height) {
								width = img.height;
								height = img.height;
							} else {
								width = img.width;
								height = img.width;
							}

							canvas.width = img.width;
							canvas.height = img.height;

							const xOffset = (img.width - width) / 2;
							const yOffset = (img.height - height) / 2;

							ctx.fillStyle = "#fff";
							ctx.fillRect(0, 0, canvas.width, canvas.height);

							ctx.drawImage(
								img,
								xOffset,
								yOffset,
								width,
								height,
								0,
								0,
								width,
								height
							);

							canvas.toBlob(
								(blob) => {
									if (blob) {
										setCreateUserForm((prev) => ({
											...prev,
											profilePhoto: {
												name: profilePhoto.name,
												url: URL.createObjectURL(blob),
												size: blob.size,
												type: blob.type,
											},
										}));
									}
								},
								"image/jpeg",
								0.8
							);
						};

						img.src = result as string;
					}
				};

				reader.readAsDataURL(profilePhoto);
			}
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
			birthdate: Timestamp.fromDate(new Date(e.target.value)),
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
