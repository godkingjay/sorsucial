import React from "react";
import { NewUserType } from "../../AddUserModal";
import moment from "moment";
import { MdDelete } from "react-icons/md";

interface Props {
	newUser: NewUserType;
	index: number;
	handleRemoveUserFromList: (email: string) => void;
}

const NewUserTable: React.FC<Props> = ({
	newUser,
	index,
	handleRemoveUserFromList,
}) => {
	0;
	return (
		<tr className="new-user-table-content w-max">
			<td className="index">{index + 1}</td>
			<td className="email">{newUser.email}</td>
			<td className="password">{newUser.password}</td>
			<td className="last-name">{newUser.lastName}</td>
			<td className="first-name">{newUser.firstName}</td>
			<td className="middle-name">{newUser.middleName}</td>
			<td className="roles">
				{newUser.roles?.map((role) => {
					return (
						<p
							key={role}
							className={`role role-${role}`}
						>
							{role}
						</p>
					);
				})}
			</td>
			<td className="birthdate">
				{moment(newUser.birthdate?.getTime()).format("MMMM DD, YYYY")}
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
			<td className="actions">
				<button
					type="button"
					title="Delete"
					className="action action-delete"
					onClick={() => handleRemoveUserFromList(newUser.email)}
				>
					<div className="icon-container">
						<MdDelete className="icon" />
					</div>
				</button>
			</td>
		</tr>
	);
};

export default NewUserTable;
