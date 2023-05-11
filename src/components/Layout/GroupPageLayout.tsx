import React from "react";
import GroupPageHeader from "../Group/GroupPageHeader";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import Link from "next/link";
import LimitedBodyLayout from "./LimitedBodyLayout";
import {
	BsChatLeftText,
	BsChatLeftTextFill,
	BsFillPeopleFill,
	BsInfoCircle,
	BsInfoCircleFill,
	BsPeople,
	BsPeopleFill,
	BsPersonFillExclamation,
	BsPersonFillSlash,
	BsPostcard,
	BsPostcardFill,
} from "react-icons/bs";
import { IoImages, IoImagesOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { currentDirectoryState } from "@/atoms/navigationBarAtom";
import GroupPageMembersNavigation from "./GroupPageLayout/GroupPageMembersNavigation";

type GroupPageProps = {
	children: React.ReactNode;
};

const GroupPageLayout: React.FC<GroupPageProps> = ({ children }) => {
	const { userStateValue } = useUser();
	const { groupStateValue } = useGroup();

	const [currentDirectoryStateValue, setCurrentDirectoryStateValue] =
		useRecoilState(currentDirectoryState);

	const router = useRouter();
	const { groupId } = router.query;

	return (
		<>
			<div className="flex-1">
				{groupStateValue.currentGroup &&
					groupStateValue.currentGroup.group.id === groupId && (
						<>
							<div className="z-20 flex flex-col">
								<GroupPageHeader
									groupData={groupStateValue.currentGroup}
									userStateValue={userStateValue}
								/>
							</div>
							<div className="z-20 sticky flex flex-col items-center top-14 bg-white shadow-page-box-1">
								<div className="w-full max-w-4xl flex flex-row px-8 py-1 overflow-x-auto scroll-x-style">
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}`}
										className="group-nav-bar-item"
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
										href={`/groups/${groupStateValue.currentGroup.group.id}/discussions/`}
										className="group-nav-bar-item"
										title="Discussions"
										data-active={
											currentDirectoryStateValue.third === "discussions"
										}
									>
										<p className="text">Discussions</p>
										<div className="icon-container">
											<BsChatLeftText className="icon inactive" />
											<BsChatLeftTextFill className="icon active" />
										</div>
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/gallery/`}
										className="group-nav-bar-item"
										title="Gallery"
										data-active={currentDirectoryStateValue.third === "gallery"}
									>
										<p className="text">Gallery</p>
										<div className="icon-container">
											<IoImagesOutline className="icon inactive" />
											<IoImages className="icon active" />
										</div>
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/members/`}
										className="group-nav-bar-item"
										title="Members"
										data-active={currentDirectoryStateValue.third === "members"}
									>
										<p className="text">Members</p>
										<div className="icon-container">
											<BsPeople className="icon inactive" />
											<BsPeopleFill className="icon active" />
										</div>
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/about/`}
										className="group-nav-bar-item"
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
						</>
					)}
				{currentDirectoryStateValue.third === "members" &&
				groupStateValue.currentGroup ? (
					<>
						<LimitedBodyLayout>
							<div className="flex flex-col md:flex-row">
								{groupStateValue.currentGroup.userJoin?.roles?.includes(
									"member"
								) ? (
									<>
										<GroupPageMembersNavigation />
									</>
								) : groupStateValue.currentGroup.group.privacy === "public" ? (
									<>
										<GroupPageMembersNavigation />
									</>
								) : (
									<></>
								)}
								{children}
							</div>
						</LimitedBodyLayout>
					</>
				) : (
					children
				)}
			</div>
		</>
	);
};

export default GroupPageLayout;
