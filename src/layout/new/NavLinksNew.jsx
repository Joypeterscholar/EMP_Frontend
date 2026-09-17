import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { memoize } from "proxy-memoize";
import { getUserFromLocalStorage } from "../../redux/reducers/userReducer";
import {
	FaHome,
	FaBuilding,
	FaUsers,
	FaFileAlt,
	FaCommentDots,
	FaTrash,
} from "react-icons/fa";

const iconMap = {
	dashboard: FaHome,
	models: FaBuilding,
	users: FaUsers,
	report: FaFileAlt,
	feedback: FaCommentDots,
	trash: FaTrash,
};

const NavLinksNew = ({ collapsed }) => {
	const user = useSelector(memoize((state) => state.userState.user));
	const localUser = getUserFromLocalStorage();
	const currentUser = localUser || user;

	let links = [
		{
			id: 1,
			url: `${
				["admin", "superAdmin"].includes(currentUser.role)
					? "/admin"
					: `/${currentUser.role}`
			}`,
			text: "Dashboard",
			icon: "dashboard",
		},
		{ id: 2, url: "models", text: "Facility Sections", icon: "models" },
		{ id: 3, url: "users", text: "Users", icon: "users" },
		{ id: 6, url: "report", text: "Report", icon: "report" },
		{ id: 8, url: "feedback", text: "Feedback", icon: "feedback" },
		{ id: 7, url: "trash", text: "Recycle Bin", icon: "trash" },
	];

	if (currentUser.role !== "superAdmin") {
		links = links.filter(
			(l) => !["users", "location", "trash", "/tagger"].includes(l.url)
		);
	}
	if (currentUser.role === "reviewer") {
		links = [
			{
				id: 1,
				url: `/${currentUser.role}`,
				text: "Dashboard",
				icon: "dashboard",
			},
			{ id: 6, url: "report", text: "Report", icon: "report" },
			{ id: 8, url: "feedback", text: "Feedback", icon: "feedback" },
		];
	}

	if (collapsed) {
		return (
			<div className="flex flex-col items-center gap-1">
				{links.map((l) => {
					const Icon = iconMap[l.icon] || FaHome;
					return (
						<NavLink
							key={l.id}
							to={l.url}
							end
							title={l.text}
							className={({ isActive }) =>
								`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
									isActive
										? "bg-brand-600 text-white shadow-glow-sm"
										: "text-surface-500 hover:bg-surface-200 hover:text-surface-700"
								}`
							}
						>
							<Icon className="h-4 w-4" />
						</NavLink>
					);
				})}
			</div>
		);
	}

	return (
		<nav className="flex flex-col gap-0.5">
			{links.map((l) => {
				const Icon = iconMap[l.icon] || FaHome;
				return (
					<NavLink
						key={l.id}
						to={l.url}
						end
						className={({ isActive }) =>
							`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
								isActive
									? "bg-brand-600 text-white shadow-glow-sm"
									: "text-surface-600 hover:bg-surface-200 hover:text-surface-800"
							}`
						}
					>
						<Icon className="h-4 w-4 flex-shrink-0" />
						<span className="truncate">{l.text}</span>
					</NavLink>
				);
			})}
		</nav>
	);
};

export default NavLinksNew;
