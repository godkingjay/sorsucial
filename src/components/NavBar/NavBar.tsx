import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import React, { useRef } from "react";
import RightNav from "./RightNav";
import { SetterOrUpdater } from "recoil";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";

type NavBarProps = {
	userStateValue: UserState;
	authLoading: boolean;
	logOutUser: () => void;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
};

const NavBar: React.FC<NavBarProps> = ({
	userStateValue,
	authLoading,
	logOutUser,
	navigationBarStateValue,
	setNavigationBarStateValue,
}) => {
	const searchBoxRef = useRef<HTMLInputElement>(null);

	return (
		<div className="sticky top-0 w-full h-14 bg-white shadow-sm z-[1000]">
			<div className="h-14 w-full flex flex-row items-center">
				<div className="h-full lg:w-full lg:max-w-2xs">
					<div className="flex flex-row w-full h-full items-center gap-x-2">
						<Link
							href={"/"}
							className="aspect-square h-14 w-14 p-2 bg-logo-500"
						>
							<Image
								src="/assets/logo/sorsu-xs.png"
								alt="SorSUcial Logo"
								width={128}
								height={128}
								className="rounded-full h-full w-full"
							/>
						</Link>
					</div>
				</div>
				<div className="h-full flex-1 flex flex-col items-center mx-2">
					<div className="w-full max-w-3xl h-full flex flex-row items-center p-2">
						<div className="flex-1 flex flex-row h-full bg-gray-100 rounded-full px-4 py-2 items-center gap-x-4">
							<button
								type="button"
								title="Search"
								className="h-5 w-5 text-gray-400 cursor-text"
								onClick={() => {
									searchBoxRef.current?.focus();
								}}
							>
								<BsSearch className="h-full w-full" />
							</button>
							<input
								name="search"
								type="text"
								title="Search SorSUcial"
								placeholder="Search posts, discussions, people..."
								className="flex-1 outline-none text-sm"
								ref={searchBoxRef}
							/>
						</div>
					</div>
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
