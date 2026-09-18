import { useState, useRef } from "react";
import { FaCloudUploadAlt, FaFile, FaTimes } from "react-icons/fa";

const DragDropFile = ({
	name,
	accept,
	onChange,
	label,
	sublabel,
	fileName,
	required = false,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef(null);

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragIn = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragOut = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const file = e.dataTransfer.files[0];
			// Create a synthetic event-like object for the parent handler
			const syntheticEvent = {
				target: {
					name,
					files: [file],
					value: "",
				},
			};
			onChange(syntheticEvent);
		}
	};

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			onChange(e);
		}
	};

	const handleRemove = (e) => {
		e.stopPropagation();
		// Reset the input
		if (inputRef.current) {
			inputRef.current.value = "";
		}
		const syntheticEvent = {
			target: {
				name,
				files: null,
				value: "",
			},
		};
		onChange(syntheticEvent);
	};

	return (
		<div
			onClick={handleClick}
			onDragEnter={handleDragIn}
			onDragLeave={handleDragOut}
			onDragOver={handleDrag}
			onDrop={handleDrop}
			className={`relative flex w-full cursor-pointer flex-col items-center gap-y-2 rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
				isDragging
					? "border-brand-500 bg-brand-500/5"
					: fileName
					? "border-brand-500/50 bg-surface-200/30"
					: "border-surface-300 bg-surface-200/30 hover:border-surface-400 hover:bg-surface-200/50"
			}`}
		>
			<input
				ref={inputRef}
				type="file"
				name={name}
				accept={accept}
				required={required}
				className="hidden"
				onChange={handleFileChange}
			/>

			{fileName ? (
				<>
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/10">
						<FaFile className="h-6 w-6 text-brand-400" />
					</div>
					<div className="text-center">
						<p className="text-sm font-medium" style={{ color: "#f0f1f7" }}>
							{fileName}
						</p>
						<p className="mt-0.5 text-xs" style={{ color: "#646680" }}>
							Click to replace or drag a new file
						</p>
					</div>
					<button
						onClick={handleRemove}
						className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-surface-300 transition-colors hover:bg-accent-rose hover:text-white"
						style={{ color: "#8b8da5" }}
					>
						<FaTimes className="h-3 w-3" />
					</button>
				</>
			) : (
				<>
					<div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isDragging ? "bg-brand-500/10" : "bg-surface-300/50"}`}>
						<FaCloudUploadAlt className={`h-6 w-6 ${isDragging ? "text-brand-400" : "text-surface-500"}`} />
					</div>
					<div className="text-center">
						<p className="text-sm font-medium" style={{ color: "#f0f1f7" }}>
							{label || "Click to upload or drag and drop"}
						</p>
						<p className="mt-0.5 text-xs" style={{ color: "#646680" }}>
							{sublabel || "Select a file to upload"}
						</p>
					</div>
				</>
			)}
		</div>
	);
};

export default DragDropFile;
