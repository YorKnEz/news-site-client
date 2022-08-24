import React from "react"
import { AiOutlineExclamationCircle, AiOutlineFrown } from "react-icons/ai"

import { SpinnerCircular } from "spinners-react"

import "./QueryResult.scss"

function QueryResult({ loading, error, data, children }) {
	if (error) {
		console.log(error.message ? error.message : error)

		return (
			<div className="query_error" style={{}}>
				<AiOutlineExclamationCircle className="query_error_icon" />
				<p>{error.message ? error.message : error}</p>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="query_spinner">
				<SpinnerCircular
					className="query_spinner_icon"
					thickness={50}
					color="#161616"
					secondaryColor="#eee"
				/>
			</div>
		)
	}

	if (data) {
		const queryNames = [
			"newsForHome",
			"newsForHomeReddit",
			"newsForProfile",
			"followedAuthors",
			"liked",
			"saved",
		]

		// check for each array if it is empty and return notFound if so
		for (const index in queryNames) {
			if (data[queryNames[index]] && data[queryNames[index]].length === 0)
				return (
					<div className="query_error">
						<AiOutlineFrown className="query_error_icon" />
						<p className="querry_error_p">
							You reached the bottom of the page.
						</p>
					</div>
				)
		}

		// otherwise return the children
		return children
	}
}

export default QueryResult
