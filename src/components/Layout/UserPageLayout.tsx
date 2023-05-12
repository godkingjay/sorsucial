import React from "react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import UserPageHeader from "../User/UserPageHeader";
import UserPageNavigation from "./UserPageLayout/UserPageNavigation";

type UserPageLayoutProps = {
	children: React.ReactNode;
};

const UserPageLayout: React.FC<UserPageLayoutProps> = ({ children }) => {
	const { userStateValue } = useUser();

	const router = useRouter();

	const { userId } = router.query;

	return (
		<div className="flex-1">
			{userStateValue.userPage &&
				userStateValue.userPage.user.uid === userId && (
					<>
						<div className="z-20 flex flex-col">
							<UserPageHeader userData={userStateValue.userPage} />
						</div>
						<UserPageNavigation />
					</>
				)}
			{children}
		</div>
	);
};

export default UserPageLayout;
