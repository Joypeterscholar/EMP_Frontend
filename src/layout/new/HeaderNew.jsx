import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getUserFromLocalStorage } from "../../redux/reducers/userReducer";
import { FaBars, FaBell } from "react-icons/fa";

const HeaderNew = ({ sidebarCollapsed, onToggleSidebar }) => {
	const user = useSelector((s) => s.userState.user);
	const currentUser = getUserFromLocalStorage() || user;
	const location = useLocation();

	const getPageTitle = () => {
		const pathname = location.pathname || "/";
		const lower = pathname.toLowerCase();
		const segmentToTitle = {
			models: "Facility Sections",
			users: "Users",
			location: "Facility",
			report: "Report",
			feedback: "Feedback",
			trash: "Recycle Bin",
		};
		if (/^\/(admin|tagger|reviewer)\/?$/.test(lower)) return "Dashboard";
		for (const [segment, title] of Object.entries(segmentToTitle)) {
			if (lower.includes(`/${segment}`)) return title;
		}
		return "Dashboard";
	};

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200/60 bg-white/80 px-4 sm:px-6 backdrop-blur-xl">
			<div className="flex items-center gap-3">
				<button
					onClick={onToggleSidebar}
					className="hidden max-lg:flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-500 transition-colors hover:bg-surface-50 hover:text-surface-700"
				>
					<FaBars className="h-4 w-4" />
				</button>
				<h1 className="text-lg font-bold tracking-tight text-surface-900">
					{getPageTitle()}
				</h1>
			</div>

			<div className="flex items-center gap-2">
				<button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-white text-surface-400 transition-colors hover:bg-surface-50 hover:text-surface-600">
					<FaBell className="h-4 w-4" />
					<span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-rose ring-2 ring-white" />
				</button>
				<div className="flex items-center gap-2.5 rounded-xl border border-surface-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:bg-surface-50">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-700">
						{currentUser?.fullname?.charAt(0)?.toUpperCase() || "U"}
					</div>
					<span className="text-sm font-medium text-surface-700 max-sm:hidden">
						{currentUser?.fullname || "User"}
					</span>
				</div>
			</div>
		</header>
	);
};

export default HeaderNew;
