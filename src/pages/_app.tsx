import Layout from "@/components/Layout/Layout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	return (
		<RecoilRoot>
			{router.pathname.split("/")[1].match(/auth/g) ? (
				<Component {...pageProps} />
			) : (
				<Layout>
					<Component {...pageProps} />
				</Layout>
			)}
		</RecoilRoot>
	);
}
