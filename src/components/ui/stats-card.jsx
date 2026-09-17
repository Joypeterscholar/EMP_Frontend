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

const StatsCard = ({
	icon,
	title,
	count,
	trend,
	trendLabel,
	onClick,
	isClickable = false,
}) => {
	const IconComponent = iconComponents[icon] || FaChartLine;
	const isPositiveTrend = trend && !trend.startsWith("-");

	const CardContent = () => (
		<div className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-surface-100 p-5 transition-all duration-300 hover:shadow-elevated hover:border-brand-500/30 hover:-translate-y-0.5">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/10 ring-1 ring-brand-500/20">
						<IconComponent className="h-5 w-5 text-brand-400" />
					</div>
					<div>
						<p className="text-sm font-medium text-surface-600">{title}</p>
						<p className="mt-1 text-2xl font-bold tracking-tight text-surface-900">
							{count?.toLocaleString() || 0}
						</p>
					</div>
				</div>
			</div>
			{trend && (
				<div className="mt-3 flex items-center gap-1.5">
					<span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
						isPositiveTrend ? "bg-emerald-600/10 text-emerald-400" : "bg-red-600/10 text-red-400"
					}`}>
						{isPositiveTrend ? <FaArrowUp className="h-2.5 w-2.5" /> : <FaArrowDown className="h-2.5 w-2.5" />}
						{trend}
					</span>
					<span className="text-xs text-surface-500">{trendLabel}</span>
				</div>
			)}
			<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
		</div>
	);

	if (isClickable && onClick) {
		return <button onClick={onClick} className="text-left"><CardContent /></button>;
	}
	return <CardContent />;
};

export default StatsCard;
