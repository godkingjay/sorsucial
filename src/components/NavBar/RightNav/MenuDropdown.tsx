import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import React from "react";
import {
	BsFileEarmarkText,
	BsFileEarmarkTextFill,
	BsFillFileEarmarkTextFill,
} from "react-icons/bs";
import { CgMenuGridO } from "react-icons/cg";
import { CiBullhorn } from "react-icons/ci";
import { FaBullhorn } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";

type MenuDropdownProps = {
	userStateValue: UserState;
	navigationBarStateValue: NavigationBarState;
	handleMenuDropdown: () => void;
	handleMenuCreateClick: (
		type: "announcement" | "post" | "discussion" | "group"
	) => void;
};

const MenuDropdown: React.FC<MenuDropdownProps> = ({
	userStateValue,
	navigationBarStateValue,
	handleMenuDropdown,
	handleMenuCreateClick,
}) => {
	return (
		<div className="h-full flex flex-row items-center">
			<button
				type="button"
				title="Menu"
				className="h-11 w-11 rounded-full bg-gray-200 text-gray-600 p-2 hover:bg-gray-300 focus:bg-gray-300"
				onClick={handleMenuDropdown}
			>
				<CgMenuGridO className="h-full w-full" />
			</button>
			<div
				className="menu-dropdown-wrapper"
				data-open={navigationBarStateValue.menuDropdown.open}
			>
				<div className="menu-dropdown !max-h-[384px]">
					<div className="flex flex-col overflow-y-auto scroll-y-style p-4 bg-gray-50 gap-y-4">
						<div className="p-4 bg-white shadow-page-box-1 rounded-lg flex row">
							<div className="flex-1 flex flex-col">
								<h2 className="font-bold text-lg">Create</h2>
								<div className="grid grid-cols-1 xs:grid-cols-2">
									{userStateValue.user.roles.includes("admin") && (
										<button
											type="button"
											title="Announcement"
											className="flex flex-row items-center gap-x-4 px-3 py-2 rounded-md hover:bg-gray-100"
											onClick={() => handleMenuCreateClick("announcement")}
										>
											<div className="h-10 w-10 p-2.5 bg-gray-300 rounded-full">
												<CiBullhorn className="h-full w-full text-black" />
											</div>
											<div>
												<p className="text-sm font-semibold">Announcement</p>
											</div>
										</button>
									)}
									<button
										type="button"
										title="Post"
										className="flex flex-row items-center gap-x-4 px-3 py-2 rounded-md hover:bg-gray-100"
										onClick={() => handleMenuCreateClick("post")}
									>
										<div className="h-10 w-10 p-2.5 bg-gray-300 rounded-full">
											<BsFileEarmarkTextFill className="h-full w-full text-black" />
										</div>
										<div>
											<p className="text-sm font-semibold">Post</p>
										</div>
									</button>
									<button
										type="button"
										title="Discussion"
										className="flex flex-row items-center gap-x-4 px-3 py-2 rounded-md hover:bg-gray-100"
										onClick={() => handleMenuCreateClick("discussion")}
									>
										<div className="h-10 w-10 p-2.5 bg-gray-300 rounded-full">
											<GoCommentDiscussion className="h-full w-full text-black" />
										</div>
										<div>
											<p className="text-sm font-semibold">Discussion</p>
										</div>
									</button>
									<button
										type="button"
										title="Group"
										className="flex flex-row items-center gap-x-4 px-3 py-2 rounded-md hover:bg-gray-100"
										onClick={() => handleMenuCreateClick("group")}
									>
										<div className="h-10 w-10 p-2.5 bg-gray-300 rounded-full">
											<HiUserGroup className="h-full w-full text-black" />
										</div>
										<div>
											<p className="text-sm font-semibold">Group</p>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MenuDropdown;
