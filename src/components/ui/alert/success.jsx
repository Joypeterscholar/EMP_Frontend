import React from "react";
import ReactDOM from "react-dom";
import WebIcon from "../../custom/WebIcons";

const SuccessAlert = ({ isOpen, onClose, title = "Success", message = "Operation completed successfully." }) => {
	if (!isOpen) return null;
	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
			<div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-surface-100 border border-surface-300 p-6 shadow-elevated flex flex-col items-center justify-center text-center gap-2">
				<h3 className="text-lg font-semibold text-surface-900">{title}</h3>
				<div><WebIcon icon="check_circle" className="h-36 w-36" /></div>
				<p className="text-sm text-surface-600 max-w-md">{message}</p>
				<button onClick={onClose} className="mt-4 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
					Okay, thank you
				</button>
			</div>
		</div>,
		document.body
	);
};

export default SuccessAlert;
