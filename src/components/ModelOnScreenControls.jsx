import {
	FaArrowUp,
	FaArrowDown,
	FaArrowLeft,
	FaArrowRight,
	FaSearchPlus,
	FaSearchMinus,
	FaCircle,
	FaCamera,
} from "react-icons/fa";

export function simulateKeyDown(key, code, keyCode) {
	const event = new KeyboardEvent("keydown", {
		key,
		code,
		keyCode,
		which: keyCode,
		bubbles: true,
	});
	document.dispatchEvent(event);
}

function ControlButton({ id, children, className = "" }) {
	return (
		<button
			id={id}
			className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 ${className}`}
		>
			{children}
		</button>
	);
}

function Separator() {
	return <div className="h-8 w-px bg-white/20" />;
}

function ModelOnScreenControls() {
	return (
		<div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
			<div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-white/10 bg-surface-900/60 px-3 py-2 backdrop-blur-xl shadow-elevated">
				{/* Direction pad */}
				<div className="flex flex-col items-center gap-0.5">
					<ControlButton id="panForward">
						<FaArrowUp className="h-3.5 w-3.5" />
					</ControlButton>
					<div className="flex gap-0.5">
						<ControlButton id="panLeft">
							<FaArrowLeft className="h-3.5 w-3.5" />
						</ControlButton>
						<ControlButton id="panUp" className="h-8 w-8">
							<span className="text-[8px] text-white/40">U</span>
						</ControlButton>
						<ControlButton id="panRight">
							<FaArrowRight className="h-3.5 w-3.5" />
						</ControlButton>
					</div>
					<ControlButton id="panBackward">
						<FaArrowDown className="h-3.5 w-3.5" />
					</ControlButton>
				</div>

				<Separator />

				{/* Zoom */}
				<div className="flex flex-col gap-0.5">
					<ControlButton id="zoomIn">
						<FaSearchPlus className="h-3.5 w-3.5" />
					</ControlButton>
					<ControlButton id="zoomOut">
						<FaSearchMinus className="h-3.5 w-3.5" />
					</ControlButton>
				</div>

				<Separator />

				{/* Camera controls */}
				<div className="flex gap-0.5">
					<ControlButton id="recordButton">
						<FaCircle className="h-3 w-3 text-accent-rose" />
					</ControlButton>
					<ControlButton id="screenshotButton">
						<FaCamera className="h-3.5 w-3.5" />
					</ControlButton>
				</div>

				<Separator />

				{/* View toggles */}
				<div className="flex gap-0.5">
					<ControlButton id="2DOverlayButton" className="px-3 text-xs font-bold">
						2D/3D
					</ControlButton>
					<ControlButton id="heatmapButton" className="px-3 text-xs font-semibold">
						Heat Map
					</ControlButton>
					<ControlButton id="twoDview" className="px-3 text-xs font-semibold">
						View 2D
					</ControlButton>
				</div>
			</div>
		</div>
	);
}

export default ModelOnScreenControls;
