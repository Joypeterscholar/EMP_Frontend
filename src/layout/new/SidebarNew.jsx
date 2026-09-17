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
			{mobileOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			<button
				onClick={() => setMobileOpen(true)}
				className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 border border-surface-300 lg:hidden"
			>
				<FaBars className="h-4 w-4 text-surface-700" />
			</button>

			<aside
				className={`fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300 ease-out
					${collapsed ? "w-[76px]" : "w-[240px]"}
					max-lg:transition-transform max-lg:duration-300
					${mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
				`}
			>
				<div className="absolute inset-0 bg-surface-100 border-r border-surface-200" />

				<div className="relative z-10 flex h-full flex-col">
					<div className={`flex h-16 items-center border-b border-surface-200 ${collapsed ? "justify-center px-2" : "px-5"}`}>
						{collapsed ? (
							<img src={logo} alt="EMP" className="h-8 w-8 object-contain" />
						) : (
							<div className="flex items-center gap-3">
								<img src={logo} alt="EMP" className="h-8 w-auto object-contain" />
							</div>
						)}
						{!collapsed && (
							<button
								onClick={toggle}
								className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-700"
							>
								<FaTimes className="h-3.5 w-3.5" />
							</button>
						)}
					</div>

					{collapsed && (
						<div className="flex justify-center py-3">
							<button
								onClick={toggle}
								className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-700"
							>
								<FaBars className="h-3.5 w-3.5" />
							</button>
						</div>
					)}

					<div className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? "px-2 py-2" : "px-3 py-4"}`}>
						<NavLinksNew collapsed={collapsed} />
					</div>

					<SidebarFooter collapsed={collapsed} />
				</div>
			</aside>
		</>
	);
};

export default SidebarNew;
