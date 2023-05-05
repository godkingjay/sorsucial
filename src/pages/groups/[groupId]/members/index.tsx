import { GroupData, GroupState } from "@/atoms/groupAtom";
import GroupPageLoader from "@/components/Group/GroupPageLoader";
import PostsFilter from "@/components/Post/PostsFilter";
import useGroup from "@/hooks/useGroup";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BiBlock } from "react-icons/bi";
import {
	BsFillPeopleFill,
	BsPersonFillExclamation,
	BsPersonFillSlash,
} from "react-icons/bs";
import safeJsonStringify from "safe-json-stringify";

type GroupPageMembersPageProps = {
	groupPageData: GroupState["currentGroup"];
	loadingPage: boolean;
};

const GroupPageMembersPage: React.FC<GroupPageMembersPageProps> = ({
	groupPageData,
	loadingPage = true,
}) => {
	const { groupStateValue } = useGroup();
	const router = useRouter();
	const { groupId } = router.query;

	return (
		<>
			<GroupPageLoader
				groupPageData={groupPageData}
				loadingGroup={loadingPage}
			>
				{groupStateValue.currentGroup &&
					groupStateValue.currentGroup?.group.id === groupId && (
						<>
							<div className="flex flex-row gap-x-4 gap-y-4">
								<div className="sticky top-[120px] h-max">
									<div className="relative h-full flex-1 flex flex-col border gap-x-2 rounded-lg shadow-page-box-1 bg-white p-1 w-48">
										<Link
											href={`/groups/${groupStateValue.currentGroup.group.id}/members/`}
											title="Members"
											className="px-4 py-2 flex flex-row items-center gap-x-2 text-left font-semibold text-sm text-gray-500 hover:bg-gray-100 rounded-md"
										>
											<div className="h-4 w-4">
												<BsFillPeopleFill className="h-full w-full" />
											</div>
											<p>Members</p>
										</Link>
										<Link
											href={`/groups/${groupStateValue.currentGroup.group.id}/members/requests/`}
											title="Requests"
											className="px-4 py-2 flex flex-row items-center gap-x-2 text-left font-semibold text-sm text-gray-500 hover:bg-gray-100 rounded-md"
										>
											<div className="h-4 w-4">
												<BsPersonFillExclamation className="h-full w-full" />
											</div>
											<p>Requests</p>
										</Link>
										<Link
											href={`/groups/${groupStateValue.currentGroup.group.id}/members/banned/`}
											title="Banned"
											className="px-4 py-2 flex flex-row items-center gap-x-2 text-left font-semibold text-sm text-red-500 hover:bg-red-100 rounded-md"
										>
											<div className="h-4 w-4">
												<BsPersonFillSlash className="h-full w-full" />
											</div>
											<p>Banned</p>
										</Link>
									</div>
								</div>
								<div className="relative h-full flex-1 flex flex-col bg-black"></div>
							</div>
						</>
					)}
			</GroupPageLoader>
		</>
	);
};

export default GroupPageMembersPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { groupsCollection } = await groupDb();

		const { groupId } = context.query;

		const groupPageData: Partial<GroupData> = {
			group: (await groupsCollection.findOne({
				id: groupId,
			})) as unknown as GroupData["group"],
		};

		if (groupPageData.group !== null) {
			groupPageData.creator = (await usersCollection.findOne({
				uid: groupPageData.group?.creatorId,
			})) as unknown as GroupData["creator"];
		}

		return {
			props: {
				groupPageData: groupPageData.group
					? JSON.parse(safeJsonStringify(groupPageData))
					: null,
				loadingPage: false,
			},
		};
	} catch (error: any) {
		return {
			notFound: true,
		};
	}
};
