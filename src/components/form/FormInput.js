import React from "react"

import { handleInputBlur, handleInputFocus } from "../../utils/utils"

function FormInput({ register, title, id, type, errorCheck }) {
	return (
		<div className="formItem">
			<label className="formItem_label" htmlFor={id}>
				{title}
			</label>
			<input
				className="formItem_input"
				id={id}
				name={id}
				type={type}
				onFocus={handleInputFocus}
				{...register(id, {
					required: true,
					onBlur: handleInputBlur,
				})}
			/>
			{errorCheck(id)}
		</div>
	)
}

export default FormInput
