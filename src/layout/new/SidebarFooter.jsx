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
		<div className={`border-t border-surface-200 ${collapsed ? "px-2 py-3" : "px-3 py-4"}`}>
			<div className={`flex items-center gap-3 ${collapsed ? "flex-col" : ""}`}>
				<button onClick={handleProfileClick} className="group flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-200 text-surface-600 transition-colors group-hover:bg-surface-300">
						{currentUser?.imageUrl ? (
							<img src={currentUser.imageUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
						) : (
							<FaUser className="h-3.5 w-3.5" />
						)}
					</div>
					{!collapsed && (
						<div className="min-w-0 text-left">
							<p className="truncate text-xs font-medium text-surface-800">
								{currentUser?.fullname || "User"}
							</p>
							<p className="truncate text-[10px] text-surface-500">
								{currentUser?.role || "role"}
							</p>
						</div>
					)}
				</button>

				<button
					onClick={handleLogout}
					className={`flex items-center justify-center rounded-lg text-surface-500 transition-all hover:bg-surface-200 hover:text-accent-rose ${
						collapsed ? "h-8 w-8" : "ml-auto h-8 w-8"
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
