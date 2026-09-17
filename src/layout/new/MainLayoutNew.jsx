import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import HeaderNew from "./HeaderNew";
import SidebarNew from "./SidebarNew";

const AUTH_ROUTES = [
	"/",
	"/login",
	"/register",
	"/forgot-password",
	"/password-otp",
	"/new-password",
	"/reset-password",
];

const MainLayoutNew = () => {
	const location = useLocation();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [showShell, setShowShell] = useState(true);

	useEffect(() => {
		const hidden = AUTH_ROUTES.some(
			(p) =>
				location.pathname === p ||
				location.pathname?.includes("password-reset")
		);
		setShowShell(!hidden);
	}, [location.pathname]);

	if (!showShell) return <Outlet />;

	return (
		<div className="flex min-h-screen bg-surface-0">
			<SidebarNew onCollapse={(c) => setSidebarCollapsed(c)} />
			<div
				className={`relative flex-1 transition-all duration-300 ease-out ${
					sidebarCollapsed ? "ml-[76px]" : "ml-[240px]"
				} max-lg:ml-0`}
			>
				<HeaderNew
					sidebarCollapsed={sidebarCollapsed}
					onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
				/>
				<main className="min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayoutNew;
