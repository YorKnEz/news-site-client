import React, { useState } from "react"

import "./BecomeEditor.scss"
import { Page } from "../components"
import { useDocumentTitle } from "../utils/utils"

const publicEmail = process.env.REACT_APP_PUBLIC_EMAIL

function BecomeEditor() {
	// eslint-disable-next-line no-unused-vars
	const [error, setError] = useState("")

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] = useDocumentTitle(
		"Become an Editor | YorkNews"
	)

	return (
		<Page>
			<div className="becomeEditor">
				<div className="becomeEditor_container">
					<span className="becomeEditor_title">
						So, you want to become an editor?
					</span>
					<p>Send us an email with your CV at {publicEmail}!</p>
				</div>
			</div>
		</Page>
	)
}

export default BecomeEditor
