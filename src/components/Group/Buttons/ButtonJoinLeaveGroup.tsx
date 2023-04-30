import { GroupMember } from "@/lib/interfaces/group";
import React from "react";
import { FiLoader } from "react-icons/fi";
import { MdGroupAdd, MdBlock, MdOutlineTimer, MdCheck } from "react-icons/md";

type ButtonJoinLeaveGroupProps = {
	joiningGroup: boolean;
	userJoin: GroupMember | null;
	handleJoinGroup: () => Promise<void>;
};

const ButtonJoinLeaveGroup: React.FC<ButtonJoinLeaveGroupProps> = ({
	joiningGroup,
	userJoin,
	handleJoinGroup,
}) => {
	return (
		<button
			type="button"
			title="Join"
			onClick={() =>
				(!userJoin?.roles.includes("banned") || joiningGroup) &&
				handleJoinGroup()
			}
			className="page-button group-join-leave-button"
			data-state={
				userJoin
					? userJoin.roles.includes("rejected")
						? "rejected"
						: userJoin.roles.includes("banned")
						? "banned"
						: userJoin.roles.includes("pending")
						? "pending"
						: "joined"
					: "join"
			}
			disabled={joiningGroup || userJoin?.roles.includes("banned")}
		>
			{!joiningGroup ? (
				<>
					<div className="icon-container">
						{userJoin ? (
							userJoin.roles.includes("rejected") ? (
								<MdGroupAdd className="icon" />
							) : userJoin.roles.includes("banned") ? (
								<MdBlock className="icon" />
							) : userJoin.roles.includes("pending") ? (
								<MdOutlineTimer className="icon" />
							) : (
								<MdCheck className="icon" />
							)
						) : (
							<MdGroupAdd className="icon" />
						)}
					</div>
					<div>
						<p>
							{userJoin
								? userJoin.roles.includes("rejected")
									? "Join"
									: userJoin.roles.includes("banned")
									? "Banned"
									: userJoin.roles.includes("pending")
									? "Pending"
									: "Joined"
								: "Join"}
						</p>
					</div>
				</>
			) : (
				<div className="loading-spinner animate-spin">
					<FiLoader className="h-full w-full" />
				</div>
			)}
		</button>
	);
};

export default ButtonJoinLeaveGroup;
