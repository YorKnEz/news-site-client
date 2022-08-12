import React from "react"
import { Link } from "react-router-dom"

import "./index.scss"

function JoinCard() {
	return (
		<div className="card">
			<div
				className="card_thumbnail"
				style={{ backgroundImage: "url(/card_thumbnail1.jpg)" }}
			>
				<div className="card_thumbnail_overlay"></div>
				<span className="card_thumbnail_title">Join YorkNews today!</span>
			</div>
			<div className="card_container">
				<span className="card_text">
					Create an account or log in and check out the latest news
				</span>
				<Link to="/sign-up" className="button button_primary card_button">
					Sign Up
				</Link>
				<Link to="/sign-in" className="button button_secondary card_button">
					Sign In
				</Link>
			</div>
		</div>
	)
}

export default JoinCard
