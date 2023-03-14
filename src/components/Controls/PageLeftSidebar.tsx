import React, { useState } from "react";
import {
	MdOutlineKeyboardDoubleArrowLeft,
	MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

type PageLeftSidebarProps = {};

const PageLeftSidebar: React.FC<PageLeftSidebarProps> = () => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen((prev) => !prev);
	};

	return (
		<div className="z-[100] w-max h-full sticky top-0">
			<div
				className="sticky top-14 w-max h-full max-h-screen"
				style={{
					height: "calc(100vh - 56px)",
				}}
			>
				<div
					className="page-left-sidebar p-1"
					data-open={open}
				>
					<button
						type="button"
						title={open ? "Close" : "Open"}
						className="open-close-button"
						onClick={handleOpen}
					>
						<div className="label-container">
							<p className="label">SorSUcial</p>
						</div>
						<div className="icon-container">
							{open ? (
								<MdOutlineKeyboardDoubleArrowLeft className="icon" />
							) : (
								<MdOutlineKeyboardDoubleArrowRight className="icon" />
							)}
						</div>
					</button>
					<div className="h-[1px] w-full bg-white bg-opacity-10"></div>
				</div>
			</div>
		</div>
	);
};

export default PageLeftSidebar;
