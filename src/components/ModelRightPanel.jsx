/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import AccordionWrapper from "../pages/AccordionWrapper";
import {
	customFetch,
	filterDataByDateAndTimeRange,
	formatDate,
} from "../utils";
import { toast } from "react-toastify";
import FormInput from "./FormInput";
import TagModelForm from "./TagModelForm";
import ObjectGroups from "./ObjectGroups";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { FaTimes, FaBars, FaDownload, FaTrash } from "react-icons/fa";

const ModelRightPanel = ({
	mobile,
	setMobile,
	activePane,
	setActivePane,
	tagType,
	tagsData,
	setTagsData,
	model,
	searchApplied,
	setSearchApplied,
	newTaggedInfoName,
	setNewTaggedInfoName,
	handleFilterTags,
	resetTagsData,
	startDate,
	setStartDate,
	startTime,
	setStartTime,
	endDate,
	setEndDate,
	endTime,
	setEndTime,
	filterApplied,
	setFilterApplied,
	ReviewerState,
	setReviewerState,
	typeChoosed,
	setTypeChoosed,
	sampleChoosed,
	setSampleChoosed,
	incidentChoosed,
	setIncidentChoosed,
	resultChoosed,
	setResultChoosed,
	exportToCsv,
	exportData,
	fileExported,
	setFileExported,
	currentUser,
	promptDelete,
	objectGroups,
	setObjectGroups,
	fetchObjectGroups,
	modelId,
}) => {
	const AddFilter = () => setReviewerState("filter");

	const ApplyFilterButton = async () => {
		setFilterApplied(true);
		setReviewerState("allReviewer");
		const result = await filterDataByDateAndTimeRange(
			model.tags || [], startDate, endDate, startTime, endTime
		);
		if (result.length && (typeChoosed === "sampling" || tagType === "sample")) {
			if (sampleChoosed.length) {
				const filterResult = result.filter(
					(item) =>
						item?.sample?.toLowerCase() === sampleChoosed.toLowerCase() &&
						(item?.presence.toLowerCase() === resultChoosed.toLowerCase() || !resultChoosed)
				);
				setTagsData(filterResult);
			} else {
				toast.error("please choose sample type, aborting filter apply");
			}
		} else if (result.length && (typeChoosed === "incident" || tagType == "incident")) {
			if (incidentChoosed.length) {
				const filterResult = result.filter(
					(item) => item?.incident?.toLowerCase() === incidentChoosed.toLowerCase()
				);
				setTagsData(filterResult);
			} else {
				toast.error("please choose incident type, aborting filter apply");
			}
		} else {
			setTagsData(result);
		}
	};

	const ClearFilter = () => {
		setFilterApplied(false);
		setReviewerState("allReviewer");
		resetTagsData();
	};

	const tabs = [
		{ id: "view-tags", label: "Tag History" },
		...(tagType === "sample" || tagType === "incident"
			? [{ id: "tag-model", label: "Add Tag" }]
			: []),
		{ id: "object-groups", label: "Groups" },
	];

	return (
		<>
			{/* Panel */}
			<div
				className={`flex h-full flex-col border-l border-surface-200/60 bg-white transition-all duration-300 ${
					mobile
						? "fixed inset-y-0 right-0 z-50 w-full max-w-md shadow-elevated"
						: "hidden lg:flex lg:w-[420px]"
				}`}
			>
				{/* Mobile close */}
				{mobile && (
					<div className="flex items-center justify-between border-b border-surface-100 px-4 py-3">
						<span className="text-sm font-semibold text-surface-800">Details</span>
						<button
							onClick={() => setMobile(false)}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100"
						>
							<FaTimes className="h-4 w-4" />
						</button>
					</div>
				)}

				{/* Tabs */}
				<div className="flex border-b border-surface-100">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActivePane(tab.id)}
							className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors ${
								activePane === tab.id
									? "text-brand-600"
									: "text-surface-500 hover:text-surface-700"
							}`}
						>
							{tab.label}
							{activePane === tab.id && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
							)}
						</button>
					))}
				</div>

				{/* Panel content */}
				<div className="flex-1 overflow-y-auto">
					{/* View Tags Pane */}
					{activePane === "view-tags" && (
						<div className="p-4">
							<h3 className="mb-4 text-lg font-semibold text-surface-900">Tag History</h3>

							{/* Search */}
							<div className="relative mb-4">
								<input
									type="text"
									value={newTaggedInfoName}
									placeholder="Search tags..."
									onChange={(e) => {
										handleFilterTags(e.target.value);
										setNewTaggedInfoName(e.target.value);
										setSearchApplied(true);
									}}
									className="input-field pr-10"
								/>
								{(searchApplied || filterApplied) && (
									<button
										onClick={() => {
											setSearchApplied(false);
											setNewTaggedInfoName("");
											resetTagsData();
											setFilterApplied(false);
										}}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
									>
										<FaTimes className="h-3.5 w-3.5" />
									</button>
								)}
							</div>

							{/* Filter controls */}
							{ReviewerState === "filter" && (
								<div className="mb-4 rounded-xl border border-surface-200 bg-surface-50 p-4">
									<p className="mb-3 text-sm font-medium text-surface-700">Filter by date</p>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="mb-1 block text-xs text-surface-500">From</label>
											<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field text-xs" />
											<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input-field mt-2 text-xs" />
										</div>
										<div>
											<label className="mb-1 block text-xs text-surface-500">To</label>
											<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field text-xs" />
											<input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input-field mt-2 text-xs" />
										</div>
									</div>
									{!["sample", "incident"].includes(tagType) && (
										<div className="mt-3">
											<label className="mb-1 block text-xs text-surface-500">Type</label>
											<Select value={typeChoosed} onValueChange={setTypeChoosed}>
												<SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
												<SelectContent>
													<SelectItem value="incident">Incident</SelectItem>
													<SelectItem value="sampling">Sampling</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
									{(typeChoosed === "sampling" || tagType === "sample") && (
										<>
											<div className="mt-3">
												<label className="mb-1 block text-xs text-surface-500">Sample</label>
												<FormInput onChange={(e) => setSampleChoosed(e.target.value)} type="text" name="sample" placeholder="Type of sample" value={sampleChoosed} options={["Salmonella", "Listeria"]} />
											</div>
											<div className="mt-3">
												<label className="mb-1 block text-xs text-surface-500">Result</label>
												<Select value={resultChoosed} onValueChange={setResultChoosed}>
													<SelectTrigger><SelectValue placeholder="Select result" /></SelectTrigger>
													<SelectContent>
														<SelectItem value="positive">Positive</SelectItem>
														<SelectItem value="negative">Negative</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</>
									)}
									<div className="mt-4 flex gap-2">
										<button onClick={ClearFilter} className="btn-secondary flex-1 text-xs">Cancel</button>
										<button onClick={ApplyFilterButton} className="btn-primary flex-1 text-xs">Apply</button>
									</div>
								</div>
							)}

							{/* Tags list */}
							{ReviewerState === "allReviewer" && (
								<div className="space-y-4">
									<AccordionWrapper data={tagsData} setTagsData={setTagsData} model={model} />

									<div className="flex gap-2">
										<button onClick={exportToCsv} className="btn-primary flex-1">
											<FaDownload className="h-3.5 w-3.5" />
											Export CSV
										</button>
										{["admin", "superAdmin", "tagger"].includes(currentUser.role) && (
											<button onClick={promptDelete} className="btn-danger flex-1">
												<FaTrash className="h-3.5 w-3.5" />
												Delete All
											</button>
										)}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Tag Model Pane */}
					{activePane === "tag-model" && (
						<TagModelForm
							model={model}
							setTagsData={setTagsData}
							tagsData={tagsData}
							tagType={tagType}
							onCancel={() => setActivePane("view-tags")}
							objectGroups={objectGroups}
						/>
					)}

					{/* Object Groups Pane */}
					{activePane === "object-groups" && (
						<ObjectGroups
							objectGroups={objectGroups}
							setObjectGroups={setObjectGroups}
							modelId={modelId}
							fetchObjectGroups={fetchObjectGroups}
						/>
					)}
				</div>
			</div>

			{/* Mobile overlay */}
			{mobile && (
				<div
					className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
					onClick={() => setMobile(false)}
				/>
			)}
		</>
	);
};

export default ModelRightPanel;
