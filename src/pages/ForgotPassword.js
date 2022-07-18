import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"

import axios from "axios"

import "./SignUp.scss"
import { Modal, Page } from "../components"
import {
	handleInputBlur,
	handleInputFocus,
	updateInputLabels,
	useDocumentTitle,
} from "../utils/utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [error, setError] = useState("")
	const [showModal, setShowModal] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Reset your password | YorkNews"
	)

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	const onSubmit = async data => {
		console.log(data.email)

		await axios({
			method: "post",
			url: `${ip}/users/verify-password-reset`,
			data: {
				email: data.email,
			},
		})
			.then(res => {
				setShowModal(true)
			})
			.catch(e => setError(e?.response?.data?.error.message || e.message))
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
			{showModal && (
				<Modal>
					<p>You can close this page now and go check your email.</p>
				</Modal>
			)}
			<div className="signUp_container">
				<div className="signUp">
					<span className="signUp_title">Reset your password</span>
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
						{error && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error}
							</p>
						)}
						<button className="button button_primary form_submit">
							Send verification email
						</button>
					</form>
				</div>
			</div>
		</Page>
	)
}

export default ForgotPassword
