import React from "react";
import { CurrentDirectory } from "./Layout";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import Link from "next/link";
import UserPageHeader from "../User/UserPageHeader";

type UserPageLayoutProps = {
	children: React.ReactNode;
	currentDirectory: CurrentDirectory;
};

const UserPageLayout: React.FC<UserPageLayoutProps> = ({
	children,
	currentDirectory,
}) => {
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
						<div className="z-20 sticky flex flex-col items-center top-14 bg-white shadow-page-box-1">
							<div className="w-full max-w-4xl flex flex-row px-8 py-1">
								<Link
									href={`/user/${userStateValue.userPage.user.uid}`}
									className="user-nav-bar-item"
									data-active={
										!currentDirectory.third ||
										currentDirectory.third === "posts" ||
										currentDirectory.third === ""
									}
								>
									Posts
									<div className="indicator"></div>
								</Link>
								<Link
									href={`/user/${userStateValue.userPage.user.uid}/discussions/`}
									className="user-nav-bar-item"
									data-active={currentDirectory.third === "discussions"}
								>
									Discussions
									<div className="indicator"></div>
								</Link>
								<Link
									href={`/user/${userStateValue.userPage.user.uid}/groups/`}
									className="user-nav-bar-item"
									data-active={currentDirectory.third === "groups"}
								>
									Groups
									<div className="indicator"></div>
								</Link>
								<Link
									href={`/user/${userStateValue.userPage.user.uid}/gallery/`}
									className="user-nav-bar-item"
									data-active={currentDirectory.third === "gallery"}
								>
									Gallery
									<div className="indicator"></div>
								</Link>
								<Link
									href={`/user/${userStateValue.userPage.user.uid}/connections/`}
									className="user-nav-bar-item"
									data-active={currentDirectory.third === "members"}
								>
									Connections
									<div className="indicator"></div>
								</Link>
								<Link
									href={`/user/${userStateValue.userPage.user.uid}/about/`}
									className="user-nav-bar-item"
									data-active={currentDirectory.third === "about"}
								>
									About
									<div className="indicator"></div>
								</Link>
							</div>
						</div>
					</>
				)}
			{children}
		</div>
	);
};

export default UserPageLayout;
