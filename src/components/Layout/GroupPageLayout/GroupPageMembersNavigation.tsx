import { currentDirectoryState } from "@/atoms/navigationBarAtom";
import useGroup from "@/hooks/useGroup";
import Link from "next/link";
import React from "react";
import {
	BsFillPeopleFill,
	BsPersonFillExclamation,
	BsPersonFillSlash,
} from "react-icons/bs";
import { useRecoilValue } from "recoil";

type GroupPageMembersNavigationProps = {};

const GroupPageMembersNavigation: React.FC<
	GroupPageMembersNavigationProps
> = () => {
	const { groupStateValue } = useGroup();
	const currentDirectoryStateValue = useRecoilValue(currentDirectoryState);

	return (
		<>
			{groupStateValue.currentGroup && (
				<div className="md:sticky md:top-[104px] h-max pt-4 pl-4 pr-4 md:pr-0">
					<div className="relative h-full flex-1 flex flex-col gap-x-2 rounded-lg shadow-page-box-1 bg-white p-1 md:w-40">
						<Link
							href={`/groups/${groupStateValue.currentGroup.group.id}/members/`}
							title="Members"
							className="group-members-nav-item"
							data-active={
								(currentDirectoryStateValue.fourth === "" ||
									!currentDirectoryStateValue.fourth) &&
								currentDirectoryStateValue.third === "members"
							}
						>
							<div className="icon-container">
								<BsFillPeopleFill className="icon" />
							</div>
							<p>Members</p>
						</Link>
						<Link
							href={`/groups/${groupStateValue.currentGroup.group.id}/members/requests/`}
							title="Requests"
							className="group-members-nav-item"
							data-active={currentDirectoryStateValue.fourth === "requests"}
						>
							<div className="icon-container">
								<BsPersonFillExclamation className="icon" />
							</div>
							<p>Requests</p>
						</Link>
						{/* <Link
							href={`/groups/${groupStateValue.currentGroup.group.id}/members/banned/`}
							title="Banned"
							className="group-members-nav-item"
							data-active={currentDirectoryStateValue.fourth === "banned"}
							data-banned
						>
							<div className="icon-container">
								<BsPersonFillSlash className="icon" />
							</div>
							<p>Banned</p>
						</Link> */}
					</div>
				</div>
			)}
		</>
	);
};

export default GroupPageMembersNavigation;
