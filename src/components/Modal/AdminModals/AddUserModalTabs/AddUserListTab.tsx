import React from "react";
import { NewUsersFormType } from "../AddUserModal";
import NewUserTable from "./UserList/NewUserTable";

type AddUserListTabProps = {
	newUsersForm: NewUsersFormType;
};

const AddUserListTab: React.FC<AddUserListTabProps> = ({ newUsersForm }) => {
	return (
		<div className="flex flex-col-gap-y-2 overflow-hidden">
			<table className="new-user-table overflow-x-auto scroll-x-style">
				<tbody className="new-user-table-body">
					<tr className="new-user-table-header w-max">
						<td className="index">#</td>
						<td className="email">Email</td>
						<td className="password">Password</td>
						<td className="last-name">Last Name</td>
						<td className="first-name">First Name</td>
						<td className="middle-name">Middle Name</td>
						<td className="roles">Roles</td>
						<td className="birthdate">Birthdate</td>
						<td className="gender">Gender</td>
						<td className="province">Province</td>
						<td className="city-municipality">City or Municipality</td>
						<td className="barangay">Barangay</td>
						<td className="street-address">Street Address</td>
					</tr>
					{newUsersForm.users.map((user, index) => (
						<NewUserTable
							newUser={user}
							index={index}
							key={user.email}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AddUserListTab;
