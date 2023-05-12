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
import GroupPageNavigation from "./GroupPageLayout/GroupPageNavigation";

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
							<GroupPageNavigation />
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
								) : groupStateValue.currentGroup.group.privacy !== "private" ? (
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
