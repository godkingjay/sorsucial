import {
	DiscussionState,
	discussionOptionsState,
	discussionState,
} from "@/atoms/discussionAtom";
import React from "react";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { CreateDiscussionType } from "@/components/Modal/DiscussionCreationModal";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";

const useDiscussion = () => {
	const [discussionStateValue, setDiscussionStateValue] = useRecoilState(discussionState);
	const [discussionOptionsStateValue, setDiscussionOptionsStateValue] =
		useRecoilState(discussionOptionsState);
	const { authUser, userStateValue } = useUser();

	const createDiscussion = async (discussionForm: CreateDiscussionType) => {
		try {
			const discussionDate = new Date();

			const newDiscussion: Partial<SiteDiscussion> = {
				creatorId: userStateValue.user.uid,
				privacy: discussionForm.privacy,
				discussionTitle: discussionForm.discussionTitle,
				discussionBody: discussionForm.discussionBody,
				discussionType: discussionForm.discussionType,
				discussionTags: discussionForm.discussionTags,
				isHidden: false,
				isOpen: true,
				numberOfUpVotes: 0,
				numberOfDownVotes: 0,
				numberOfVotes: 0,
				numberOfReplies: 0,
				updatedAt: discussionDate,
				createdAt: discussionDate,
			};

			if (discussionForm.groupId) {
				newDiscussion.groupId = discussionForm.groupId;
			}

			const newDiscussionData: SiteDiscussion = await axios
				.post(apiConfig.apiEndpoint + "discussion/", {
					newDiscussion,
					creator: userStateValue.user,
				})
				.then((response) => response.data.newDiscussion)
				.catch((error: any) => {
					throw new Error(
						`API(Discussion): Discussion Creation Error:  ${error.message}`
					);
				});

			if (newDiscussionData) {
				setDiscussionStateValue(
					(prev) =>
						({
							...prev,
							discussions: [
								{
									discussion: newDiscussionData,
									creator: userStateValue.user,
								},
								...prev.discussions,
							],
						} as DiscussionState)
				);
			} else {
				throw new Error(`API(Discussion): Discussion Creation Error:  No Data Returned!`);
			}
		} catch (error: any) {
			console.log("Mongo: Creating Discussion Error: ", error.message);
		}
	};

	return {
		discussionStateValue,
		setDiscussionStateValue,
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
		createDiscussion,
	};
};

export default useDiscussion;
