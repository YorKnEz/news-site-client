import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle, AiOutlineFileText } from "react-icons/ai"

import "./BecomeEditor.scss"
import { FormInput, Page } from "../components"
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
			<div className="becomeEditor">
				<div className="becomeEditor_container">
					<span className="becomeEditor_title">
						So, you want to become an editor?
					</span>
					<p>Send us an email with your CV!</p>
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
