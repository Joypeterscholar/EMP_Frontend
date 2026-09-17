import {
	FaTags,
	FaBuilding,
	FaUserTie,
	FaUserCog,
	FaChartLine,
	FaArrowUp,
	FaArrowDown,
} from "react-icons/fa";

const iconComponents = {
	activity: FaTags,
	facility: FaBuilding,
	reviewer: FaUserTie,
	sampler: FaUserCog,
};

const colorMap = {
	"purple": {
		bg: "bg-brand-50",
		icon: "text-brand-600",
	 ring: "ring-brand-100",
	},
	"blue": {
		bg: "bg-blue-50",
		icon: "text-blue-600",
		ring: "ring-blue-100",
	},
	"green": {
		bg: "bg-emerald-50",
		icon: "text-emerald-600",
		ring: "ring-emerald-100",
	},
	"orange": {
		bg: "bg-amber-50",
		icon: "text-amber-600",
		ring: "ring-amber-100",
	},
};

const StatsCard = ({
	icon,
	title,
	count,
	iconBgColor = "bg-brand-100",
	iconColor = "text-brand-600",
	trend,
	trendLabel,
	trendColor,
	onClick,
	isClickable = false,
}) => {
	const IconComponent = iconComponents[icon] || FaChartLine;
	const isPositiveTrend = trend && !trend.startsWith("-");

	const CardContent = () => (
		<div className="group relative overflow-hidden rounded-2xl border border-surface-200/60 bg-white p-5 transition-all duration-300 hover:shadow-elevated hover:border-brand-200/50 hover:-translate-y-0.5">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
						<IconComponent className="h-5 w-5 text-brand-600" />
					</div>
					<div>
						<p className="text-sm font-medium text-surface-500">{title}</p>
						<p className="mt-1 text-2xl font-bold tracking-tight text-surface-900">
							{count?.toLocaleString() || 0}
						</p>
					</div>
				</div>
			</div>
			{trend && (
				<div className="mt-3 flex items-center gap-1.5">
					<span
						className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
							isPositiveTrend
								? "bg-emerald-50 text-emerald-700"
								: "bg-red-50 text-red-600"
						}`}
					>
						{isPositiveTrend ? (
							<FaArrowUp className="h-2.5 w-2.5" />
						) : (
							<FaArrowDown className="h-2.5 w-2.5" />
						)}
						{trend}
					</span>
					<span className="text-xs text-surface-400">{trendLabel}</span>
				</div>
			)}
			{/* Decorative gradient on hover */}
			<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
		</div>
	);

	if (isClickable && onClick) {
		return (
			<button onClick={onClick} className="text-left">
				<CardContent />
			</button>
		);
	}

	return <CardContent />;
};

export default StatsCard;
