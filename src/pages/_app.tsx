import "@/styles/globals.scss";

import { NextPage } from "next";

import type { AppProps } from "next/app";

import { ReactElement, ReactNode } from "react";
import { RecoilRoot } from "recoil";

export type NextPageLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<RecoilRoot>
			<>{getLayout(<Component {...pageProps} />)}</>
		</RecoilRoot>
	);
}
