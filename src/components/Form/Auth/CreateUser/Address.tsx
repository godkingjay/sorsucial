import React, { useEffect, useState } from "react";
import { CreateUserType } from "./CreateUserForm";
import { OptionsData } from "@/lib/api/psgc";

type AddressProps = {
	createUserForm: CreateUserType;
	handleAddressSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	provinceOptions: OptionsData[];
	cityOrMunicipalityOptions: OptionsData[];
	barangayOptions: OptionsData[];
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Address: React.FC<AddressProps> = ({
	createUserForm,
	handleAddressSelect,
	provinceOptions,
	cityOrMunicipalityOptions,
	barangayOptions,
	handleInputChange,
}) => {
	return (
		<div className="flex flex-col w-full gap-y-4">
			<div className="flex flex-col w-full gap-y-2">
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
					value={createUserForm.stateOrProvince}
					onChange={(e) => handleAddressSelect(e)}
					className="bg-gray-100 p-2 rounded-md shadow-around-sm border border-transparent font-semibold hover:border-gray-500 focus:border-500"
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
			<div className="flex flex-col w-full gap-y-2">
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
					value={createUserForm.cityOrMunicipality}
					onChange={(e) => handleAddressSelect(e)}
					className="bg-gray-100 p-2 rounded-md shadow-around-sm border border-transparent font-semibold hover:border-gray-500 focus:border-500"
					disabled={
						createUserForm.stateOrProvince === "" && provinceOptions.length > 0
					}
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
			<div className="flex flex-col w-full gap-y-2">
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
					value={createUserForm.barangay}
					onChange={(e) => handleAddressSelect(e)}
					className="bg-gray-100 p-2 rounded-md shadow-around-sm border border-transparent font-semibold hover:border-gray-500 focus:border-500"
					disabled={
						(createUserForm.stateOrProvince === "" &&
							provinceOptions.length > 0) ||
						(createUserForm.cityOrMunicipality === "" &&
							cityOrMunicipalityOptions.length > 0)
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
			<div className="w-full flex flex-col relative z-10 gap-y-2">
				<label
					htmlFor="streetAddress"
					className="create-user-field-title"
				>
					Street Address
				</label>
				<div className={`auth-input-container auth-input-container-filled`}>
					<div className="auth-input-text required-field">
						<input
							required
							type="streetAddress"
							name="streetAddress"
							title="First Name"
							className="input-field"
							onChange={handleInputChange}
							value={createUserForm.streetAddress}
							placeholder="Street Address"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Address;
