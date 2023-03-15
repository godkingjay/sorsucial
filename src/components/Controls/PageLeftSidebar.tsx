import Link from "next/link";
import React, { useState } from "react";
import {
	MdAdminPanelSettings,
	MdFeed,
	MdOutlineKeyboardDoubleArrowLeft,
	MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FaBullhorn } from "react-icons/fa";
import { RiDiscussFill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi";

type PageLeftSidebarProps = {};

const PageLeftSidebar: React.FC<PageLeftSidebarProps> = () => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen((prev) => !prev);
	};

	return (
		<div className="z-[100] w-max h-full sticky top-0">
			<div
				className="sticky top-14 w-max h-full max-h-screen"
				style={{
					height: "calc(100vh - 56px)",
				}}
			>
				<div
					className="page-left-sidebar"
					data-open={open}
				>
					<div className="w-full flex flex-col gap-y-2">
						<button
							type="button"
							title={open ? "Close" : "Open"}
							className="open-close-button"
							onClick={handleOpen}
						>
							<div className="label-container">
								<p className="label">SorSUcial</p>
							</div>
							<div className="icon-container">
								{open ? (
									<MdOutlineKeyboardDoubleArrowLeft className="icon" />
								) : (
									<MdOutlineKeyboardDoubleArrowRight className="icon" />
								)}
							</div>
						</button>
						<div className="h-[1px] w-full bg-white bg-opacity-10"></div>
					</div>
					<ul className="flex flex-col">
						<li>
							<p className="list-header">
								{open ? "Site Administration" : "• • •"}
							</p>
						</li>
						<li>
							<Link
								href="/admin/"
								title="Administration"
								className="sidebar-nav-group"
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
					<ul className="flex flex-col">
						<li>
							<p className="list-header">{open ? "Home" : "• • •"}</p>
						</li>
						<li>
							<Link
								href="/"
								title="Announcements"
								className="sidebar-nav-group"
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
	);
};

export default PageLeftSidebar;
