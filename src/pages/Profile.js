import React, { useContext } from "react"
import { useParams } from "react-router"

import { User, Author } from "./profile"
import { UserContext } from "../context"

function Profile() {
	const { authorId } = useParams()
	const { user } = useContext(UserContext)

	if (authorId || user.type === "author") return <Author />

	return <User />
}

export default Profile
