import PostCreationListener from "@/components/Post/PostCreationListener";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export default function Home() {
	const { userStateValue } = useUser();

	return (
		<>
			<main className="flex flex-col w-full py-4 px-2">
				<section className="flex flex-col gap-y-4">
					{userStateValue.user.roles.includes("admin") && (
						<PostCreationListener
							useStateValue={userStateValue}
							postType="announcement"
						/>
					)}
				</section>
			</main>
		</>
	);
}
