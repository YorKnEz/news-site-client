import React from "react"
import { Link } from "react-router-dom"

import "./index.scss"
import { BaseCard } from "."

function BecomeEditorCard() {
	return (
		<BaseCard thumbnailIndex={3} title="Become an editor?">
			<span className="card_text">
				If you want to become an editor for YorkNews, it's simple: send us your
				CV from the link below!
			</span>
			<Link to="/become-editor" className="button button_primary card_button">
				Become editor
			</Link>
		</BaseCard>
	)
}

export default BecomeEditorCard
