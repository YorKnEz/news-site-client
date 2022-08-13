import React from "react"
import { Link } from "react-router-dom"

import "./index.scss"
import { BaseCard } from "."

function PostCard() {
	return (
		<BaseCard thumbnailIndex={4} title="Create a news">
			<span className="card_text">Start writing your news and post it.</span>
			<Link to="/news/create" className="button button_primary card_button">
				Create a news
			</Link>
		</BaseCard>
	)
}

export default PostCard
