import React from "react"

const MAX_IMAGE_SIZE = 10485760 // 10 MB

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function FormProfilePictureInput({ register, profilePicture, errorCheck }) {
	const isSizeOk = value => (value[0] ? value[0].size < MAX_IMAGE_SIZE : true)

	return (
		<div className="profilePicture_wrapper">
			<div className="formItem">
				<label className="formItem_image_label" htmlFor="profilePicture">
					<div
						className="formItem_image_profilePicture"
						style={{
							backgroundImage:
								profilePicture.length > 0
									? `url(${URL.createObjectURL(profilePicture[0])})`
									: `url(${ip}:${port}/public/default_avatar.png)`,
						}}
					/>
				</label>
				<input
					className="formItem_image_input"
					id="profilePicture"
					name="profilePicture"
					type="file"
					accept="image/*"
					{...register("profilePicture", {
						required: false,
						validate: isSizeOk,
					})}
				/>
				{errorCheck("profilePicture")}
			</div>
		</div>
	)
}

export default FormProfilePictureInput
