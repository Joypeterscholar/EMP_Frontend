import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customFetch, formatDate, formatTime } from "../../utils";
import { toast } from "react-toastify";
import DashboardOverview from "./DashboardOverview";
import { FullDashboard } from "../../components";
import TanstackTable from "../../components/TanstackTable";
import SearchInput from "../../components/ui/search-input";
import { FaEllipsisV } from "react-icons/fa";

const url = "/user/dashboard";

function OptionsDropdown({ row, navigate }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleViewModel = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(false);
		const _id = row?._id;
		if (!_id) {
			toast.error("Row data is missing");
			return;
		}
		navigate(`/view-model/${_id}`);
	};

	return (
		<div className="relative" onClick={(e) => e.stopPropagation()}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
			>
				<FaEllipsisV className="h-3.5 w-3.5" />
			</button>
			{isOpen && (
				<>
					<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
					<div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-elevated animate-scale-in">
						<button
							onClick={handleViewModel}
							className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-surface-700 transition-colors hover:bg-surface-50"
						>
							View Model
						</button>
					</div>
				</>
			)}
		</div>
	);
}

const DashboardNew = () => {
	const navigate = useNavigate();
	const [dashboardData, setDashboardData] = useState({});
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await customFetch(url);
			if (response.data.status !== "error") {
				setDashboardData(response.data || {});
			} else {
				toast.error(response.data.message);
				setDashboardData({});
			}
		} catch (error) {
			toast.error("Failed to load dashboard data");
			setDashboardData({});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const safeRecentModels = Array.isArray(dashboardData?.recentModels)
		? dashboardData.recentModels
		: Array.isArray(dashboardData?.recentlyViewedModels)
		? dashboardData.recentlyViewedModels
		: [];

	const columns = useMemo(
		() => [
			{
				accessorKey: "slug",
				header: () => <span>Facility ID</span>,
				cell: ({ row }) => (
					<span className="font-medium text-surface-800">
						{row.original.slug || "N/A"}
					</span>
				),
			},
			{
				accessorKey: "modelName",
				header: () => <span>Facility Name</span>,
				cell: ({ row }) => (
					<span className="text-surface-700">
						{row.original.modelName || "N/A"}
					</span>
				),
			},
			{
				id: "uploadedBy",
				accessorFn: (row) => row?.user?.username || "N/A",
				header: () => <span>Uploaded By</span>,
				cell: ({ row }) => (
					<span className="text-surface-700">
						{row.original.user?.username || "N/A"}
					</span>
				),
			},
			{
				id: "timeStr",
				accessorFn: (row) =>
					row?.createdAt ? formatTime(row.createdAt) : "N/A",
				header: () => <span>Time</span>,
				cell: ({ row }) => (
					<span className="text-surface-500 text-sm">
						{row.original.createdAt
							? formatTime(row.original.createdAt)
							: "N/A"}
					</span>
				),
			},
			{
				id: "dateStr",
				accessorFn: (row) =>
					row?.createdAt ? formatDate(row.createdAt) : "N/A",
				header: () => <span>Date</span>,
				cell: ({ row }) => (
					<span className="text-surface-500 text-sm">
						{row.original.createdAt
							? formatDate(row.original.createdAt)
							: "N/A"}
					</span>
				),
			},
			{
				accessorKey: "action",
				header: () => <span>Action</span>,
				cell: ({ row }) => (
					<OptionsDropdown row={row.original} navigate={navigate} />
				),
			},
		],
		[navigate]
	);

	const filteredModels = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return safeRecentModels;
		return safeRecentModels.filter((model) => {
			const values = [
				model?.slug,
				model?.modelName,
				model?.location?.name,
				model?.user?.username,
				formatDate(model?.createdAt),
				formatTime(model?.createdAt),
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return values.includes(q);
		});
	}, [search, safeRecentModels]);

	return (
		<div className="space-y-6">
			<DashboardOverview dashboardData={dashboardData} />
			<FullDashboard dashboardData={dashboardData} />

			{/* Recent Activity Table */}
			<div className="rounded-2xl border border-surface-200/60 bg-white shadow-soft-xl">
				<div className="flex items-center justify-between border-b border-surface-100 px-6 py-4">
					<h2 className="text-base font-semibold text-surface-900">
						Recent Activity
					</h2>
					<div className="w-72 max-sm:w-full">
						<SearchInput
							value={search}
							onChange={(v) => setSearch(v)}
							placeholder="Search facilities..."
						/>
					</div>
				</div>
				<div className="p-4">
					{loading ? (
						<div className="flex items-center justify-center py-16">
							<div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
						</div>
					) : (
						<TanstackTable
							columns={columns}
							tableData={filteredModels}
							initialPageSize={10}
							pageSizeOptions={[5, 10, 20, 30]}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardNew;
