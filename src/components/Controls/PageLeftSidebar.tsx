import Link from "next/link";
import React from "react";
import {
	MdAdminPanelSettings,
	MdFeed,
	MdOutlineKeyboardDoubleArrowLeft,
	MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FaBullhorn } from "react-icons/fa";
import { RiDiscussFill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { SetterOrUpdater } from "recoil";
import { UserState } from "@/atoms/userAtom";

type PageLeftSidebarProps = {
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
	userStateValue: UserState;
};

const PageLeftSidebar: React.FC<PageLeftSidebarProps> = ({
	navigationBarStateValue,
	setNavigationBarStateValue,
	userStateValue,
}) => {
	const handleOpen = () => {
		setNavigationBarStateValue((prev) => ({
			...prev,
			pageLeftSidebar: {
				...prev.pageLeftSidebar,
				open: !prev.pageLeftSidebar.open,
			},
		}));
	};

	return (
		<>
			<div
				className="z-[590] hidden fixed w-full h-full data-[open=true]:block"
				data-open={navigationBarStateValue.pageLeftSidebar.open}
			>
				<div className="sticky h-full w-full bg-black bg-opacity-20 top-0"></div>
			</div>
			<div className="z-[600] w-14 h-full sticky top-0">
				<div className="sticky top-14 w-max h-full page-left-sidebar-wrapper">
					<div
						className="page-left-sidebar"
						data-open={navigationBarStateValue.pageLeftSidebar.open}
					>
						<div className="w-full flex flex-col gap-y-2">
							<button
								type="button"
								title={
									navigationBarStateValue.pageLeftSidebar.open ? "Close" : "Open"
								}
								className="open-close-button"
								onClick={handleOpen}
							>
								<div className="label-container">
									<p className="label">SorSUcial</p>
								</div>
								<div className="icon-container">
									{navigationBarStateValue.pageLeftSidebar.open ? (
										<MdOutlineKeyboardDoubleArrowLeft className="icon" />
									) : (
										<MdOutlineKeyboardDoubleArrowRight className="icon" />
									)}
								</div>
							</button>
							<div className="h-[1px] w-full bg-white bg-opacity-10"></div>
						</div>
						{userStateValue.user.roles.includes("admin") && (
							<ul className="flex flex-col">
								<li>
									<p className="list-header">
										{navigationBarStateValue.pageLeftSidebar.open
											? "Site Administration"
											: "• • •"}
									</p>
								</li>
								<li>
									<Link
										href="/admin/"
										title="Administration"
										className="sidebar-nav-group"
										role="button"
										data-active={
											navigationBarStateValue.pageLeftSidebar.current === "admin"
										}
									>
										<div className="icon-container">
											<MdAdminPanelSettings className="icon" />
										</div>
										<div className="label-container">
											<p className="label">Administration</p>
										</div>
									</Link>
								</li>
							</ul>
						)}
						<ul className="flex flex-col">
							<li>
								<p className="list-header">
									{navigationBarStateValue.pageLeftSidebar.open
										? "Home"
										: "• • •"}
								</p>
							</li>
							<li>
								<Link
									href="/"
									title="Announcements"
									className="sidebar-nav-group"
									role="button"
									data-active={
										navigationBarStateValue.pageLeftSidebar.current === ""
									}
								>
									<div className="icon-container">
										<FaBullhorn className="icon" />
									</div>
									<div className="label-container">
										<p className="label">Announcements</p>
									</div>
								</Link>
							</li>
							<li>
								<Link
									href="/feeds/"
									title="Feeds"
									className="sidebar-nav-group"
									role="button"
									data-active={
										navigationBarStateValue.pageLeftSidebar.current === "feeds"
									}
								>
									<div className="icon-container">
										<MdFeed className="icon" />
									</div>
									<div className="label-container">
										<p className="label">Feeds</p>
									</div>
								</Link>
							</li>
							<li>
								<Link
									href="/discussions/"
									title="Discussions"
									className="sidebar-nav-group"
									role="button"
									data-active={
										navigationBarStateValue.pageLeftSidebar.current ===
										"discussions"
									}
								>
									<div className="icon-container">
										<RiDiscussFill className="icon" />
									</div>
									<div className="label-container">
										<p className="label">Discussions</p>
									</div>
								</Link>
							</li>
							<li>
								<Link
									href="/groups/"
									title="Groups"
									className="sidebar-nav-group"
									role="button"
									data-active={
										navigationBarStateValue.pageLeftSidebar.current === "groups"
									}
								>
									<div className="icon-container">
										<HiUserGroup className="icon" />
									</div>
									<div className="label-container">
										<p className="label">Groups</p>
									</div>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default PageLeftSidebar;
