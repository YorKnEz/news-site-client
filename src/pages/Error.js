import React from "react"
import { Link } from "react-router-dom"

import "./Error.scss"
import { Page } from "../components"

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
			buttonTextP: "Sign in",
		},
		"403_1": {
			message: "You must be an author to access this page.",
			to: "/become-editor",
			buttonTextP: "Become an editor",
		},
		"403_2": {
			message: "You must verify your email to access this page.",
			to: "/",
			buttonTextP: "Return home",
		},
		"404": {
			message: "Page not found.",
			to: "/",
			buttonTextP: "Return home",
		},
	}

	return (
		<Page>
			<div className="error404">
				<div className="error404_message">
					<span>{`${errors[code].message}`}</span>
				</div>
				<Link
					to={errors[code].to}
					className="button button_primary error404_button"
				>
					{errors[code].buttonTextP}
				</Link>
			</div>
		</Page>
	)
}

export default Error
