import React from "react"
import { AiOutlineFrown } from "react-icons/ai"

import { SpinnerCircular } from "spinners-react"

function QueryResult({ loading, error, data, children }) {
	if (error) {
		console.log(error)

		return error
	}

	if (loading) {
		return (
			<>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "40px 0",
					}}
				>
					<SpinnerCircular
						size={50}
						thickness={50}
						color="#161616"
						secondaryColor="#eee"
					/>
				</div>
			</>
		)
	}

	if (data) {
		// object to return if the array of news is empty
		const notFound = (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "40px 0",
					fontSize: "20px",
					height: "50px",
				}}
			>
				<AiOutlineFrown />
				<p style={{ marginLeft: "16px" }}>
					You reached the bottom of the page.
				</p>
			</div>
		)

		// check for each array if it is empty and return notFound if so
		if (data.newsForHome && data.newsForHome.length === 0) {
			return notFound
		}
		if (data.newsForRedditHome && data.newsForRedditHome.length === 0) {
			return notFound
		}
		if (data.newsForProfile && data.newsForProfile.length === 0) {
			return notFound
		}

		// otherwise return the children
		return children
	}
}

export default QueryResult
