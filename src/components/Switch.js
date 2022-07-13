import React from "react"

import "./Switch.scss"

function Switch({ theme, toggleTheme, switchState, setSwitchState }) {
	const handleClick = e => {
		e.preventDefault()

		toggleTheme()
		setSwitchState(!switchState)
	}

	return (
		<div className="switch" onClick={handleClick}>
			<div
				id="switchElement"
				className="switch_circle"
				style={theme === "dark" ? { left: "calc(36px - 16px)" } : { left: "0" }}
			></div>
		</div>
	)
}

export default Switch
