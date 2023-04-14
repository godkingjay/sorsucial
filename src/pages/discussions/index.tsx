import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import React, { useRef, useState } from "react";

type DiscussionsPageProps = {};

const DiscussionsPage: React.FC<DiscussionsPageProps> = () => {
	const { userMounted } = useUser();
	const [firstLoadingDiscussions, setFirstLoadingDiscussions] = useState(false);
	const discussionsMounted = useRef(false);

	return (
		<>
			<Head>
				<title>Discussions | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{firstLoadingDiscussions && !userMounted ? (
							<>
								<p>Loading</p>
							</>
						) : (
							<div>Discussion</div>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default DiscussionsPage;
