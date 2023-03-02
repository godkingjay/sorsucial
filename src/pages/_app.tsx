import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	);
}
