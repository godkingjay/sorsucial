import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LoadingBar: React.FC = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const startLoading = () => setLoading(true);
		const endLoading = () => {
			setLoading(false);
		};

		router.events.on("routeChangeStart", startLoading);
		router.events.on("routeChangeComplete", endLoading);
		router.events.on("routeChangeError", endLoading);

		return () => {
			router.events.off("routeChangeStart", startLoading);
			router.events.off("routeChangeComplete", endLoading);
			router.events.off("routeChangeError", endLoading);
		};
	}, [router]);

	return (
		<>
			<div
				className="z-[9999] bg-blue-500 bg-opacity-25 w-full h-1 fixed top-0 left-0 right-0 flex overflow-x-hidden group data-[loading=false]:hidden"
				data-loading={loading}
			>
				<div className="h-full translate-x-[-100%] w-full absolute top-0 left-0 group-data-[loading=true]:animate-sliding-t-r">
					<div className="w-full h-full bg-blue-500" />
				</div>
			</div>
		</>
	);
};

export default LoadingBar;
