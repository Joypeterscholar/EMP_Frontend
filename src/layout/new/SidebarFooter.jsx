import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../../redux/reducers/userReducer";
import { logoutUser } from "../../redux/actions/userActions";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const SidebarFooter = ({ collapsed }) => {
	const user = useSelector((s) => s.userState.user);
	const currentUser = getUserFromLocalStorage() || user;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/login");
	};

	const handleProfileClick = () => {
		const baseRole = ["admin", "superAdmin"].includes(currentUser.role)
			? "admin"
			: currentUser.role;
		navigate(`/${baseRole}/single-user/${currentUser._id}`);
	};

	return (
		<div className={`border-t border-white/[0.06] ${collapsed ? "px-2 py-3" : "px-3 py-4"}`}>
			<div
				className={`flex items-center gap-3 ${collapsed ? "flex-col" : ""}`}
			>
				{/* Profile */}
				<button
					onClick={handleProfileClick}
					className="group flex items-center gap-3"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors group-hover:bg-white/15 group-hover:text-white/80">
						{currentUser?.imageUrl ? (
							<img
								src={currentUser.imageUrl}
								alt=""
								className="h-8 w-8 rounded-lg object-cover"
							/>
						) : (
							<FaUser className="h-3.5 w-3.5" />
						)}
					</div>
					{!collapsed && (
						<div className="min-w-0 text-left">
							<p className="truncate text-xs font-medium text-white/80">
								{currentUser?.fullname || "User"}
							</p>
							<p className="truncate text-[10px] text-white/40">
								{currentUser?.role || "role"}
							</p>
						</div>
					)}
				</button>

				{/* Logout */}
				<button
					onClick={handleLogout}
					className={`flex items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/10 hover:text-accent-rose ${
						collapsed
							? "h-8 w-8"
							: "ml-auto h-8 w-8"
					}`}
					title="Logout"
				>
					<FaSignOutAlt className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	);
};

export default SidebarFooter;
