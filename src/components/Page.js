import React, { useContext } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import "./Page.scss"
import { Header, Footer } from "../components"
import { UserContext } from "../context"
import { USER } from "../utils/apollo-queries"

function Page({ children }) {
	const { id } = useParams()
	const { user } = useContext(UserContext)

	const { data } = useQuery(USER, {
		variables: { id },
		skip: !id,
	})

	const profileHeader = window.location.pathname.includes("profile")

	const userData = profileHeader ? data?.user : user

	return (
		<>
			<Header userData={userData} profileHeader={profileHeader} />
			<div
				className={`page ${profileHeader && userData ? "page_margin-top" : ""}`}
			>
				{children}
			</div>
			<Footer />
		</>
	)
}

export default Page
