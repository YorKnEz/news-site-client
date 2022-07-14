import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../context"

function ProtectedRoute({ children, authorOnly }) {
	const { user, token } = useContext(UserContext)

	// if the route should be accessible only by the author we reroute the user accordingly
	if (authorOnly)
		return user.type !== "author" ? <Navigate to="/" replace /> : children

	// if the route is not author only it means any user with a valid token can access it
	return !token ? <Navigate to="/sign-up" /> : children
}

export default ProtectedRoute
