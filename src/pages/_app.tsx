import Layout from "@/components/Layout/Layout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</RecoilRoot>
	);
}
