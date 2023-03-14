import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import React from "react";
import RightNav from "./RightNav";
import { useRecoilState } from "recoil";
import { navigationBarState } from "@/atoms/navigationBarAtom";

type NavBarProps = {
	userStateValue: UserState;
	authLoading: boolean;
	logOutUser: () => void;
};

const NavBar: React.FC<NavBarProps> = ({
	userStateValue,
	authLoading,
	logOutUser,
}) => {
	const [navigationBarStateValue, setNavigationBarStateValue] =
		useRecoilState(navigationBarState);

	return (
		<div className="sticky top-0 w-full h-14 bg-white shadow-sm">
			<div className="h-14 w-full flex flex-row items-center gap-x-2">
				<div className="h-full w-2xs max-w-2xs">
					<div className="flex flex-row w-full h-full items-center">
						<div className="aspect-square h-14 w-14 p-2 bg-logo-500">
							<Image
								src="/assets/logo/sorsu-xs.png"
								alt="SorSUcial Logo"
								width={32}
								height={32}
								className="rounded-full h-full w-full"
							/>
						</div>
					</div>
				</div>
				<div className="h-full flex-1 max-w-3xl mx-auto flex flex-row items-center">
					Mid
				</div>
				<div className="h-full w-2xs max-w-2xs flex flex-row items-center justify-end">
					<RightNav
						userStateValue={userStateValue}
						navigationBarStateValue={navigationBarStateValue}
						setNavigationBarStateValue={setNavigationBarStateValue}
						logOutUser={logOutUser}
					/>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
