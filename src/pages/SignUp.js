import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

import "./SignUp.scss"
import {
	FormConfirmPassword,
	FormInput,
	FormPassword,
	Modal,
	Page,
} from "../components"
import { updateInputLabels, useDocumentTitle } from "../utils/utils"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function SignUp() {
	const history = useNavigate()

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const password = watch("password", "")

	const [showPassword, setShowPassword] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [error, setError] = useState("")

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Sign Up | YorkNews")

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	useEffect(() => updateInputLabels(), [password])

	const onSubmit = async data => {
		try {
			await axios({
				method: "post",
				url: `${ip}:${port}/users/register`,
				data: {
					...data,
					fullName: data.firstName + " " + data.lastName,
					type: "user",
				},
			})

			setError("")

			setShowModal(true)
		} catch (error) {
			setError(error?.response?.data?.message || error.message)
			console.error(error?.response?.data?.message || error.message)
		}
	}

	const onModalSubmit = () => {
		setShowModal(false)

		history("/sign-in")
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
			<div className="signUp">
				<div className="signUp_container">
					<span className="signUp_title">Sign Up</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
						<div className="form_row">
							<FormInput
								register={register}
								errorCheck={errorCheck}
								title="First name"
								id="firstName"
								type="text"
							/>
							<FormInput
								register={register}
								errorCheck={errorCheck}
								title="Last name"
								id="lastName"
								type="text"
							/>
						</div>
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
							Create Account
						</button>
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
