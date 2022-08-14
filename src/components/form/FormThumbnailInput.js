import React from "react"
import { AiOutlinePicture } from "react-icons/ai"

function FormThumbnailInput({ register, thumbnail, errorCheck }) {
	// const isSizeOk = value => {
	// 	// check if an image has been added and check if the size is less than 10MB
	// 	if (value.length > 0) return value[0].size < 10485760

	// 	// return true otherwise to avoid errors
	// 	return true
	// }
	const isSizeOk = value => (value[0] ? value[0].size < 10485760 : true)

	return (
		<div className="thumbnail_wrapper">
			<div className="formItem">
				<label className="formItem_image_label" htmlFor="thumbnail">
					<span className="formItem_image_title">
						<AiOutlinePicture className="formItem_image_icon" />
						{thumbnail.length > 0 ? thumbnail[0].name : "Your thumbnail"}
					</span>
					<div
						className="formItem_image_thumbnail"
						style={{
							backgroundImage:
								thumbnail.length > 0
									? `url(${URL.createObjectURL(thumbnail[0])})`
									: "url(/default_thumbnail.png)",
						}}
					/>
				</label>
				<input
					className="formItem_image_input"
					id="thumbnail"
					name="thumbnail"
					type="file"
					accept="image/*"
					{...register("thumbnail", {
						required: false,
						validate: isSizeOk,
					})}
				/>
				{errorCheck("thumbnail")}
			</div>
		</div>
	)
}

export default FormThumbnailInput
