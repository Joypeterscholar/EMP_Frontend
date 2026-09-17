import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({
	value,
	onChange,
	placeholder = "Search...",
	className = "",
	inputClassName = "",
	style,
}) => {
	return (
		<div className={`relative ${className}`} style={style}>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={placeholder}
				className={`w-full rounded-xl border border-surface-300 bg-surface-100 px-4 py-2.5 pr-10 text-sm transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${inputClassName}`}
				style={{ color: "#f0f1f7" }}
			/>
			<div className="absolute right-3 top-1/2 -translate-y-1/2">
				<FaSearch className="h-4 w-4 text-surface-500" />
			</div>
		</div>
	);
};

export default SearchInput;
