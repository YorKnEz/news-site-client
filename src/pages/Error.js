import React from "react"
import { AiFillExclamationCircle } from "react-icons/ai"
import { Link } from "react-router-dom"
import { Page } from "../components"

import "./Error.scss"

/*
 types can be:
	401: if the page should be accessed by a signed in user/author
	403: if the page should be accessed by a signed in author
	404: if the page doesn't exist
*/
function Error({ code }) {
	const errors = {
		"401": {
			message: "You must be signed in to access this page.",
			to: "/sign-in",
			buttonText: "Sign in",
		},
		"403": {
			message: "You must be an author to access this page.",
			to: "/become-editor",
			buttonText: "Become an editor",
		},
		"404": {
			message: "Page not found.",
			to: "/",
			buttonText: "Return home",
		},
	}

	return (
		<Page>
			<div className="error404">
				<div className="error404_message">
					<span>
						<AiFillExclamationCircle />
						{`Error ${code}`}
					</span>
					<span>{`${errors[code].message}`}</span>
				</div>
				<Link to={errors[code].to} className="button button_primary">
					{errors[code].buttonText}
				</Link>
			</div>
		</Page>
	)
}

export default Error
