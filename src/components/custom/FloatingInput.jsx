import React from "react";
import { cn } from "../../lib/utils";

const FloatingInput = React.forwardRef(
	({ id, label, type = "text", className = "", ...props }, ref) => {
		return (
			<div className="relative w-full">
				<input
					ref={ref}
					id={id}
					type={type}
					className={cn(
						"peer block px-4 pb-2.5 pt-5 w-full text-sm rounded-2xl border appearance-none focus:outline-none focus:ring-0",
						className
					)}
					style={{
						backgroundColor: "#161822",
						borderColor: "#2a2d3e",
						color: "#f0f1f7",
					}}
					placeholder=" "
					{...props}
				/>
				<label
					htmlFor={id}
					className="absolute text-sm duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3"
					style={{
						backgroundColor: "#161822",
						color: "#8b8da5",
					}}
				>
					{label}
				</label>
			</div>
		);
	}
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
