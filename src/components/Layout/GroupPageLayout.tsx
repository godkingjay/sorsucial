import React from "react";
import GroupPageHeader from "../Group/GroupPageHeader";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { CurrentDirectory } from "./Layout";

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

	return (
		<>
			<div className="flex-1">
				{groupStateValue.currentGroup && (
					<>
						<GroupPageHeader
							groupData={groupStateValue.currentGroup}
							userStateValue={userStateValue}
						/>
						<div className="sticky flex flex-col items-center top-14 bg-white shadow-page-box-1">
							<div className="w-full flex flex-col max-w-5xl px-8 py-4">
								<p>Navigation</p>
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
