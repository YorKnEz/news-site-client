import React from "react"
import { AiFillExclamationCircle } from "react-icons/ai"

import { handleInputBlur, handleInputFocus } from "../../utils/utils"

function FormControlledInput({ title, id, type, value, setValue, error }) {
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
				value={value}
				autoComplete="off"
				onChange={setValue}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
			/>
			{error && (
				<p className="formItem_error">
					<AiFillExclamationCircle className="formItem_error_icon" />
					{error}
				</p>
			)}
		</div>
	)
}

export default FormControlledInput
