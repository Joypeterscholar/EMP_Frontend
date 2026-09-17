/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import {
	useLoaderData,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import "../styles/singleModel.css";
import AccordionWrapper from "./AccordionWrapper";
import ModelViewBabylon from "../components/ModelViewBabylon";
import ModelOnScreenControls from "../components/ModelOnScreenControls";
import { useDispatch, useSelector } from "react-redux";
import { memoize } from "proxy-memoize";
import {
	customFetch,
	formatDate,
	formatTime,
	removeCommas,
} from "../utils";
import { toast } from "react-toastify";
import { dispatchSelectedMeshTags } from "../redux/actions/meshActions";
import { getUserFromLocalStorage } from "@/redux/reducers/userReducer";
import ModelRightPanel from "../components/ModelRightPanel";
import { FaArrowLeft, FaBars, FaCog } from "react-icons/fa";

export const loader =
	() =>
	async ({ params }) => {
		const response = await customFetch(`/model/get-a-models/${params.id}`);
		if (response?.data.status === "error") {
			toast.error(response?.data.message);
		}
		return { model: response?.data?.data ?? {} };
	};

const SingleModel = () => {
	const { model } = useLoaderData();
	const { id } = useParams();
	const [sp] = useSearchParams();
	const tagType = sp.get("tagType");
	const dispatch = useDispatch();

	const [searchApplied, setSearchApplied] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [startTime, setStartTime] = useState("00:00");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("24:00");
	const [mobile, setMobile] = useState(false);
	const [ReviewerState, setReviewerState] = useState("allReviewer");
	const [filterApplied, setFilterApplied] = useState(false);
	const [exportData, setExportData] = useState(false);
	const [fileExported, setFileExported] = useState(false);
	const [tagsData, setTagsData] = useState([]);
	const [newTaggedInfoName, setNewTaggedInfoName] = useState("");
	const [newTaggedInfoPosition, setNewTaggedInfoPosition] = useState("");
	const [newTaggedInfo, setNewTaggedInfo] = useState({});
	const [sampleChoosed, setSampleChoosed] = useState("");
	const [typeChoosed, setTypeChoosed] = useState("");
	const [incidentChoosed, setIncidentChoosed] = useState("");
	const [resultChoosed, setResultChoosed] = useState("");
	const [activePane, setActivePane] = useState("view-tags");
	const [objectGroups, setObjectGroups] = useState([]);
	const navigate = useNavigate();

	const user = useSelector((state) => state.userState.user);
	const localUser = getUserFromLocalStorage();
	const currentUser = localUser || user;

	async function fetchObjectGroups() {
		await customFetch.get(`/model/${id}/object-group`).then(({ data }) => {
			if (data) setObjectGroups(data);
		});
	}

	useEffect(() => {
		fetchObjectGroups();
	}, []);

	useEffect(() => {
		const tags = model?.tags;
		if (tags) dispatch(dispatchSelectedMeshTags(tags));
	}, [dispatch, model]);

	useEffect(() => {
		if (model?.tags) {
			if (tagType) {
				setTagsData(model.tags.filter((tag) => tag[tagType]));
				model.tags = model.tags.filter((tag) => tag[tagType]);
			} else {
				setTagsData(model.tags);
			}
		}
	}, []);

	const modelInterationData = useSelector(
		memoize((state) => state.selectedMeshState.data)
	);
	const modelInterationActiveData = useSelector(
		memoize((state) => state.selectedMeshState.activeMeshData)
	);

	const destructureTaggedInfo = (data) => {
		if (data) {
			const info = JSON.parse(data);
			return [info?.meshName, info?.tagPosition];
		}
		return [];
	};

	useEffect(() => {
		const [meshName, tagPosition] = destructureTaggedInfo(modelInterationData);
		setNewTaggedInfoPosition(tagPosition);
		setNewTaggedInfo(modelInterationData);
	}, [modelInterationData, modelInterationActiveData]);

	function resetTagsData() {
		setTagsData(model?.tags);
	}

	const handleFilterTags = useCallback(
		(search) => {
			if (!search.length) {
				setTagsData(model.tags || []);
				return;
			}
			const regex = new RegExp(`.*${search.toLowerCase()}.*`, "i");
			const searchResult = (model.tags || []).filter((item) => {
				return (
					regex.test(item.objectName?.toLowerCase()) ||
					regex.test(item.incident?.toLowerCase()) ||
					regex.test(item.presence?.toLowerCase()) ||
					regex.test(item.sample?.toLowerCase()) ||
					regex.test(item.locations?.toLowerCase()) ||
					regex.test(item.text?.toLowerCase()) ||
					regex.test(item.type?.toLowerCase()) ||
					regex.test(item.slug?.toLowerCase()) ||
					regex.test(item.group?.toLowerCase())
				);
			});
			setTagsData(searchResult);
		},
		[tagsData, setTagsData]
	);

	function exportToCsv() {
		toast.success("Exporting data...");
		var formattedRows = [];
		for (var i = 0; i < tagsData.length; i++) {
			var formattedRow = [];
			formattedRow.push(tagsData[i].objectName);
			formattedRow.push(tagsData[i].slug);
			formattedRow.push(tagsData[i].incident?.name);
			formattedRow.push(tagsData[i].evidence);
			formattedRow.push(tagsData[i].locations);
			formattedRow.push(tagsData[i].presence);
			formattedRow.push(tagsData[i].sample?.name);
			formattedRow.push(tagsData[i].user.username);
			formattedRow.push(model.modelName);
			formattedRow.push(tagsData[i].text);
			formattedRow.push(removeCommas(formatDate(tagsData[i].createdAt)));
			formattedRow.push(formatTime(tagsData[i].createdAt));
			formattedRows.push(formattedRow);
		}
		var csvContent =
			"ObjectName,Ref,Actions,Evidence,Locations,Result,Type,Username,Model,Note,Date,Time\n";
		for (var j = 0; j < formattedRows.length; j++) {
			csvContent += formattedRows[j].join(",") + "\n";
		}
		var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		var url = URL.createObjectURL(blob);
		var link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", model.name);
		document.body.appendChild(link);
		link.click();
		URL.revokeObjectURL(url);
		toast.success("Data exported Successfully");
	}

	const promptDelete = () => {
		if (confirm("Are you sure you want delete all samples")) {
			handleDelete();
		}
	};

	const handleDelete = async () => {
		const response = await customFetch.delete(`/tag/delete-model-tags/${id}`);
		if (response.data.status !== "error") {
			toast.success(response.data.message || "All Samples deleted successfully");
			model.tags = [];
			setTagsData([]);
		} else {
			toast.error(response.data.message);
		}
	};

	return (
		<div className="flex h-screen bg-surface-900">
			{/* 3D Viewer */}
			<div className="relative flex-1">
				<div className="h-full w-full">
					<ModelViewBabylon
						MODEL_URL={model.file}
						tags={tagsData}
						model={model}
						setTagsData={setTagsData}
					/>
				</div>
				{/* Overlay controls */}
				<div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-4">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 rounded-xl bg-black/50 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
					>
						<FaArrowLeft className="h-3.5 w-3.5" />
						Back
					</button>
					<button
						onClick={() => setMobile(!mobile)}
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 lg:hidden"
					>
						<FaBars className="h-4 w-4" />
					</button>
				</div>
				<ModelOnScreenControls />
			</div>

			{/* Right Panel */}
			<ModelRightPanel
				mobile={mobile}
				setMobile={setMobile}
				activePane={activePane}
				setActivePane={setActivePane}
				tagType={tagType}
				tagsData={tagsData}
				setTagsData={setTagsData}
				model={model}
				searchApplied={searchApplied}
				setSearchApplied={setSearchApplied}
				newTaggedInfoName={newTaggedInfoName}
				setNewTaggedInfoName={setNewTaggedInfoName}
				handleFilterTags={handleFilterTags}
				resetTagsData={resetTagsData}
				startDate={startDate}
				setStartDate={setStartDate}
				startTime={startTime}
				setStartTime={setStartTime}
				endDate={endDate}
				setEndDate={setEndDate}
				endTime={endTime}
				setEndTime={setEndTime}
				filterApplied={filterApplied}
				setFilterApplied={setFilterApplied}
				ReviewerState={ReviewerState}
				setReviewerState={setReviewerState}
				typeChoosed={typeChoosed}
				setTypeChoosed={setTypeChoosed}
				sampleChoosed={sampleChoosed}
				setSampleChoosed={setSampleChoosed}
				incidentChoosed={incidentChoosed}
				setIncidentChoosed={setIncidentChoosed}
				resultChoosed={resultChoosed}
				setResultChoosed={setResultChoosed}
				exportToCsv={exportToCsv}
				exportData={exportData}
				fileExported={fileExported}
				setFileExported={setFileExported}
				currentUser={currentUser}
				promptDelete={promptDelete}
				objectGroups={objectGroups}
				setObjectGroups={setObjectGroups}
				fetchObjectGroups={fetchObjectGroups}
				modelId={model._id}
			/>
		</div>
	);
};

export default SingleModel;
