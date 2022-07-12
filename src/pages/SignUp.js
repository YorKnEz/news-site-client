import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import {
	AiFillExclamationCircle,
	AiOutlineEye,
	AiOutlineEyeInvisible,
} from "react-icons/ai"
import axios from "axios"

import "./SignUp.scss"
import Modal from "../components/Modal"
import Page from "../components/Page"
import {
	handleInputBlur,
	handleInputFocus,
	updateInputLabels,
	useDocumentTitle,
} from "../utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function SignUp() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [error, setError] = useState("")
	const history = useNavigate()
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Sign Up | YorkNews")

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	const onSubmit = async data => {
		await axios({
			method: "put",
			url: `${ip}/users/register`,
			data: {
				...data,
				fullName: data.firstName + " " + data.lastName,
				type: "user",
			},
		})
			.then(res => {
				setError("")

				setShowModal(true)
			})
			.catch(e => setError(e?.response?.data?.error || e.message))
	}

	const arePasswordsTheSame = value => {
		return password === value
	}

	const errorCheck = name => {
		if (errors[name] && errors[name].type === "required")
			return (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					This field is required.
				</p>
			)

		if (errors[name] && errors[name].type === "validate")
			return (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					The passwords must be the same.
				</p>
			)

		if (name === "email" && error.includes("Email"))
			return (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					{error}
				</p>
			)
	}

	const onModalSubmit = () => {
		setShowModal(false)

		history("/sign-in")
	}

	const handleShowPassword = e => {
		setShowPassword(!showPassword)
	}

	return (
		<Page>
			{showModal && (
				<Modal onSubmit={onModalSubmit}>
					<h3 style={{ margin: 0 }}>Verify account</h3>
					<hr />
					<p>
						Registration success! Check your email in order to verify your
						account.
					</p>
				</Modal>
			)}
			<div className="signUp_container">
				<div className="signUp">
					<span className="signUp_title">Sign Up</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
						<div className="form_row">
							<div className="formItem">
								<label className="formItem_label" htmlFor="firstName">
									First Name
								</label>
								<input
									className="formItem_input"
									id="firstName"
									name="firstName"
									type="text"
									onFocus={handleInputFocus}
									{...register("firstName", {
										required: true,
										onBlur: handleInputBlur,
									})}
								/>
								{errorCheck("firstName")}
							</div>
							<div className="formItem">
								<label className="formItem_label" htmlFor="lastName">
									Last Name
								</label>
								<input
									className="formItem_input"
									id="lastName"
									name="lastName"
									type="text"
									onFocus={handleInputFocus}
									{...register("lastName", {
										required: true,
										onBlur: handleInputBlur,
									})}
								/>
								{errorCheck("lastName")}
							</div>
						</div>
						<div className="formItem">
							<label className="formItem_label" htmlFor="email">
								Email
							</label>
							<input
								className="formItem_input"
								id="email"
								name="email"
								type="email"
								onFocus={handleInputFocus}
								{...register("email", {
									required: true,
									onBlur: handleInputBlur,
								})}
							/>
							{errorCheck("email")}
						</div>
						<div className="formItem password">
							<label className="formItem_label" htmlFor="password">
								Password
							</label>
							<input
								className="formItem_input"
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								onFocus={handleInputFocus}
								{...register("password", {
									required: true,
									onBlur: handleInputBlur,
								})}
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							<button className="password_button" onClick={handleShowPassword}>
								{showPassword ? (
									<AiOutlineEyeInvisible className="password_icon" />
								) : (
									<AiOutlineEye className="password_icon" />
								)}
							</button>
							{errorCheck("password")}
						</div>
						<div className="formItem">
							<label className="formItem_label" htmlFor="confirmPassword">
								Confirm Password
							</label>
							<input
								className="formItem_input"
								id="confirmPassword"
								name="confirmPassword"
								type={showPassword ? "text" : "password"}
								onFocus={handleInputFocus}
								{...register("confirmPassword", {
									required: true,
									onBlur: handleInputBlur,
									validate: arePasswordsTheSame,
								})}
							/>
							{errorCheck("confirmPassword")}
						</div>
						{error && !error.includes("Email") && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error}
							</p>
						)}
						<button className="form_submit">Create Account</button>
					</form>
					<span>
						Already a user?{" "}
						<Link to="/sign-in" className="link">
							Sign In
						</Link>
					</span>
				</div>
			</div>
		</Page>
	)
}

export default SignUp
