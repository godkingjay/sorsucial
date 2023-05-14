import React from "react";
import AdminPageLayout from "./AdminPageLayout";
import MainPageLayout from "./MainPageLayout";
import {
	currentDirectoryState,
	navigationBarState,
} from "@/atoms/navigationBarAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import GroupPageLayout from "./GroupPageLayout";
import useUser from "@/hooks/useUser";
import UserPageLayout from "./UserPageLayout";
import UserSettingsPageLayout from "./UserSettingsPageLayout";

type PageContainerLayoutProps = {
	children: React.ReactNode;
};

const PageContainerLayout: React.FC<PageContainerLayoutProps> = ({
	children,
}) => {
	const currentDirectoryStateValue = useRecoilValue(currentDirectoryState);

	const {
		authUser,
		loadingUser,
		authLoading,
		setLoadingUser,
		userStateValue,
		logOutUser,
		userMounted,
	} = useUser();

	const [navigationBarStateValue, setNavigationBarStateValue] =
		useRecoilState(navigationBarState);

	const router = useRouter();

	const defaultPage = () => {
		return <MainPageLayout>{children}</MainPageLayout>;
	};

	switch (currentDirectoryStateValue.main) {
		case "admin": {
			return (
				<AdminPageLayout
					navigationBarStateValue={navigationBarStateValue}
					setNavigationBarStateValue={setNavigationBarStateValue}
					router={router}
					loadingUser={loadingUser}
					authLoading={authLoading}
					authUser={authUser}
					userStateValue={userStateValue}
					userMounted={userMounted}
				>
					{children}
				</AdminPageLayout>
			);
		}

		case "groups": {
			if (currentDirectoryStateValue.second === "[groupId]") {
				return <GroupPageLayout>{children}</GroupPageLayout>;
			} else {
				return defaultPage();
			}

			break;
		}

		case "user": {
			switch (currentDirectoryStateValue.second) {
				case "[userId]": {
					return <UserPageLayout>{children}</UserPageLayout>;

					break;
				}

				case "settings": {
					return <UserSettingsPageLayout>{children}</UserSettingsPageLayout>;
					break;
				}

				default: {
					return defaultPage();

					break;
				}
			}

			break;
		}

		default: {
			return defaultPage();
			break;
		}
	}
};

export default PageContainerLayout;
