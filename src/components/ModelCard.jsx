import { Eye, Edit, Trash2, ChevronDown, Tag, Shield, List } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getRealFileUrl } from "../utils";
import { deleteFromDb } from "./SceneComponent";
import { useSelector } from "react-redux";
import { getUserFromLocalStorage } from "@/redux/reducers/userReducer";

export const ModelCard = ({
	model,
	onDelete,
	onEdit,
	deleteModel,
	onCheck,
	userRole,
	isChecked = false,
}) => {
	const { _id, coverPicture, modelName, file, tags } = model;
	const user = useSelector((state) => state.userState.user);
	const localUser = getUserFromLocalStorage();
	const currentUser = localUser || user;
	const navigate = useNavigate();
	const tagCount = (tags || []).length;
	const coverUrl = getRealFileUrl(coverPicture || "");

	return (
		<div
			onClick={(e) => {
				if (deleteModel) { e.preventDefault(); e.stopPropagation(); return; }
				navigate(`/view-model/${_id}`);
			}}
			className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
				deleteModel
					? isChecked
						? "border-brand-500 ring-2 ring-brand-500/20 shadow-glow-sm"
						: "border-surface-300 hover:border-brand-500"
					: "border-surface-200 bg-surface-100 hover:shadow-elevated hover:border-brand-500/30 hover:-translate-y-0.5"
			}`}
		>
			<div className="relative h-44 overflow-hidden">
				<img
					src={coverUrl || "https://res.cloudinary.com/diqqf3eq2/image/upload/v1595959131/person-3_rxtqvi.jpg"}
					alt={modelName}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
				{deleteModel && (
					<div className="absolute right-3 top-3 z-10">
						<input
							checked={isChecked}
							onClick={(e) => e.stopPropagation()}
							onChange={(e) => { e.stopPropagation(); onCheck(_id, e); }}
							type="checkbox"
							className="h-5 w-5 rounded-lg border-2 border-white bg-white/20 backdrop-blur-sm checked:bg-brand-600"
						/>
					</div>
				)}
				<div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
					<Tag className="h-3 w-3" />
					{tagCount} {tagCount === 1 ? "tag" : "tags"}
				</div>
			</div>

			<div className="p-4">
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-base font-semibold text-surface-900 truncate">{modelName}</h3>
					<div className="flex items-center gap-0.5 flex-shrink-0">
						<button onClick={(e) => { e.stopPropagation(); navigate(`/view-model/${_id}`); }}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-200 hover:text-brand-400">
							<Eye className="h-4 w-4" />
						</button>
						{["admin", "superAdmin"].includes(currentUser.role) && (
							<>
								<button onClick={(e) => { e.stopPropagation(); onEdit(_id); }}
									className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-700">
									<Edit className="h-4 w-4" />
								</button>
								<button onClick={(e) => { e.stopPropagation(); onDelete(_id); deleteFromDb(getRealFileUrl(file)).then(console.log); }}
									className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-red-600/10 hover:text-accent-rose">
									<Trash2 className="h-4 w-4" />
								</button>
							</>
						)}
					</div>
				</div>
				<div className="mt-3 flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button onClick={(e) => e.stopPropagation()}
								className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-surface-300 bg-surface-200 px-4 py-2.5 text-sm font-medium text-surface-800 transition-all hover:bg-surface-300">
								<span>View Tags</span>
								<ChevronDown className="h-3.5 w-3.5" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem asChild>
								<Link to={`/view-model/${_id}?tagType=sample`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5">
									<List className="h-4 w-4 text-brand-400" />
									Samples
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to={`/view-model/${_id}?tagType=incident`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5">
									<Shield className="h-4 w-4 text-accent-amber" />
									Incidents
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};
