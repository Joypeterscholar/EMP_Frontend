/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { memoize } from "proxy-memoize";
import { customFetch } from "../utils";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getUserFromLocalStorage } from "../redux/reducers/userReducer";
import { ModelCard } from "../components/ModelCard";
import SearchInput from "../components/ui/search-input";
import { DeleteAlert, SuccessAlert } from "../components/ui/alert";
import ModelsOverview from "./new/ModelsOverview";
import { FaPlus, FaTrash } from "react-icons/fa";

const url = "/model/get-models";
const deletedModelsUrl = "/model/get-softed-models";

const modelQuery = {
	queryKey: ["model"],
	queryFn: () => customFetch(url),
};

export const deletedModelQuery = {
	queryKey: ["deleted_model"],
	queryFn: () => customFetch(deletedModelsUrl),
};

export const loader = (queryClient) => async () => {
	const response = await queryClient.ensureQueryData(modelQuery);
	let model = [];
	if (response.data.status !== "error") {
		model = response.data.data || [];
	} else {
		toast.error(response.data.message);
	}
	let deletedModels = [];
	const deletedResponse = await queryClient.ensureQueryData(deletedModelQuery);
	if (deletedResponse.data.status !== "error") {
		deletedModels = deletedResponse.data.data || [];
	} else {
		toast.error(deletedResponse.data.message);
	}
	return { model, deletedModels };
};

const AllModels = () => {
	const { data: modelsResponse } = useQuery(modelQuery);
	const { data: deletedModelsResponse } = useQuery(deletedModelQuery);
	const model = modelsResponse?.data?.data || [];
	const deletedModels = deletedModelsResponse?.data?.data || [];
	const [searchParams] = useSearchParams();
	const isCompletedView = searchParams.get("type") === "completed";
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchText, setSearchText] = useState("");
	const [deleteModel, setDeleteModel] = useState(false);
	const [modelToDelList, setModelToDelList] = useState([]);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
	const [itemOffset, setItemOffset] = useState(0);
	const itemsPerPage = 6;

	const statsData = useMemo(() => {
		const totalModels = Array.isArray(model) ? model.length : 0;
		const completedModels = Array.isArray(model) ? model.filter((m) => m?.isComplete).length : 0;
		const deleted = Array.isArray(deletedModels) ? deletedModels.filter((m) => m?.delete).length : 0;
		return { totalModels, activeModels: totalModels, completedModels, deletedModels: deleted };
	}, [model]);

	const modelsAfterViewAndSearch = useMemo(() => {
		const viewFiltered = isCompletedView ? model.filter((item) => item.isComplete) : model;
		const term = searchText.toLowerCase();
		if (!term.length) return viewFiltered;
		const regex = new RegExp(`.*${term}.*`, "i");
		return viewFiltered.filter((item) => regex.test((item.modelName || "").toLowerCase()));
	}, [model, isCompletedView, searchText]);

	const endOffset = itemOffset + itemsPerPage;
	const currentItems = useMemo(
		() => modelsAfterViewAndSearch.slice(itemOffset, endOffset),
		[endOffset, itemOffset, modelsAfterViewAndSearch]
	);

	const pageCount = Math.max(1, Math.ceil(modelsAfterViewAndSearch.length / itemsPerPage));
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % modelsAfterViewAndSearch.length;
		setItemOffset(newOffset);
	};

	const user = useSelector(memoize((state) => state?.userState?.user));
	const localUser = getUserFromLocalStorage();
	const currentUser = localUser || user;

	const mutation = useMutation(
		(ids) => customFetch.post(`/model/soft-delete-models/`, { modelIds: ids }),
		{
			onSuccess: async () => {
				setShowSuccessAlert(true);
				await queryClient.invalidateQueries(["model"]);
				setModelToDelList([]);
				setDeleteModel(false);
				setItemOffset(0);
			},
			onError: (error) => toast.error(error.message),
		}
	);

	const handleDeleteModels = () => {
		if (!modelToDelList.length) {
			toast.error("Please select at least one Facility Section");
			return;
		}
		setPendingDeleteIds(modelToDelList);
		setShowDeleteAlert(true);
	};

	useEffect(() => {
		const total = modelsAfterViewAndSearch.length;
		const maxPageIndex = Math.max(0, Math.ceil(total / itemsPerPage) - 1);
		const desiredOffset = Math.min(itemOffset, maxPageIndex * itemsPerPage);
		if (itemOffset !== desiredOffset) setItemOffset(desiredOffset);
	}, [modelsAfterViewAndSearch, itemsPerPage, itemOffset]);

	const handleDeleteAModel = (id) => {
		setPendingDeleteIds([id]);
		setShowDeleteAlert(true);
	};

	const handleCheckedForSoftDelete = (id, e) => {
		if (e) { e.preventDefault?.(); e.stopPropagation?.(); }
		if (modelToDelList.includes(id)) {
			setModelToDelList(modelToDelList.filter((item) => item !== id));
		} else {
			setModelToDelList([...modelToDelList, id]);
		}
	};

	return (
		<div className="space-y-6">
			<ModelsOverview data={statsData} />

			{/* View toggles */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => navigate("/admin/models")}
					className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
						!isCompletedView
							? "bg-brand-600 text-white shadow-sm"
							: "border border-surface-200 bg-white text-surface-600 hover:bg-surface-50"
					}`}
				>
					All Facilities
				</button>
				<button
					onClick={() => navigate("/admin/models?type=completed")}
					className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
						isCompletedView
							? "bg-brand-600 text-white shadow-sm"
							: "border border-surface-200 bg-white text-surface-600 hover:bg-surface-50"
					}`}
				>
					Complete Facilities
				</button>
			</div>

			{/* Delete mode bar */}
			{deleteModel && (
				<div className="flex items-center justify-between rounded-xl border border-accent-rose/20 bg-red-50 px-4 py-3">
					<span className="text-sm font-medium text-accent-rose">
						{modelToDelList.length} facility section(s) selected
					</span>
					<div className="flex gap-2">
						<button onClick={() => { setDeleteModel(false); setModelToDelList([]); }} className="btn-secondary text-xs">
							Cancel
						</button>
						<button onClick={handleDeleteModels} className="btn-danger text-xs">
							<FaTrash className="h-3 w-3" />
							Delete Selected
						</button>
					</div>
				</div>
			)}

			{/* Search and actions */}
			<div className="flex items-center gap-3">
				<div className="flex-1">
					<SearchInput
						value={searchText}
						onChange={(v) => { setSearchText(v); setItemOffset(0); }}
						placeholder="Search by Facility, Status, Location..."
					/>
				</div>
				{!deleteModel && ["admin", "superAdmin"].includes(currentUser.role) && (
					<>
						<Link
							to={`${
								["admin", "superAdmin"].includes(currentUser.role)
									? "/admin/models/add-model"
									: currentUser.role === "sampler"
									? "/sampler/models/add-model"
									: "/login"
							}`}
						>
							<button className="btn-primary">
								<FaPlus className="h-3.5 w-3.5" />
								<span className="max-sm:hidden">Add Facility</span>
							</button>
						</Link>
						<button onClick={() => setDeleteModel(true)} className="btn-secondary">
							<FaTrash className="h-3.5 w-3.5" />
							<span className="max-sm:hidden">Delete Multiple</span>
						</button>
					</>
				)}
			</div>

			{/* Model grid */}
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{currentItems?.map((item) => (
					<div
						key={item._id}
						onClick={(e) => {
							if (deleteModel) { e.preventDefault(); e.stopPropagation(); }
						}}
					>
						<ModelCard
							model={item}
							onDelete={handleDeleteAModel}
							onEdit={(id, e) => {
								if (deleteModel) { e?.preventDefault?.(); e?.stopPropagation?.(); return; }
								navigate(`/${["admin", "superAdmin"].includes(user?.role) ? "admin" : user?.role}/edit-model/${id}`);
							}}
							deleteModel={deleteModel}
							onCheck={(id, e) => handleCheckedForSoftDelete(id, e)}
							userRole={user?.role}
							isChecked={modelToDelList.includes(item._id)}
						/>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className="flex justify-center">
				<ReactPaginate
					previousLabel="Previous"
					nextLabel="Next"
					breakLabel="..."
					pageCount={pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					onPageChange={handlePageClick}
					containerClassName="flex items-center gap-1.5"
					pageClassName="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100"
					previousClassName="flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100"
					nextClassName="flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100"
					breakClassName="flex h-9 w-9 items-center justify-center text-sm text-surface-400"
					activeClassName="!bg-brand-600 !text-white"
					forcePage={Math.floor(itemOffset / itemsPerPage)}
				/>
			</div>

			<DeleteAlert
				isOpen={showDeleteAlert}
				onClose={() => { setShowDeleteAlert(false); setTimeout(() => window?.location.reload(), 2000); }}
				onConfirm={() => { setShowDeleteAlert(false); if (pendingDeleteIds.length) mutation.mutate(pendingDeleteIds); }}
				title="Delete Facility Section(s)"
				message="Are you sure you want to delete the selected Facility Section(s)? This action cannot be undone."
			/>
			<SuccessAlert
				isOpen={showSuccessAlert}
				onClose={() => setShowSuccessAlert(false)}
				title="Delete Successful"
				message="Facility Section(s) were deleted successfully."
			/>
		</div>
	);
};

export default AllModels;
