import React from "react"
import { useNavigate } from "react-router"

import { SpinnerCircular } from "spinners-react"

function QueryResult({ loading, error, data, children }) {
	const history = useNavigate()

	if (error) {
		console.log(error)

		return history(-1)
	}

	if (loading) {
		return (
			<SpinnerCircular
				size={50}
				thickness={50}
				color="#161616"
				secondaryColor="#eee"
				style={{
					position: "absolute",
					top: "calc(50% - 25px)",
					left: "calc(50% - 25px)",
				}}
			/>
		)
	}

	if (data) {
		return children
	}
}

export default QueryResult
