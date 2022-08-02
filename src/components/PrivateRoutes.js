import { useContext } from "react"
import { Outlet } from "react-router-dom"

import { UserContext } from "../context"
import { Error } from "../pages"

const PrivateRoutes = ({ authorOnly }) => {
	const { user, token } = useContext(UserContext)

	if (!token) return <Error code="401" />

	if (authorOnly && user.type !== "author") return <Error code="403_1" />

	if (authorOnly && !user.verified) return <Error code="403_2" />

	return <Outlet />
}

export default PrivateRoutes
