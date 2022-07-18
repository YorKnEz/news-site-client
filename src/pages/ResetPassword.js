import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
	AiFillExclamationCircle,
	AiOutlineEye,
	AiOutlineEyeInvisible,
} from "react-icons/ai"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import "./SignUp.scss"
import Page from "../components/Page"
import {
	handleInputBlur,
	handleInputFocus,
	updateInputLabels,
	useDocumentTitle,
} from "../utils/utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function SignIn() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const password = watch("password", "")
	const [error, setError] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const history = useNavigate()
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Reset your password | YorkNews"
	)

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	useEffect(() => updateInputLabels(), [password])

	const onSubmit = async data => {
		await axios({
			method: "post",
			url: `${ip}/users/reset-password?token=${params.token}`,
			data: {
				password: data.password,
			},
		})
			.then(res => {
				history("/sign-in")
			})
			.catch(e => setError(e?.response?.data?.error.message || e.message))
	}

	const handleShowPassword = e => {
		e.preventDefault()

		setShowPassword(!showPassword)
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

	return (
		<Page>
			<div className="signUp_container">
				<div className="signUp">
					<span className="signUp_title">Reset your password</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
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
						{error && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error}
							</p>
						)}
						<button className="button button_primary form_submit">
							Reset your password
						</button>
					</form>
				</div>
			</div>
		</Page>
	)
}

export default SignIn
