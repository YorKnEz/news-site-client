import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { AiFillExclamationCircle } from "react-icons/ai"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import axios from "axios"

import "./ProfileSettings.scss"
import { FormInput, FormProfilePictureInput, Modal } from "../components"
import { updateInputLabels } from "../utils/utils"
import { UPDATE_PROFILE } from "../utils/apollo-queries"
import { UserContext } from "../context"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function ProfileSettings({ profile, setProfile }) {
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const watchProfilePicture = watch("profilePicture", [])

	const { token, user, signIn } = useContext(UserContext)
	const [showModal, setShowModal] = useState(false)
	const [error, setError] = useState("")

	const client = useApolloClient()
	const [updateProfile] = useMutation(UPDATE_PROFILE)

	// check if any input has been autofilled in order to change the label position
	useEffect(() => updateInputLabels())

	useEffect(() => {
		// set the profile picture
		const inputProfilePicture = document.querySelector(
			".formItem_image_profilePicture"
		)
		inputProfilePicture.style.backgroundImage = profile.profilePicture
			? `url("${ip}:${port}/public/${profile.profilePicture}")`
			: "url(/default_thumbnail.png)"
	}, [profile])

	const onSubmit = async data => {
		try {
			const requestBody = {
				id: profile.id,
				firstName: data.firstName,
				lastName: data.lastName,
			}

			if (data.profilePicture[0]) {
				const profilePicture = data.profilePicture[0]
					? data.profilePicture[0]
					: ""
				const fileName = Date.now() + "-" + profilePicture.name

				const form = new FormData()

				form.append("file", profilePicture, fileName)

				requestBody.profilePicture = fileName

				await axios({
					method: "post",
					url: `${ip}:${port}/utils/upload-profile-picture`,
					data: form,
				})
			}

			updateProfile({
				variables: {
					userData: requestBody,
				},
				onCompleted: ({ updateProfile }) => {
					if (!updateProfile.success) {
						setError({
							...error,
							other: { message: updateProfile.message },
						})

						return
					}

					client.clearStore()

					setShowModal(true)
					signIn({ token, user: { ...user, ...updateProfile.user } })
					setProfile({ ...user, ...updateProfile.user })
				},
				onError: error => console.log({ ...error }),
			})
		} catch (error) {
			setError(error?.response?.data?.message || error.message)
			console.error(error?.response?.data?.message || error.message)
		}
	}

	const onModalSubmit = () => setShowModal(value => !value)

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
		<div className="psettings">
			{showModal && (
				<Modal onSubmit={onModalSubmit}>
					<h3 style={{ margin: 0 }}>Profile updated</h3>
					<hr />
					<p>
						Your profile has been updated successfully. You may close this modal
						now.
					</p>
				</Modal>
			)}
			<span className="signUp_title">Change your profile</span>
			<form id="form" className="form" onSubmit={handleSubmit(onSubmit)}>
				<FormProfilePictureInput
					register={register}
					profilePicture={watchProfilePicture}
					errorCheck={errorCheck}
				/>
				<div className="form_row">
					<FormInput
						register={register}
						errorCheck={errorCheck}
						title="First name"
						id="firstName"
						type="text"
						defaultValue={profile.firstName}
					/>
					<FormInput
						register={register}
						errorCheck={errorCheck}
						title="Last name"
						id="lastName"
						type="text"
						defaultValue={profile.lastName}
					/>
				</div>
				<Link className="link" to="/forgot-password">
					Reset your password
				</Link>
				{error && (
					<p className="formItem_error">
						<AiFillExclamationCircle className="formItem_error_icon" />
						{error}
					</p>
				)}
				<button className="button button_primary form_submit">
					Save changes
				</button>
			</form>
		</div>
	)
}

export default ProfileSettings
