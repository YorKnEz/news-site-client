import React from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../context"

function ProtectedRoute({ children, authorOnly }) {
	return (
		<UserContext.Consumer>
			{({ token, user }) => {
				// if the route should be accessible only by the author we reroute the user accordingly
				if (authorOnly)
					return user.type !== "author" ? <Navigate to="/" replace /> : children

				// if the route is not author only it means any user with a valid token can access it
				return !token ? <Navigate to="/" replace /> : children
			}}
		</UserContext.Consumer>
	)
}

export default ProtectedRoute
