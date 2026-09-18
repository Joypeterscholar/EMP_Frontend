import React, { useEffect, useState } from "react";
import { Successful } from "../components";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import { getUserFromLocalStorage } from "../redux/reducers/userReducer";
import { CustomCheckbox } from "../components/custom/CustomCheckbox";
import DragDropFile from "../components/DragDropFile";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AddModel = () => {
	const [showModal, setShowModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [locations, setLocations] = useState();
	const [formData, setFormData] = useState({
		modelName: "",
		description: "",
		location: "",
		file: null,
		coverPicture: null,
		twoD: null,
		isComplete: false,
	});
	const [fileNames, setFileNames] = useState({
		file: "",
		coverPicture: "",
		twoD: "",
	});

	const user = useSelector((state) => state.userState.user);
	const localUser = getUserFromLocalStorage();
	const currentUser = localUser || user;
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	async function fetchLocations() {
		await customFetch.get("/location/locations").then(({ data }) => {
			if (data?.data) {
				const locationsNew = data.data.map((item) => ({
					label: item.name,
					value: item._id,
				}));
				setLocations(locationsNew);
				if (locationsNew.length > 0) {
					setFormData((prev) => ({ ...prev, location: locationsNew[0].value }));
				}
			}
		});
	}

	useEffect(() => {
		fetchLocations();
	}, []);

	const handleInputChange = (e) => {
		const { name, value, files, type, checked } = e.target;
		if (files) {
			if (files.length > 0) {
				setFileNames((prev) => ({ ...prev, [name]: files[0].name }));
				setFormData((prev) => ({ ...prev, [name]: files[0] }));
			} else {
				// File removed
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const formDataForUpload = new FormData();
			if (!formData.file) {
				toast.error("please provide a model file");
				setIsSubmitting(false);
				return;
			}

			formDataForUpload.append("modelName", formData.modelName);
			formDataForUpload.append("description", formData.description);
			formDataForUpload.append("location", formData.location);
			formDataForUpload.append("model", formData.file);
			formDataForUpload.append("size", formData.file.size);
			formDataForUpload.append("image", formData.coverPicture);
			formDataForUpload.append("twoD", formData.twoD);
			formDataForUpload.append("isComplete", formData.isComplete);
			formDataForUpload.append("userId", currentUser?._id);

			const response = await customFetch.post("/model/create-models", formDataForUpload);
			if (response.data?.status !== "error") {
				toast.success(`Model added successfully`);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["model"] }),
					queryClient.invalidateQueries({ queryKey: ["deleted_model"] }),
					queryClient.refetchQueries({ queryKey: ["model"] }),
					queryClient.refetchQueries({ queryKey: ["deleted_model"] }),
				]).catch(() => {});
				setFormData({
					modelName: "", description: "", location: "",
					file: null, coverPicture: null, twoD: null, isComplete: false,
				});
				setFileNames({ file: "", coverPicture: "", twoD: "" });
				const basePath = ["admin", "superAdmin"].includes(currentUser?.role)
					? "/admin" : `/${currentUser?.role}`;
				navigate(`${basePath}/models`);
			} else {
				toast.error(response.data?.message);
			}
		} catch (error) {
			const errorMessage = error?.response?.data?.msg || "Error adding model";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="grid gap-10 place-items-center py-5 w-full">
			<form
				onSubmit={handleSubmit}
				method="POST"
				encType="multipart/form-data"
				className="flex flex-col justify-start items-center w-full"
			>
				<h3 className="mb-4 text-xl font-bold text-center" style={{ color: "#f0f1f7" }}>
					Add Facility Section
				</h3>
				<div className="flex flex-col gap-4 justify-center items-center w-full max-w-2xl">
					<input
						type="text"
						name="modelName"
						placeholder="Facility Section Name"
						className="input-field w-full h-11"
						value={formData.modelName}
						onChange={handleInputChange}
						required
					/>
					<input
						type="text"
						name="description"
						placeholder="Facility Section Description"
						className="input-field w-full h-11"
						value={formData.description}
						onChange={handleInputChange}
						required
					/>

					<DragDropFile
						name="file"
						accept=".gltf, .glb, .obj, .stl"
						onChange={handleInputChange}
						label="Drop your 3D model here"
						sublabel="GLTF, GLB, OBJ, STL formats"
						fileName={fileNames.file}
						required
					/>

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
					<button
						className="w-full h-12 text-sm font-semibold text-white transition-colors rounded-2xl hover:opacity-90 active:scale-[0.98]"
						style={{ backgroundColor: "#4f46e5" }}
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Sending..." : "Save"}
					</button>
				</div>
			</form>
			<Successful text="Model added" showModal={showModal} setShowModal={setShowModal} />
		</section>
	);
};

export default AddModel;
