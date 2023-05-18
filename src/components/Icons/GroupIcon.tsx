import { SiteGroup } from "@/lib/interfaces/group";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiGroup2Fill } from "react-icons/ri";

type GroupIconProps = {
	group: SiteGroup | null;
	disabled?: boolean;
};

const GroupIcon: React.FC<GroupIconProps> = ({ group, disabled = false }) => {
	return (
		<>
			{group ? (
				<Link
					href={`/groups/${group.id}`}
					title={`${group.name}`}
					className="h-full w-full flex relative aspect-square rounded-full overflow-hidden border border-transparent text-gray-300 data-[disabled=true]:pointer-events-none"
					data-disabled={disabled}
					tabIndex={disabled ? -1 : 0}
				>
					{group.image?.fileURL ? (
						<Image
							src={group.image?.fileURL}
							alt={group.name}
							sizes="128px"
							fill
							loading="lazy"
							className="w-full bg-center object-cover"
						/>
					) : (
						<RiGroup2Fill className="h-full w-full scale-125" />
					)}
				</Link>
			) : (
				<div className="h-full w-full aspect-square rounded-full overflow-hidden border border-transparent text-gray-300">
					<RiGroup2Fill className="h-full w-full scale-125" />
				</div>
			)}
		</>
	);
};

export default GroupIcon;
