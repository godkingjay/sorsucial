import { APIEndpointPostsParams } from "./../../../lib/types/api";
import { PostData } from "@/atoms/postAtom";
import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { PostLike, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import { Document, WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

/**--------------------------------------------------------------------------------------------------------------------
 *
 * ~ ██████╗  ██████╗ ███████╗████████╗███████╗    ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~ ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~ ██████╔╝██║   ██║███████╗   ██║   ███████╗    █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~ ██╔═══╝ ██║   ██║╚════██║   ██║   ╚════██║    ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~ ██║     ╚██████╔╝███████║   ██║   ███████║    ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~ ╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 * --------------------------------------------------------------------------------------------------------------------
 */
/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 *
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();
		const { postsCollection, postLikesCollection } = await postDb();

		const {
			apiKey,
			userId,
			postType = "feed",
			privacy = "public",
			groupId,
			tags,
			creator,
			lastIndex = -1,
			fromLikes = Number.MAX_SAFE_INTEGER,
			fromComments = Number.MAX_SAFE_INTEGER,
			fromDate = new Date().toISOString(),
			sortBy = "latest",
			limit = 10,
		}: APIEndpointPostsParams = req.body || req.query;

		if (!apiKey) {
			return res.status(400).json({ error: "No API key provided!" });
		}

		if (!apiKeysCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		if (!usersCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the Users Database!" });
		}

		if (!postsCollection || !postLikesCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the Posts Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(401).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(401).json({ error: "Invalid user" });
		}

		switch (req.method) {
			/**-------------------------------------------------------------------------------------------------------------------
			 *
			 * ^  ██████╗ ███████╗████████╗    ██████╗  ██████╗ ███████╗████████╗███████╗
			 * ^ ██╔════╝ ██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝
			 * ^ ██║  ███╗█████╗     ██║       ██████╔╝██║   ██║███████╗   ██║   ███████╗
			 * ^ ██║   ██║██╔══╝     ██║       ██╔═══╝ ██║   ██║╚════██║   ██║   ╚════██║
			 * ^ ╚██████╔╝███████╗   ██║       ██║     ╚██████╔╝███████║   ██║   ███████║
			 * ^  ╚═════╝ ╚══════╝   ╚═╝       ╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 */
			case "GET": {
				if (!postType) {
					return res.status(400).json({ error: "No post type provided" });
				}

				let posts: WithId<Document>[] = [];

				try {
					switch (sortBy) {
						case "latest": {
							posts = await getSortByLatest({
								groupId,
								postType,
								privacy,
								fromDate,
								limit,
							});

							break;
						}

						default: {
							return res.status(400).json({
								error: "Invalid sort by option provided",
							});
							break;
						}
					}
				} catch (error: any) {
					return res
						.status(500)
						.json({ error: "Error getting posts:\n" + error.message });
				}

				posts = posts || [];

				const postsData = await Promise.all(
					posts!.map(async (postDoc) => {
						const post = postDoc as unknown as SitePost;

						const userLikeData = (await postLikesCollection.findOne({
							postId: post.id,
							userId: userId,
						})) as unknown as PostLike;

						const creatorData = (await usersCollection.findOne({
							uid: post.creatorId,
						})) as unknown as SiteUser;

						return {
							post,
							creator: creatorData || null,
							userLike: userLikeData || null,
							index: {
								[sortBy]:
									(typeof lastIndex === "string"
										? parseInt(lastIndex)
										: lastIndex) +
									posts.indexOf(postDoc) +
									1,
							} as Partial<PostData>,
						};
					})
				);

				if (postsData.length) {
					return res.status(200).json({ posts: postsData });
				} else {
					return res.status(200).json({ posts: [] });
				}
				break;
			}

			/**-------------------------------------------------------------------------------------------
			 *
			 * & ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗
			 * & ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝
			 * & ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║
			 * & ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║
			 * & ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║
			 * & ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
			 *
			 * -------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------
			 */
			default: {
				return res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}

const getSortByLatest = async ({
	groupId,
	postType,
	privacy,
	fromDate,
	limit = 10,
}: Partial<APIEndpointPostsParams>) => {
	const { postsCollection } = await postDb();

	let query: any = {
		postType: postType,
		privacy: privacy,
		createdAt: {
			$lt: typeof fromDate === "string" ? fromDate : fromDate?.toISOString(),
		},
	};

	if (groupId) {
		query.groupId = groupId;
	}

	return postsCollection
		? await postsCollection
				.find(query)
				.sort({
					createdAt: -1,
				})
				.limit(typeof limit === "string" ? parseInt(limit) : limit)
				.toArray()
		: [];
};
