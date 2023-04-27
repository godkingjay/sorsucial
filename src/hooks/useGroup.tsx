import { groupState } from "@/atoms/groupAtom";
import { CreateGroupType } from "@/components/Modal/GroupCreationModal";
import React, { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { SiteGroup } from "@/lib/interfaces/group";
import { doc } from "firebase/firestore";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";

const useGroup = () => {
	const [groupStateValue, setGroupStateValue] = useRecoilState(groupState);
	const { authUser, userStateValue } = useUser();

	const groupStateValueMemo = useMemo(() => groupStateValue, [groupStateValue]);
	const setGroupStateValueMemo = useMemo(
		() => setGroupStateValue,
		[setGroupStateValue]
	);

	const createGroup = useCallback(async (group: CreateGroupType) => {
		try {
			const groupDate = new Date();

			const newGroup: Partial<SiteGroup> = {
				name: group.name,
				description: group.description,
				groupTags: group.groupTags,
				privacy: group.privacy,
				creatorId: authUser?.uid,
				numberOfMembers: 1,
				numberOfPosts: 0,
				numberOfDiscussions: 0,
				updatedAt: groupDate,
				createdAt: groupDate,
			};

			// const { groupData }: { groupData: SiteGroup } = await axios
			// 	.post(apiConfig.apiEndpoint + "/groups/", {
			// 		apiKey: userStateValue.api?.keys[0].key,
			// 		groupData: newGroup,
			// 	})
			// 	.then((response) => response.data)
			// 	.catch((error) => {
			// 		throw new Error(`API: Group Creation Error:\n${error.message}`);
			// 	});
		} catch (error: any) {
			console.log(`Mongo: Create Group Error:\n${error.message}`);
		}
	}, []);

	return {
		groupStateValue: groupStateValueMemo,
		setGroupStateValue: setGroupStateValueMemo,
		createGroup,
	};
};

export default useGroup;
