import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import NavLinksNew from "./NavLinksNew";
import SidebarFooter from "./SidebarFooter";
import logo from "../../assets/logo.png";

const SidebarNew = ({ onCollapse }) => {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggle = () => {
		const c = !collapsed;
		setCollapsed(c);
		onCollapse?.(c);
	};

	return (
		<>
			{/* Mobile overlay */}
			{mobileOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Mobile hamburger */}
			<button
				onClick={() => setMobileOpen(true)}
				className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-soft-xl border border-surface-200/60 lg:hidden"
			>
				<FaBars className="h-4 w-4 text-surface-600" />
			</button>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300 ease-out
					${collapsed ? "w-[76px]" : "w-[240px]"}
					max-lg:transition-transform max-lg:duration-300
					${mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
				`}
			>
				{/* Background with subtle gradient */}
				<div className="absolute inset-0 bg-surface-900" />
				<div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-transparent to-surface-900" />

				{/* Content */}
				<div className="relative z-10 flex h-full flex-col">
					{/* Logo area */}
					<div className={`flex h-16 items-center border-b border-white/[0.06] ${collapsed ? "justify-center px-2" : "px-5"}`}>
						{collapsed ? (
							<img
								src={logo}
								alt="EMP"
								className="h-8 w-8 object-contain"
							/>
						) : (
							<div className="flex items-center gap-3">
								<img
									src={logo}
									alt="EMP"
									className="h-8 w-auto object-contain"
								/>
							</div>
						)}
						{!collapsed && (
							<button
								onClick={toggle}
								className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
							>
								<FaTimes className="h-3.5 w-3.5" />
							</button>
						)}
					</div>

					{/* Collapse toggle (collapsed state) */}
					{collapsed && (
						<div className="flex justify-center py-3">
							<button
								onClick={toggle}
								className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
							>
								<FaBars className="h-3.5 w-3.5" />
							</button>
						</div>
					)}

					{/* Nav links */}
					<div className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? "px-2 py-2" : "px-3 py-4"}`}>
						<NavLinksNew collapsed={collapsed} />
					</div>

					{/* Footer */}
					<SidebarFooter collapsed={collapsed} />
				</div>
			</aside>
		</>
	);
};

export default SidebarNew;
