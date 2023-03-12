import axios from "axios";

const endPoint = "https://psgc.gitlab.io/api";

export interface OptionsData {
	code: string;
	name: string;
}

export const getProvinces = async () => {
	const response = await axios.get(endPoint + "/provinces");
	const data = response.data;
	const optionsData: OptionsData[] = data
		.map((item: OptionsData) => ({
			code: item.code,
			name: item.name,
		}))
		.sort((a: OptionsData, b: OptionsData) => a.name.localeCompare(b.name));

	return optionsData;
};

export const getCitiesMunicipality = async (code: string = "056200000") => {
	const response = await axios.get(
		endPoint + "/provinces/" + code + "/cities-municipalities"
	);
	const data = response.data;
	const optionsData: OptionsData[] = data
		.map((item: OptionsData) => ({
			code: item.code,
			name: item.name,
		}))
		.sort((a: OptionsData, b: OptionsData) => a.name.localeCompare(b.name));

	return optionsData;
};

export const getBarangay = async (cityMunicipalityCode: string) => {
	const response = await axios.get(
		endPoint + "/cities-municipalities/" + cityMunicipalityCode + "/barangays"
	);
	const data = response.data;
	const optionsData: OptionsData[] = data
		.map((item: OptionsData) => ({
			code: item.code,
			name: item.name,
		}))
		.sort((a: OptionsData, b: OptionsData) => a.name.localeCompare(b.name));

	return optionsData;
};
