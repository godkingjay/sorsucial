import React from "react";
import GroupPageHeader from "../Group/GroupPageHeader";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { CurrentDirectory } from "./Layout";
import { useRouter } from "next/router";
import Link from "next/link";

type GroupPageProps = {
	children: React.ReactNode;
	currentDirectory: CurrentDirectory;
};

const GroupPageLayout: React.FC<GroupPageProps> = ({
	children,
	currentDirectory,
}) => {
	const { userStateValue } = useUser();
	const { groupStateValue } = useGroup();
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
								<div className="w-full flex flex-row max-w-5xl px-8">
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}`}
										className="group-nav-bar-item"
										data-active={
											!currentDirectory.third || currentDirectory.third === ""
										}
									>
										Posts
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/discussions/`}
										className="group-nav-bar-item"
										data-active={currentDirectory.third === "discussions"}
									>
										Discussions
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/gallery/`}
										className="group-nav-bar-item"
										data-active={currentDirectory.third === "gallery"}
									>
										Gallery
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/members/`}
										className="group-nav-bar-item"
										data-active={currentDirectory.third === "members"}
									>
										Members
										<div className="indicator"></div>
									</Link>
									<Link
										href={`/groups/${groupStateValue.currentGroup.group.id}/about/`}
										className="group-nav-bar-item"
										data-active={currentDirectory.third === "about"}
									>
										About
										<div className="indicator"></div>
									</Link>
								</div>
							</div>
						</>
					)}
				{children}
			</div>
		</>
	);
};

export default GroupPageLayout;
