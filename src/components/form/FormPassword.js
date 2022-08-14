import React from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

import { handleInputBlur, handleInputFocus } from "../../utils/utils"

function FormPassword({ register, showPassword, setShowPassword }) {
	const handleShowPassword = e => {
		e.preventDefault(setShowPassword(value => !value))
	}

	return (
		<div className="formItem password">
			<label className="formItem_label" htmlFor="password">
				Password
			</label>
			<input
				className="formItem_input"
				id="password"
				name="password"
				type={showPassword ? "text" : "password"}
				onFocus={handleInputFocus}
				{...register("password", {
					required: true,
					onBlur: handleInputBlur,
				})}
			/>
			<button className="password_button" onClick={handleShowPassword}>
				{showPassword ? (
					<AiOutlineEyeInvisible className="password_icon" />
				) : (
					<AiOutlineEye className="password_icon" />
				)}
			</button>
		</div>
	)
}

export default FormPassword
