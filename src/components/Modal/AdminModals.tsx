import useAdmin from "@/hooks/useAdmin";
import React from "react";
import AddUserModal from "./AdminModals/AddUserModal";
import useCheck from "@/hooks/useCheck";

type AdminModalsProps = {};

const AdminModals: React.FC<AdminModalsProps> = () => {
	const { adminModalStateValue, setAdminModalStateValue, createNewUsers } =
		useAdmin();

	const { checkUserEmailExists } = useCheck();

	return (
		<>
			{adminModalStateValue.addUser.open && (
				<AddUserModal
					adminModalStateValue={adminModalStateValue}
					setAdminModalStateValue={setAdminModalStateValue}
					checkUserEmailExists={checkUserEmailExists}
					createNewUsers={createNewUsers}
				/>
			)}
		</>
	);
};

export default AdminModals;
