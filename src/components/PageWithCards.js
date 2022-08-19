import React, { useContext } from "react"
import { useParams } from "react-router"

import { useQuery } from "@apollo/client"

import "./PageWithCards.scss"
import { Header, Footer } from "."
import { UserContext } from "../context"
import { USER } from "../utils/apollo-queries"
import { Error } from "../pages"
import {
	AuthorNewsCard,
	AuthorProfileCard,
	BecomeEditorCard,
	BestAuthorsCard,
	JoinCard,
	PostCard,
} from "./page-cards"

function Page({ children }) {
	const { id } = useParams()
	const { user } = useContext(UserContext)

	const { error, data } = useQuery(USER, {
		variables: { id },
		skip: !id,
	})

	const pathname = window.location.pathname

	const profileHeader = pathname.includes("profile")

	const isLastCharADigit = !isNaN(pathname[pathname.length - 1])

	// if the pathanem includes news and the last character of the pathname is a digit that means the link is /news/:link-:id
	const news = pathname.includes("/news/") && isLastCharADigit

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
							<>
								<BestAuthorsCard />
								<AuthorProfileCard pageCard data={userData} />
								{(profileHeader || news) && <AuthorNewsCard />}
							</>
						) : (
							<>
								<JoinCard />
							</>
						)}
						{user.type !== "author" ? <BecomeEditorCard /> : <PostCard />}
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
