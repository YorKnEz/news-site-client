import React from "react"
import { Link } from "react-router-dom"

import "./index.scss"
import { BaseCard } from "."

function JoinCard() {
	return (
		<BaseCard thumbnailIndex={1} title="Join YorkNews today!">
			<span className="card_text">
				Create an account or log in and check out the latest news.
			</span>
			<Link to="/sign-up" className="button button_primary card_button">
				Sign Up
			</Link>
			<Link to="/sign-in" className="button button_secondary card_button">
				Sign In
			</Link>
		</BaseCard>
	)
}

export default JoinCard
