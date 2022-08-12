import React from "react"
import { Link } from "react-router-dom"

import "./index.scss"

function JoinCard() {
	return (
		<div className="card">
			<div
				className="card_thumbnail"
				style={{ backgroundImage: "url(/card_thumbnail3.jpg)" }}
			>
				<div className="card_thumbnail_overlay"></div>
				<span className="card_thumbnail_title">Become an editor?</span>
			</div>
			<div className="card_container">
				<span className="card_text">
					If you want to become an editor for YorkNews, it's simple: send us
					your CV from the link below!
				</span>
				<Link to="/become-editor" className="button button_primary card_button">
					Become editor
				</Link>
			</div>
		</div>
	)
}

export default JoinCard
