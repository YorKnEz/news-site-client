import React from "react"

import "./Switch.scss"

function Switch({ theme, toggleTheme, switchState, setSwitchState }) {
	return (
		<div className="switch">
			<div
				id="switchElement"
				className="switch_circle"
				style={theme === "dark" ? { left: "calc(36px - 16px)" } : { left: "0" }}
				onClick={e => {
					toggleTheme()
					setSwitchState(!switchState)
				}}
			></div>
		</div>
	)
}

export default Switch
