import React from "react";
import CreateNewGroupButton from "./GroupCreationListener/CreateNewGroupButton";
import { useSetRecoilState } from "recoil";
import {
	GroupCreationModalState,
	groupCreationModalState,
} from "@/atoms/modalAtom";

type GroupCreationListenerProps = {};

const GroupCreationListener: React.FC<GroupCreationListenerProps> = () => {
	const setGroupCreationModalStateValue = useSetRecoilState(
		groupCreationModalState
	);

	const handleGroupCreationModal = (tab: GroupCreationModalState["tab"]) => {
		setGroupCreationModalStateValue((prev) => ({
			...prev,
			open: true,
			tab,
		}));
	};

	return (
		<div className="flex flex-row justify-between gap-x-4">
			{/* <div className="bg-white shadow-page-box-1 rounded-lg p-4 flex-1"></div> */}
			<div className="ml-auto block">
				<CreateNewGroupButton
					handleGroupCreationModal={handleGroupCreationModal}
				/>
			</div>
		</div>
	);
};

export default GroupCreationListener;
