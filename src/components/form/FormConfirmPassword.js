import React from "react"

import { handleInputBlur, handleInputFocus } from "../../utils/utils"

function FormConfirmPassword({ register, validate, showPassword }) {
	return (
		<div className="formItem">
			<label className="formItem_label" htmlFor="confirmPassword">
				Confirm Password
			</label>
			<input
				className="formItem_input"
				id="confirmPassword"
				name="confirmPassword"
				type={showPassword ? "text" : "password"}
				onFocus={handleInputFocus}
				{...register("confirmPassword", {
					required: true,
					onBlur: handleInputBlur,
					validate,
				})}
			/>
		</div>
	)
}

export default FormConfirmPassword
