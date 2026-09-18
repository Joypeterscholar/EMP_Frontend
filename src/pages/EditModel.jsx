import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserFromLocalStorage } from "../redux/reducers/userReducer";
import { customFetch } from "../utils";
import { toast } from "react-toastify";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { CustomCheckbox } from "../components/custom/CustomCheckbox";
import DragDropFile from "../components/DragDropFile";
import { useQueryClient } from "@tanstack/react-query";

const EditModel = () => {
	const { model } = useLoaderData();
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		modelName: model.modelName,
		description: model.description,
		location: model.location?._id,
		coverPicture: model.coverPicture,
		twoD: model.twoD,
		isComplete: model.isComplete || false,
	});
	const [fileNames, setFileNames] = useState({
		coverPicture: "",
		twoD: "",
	});

	const user = useSelector((state) => state.userState.user);
	const localUser = getUserFromLocalStorage();
	const currentUser = localUser || user;

	const handleInputChange = (e) => {
		const { name, value, files, type, checked } = e.target;
		if (files) {
			if (files.length > 0) {
				setFileNames((prev) => ({ ...prev, [name]: files[0].name }));
				setFormData((prev) => ({ ...prev, [name]: files[0] }));
			} else {
				setFileNames((prev) => ({ ...prev, [name]: "" }));
				setFormData((prev) => ({ ...prev, [name]: null }));
			}
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
		}
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const formDataForUpload = new FormData();
			formDataForUpload.append("modelName", formData.modelName);
			formDataForUpload.append("description", formData.description);
			formDataForUpload.append("location", formData.location);
			formDataForUpload.append("image", formData.coverPicture);
			formDataForUpload.append("twoD", formData.twoD);
			formDataForUpload.append("isComplete", formData.isComplete);
			formDataForUpload.append("userId", currentUser?._id);
			const response = await customFetch.post(`/model/update-model/${id}`, formDataForUpload);
			if (response.data?.status !== "error") {
				toast.success(`Facility Section edited successfully`);
				setFileNames({ coverPicture: "", twoD: "" });
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["model"] }),
					queryClient.invalidateQueries({ queryKey: ["deleted_model"] }),
				]);
				navigate(-1);
			} else {
				toast.error(response.data?.message);
			}
		} catch (error) {
			const errorMessage = error?.response?.data?.msg || "Error editing Model";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="py-8">
			<form
				method="POST"
				encType="multipart/form-data"
				className="flex flex-col justify-start items-center w-full"
				onSubmit={handleEdit}
			>
				<div className="flex flex-col gap-4 justify-center items-center w-full max-w-2xl">
					<div>
						<h1 className="text-xl font-bold text-center" style={{ color: "#f0f1f7" }}>
							Edit Facility Section
						</h1>
						<p className="mb-3 text-center text-sm" style={{ color: "#8b8da5" }}>
							Please edit Facility Section details
						</p>
					</div>
					<div className="flex flex-col justify-center items-start w-full">
						<p className="text-sm" style={{ color: "#b0b2c5" }}>Facility Section name</p>
						<input
							className="input-field w-full h-11"
							type="text"
							name="modelName"
							value={formData.modelName}
							placeholder="Enter Facility Section name"
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="flex flex-col justify-center items-start w-full">
						<p className="text-sm" style={{ color: "#b0b2c5" }}>Description</p>
						<input
							type="text"
							className="input-field w-full h-11"
							name="description"
							value={formData.description}
							placeholder="Enter Facility Section Description"
							onChange={handleInputChange}
							required
						/>
					</div>

					<DragDropFile
						name="twoD"
						accept=".jpg, .jpeg, .png, .webp"
						onChange={handleInputChange}
						label="Drop a 2D image here"
						sublabel="JPEG, PNG"
						fileName={fileNames.twoD}
					/>

					<DragDropFile
						name="coverPicture"
						accept=".jpg, .jpeg, .png, .webp"
						onChange={handleInputChange}
						label="Drop a cover photo here"
						sublabel="JPEG, PNG, up to 2MB"
						fileName={fileNames.coverPicture}
					/>

					<div className="flex items-center gap-2 w-full mb-3">
						<CustomCheckbox
							id="isComplete"
							checked={formData.isComplete}
							onCheckedChange={(val) =>
								setFormData((prev) => ({ ...prev, isComplete: !!val }))
							}
							className="h-5 w-5"
						/>
						<label
							htmlFor="isComplete"
							className="text-sm font-medium"
							style={{ color: "#d4d6e3" }}
						>
							Mark as complete facility
						</label>
					</div>
					<div className="mt-4 w-full">
						<button
							type="submit"
							className="w-full h-12 text-sm font-semibold text-white transition-colors rounded-2xl hover:opacity-90 active:scale-[0.98]"
							style={{ backgroundColor: "#4f46e5" }}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Saving..." : "Save model"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default EditModel;
