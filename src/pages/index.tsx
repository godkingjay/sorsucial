import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostsFilter from "@/components/Post/PostsFilter";
import useUser from "@/hooks/useUser";
import Head from "next/head";

export default function Home() {
	const { userStateValue } = useUser();

	return (
		<>
			<Head>
				<title>Announcements | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<PostsFilter
						postType="announcement"
						postCreation={userStateValue.user.roles.includes("admin")}
						filter={false}
						privacy="public"
						sortBy="latest"
						pageEnd="End of Feeds"
						filterOptions={{
							filterType: "posts",
							options: {
								postType: false,
								privacy: false,
								creatorId: true,
								creator: true,
								groupId: false,
								tags: true,
								likes: true,
								comments: true,
								date: true,
							},
						}}
					/>
				</LimitedBodyLayout>
			</main>
		</>
	);
}
