import { ObjectId } from "mongodb";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";
import discussionDb from "@/lib/db/discussionDb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { discussionsCollection, discussionVotesCollection } =
			await discussionDb();
		const {
			apiKey,
			discussionData,
			creator,
		}: {
			apiKey: string;
			discussionData: SiteDiscussion;
			creator: SiteUser;
		} = req.body || req.query;

		switch (req.method) {
			case "POST": {
				if (!discussionData) {
					res.status(400).json({ error: "No discussion data provided!" });
					break;
				}

				if (!creator) {
					res.status(400).json({ error: "No creator data provided!" });
					break;
				}

				if (discussionData.creatorId !== creator.uid) {
					res
						.status(400)
						.json({ error: "Creator ID does not match creator UID!" });
					break;
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				discussionData.id = objectIdString;

				const newDiscussionState = await discussionsCollection
					.insertOne({
						...discussionData,
						_id: objectId,
					})
					.catch((error: any) => {
						res.status(500).json({ error: error.message });
						throw new Error("Mongo: Creating document error: ", error.message);
					});

				res.status(200).json({
					newDiscussionState,
					newDiscussion: discussionData,
				});
				break;
			}

			case "DELETE": {
			}

			default: {
				res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
