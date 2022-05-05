import React from "react"
import { SpinnerCircular } from "spinners-react"

function QueryResult({ loading, error, data, children }) {
	if (error) {
		return <p>ERROR: {error.message}</p>
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
