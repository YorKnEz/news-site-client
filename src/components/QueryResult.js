import React from "react"
import { AiOutlineExclamationCircle, AiOutlineFrown } from "react-icons/ai"

import { SpinnerCircular } from "spinners-react"

function QueryResult({ loading, error, data, children }) {
	if (error) {
		console.log(error.message ? error.message : error)

		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "24px 0",
					fontSize: "20px",
					height: "50px",
				}}
			>
				<AiOutlineExclamationCircle />
				<p style={{ marginLeft: "16px" }}>
					{error.message ? error.message : error}
				</p>
			</div>
		)
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
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "24px 0",
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
		}

		// otherwise return the children
		return children
	}
}

export default QueryResult
