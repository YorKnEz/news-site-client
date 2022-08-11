import React, { useContext } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"

import { useQuery } from "@apollo/client"

import "./PageWithCards.scss"
import { AuthorProfileCard, Header, Footer } from "."
import { UserContext } from "../context"
import { USER } from "../utils/apollo-queries"
import { Error } from "../pages"

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
							<div className="card">
								<div
									className="card_thumbnail"
									style={{ backgroundImage: "url(/card_thumbnail1.jpg)" }}
								>
									<div className="card_thumbnail_overlay"></div>
									<span className="card_thumbnail_title">
										Join YorkNews today!
									</span>
								</div>
								<div className="card_container">
									<span className="card_text">
										Create an account or log in and check out the latest news
									</span>
									<Link
										to="/sign-up"
										className="button button_primary card_button"
									>
										Sign Up
									</Link>
									<Link
										to="/sign-in"
										className="button button_secondary card_button"
									>
										Sign In
									</Link>
								</div>
							</div>
						)}
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
