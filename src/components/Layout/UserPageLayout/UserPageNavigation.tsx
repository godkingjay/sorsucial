import { currentDirectoryState } from "@/atoms/navigationBarAtom";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import React from "react";
import {
	BsPostcard,
	BsPostcardFill,
	BsChatLeftText,
	BsChatLeftTextFill,
	BsPeople,
	BsPeopleFill,
	BsInfoCircle,
	BsInfoCircleFill,
} from "react-icons/bs";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi";
import { IoImagesOutline, IoImages } from "react-icons/io5";
import { useRecoilValue } from "recoil";

const UserPageNavigation = () => {
	const { userStateValue } = useUser();
	const currentDirectoryStateValue = useRecoilValue(currentDirectoryState);

	return (
		<>
			{userStateValue.userPage && (
				<div className="z-20 sticky flex flex-col items-center top-14 bg-white shadow-page-box-1">
					<div className="w-full max-w-4xl flex flex-row px-8 py-1 overflow-x-auto scroll-x-style">
						<Link
							href={`/user/${userStateValue.userPage.user.uid}`}
							className="user-nav-bar-item"
							title="Posts"
							data-active={
								!currentDirectoryStateValue.third ||
								currentDirectoryStateValue.third === "posts" ||
								currentDirectoryStateValue.third === ""
							}
						>
							<p className="text">Posts</p>
							<div className="icon-container">
								<BsPostcard className="icon inactive" />
								<BsPostcardFill className="icon active" />
							</div>
							<div className="indicator"></div>
						</Link>
						<Link
							href={`/user/${userStateValue.userPage.user.uid}/discussions/`}
							className="user-nav-bar-item"
							title="Discussions"
							data-active={currentDirectoryStateValue.third === "discussions"}
						>
							<p className="text">Discussions</p>
							<div className="icon-container">
								<BsChatLeftText className="icon inactive" />
								<BsChatLeftTextFill className="icon active" />
							</div>
							<div className="indicator"></div>
						</Link>
						<Link
							href={`/user/${userStateValue.userPage.user.uid}/groups/`}
							className="user-nav-bar-item"
							title="Groups"
							data-active={currentDirectoryStateValue.third === "groups"}
						>
							<p className="text">Groups</p>
							<div className="icon-container">
								<HiOutlineUserGroup className="icon inactive" />
								<HiUserGroup className="icon active" />
							</div>
							<div className="indicator"></div>
						</Link>
						{/* <Link
							href={`/user/${userStateValue.userPage.user.uid}/gallery/`}
							className="user-nav-bar-item"
							title="Gallery"
							data-active={currentDirectoryStateValue.third === "gallery"}
						>
							<p className="text">Gallery</p>
							<div className="icon-container">
								<IoImagesOutline className="icon inactive" />
								<IoImages className="icon active" />
							</div>
							<div className="indicator"></div>
						</Link> */}
						{/* <Link
							href={`/user/${userStateValue.userPage.user.uid}/connections/`}
							className="user-nav-bar-item"
							title="Connections"
							data-active={currentDirectoryStateValue.third === "connections"}
						>
							<p className="text">Connections</p>
							<div className="icon-container">
								<BsPeople className="icon inactive" />
								<BsPeopleFill className="icon active" />
							</div>
							<div className="indicator"></div>
						</Link> */}
						<Link
							href={`/user/${userStateValue.userPage.user.uid}/about/`}
							className="user-nav-bar-item"
							title="About"
							data-active={currentDirectoryStateValue.third === "about"}
						>
							<p className="text">About</p>
							<div className="icon-container">
								<BsInfoCircle className="icon inactive" />
								<BsInfoCircleFill className="icon active" />
							</div>
							<div className="indicator"></div>
						</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default UserPageNavigation;
