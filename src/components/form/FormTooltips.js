import React from "react"
import { AiOutlineQuestionCircle } from "react-icons/ai"

function FormTooltips({ tooltips }) {
	return (
		<div>
			{tooltips.map(tooltip => (
				<div className="tooltip">
					<AiOutlineQuestionCircle className="tooltip_icon" />
					<p className="tooltip_text">{tooltip}</p>
				</div>
			))}
		</div>
	)
}

export default FormTooltips
