import React from "react";

type UserSettingsPageLayoutProps = {
	children: React.ReactNode;
};

const UserSettingsPageLayout: React.FC<UserSettingsPageLayoutProps> = ({
	children,
}) => {
	return (
		<>
			<p>HEllo</p>
			{children}
		</>
	);
};

export default UserSettingsPageLayout;
