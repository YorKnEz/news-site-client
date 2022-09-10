import React from "react"
import { AiOutlinePicture } from "react-icons/ai"

const MAX_IMAGE_SIZE = 10485760 // 10 MB

function FormThumbnailInput({ register, thumbnail, errorCheck }) {
	const isSizeOk = value => (value[0] ? value[0].size < MAX_IMAGE_SIZE : true)

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
