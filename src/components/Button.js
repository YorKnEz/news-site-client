import React from "react"

import "./Button.scss"

function Button({ onClick, text, Icon }) {
	return (
		<button onClick={onClick} className="btn">
			<Icon className="btn_icon" />
			{text && <span className="btn_text">{text}</span>}
		</button>
	)
}

export default Button
