import React, { useContext, useState } from "react"
import { ThemeContext, themes } from "../context"

import "./Switch.scss"

function Switch() {
	const { theme, toggleTheme } = useContext(ThemeContext)
	const [switchState, setSwitchState] = useState(
		theme === themes.dark ? true : false
	)
	console.log(themes.dark === theme)

	const handleClick = () => {
		toggleTheme()
		setSwitchState(value => !value)
	}

	return (
		<div className="switch">
			Dark mode
			<div className="switch_container" onClick={handleClick}>
				<div
					id="switchElement"
					className="switch_circle"
					style={{ left: switchState ? "calc(28px - 14px)" : "0" }}
				/>
			</div>
		</div>
	)
}

export default Switch
