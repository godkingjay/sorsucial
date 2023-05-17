import { UserData } from "@/atoms/userAtom";
import InputBoxFloatingLabel from "@/components/Form/Input/InputBoxFloatingLabel";
import InputBoxFloatingLabel2 from "@/components/Form/Input/InputBoxFloatingLabel2";
import { PasswordRegex } from "@/lib/input/regex";
import React, { useCallback, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { MdSave } from "react-icons/md";

type UserSettingsSecurityProps = {
	userData: UserData;
};

const UserSettingsSecurity: React.FC<UserSettingsSecurityProps> = ({
	userData,
}) => {
	const [changingPassword, setChangingPassword] = useState(false);

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			try {
				if (!changingPassword) {
					setChangingPassword(true);

					setChangingPassword(false);
				}
			} catch (error: any) {
				console.log(`=>Hook: Updating user error:\n${error.message}`);
				setChangingPassword(false);
			}
		},
		[changingPassword]
	);

	return (
		<>
			<div className="page-wrapper">
				<div className="flex flex-col-gap-y-4">
					<div className="shadow-page-box-1 w-full page-box-1 p-4 flex flex-col">
						<h1 className="font-bold text-xl text-gray-700 text-center sm:text-left">
							Security
						</h1>
						<div className="divider my-2"></div>
						<form
							className="flex flex-col gap-y-2 mt-2 group"
							onSubmit={(event) => !changingPassword && handleSubmit(event)}
							data-changing-password={changingPassword}
						>
							<div className="relative flex flex-col items-center p-4 border border-gray-200 rounded-lg">
								<h2
									className="
                  absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-50%] font-semibold text-gray-500 px-1 bg-white
                  sm:left-1 sm:translate-x-0
                "
								>
									Password
								</h2>
								<div className="flex flex-col gap-y-2 w-full items-center">
									<InputBoxFloatingLabel2
										value={oldPassword}
										setValue={setOldPassword}
										title="Old Password"
										name="oldPassword"
										type="password"
										placeholder="Old Password"
										required={true}
										disabled={changingPassword}
										regex={PasswordRegex}
										minLength={8}
										maxLength={256}
										message={{
											error:
												"1. Password must be at least 8 characters long.\n" +
												"2. Password should only contain A-Z, a-z, 0-9, or special characters(@, $, !, %, *, ?, &), and no spaces.",
										}}
										style={{
											boxStyle: {
												maxWidth: "384px",
											},
										}}
									/>
									<InputBoxFloatingLabel2
										value={newPassword}
										setValue={setNewPassword}
										title="New Password"
										name="newPassword"
										type="password"
										placeholder="New Password"
										required={true}
										disabled={changingPassword}
										regex={PasswordRegex}
										minLength={8}
										maxLength={256}
										isError={
											newPassword !== confirmPassword &&
											newPassword !== "" &&
											confirmPassword !== ""
										}
										message={{
											error: !PasswordRegex.test(newPassword)
												? "1. Password must be at least 8 characters long.\n" +
												  "2. Password should only contain A-Z, a-z, 0-9, or special characters(@, $, !, %, *, ?, &), and no spaces."
												: "Passwords do not match.",
										}}
										style={{
											boxStyle: {
												maxWidth: "384px",
											},
										}}
									/>
									<InputBoxFloatingLabel2
										value={confirmPassword}
										setValue={setConfirmPassword}
										title="Confirm Password"
										name="confirmPassword"
										type="password"
										placeholder="Confirm Password"
										required={true}
										disabled={changingPassword}
										regex={PasswordRegex}
										minLength={8}
										maxLength={256}
										isError={
											newPassword !== confirmPassword &&
											newPassword !== "" &&
											confirmPassword !== ""
										}
										message={{
											error: !PasswordRegex.test(confirmPassword)
												? "1. Password must be at least 8 characters long.\n" +
												  "2. Password should only contain A-Z, a-z, 0-9, or special characters(@, $, !, %, *, ?, &), and no spaces."
												: "Passwords do not match.",
										}}
										style={{
											boxStyle: {
												maxWidth: "384px",
											},
										}}
									/>
									{oldPassword === newPassword && (
										<div className="bg-red-500 text-white text-xs p-3 rounded-md w-full max-w-sm">
											<p>Must change to new password!</p>
										</div>
									)}
								</div>
							</div>
							<div className="divider mt-2 mb-1"></div>
							<div className="flex flex-row justify-end items-center gap-x-2">
								<button
									type="submit"
									title="Save Changes"
									className="flex flex-row w-36 gap-x-2 text-sm items-center px-2 py-1.5 bg-green-500 text-white border-2 border-green-500 rounded-md shadow-md disabled:grayscale"
									disabled={
										oldPassword === "" ||
										newPassword === "" ||
										confirmPassword === "" ||
										newPassword !== confirmPassword ||
										changingPassword ||
										!PasswordRegex.test(oldPassword) ||
										!PasswordRegex.test(newPassword) ||
										!PasswordRegex.test(confirmPassword) ||
										oldPassword === newPassword ||
										oldPassword === confirmPassword
									}
								>
									<div className="h-5 w-5">
										{changingPassword ? (
											<FiLoader className="h-full w-full animate-spin" />
										) : (
											<MdSave className="h-full w-full" />
										)}
									</div>
									<div className="group-data-[changing-password=true]:hidden">
										<p>{changingPassword ? "Updating..." : "Save Changes"}</p>
									</div>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserSettingsSecurity;
