import React from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../context"

function ProtectedRoute({ children }) {
	return (
		<UserContext.Consumer>
			{({ token }) => (token ? children : <Navigate to="/" replace />)}
		</UserContext.Consumer>
	)
}

export default ProtectedRoute
