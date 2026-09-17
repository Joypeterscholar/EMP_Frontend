import StatsCard from "./stats-card";

const OverviewSection = ({
	title = "Overview",
	subtitle = "",
	welcomeMessage = "",
	filters = [],
	statsCards = [],
	className = "",
}) => {
	return (
		<div className={`mb-6 ${className}`}>
			{/* Welcome Section */}
			{welcomeMessage && (
				<div className="mb-6">
					<h1 className="text-2xl font-bold tracking-tight text-surface-900">
						{title}
					</h1>
					<p className="mt-1 text-sm text-surface-500">
						{welcomeMessage}
					</p>
				</div>
			)}

			{!welcomeMessage && (
				<div className="mb-6">
					<h2 className="text-2xl font-bold tracking-tight text-surface-900">
						{title}
					</h2>
				</div>
			)}

			{/* Stats Cards */}
			{statsCards.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{statsCards.map((card, index) => (
						<StatsCard key={index} {...card} />
					))}
				</div>
			)}
		</div>
	);
};

export default OverviewSection;
