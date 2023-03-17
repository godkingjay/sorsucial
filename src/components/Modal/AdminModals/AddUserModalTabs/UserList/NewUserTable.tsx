import React from "react";
import { NewUserType } from "../../AddUserModal";
import moment from "moment";

interface Props {
	newUser: NewUserType;
	index: number;
}

const NewUserTable: React.FC<Props> = ({ newUser, index }) => {
	0;
	return (
		<tr className="new-user-table-content w-max">
			<td className="index">{index + 1}</td>
			<td className="email">{newUser.email}</td>
			<td className="password">{newUser.password}</td>
			<td className="last-name">{newUser.lastName}</td>
			<td className="first-name">{newUser.firstName}</td>
			<td className="middle-name">{newUser.middleName}</td>
			<td className="roles">Roles</td>
			<td className="birthdate">
				{moment(newUser.birthdate?.toDate()).format("MMMM DD, YYYY")}
			</td>
			<td className="gender">
				{newUser.gender
					? newUser.gender?.toString().slice(0, 1).toUpperCase() +
					  newUser.gender?.toString().slice(1, newUser.gender.length)
					: "[Gender]"}
			</td>
			<td className="province">{newUser.stateOrProvince}</td>
			<td className="city-municipality">{newUser.cityOrMunicipality}</td>
			<td className="barangay">{newUser.barangay}</td>
			<td className="street-address">
				{newUser.streetAddress ? newUser.streetAddress : "N/A"}
			</td>
		</tr>
	);
};

export default NewUserTable;
