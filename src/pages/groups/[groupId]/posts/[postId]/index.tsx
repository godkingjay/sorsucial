import { GroupData, GroupState } from "@/atoms/groupAtom";
import { PostData, PostState } from "@/atoms/postAtom";
import GroupPageLoader from "@/components/Group/GroupPageLoader";
import SinglePostView from "@/components/Post/SinglePostView";
import useGroup from "@/hooks/useGroup";
import groupDb from "@/lib/db/groupDb";
import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type GroupPostViewProps = {
	groupPageData: GroupState["currentGroup"];
	postPageData: PostState["currentPost"];
	loadingPage: boolean;
};

const GroupPostView: React.FC<GroupPostViewProps> = ({
	groupPageData,
	postPageData,
	loadingPage = true,
}) => {
	const router = useRouter();
	const { groupStateValue } = useGroup();
	const { groupId, postId } = router.query;

	return (
		<>
			<GroupPageLoader
				groupPageData={groupPageData}
				loadingGroup={loadingPage}
			>
				{groupStateValue.currentGroup?.group.id === groupId && (
					<SinglePostView
						loadingPost={loadingPage}
						postPageData={postPageData}
						type="group-post"
					/>
				)}
			</GroupPageLoader>
		</>
	);
};

export default GroupPostView;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { groupsCollection } = await groupDb();
		const { postsCollection } = await postDb();
		const { groupId, postId } = context.query;

		const postPageData: Partial<PostData> = {
			post: (await postsCollection.findOne({
				id: postId,
				groupId: groupId,
				postType: "group",
			})) as unknown as PostData["post"],
		};

		const groupPageData: Partial<GroupData> = {
			group: (await groupsCollection.findOne({
				id: groupId,
			})) as unknown as GroupData["group"],
		};

		if (postPageData.post !== null) {
			postPageData.creator = (await usersCollection.findOne({
				uid: postPageData.post?.creatorId,
			})) as unknown as PostData["creator"];
		}

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
				postPageData: postPageData.post
					? JSON.parse(safeJsonStringify(postPageData))
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
