import React from "react"
import { Link } from "react-router-dom"

import "./index.scss"

function PostCard() {
	return (
		<div className="card">
			<div
				className="card_thumbnail"
				style={{ backgroundImage: "url(/card_thumbnail4.jpg)" }}
			>
				<div className="card_thumbnail_overlay"></div>
				<span className="card_thumbnail_title">Create a news</span>
			</div>
			<div className="card_container">
				<span className="card_text">Start writing your news and post it.</span>
				<Link to="/news/create" className="button button_primary card_button">
					Create a news
				</Link>
			</div>
		</div>
	)
}

export default PostCard
