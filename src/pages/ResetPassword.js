import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import "./SignUp.scss"
import { FormConfirmPassword, FormPassword, Page } from "../components"
import { updateInputLabels, useDocumentTitle } from "../utils/utils"

const ip = window._env_.REACT_APP_EXPRESS_API_IP

function SignIn() {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	})
	const history = useNavigate()

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const password = watch("password", "")

	const [error, setError] = useState("")
	const [showPassword, setShowPassword] = useState(false)

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Reset your password | YorkNews"
	)

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	useEffect(() => updateInputLabels(), [password])

	const onSubmit = async data => {
		try {
			await axios({
				method: "patch",
				url: `${ip}/users/reset-password?token=${params.token}`,
				data: {
					password: data.password,
				},
			})

			history("/sign-in")
		} catch (error) {
			setError(error?.response?.data?.message || error.message)
			console.error(error?.response?.data?.message || error.message)
		}
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
	}

	return (
		<Page>
			<div className="signUp">
				<div className="signUp_container">
					<span className="signUp_title">Reset your password</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
						<FormPassword
							register={register}
							errorCheck={errorCheck}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
						{errorCheck("password")}
						<FormConfirmPassword
							register={register}
							validate={value => password === value}
							showPassword={showPassword}
						/>
						{errorCheck("confirmPassword")}
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
