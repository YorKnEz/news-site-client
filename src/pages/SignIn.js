import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

import "./SignUp.scss"
import { FormInput, FormPassword, Page } from "../components"
import { UserContext } from "../context"
import { updateInputLabels, useDocumentTitle } from "../utils/utils"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function SignIn() {
	const history = useNavigate()

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const password = watch("password", "")

	const { signIn } = useContext(UserContext)
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Sign In | YorkNews")

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	useEffect(() => updateInputLabels(), [password])

	const onSubmit = async data => {
		try {
			const res = await axios({
				method: "post",
				url: `${ip}:${port}/users/login`,
				data,
			})

			signIn(res.data)

			history("/")
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
	}

	return (
		<Page>
			<div className="signUp">
				<div className="signUp_container">
					<span className="signUp_title">Sign In</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
						<FormInput
							register={register}
							errorCheck={errorCheck}
							title="Email"
							id="email"
							type="email"
						/>
						<FormPassword
							register={register}
							errorCheck={errorCheck}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
						{errorCheck("password")}
						<Link className="link" to="/forgot-password">
							Forgot your password?
						</Link>
						{error && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error}
							</p>
						)}
						<button className="button button_primary form_submit">
							See some news
						</button>
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
