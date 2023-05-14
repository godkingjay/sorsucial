import React, { useEffect, useState } from "react";
import LimitedBodyLayout from "./LimitedBodyLayout";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { HiLockClosed } from "react-icons/hi";

type UserSettingsPageLayoutProps = {
	children: React.ReactNode;
};

const UserSettingsPageLayout: React.FC<UserSettingsPageLayoutProps> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState(
		window.matchMedia("(max-width: 640px)").matches ? false : true
	);

	const handleSettingsPanel = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div
				className="z-[570] duration-200 sm:hidden pointer-events-none opacity-0 fixed w-full h-full data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto"
				data-open={isOpen}
			>
				<div className="sticky h-full w-full bg-black bg-opacity-40 top-0"></div>
			</div>
			<div className="flex-1 flex flex-row">
				<div className="z-[570] sticky top-14 max-h-[calc(100vh-56px)]">
					<div className="w-0 absolute sm:relative sm:w-[224px] h-full flex flex-col">
						<div
							className="relative flex flex-col w-[224px] max-w-[224px] flex-1 h-full duration-100 translate-x-0 data-[open=false]:-translate-x-full sm:!translate-x-0"
							data-open={
								window.matchMedia("(max-width: 640px)").matches ? isOpen : true
							}
						>
							<div className="flex flex-col bg-white shadow-page-box-1 w-[224px] max-w-[224px] overflow-y-auto scroll-y-style h-full">
								<div className="bg-white p-2 sticky top-0 flex flex-col gap-y-2">
									<h1 className="font-bold text-xl text-gray-700 bg-white text-center sm:text-left">
										Settings
									</h1>
									<div className="divider"></div>
								</div>
								<div className="px-2 flex flex-col w-full">
									<Link
										href={"/user/settings/"}
										className="p-2 flex flex-row items-center gap-x-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100"
									>
										<div className="h-6 w-6">
											<CgProfile className="h-full w-full" />
										</div>
										<div>
											<p>Profile Information</p>
										</div>
									</Link>
									<Link
										href={"/user/settings/"}
										className="p-2 flex flex-row items-center gap-x-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100"
									>
										<div className="h-6 w-6">
											<HiLockClosed className="h-full w-full" />
										</div>
										<div>
											<p>Security</p>
										</div>
									</Link>
								</div>
							</div>
							<button
								type="button"
								title={isOpen ? "Close Settings Panel" : "Open Settings Panel"}
								className="sm:hidden absolute p-2 top-16 left-[100%] bg-gray-50 rounded-r-full shadow-lg text-gray-700"
								onClick={handleSettingsPanel}
							>
								<div className="h-6 w-6">
									<IoSettingsOutline className="h-full w-full" />
								</div>
							</button>
						</div>
					</div>
				</div>
				<div className="flex-1 flex flex-col items-center">
					<LimitedBodyLayout>{children}</LimitedBodyLayout>
				</div>
			</div>
		</>
	);
};

export default UserSettingsPageLayout;
