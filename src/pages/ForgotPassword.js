import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"

import axios from "axios"

import "./SignUp.scss"
import { FormInput, Modal, Page } from "../components"
import { updateInputLabels, useDocumentTitle } from "../utils/utils"

const ip = window._env_.REACT_APP_EXPRESS_API_IP

function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const [showModal, setShowModal] = useState(false)
	const [error, setError] = useState("")

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Reset your password | YorkNews"
	)

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	const onSubmit = async data => {
		try {
			await axios({
				method: "post",
				url: `${ip}/users/verify-password-reset`,
				data: {
					email: data.email,
				},
			})

			setShowModal(true)
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
			{showModal && (
				<Modal>
					<p>You can close this page now and go check your email.</p>
				</Modal>
			)}
			<div className="signUp">
				<div className="signUp_container">
					<span className="signUp_title">Reset your password</span>
					<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
						<FormInput
							register={register}
							errorCheck={errorCheck}
							title="Email"
							id="email"
							type="email"
						/>
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
