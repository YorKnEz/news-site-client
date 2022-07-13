import React from "react"
import { AiFillExclamationCircle } from "react-icons/ai"
import { Link } from "react-router-dom"
import { Page } from "../components"

import "./Error.scss"

function Error() {
	return (
		<Page>
			<div className="error404">
				<p className="error404_message">
					<AiFillExclamationCircle />
					Error 404: Page not found.
				</p>
				<Link to="/" className="button button_primary">
					Return home
				</Link>
			</div>
		</Page>
	)
}

export default Error
