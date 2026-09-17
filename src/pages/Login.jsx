import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import axios from "axios";

import "../styles/Login.css";
import { baseURL } from "../utils";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
import {
	getAccessTokenFromLocalStorage,
	getUserFromLocalStorage,
} from "../redux/reducers/userReducer";

const Login = () => {
	const user = useSelector((state) => state.userState.user);
	const localUser = getUserFromLocalStorage();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoggedin, setIsLoggedin] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const currentUser = localUser || user;

	function reRouteByRole(role) {
		let rerouteUrl = "/";
		switch ((role || "").toLowerCase()) {
			case "superadmin":
			case "admin":
				rerouteUrl = "/admin";
				break;
			case "tagger":
				rerouteUrl = "/tagger";
				break;
			case "sampler":
				rerouteUrl = "/sampler";
				break;
			case "reviewer":
				rerouteUrl = "/reviewer";
				break;
		}
		navigate(rerouteUrl);
	}

	useEffect(() => {
		if (currentUser?.role) {
			reRouteByRole(currentUser.role);
		}
	}, [isLoggedin]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const response = await axios.post(
				baseURL + "/api/user/login",
				{ email: email.trim(), password: password.trim() },
				{ headers: { "Content-Type": "application/json" }, timeout: 10000 }
			);
			const userData =
				response.data.status !== "error" ? response.data : null;
			if (response.data.status !== "error") {
				dispatch(loginUser(userData));
				toast.success("Welcome back!");
				setIsLoggedin(true);
			} else {
				toast.error(`${response.data.message}`);
			}
		} catch (err) {
			const errorMessage =
				err?.response?.data?.message ||
				"Wrong login details or Network error";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
			{/* Left panel */}
			<div className="relative hidden lg:flex lg:w-[45%] overflow-hidden" style={{ backgroundColor: "#0f1117" }}>
				<div className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
						backgroundSize: '32px 32px',
					}}
				/>
				<div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-600/10 blur-[120px]" />
				<div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-800/20 blur-[120px]" />
				<div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-violet/5 blur-[100px]" />

				<div className="relative z-10 flex flex-col justify-between p-12 text-surface-800">
					<div>
						<img src={logo} alt="EMP" className="h-10 w-auto" />
					</div>
					<div>
						<h2 className="text-4xl font-bold leading-tight tracking-tight">
							Environmental
							<br />
							Mapping
							<br />
							<span className="text-brand-500">Platform</span>
						</h2>
						<p className="mt-6 max-w-sm text-base leading-relaxed text-surface-600">
							Track, tag, and manage environmental data across your facilities with precision 3D mapping.
						</p>
					</div>
					<div className="flex items-center gap-3 text-xs text-surface-500">
						<div className="h-px flex-1 bg-surface-300" />
						<span>Secure Access</span>
						<div className="h-px flex-1 bg-surface-300" />
					</div>
				</div>
			</div>

			{/* Right panel — login form */}
			<div className="flex flex-1 items-center justify-center px-6 py-12" style={{ backgroundColor: "#0a0a0f" }}>
				<div className="w-full max-w-[400px]">
					<div className="mb-10 flex items-center gap-3 lg:hidden">
						<img src={logo} alt="EMP" className="h-10 w-auto" />
					</div>

					<div className="mb-8">
						<h1 className="text-2xl font-bold tracking-tight text-surface-900">
							Welcome back
						</h1>
						<p className="mt-2 text-sm text-surface-600">
							Sign in to your account to continue
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="space-y-1.5">
							<label className="label-text">Email address</label>
							<input
								type="email"
								placeholder="name@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input-field h-11"
								style={{ backgroundColor: "#161822", borderColor: "#2a2d3e", color: "#f0f1f7" }}
								required
							/>
						</div>

						<div className="space-y-1.5">
							<label className="label-text">Password</label>
							<div className="relative">
								<input
									type={passwordVisible ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="input-field h-11 pr-11"
									style={{ backgroundColor: "#161822", borderColor: "#2a2d3e", color: "#f0f1f7" }}
									required
								/>
								<button
									type="button"
									onClick={() => setPasswordVisible(!passwordVisible)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 transition-colors hover:text-surface-700"
								>
									{passwordVisible ? (
										<FaEyeSlash className="h-4 w-4" />
									) : (
										<FaEye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									className="h-4 w-4 rounded border-surface-400 bg-surface-100 text-brand-600 focus:ring-brand-500"
								/>
								<span className="text-sm text-surface-600">Remember me</span>
							</label>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl !bg-brand-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:!bg-brand-700 hover:shadow-glow-sm active:scale-[0.98] disabled:opacity-50"
						>
							{isSubmitting ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
									<span>Signing in...</span>
								</div>
							) : (
								<div className="flex items-center gap-2">
									<span>Sign in</span>
									<FaArrowRight className="h-3.5 w-3.5" />
								</div>
							)}
						</button>
					</form>

					<p className="mt-8 text-center text-sm text-surface-600">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
						>
							Create one
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
