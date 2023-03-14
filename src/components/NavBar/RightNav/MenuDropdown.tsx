import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import React from "react";
import { FiMenu } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";

type MenuDropdownProps = {
	userStateValue: UserState;
	navigationBarStateValue: NavigationBarState;
	handleMenuDropdown: () => void;
};

const MenuDropdown: React.FC<MenuDropdownProps> = ({
	userStateValue,
	navigationBarStateValue,
	handleMenuDropdown,
}) => {
	return (
		<div className="h-full flex flex-row items-center">
			<button
				type="button"
				title="Menu"
				className="h-11 w-11 rounded-full bg-gray-200 text-gray-800 p-3 hover:bg-gray-300 focus:bg-gray-300"
				onClick={handleMenuDropdown}
			>
				<FiMenu className="h-full w-full" />
			</button>
			<div
				className={`
						absolute w-full top-0 px-4 max-w-lg right-0 duration-75 max-h-screen pt-14 pb-4 flex flex-col pointer-events-none
						${
							navigationBarStateValue.menuDropdown.open
								? " "
								: " translate-y-[-8px] opacity-0 [&_*]:pointer-events-none"
						}
					`}
			>
				<div className="menu-dropdown !max-h-[384px]"></div>
			</div>
		</div>
	);
};

export default MenuDropdown;
