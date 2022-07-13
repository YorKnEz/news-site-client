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
import Page from "../components/Page"
import {
	handleInputBlur,
	handleInputFocus,
	updateInputLabels,
	useDocumentTitle,
} from "../utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function SignIn({ signIn }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const history = useNavigate()
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Sign In | YorkNews")

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	const onSubmit = async data => {
		await axios({
			method: "post",
			url: `${ip}/users/login`,
			data,
		})
			.then(res => {
				signIn(res.data)

				history("/")
			})
			.catch(e => setError(e?.response?.data?.error || e.message))
	}

	const errorCheck = name => {
		if (errors[name] && errors[name].type === "required")
			return (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					This field is required.
				</p>
			)
	}

	const handleShowPassword = e => {
		e.preventDefault()

		setShowPassword(!showPassword)
	}

	return (
		<Page>
			<div className="signUp_container">
				<div className="signUp">
					<span className="signUp_title">Sign In</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
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
						{error && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error}
							</p>
						)}
						<button className="form_submit">See some news</button>
					</form>
					<span>
						Don't have an account?{" "}
						<Link to="/sign-up" className="link">
							Sign Up
						</Link>
					</span>
				</div>
			</div>
		</Page>
	)
}

export default SignIn
