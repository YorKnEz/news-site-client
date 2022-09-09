import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle, AiOutlineFileText } from "react-icons/ai"

import axios from "axios"

import "./BecomeEditor.scss"
import { FormInput, FormTooltips, Modal, Page } from "../components"
import { UserContext } from "../context"
import {
	handleInputBlur,
	handleInputFocus,
	useDocumentTitle,
} from "../utils/utils"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function BecomeEditor() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const { token } = useContext(UserContext)
	const [showModal, setShowModal] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [error, setError] = useState("")

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Become an Editor | YorkNews"
	)

	const tooltips = ["The CV should be in PDF format"]

	const onSubmit = async data => {
		try {
			console.log(data)

			// check if the cv is in pdf format
			const file = data.cv.length > 0 ? data.cv[0] : undefined

			if (file) {
				if (file.type !== "application/pdf") {
					setError("The CV is not in PDF format.")

					return
				}

				const form = new FormData()

				for (const item in data) {
					if (item !== "cv") form.append(item, data[item])
				}

				form.append("cv", data.cv[0], "cv")

				await axios({
					headers: {
						authorization: token,
						"Content-Type": "multipart/form-data",
					},
					method: "post",
					url: `${ip}:${port}/users/become-editor`,
					data: form,
				})

				setShowModal(true)
			}
		} catch (error) {
			console.log(error)
			setError("An error has occured.")
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
				<Modal onSubmit={() => setShowModal(false)}>
					<h2 style={{ margin: 0 }}>Response</h2>
					<hr />
					<p>
						Your request has been sent successfully. You can return to what you
						were doing while we review it.
					</p>
				</Modal>
			)}
			<div className="becomeEditor">
				<div className="becomeEditor_container">
					<span className="becomeEditor_title">
						So, you want to become an editor?
					</span>
					<p>Send us an email with your CV!</p>
					<form
						id="form"
						className="form"
						onSubmit={handleSubmit(onSubmit)}
						encType="multipart/form-data"
					>
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
								accept=".pdf"
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
						<FormTooltips tooltips={tooltips} />
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
