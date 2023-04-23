import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import React from "react";
import { AiFillBell } from "react-icons/ai";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { CgMenuGridO } from "react-icons/cg";
import { CiBullhorn } from "react-icons/ci";
import { GoCommentDiscussion } from "react-icons/go";
import { HiBell, HiUserGroup } from "react-icons/hi";

type NotificationDropdownProps = {
	userStateValue: UserState;
	navigationBarStateValue: NavigationBarState;
	handleNotificationDropdown: () => void;
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	userStateValue,
	navigationBarStateValue,
	handleNotificationDropdown,
}) => {
	return (
		<div className="h-full flex flex-row items-center">
			<button
				type="button"
				title="Notifications"
				className="h-11 w-11 rounded-full bg-gray-200 text-gray-600 p-2.5 hover:bg-gray-300 focus:bg-gray-300"
				onClick={handleNotificationDropdown}
			>
				<HiBell className="h-full w-full" />
			</button>
			<div
				className="notification-dropdown-wrapper !max-w-sm"
				data-open={navigationBarStateValue.notificationDropdown.open}
			>
				<div className="notification-dropdown">
					<div className="flex flex-col overflow-y-auto scroll-y-style p-4 bg-gray-50 gap-y-4">
						<div>
							<h2 className="text-lg font-bold">Notifications</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationDropdown;
