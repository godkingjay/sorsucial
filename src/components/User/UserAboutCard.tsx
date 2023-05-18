import useUser from "@/hooks/useUser";
import moment from "moment";
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";

type UserAboutCardProps = {};

const UserAboutCard: React.FC<UserAboutCardProps> = () => {
	const { userStateValue } = useUser();

	return (
		<>
			{userStateValue.userPage && (
				<>
					<div className="page-wrapper p-4">
						<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
							<div className="shadow-page-box-1 page-box-1 rounded-lg p-4 col-span-full">
								<>
									<div className="flex flex-col gap-y-2 mb-8">
										<h2 className="font-semibold text-gray-700 text-lg">
											Profile Information
										</h2>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
											<div className="flex-1 flex flex-col">
												<p className="font-semibold text-gray-700 text-xs">
													First Name
												</p>
												<p className="text-sm text-gray-500">
													{userStateValue.userPage.user.firstName}
												</p>
											</div>
											<div className="flex-1 flex flex-col">
												<p className="font-semibold text-gray-700 text-xs">
													Last Name
												</p>
												<p className="text-sm text-gray-500">
													{userStateValue.userPage.user.lastName}
												</p>
											</div>
											{userStateValue.userPage.user.middleName && (
												<>
													<div className="flex-1 flex flex-col">
														<p className="font-semibold text-gray-700 text-xs">
															Middle Name
														</p>
														<p className="text-sm text-gray-500">
															{userStateValue.userPage.user.middleName}
														</p>
													</div>
												</>
											)}
											{userStateValue.userPage.user.gender && (
												<>
													<div className="flex-1 flex flex-col">
														<p className="font-semibold text-gray-700 text-xs">
															Gender
														</p>
														<p className="text-sm text-gray-500">
															{userStateValue.userPage.user.gender
																.charAt(0)
																.toUpperCase() +
																userStateValue.userPage.user.gender.substring(1)}
														</p>
													</div>
												</>
											)}
										</div>
									</div>
								</>
								<div className="divider my-2"></div>
								<div className="flex flex-col gap-y-4">
									<div className="flex flex-row gap-x-4">
										<div className="h-8 w-8 p-1 text-gray-700">
											<AiOutlineCalendar className="h-full w-full" />
										</div>
										<div className="flex-1 flex flex-col">
											<p className="font-semibold text-gray-700">Birthdate</p>
											<p className="text-sm text-gray-500">
												{moment(userStateValue.userPage.user.birthDate).format(
													"MMMM DD, YYYY"
												)}
											</p>
										</div>
									</div>
									<div className="flex flex-row gap-x-4">
										<div className="h-8 w-8 p-1 text-gray-700">
											<AiOutlineCalendar className="h-full w-full" />
										</div>
										<div className="flex-1 flex flex-col">
											<p className="font-semibold text-gray-700">Created On</p>
											<p className="text-sm text-gray-500">
												{moment(userStateValue.userPage.user.createdAt).format(
													"MMMM DD, YYYY"
												)}
											</p>
										</div>
									</div>
								</div>
							</div>
							{/* <div className="shadow-page-box-1 page-box-1 rounded-lg p-4 flex flex-col"></div>
							<div className="shadow-page-box-1 page-box-1 rounded-lg p-4"></div>
							<div className="shadow-page-box-1 page-box-1 rounded-lg p-4"></div> */}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default UserAboutCard;
