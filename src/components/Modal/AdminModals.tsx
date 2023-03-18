import useAdmin from "@/hooks/useAdmin";
import React from "react";
import AddUserModal from "./AdminModals/AddUserModal";

type AdminModalsProps = {};

const AdminModals: React.FC<AdminModalsProps> = () => {
	const {
		adminModalStateValue,
		setAdminModalStateValue,
		checkUserEmailExists,
		createNewUsers,
	} = useAdmin();

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
