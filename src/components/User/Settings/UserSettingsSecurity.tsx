import { UserData } from "@/atoms/userAtom";
import React from "react";

type UserSettingsSecurityProps = {
	userData: UserData;
};

const UserSettingsSecurity: React.FC<UserSettingsSecurityProps> = ({
	userData,
}) => {
	return (
		<>
			<div className="page-wrapper">
				<div>UserSettingsSecurity</div>
			</div>
		</>
	);
};

export default UserSettingsSecurity;
