import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle, AiOutlineFileText } from "react-icons/ai"

import "./BecomeEditor.scss"
import { Page } from "../components"
import {
	handleInputBlur,
	handleInputFocus,
	useDocumentTitle,
} from "../utils/utils"

function BecomeEditor() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	// eslint-disable-next-line no-unused-vars
	const [error, setError] = useState("")

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Become an Editor | YorkNews"
	)

	const onSubmit = data => {
		console.log(data)

		// send email with the data
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
			<div className="becomeEditor_container">
				<div className="becomeEditor">
					<h1>So, you want to become an editor?</h1>
					<p>Send us an email with your CV!</p>
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
						<div className="formItem">
							<label className="formItem_file_label" htmlFor="cv">
								<AiOutlineFileText className="formItem_file_icon" />
								Your CV
							</label>
							<input
								className="formItem_file_input"
								id="cv"
								name="cv"
								type="file"
								onFocus={handleInputFocus}
								{...register("cv", {
									required: true,
									onBlur: handleInputBlur,
								})}
							/>
							{errorCheck("cv")}
						</div>
						<div className="formItem">
							<label className="formItem_label" htmlFor="other">
								Other Information
							</label>
							<textarea
								className="formItem_input"
								id="other"
								name="other"
								type="text"
								onFocus={handleInputFocus}
								{...register("other", {
									required: true,
									onBlur: handleInputBlur,
								})}
							/>
							{errorCheck("other")}
						</div>
						{error && (
							<p className="formItem_error">
								<AiFillExclamationCircle className="formItem_error_icon" />
								{error}
							</p>
						)}
						<button className="button button_primary form_submit">
							Send Us Your Information
						</button>
					</form>
				</div>
			</div>
		</Page>
	)
}

export default BecomeEditor
