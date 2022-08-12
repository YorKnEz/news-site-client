import React, { useContext } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./PageWithCards.scss"
import { Header, Footer } from "."
import { UserContext } from "../context"
import { USER } from "../utils/apollo-queries"
import { Error } from "../pages"
import {
	AuthorProfileCard,
	BecomeEditorCard,
	JoinCard,
} from "./page-cards"

function Page({ children }) {
	const { id } = useParams()
	const { user } = useContext(UserContext)

	const { error, data } = useQuery(USER, {
		variables: { id },
		skip: !id,
	})

	const profileHeader = window.location.pathname.includes("profile")

	const userData = profileHeader ? data?.user : user

	return (
		<>
			<Header userData={userData} profileHeader={profileHeader} />
			{!error ? (
				<div
					className={`pagewc ${
						profileHeader && userData ? "pagewc_margin-top" : ""
					}`}
				>
					<div className="pagewc_col1">{children}</div>
					<div className="pagewc_col2">
						{userData && Object.keys(userData).length > 0 ? (
							<AuthorProfileCard data={userData} />
						) : (
							<>
								<JoinCard />
							</>
						)}
						{user.type !== "author" && <BecomeEditorCard />}
					</div>
				</div>
			) : (
				profileHeader && <Error code="404" />
			)}
			<Footer />
		</>
	)
}

export default Page
