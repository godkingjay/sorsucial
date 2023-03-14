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
		<div className="sticky top-0 w-full h-14 bg-white shadow-sm z-[1000]">
			<div className="h-14 w-full flex flex-row items-center">
				<div className="h-full lg:w-full lg:max-w-2xs">
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
				<div className="h-full flex-1 flex flex-col items-center">
					<div className="w-full max-w-3xl h-full bg-green-100">Mid</div>
				</div>
				<div className="h-full flex flex-row items-center justify-end md:w-56">
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
