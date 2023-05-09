import { GroupMemberData } from "@/atoms/groupAtom";
import useGroup from "@/hooks/useGroup";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import {
	BsCheck2,
	BsCheckLg,
	BsEye,
	BsEyeFill,
	BsFillCaretUpFill,
	BsFillCircleFill,
} from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

type MemberCardMenuProps = {
	memberData: GroupMemberData;
};

const MemberCardMenu: React.FC<MemberCardMenuProps> = ({ memberData }) => {
	const {
		groupStateValue,
		groupOptionsStateValue,
		setGroupOptionsStateValue,
		onRequestAction,
	} = useGroup();

	const [inAction, setInAction] = useState<boolean>(false);

	const handleMemberOptions = () => {
		if (groupOptionsStateValue.memberMenu === memberData.member.userId) {
			setGroupOptionsStateValue((prev) => ({
				...prev,
				memberMenu: "",
			}));
		} else {
			setGroupOptionsStateValue((prev) => ({
				...prev,
				memberMenu: memberData.member.userId,
			}));
		}
	};

	const handleRequestAction = useCallback(
		async (action: "accept" | "reject") => {
			try {
				if (!inAction) {
					setInAction(true);

					onRequestAction({
						action: action,
						memberData: memberData,
					});

					setInAction(false);
				}
			} catch (error: any) {
				console.log(`=>Hook: Hook User Request Action Error:\n${error.message}`);
				setInAction(false);
			}
		},
		[]
	);

	return (
		<>
			<div className="flex flex-row justify-end">
				<button
					type="button"
					title="Member Menu"
					className="
					h-6 w-6 p-1.5 rounded-md border-gray-500 border-2 shadow-md text-gray-500
					hover:border-blue-500 hover:text-blue-500
					focus:border-blue-500 focus:text-blue-500
					data-[active=true]:bg-blue-500 data-[active=true]:border-blue-500 data-[active=true]:text-white data-[active=true]:rounded-full
					data-[active=true]:hover:bg-blue-600 data-[active=true]:hover:border-blue-600
					group
				"
					data-active={
						groupOptionsStateValue.memberMenu === memberData.member.userId
					}
					onClick={handleMemberOptions}
				>
					<BsFillCaretUpFill className="h-full w-full group-data-[active=true]:rotate-180 duration-100" />
				</button>
			</div>
			<div
				className="
					z-[20] w-56 absolute bg-white rounded-md p-1 shadow-around-xl bottom-11 right-4 duration-100
					flex flex-col
					data-[active=true]:pointer-events-auto data-[active=true]:opacity-100 data-[active=true]:translate-y-0
					data-[active=false]:pointer-events-none data-[active=false]:opacity-0 data-[active=false]:translate-y-[8px]
				"
				data-active={
					groupOptionsStateValue.memberMenu === memberData.member.userId
				}
			>
				<Link
					href={`/user/${memberData.member.userId}`}
					title="View User"
					className="member-menu-item"
					tabIndex={
						groupOptionsStateValue.memberMenu === memberData.member.userId
							? 0
							: -1
					}
				>
					<div className="icon-container">
						<BsEyeFill className="icon" />
					</div>
					<div className="label-container">
						<p className="label">View User</p>
					</div>
				</Link>
				{(memberData.member.roles.includes("pending") ||
					memberData.member.roles.includes("rejected")) &&
					(groupStateValue.currentGroup?.userJoin?.roles.includes("owner") ||
						groupStateValue.currentGroup?.userJoin?.roles.includes("admin") ||
						groupStateValue.currentGroup?.userJoin?.roles.includes(
							"moderator"
						)) && (
						<>
							<button
								type="button"
								title="Accept Request"
								className="member-menu-item"
								aria-label="accept"
								disabled={inAction}
								tabIndex={
									groupOptionsStateValue.memberMenu === memberData.member.userId
										? 0
										: -1
								}
								onClick={() => !inAction && handleRequestAction("accept")}
							>
								<div className="icon-container">
									<BsCheck2 className="icon stroke-2" />
								</div>
								<div className="label-container">
									<p className="label">Accept</p>
								</div>
							</button>
							{memberData.member.roles.includes("pending") && (
								<>
									<button
										type="button"
										title="Reject Request"
										className="member-menu-item"
										aria-label="reject"
										disabled={inAction}
										tabIndex={
											groupOptionsStateValue.memberMenu ===
											memberData.member.userId
												? 0
												: -1
										}
										onClick={() => !inAction && handleRequestAction("reject")}
									>
										<div className="icon-container">
											<RxCross1 className="icon stroke-1" />
										</div>
										<div className="label-container">
											<p className="label">Reject</p>
										</div>
									</button>
								</>
							)}
						</>
					)}
			</div>
		</>
	);
};

export default MemberCardMenu;
