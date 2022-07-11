import React, { useContext, useEffect, useState } from "react"
import { useQuery, gql } from "@apollo/client"

import "./Profile.scss"
import { NewsCard2, Page, QueryResult } from "../components"
import { UserContext } from "../context"
import { useDocumentTitle } from "../utils"

const NEWS = gql`
	query NewsForProfile($offsetIndex: Int, $authorEmail: String) {
		newsForProfile(offsetIndex: $offsetIndex, authorEmail: $authorEmail) {
			id
			title
			subreddit
			thumbnail
			sources
			tags
			body
			type
			createdAt
			updatedAt
			author {
				id
				fullName
				profilePicture
			}
		}
	}
`

function Profile() {
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [news, setNews] = useState([])
	const { user } = useContext(UserContext)
	const { loading, error, data } = useQuery(NEWS, {
		variables: {
			offsetIndex,
			authorEmail: user.email,
		},
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	useEffect(() => {
		if (data) {
			console.log(data)

			setNews(news => [...news, ...data.newsForProfile])
		}
	}, [data])

	useEffect(() => {
		if (reachedBottomOfPage) {
			setReachedBottomOfPage(false)
			setOffsetIndex(offsetIndex + 1)
		}
	}, [reachedBottomOfPage, offsetIndex])

	// check if the user scrolled to the bottom of the page so we can request more news only then
	window.addEventListener("scroll", event => {
		const { clientHeight, scrollHeight, scrollTop } =
			event.target.scrollingElement

		if (!loading && !error && scrollHeight - clientHeight === scrollTop) {
			setReachedBottomOfPage(true)
		}
	})

	return (
		<Page>
			<div className="profile">
				<div className="profile_info">
					{user.profilePicture === "default" ? (
						<img src="default_avatar.png" alt="avatar of user" />
					) : (
						<img src={user.profilePicture} alt="avatar of user" />
					)}
					<div className="profile_info_text">
						<div className="profile_info_text2">
							<h3>{user.fullName}</h3>
							<h4>{user.type}</h4>
						</div>
						<p>{user.email}</p>
					</div>
				</div>
				<hr style={{ width: "100%" }} />
				<div className="info">
					<div className="info_box">
						<span className="info_box_title">Info</span>
						<span className="info_box_data">123</span>
					</div>
					<div className="info_box">
						<span className="info_box_title">Info</span>
						<span className="info_box_data">123</span>
					</div>
					<div className="info_box">
						<span className="info_box_title">Info</span>
						<span className="info_box_data">123</span>
					</div>
				</div>
				<hr style={{ width: "100%" }} />
			</div>
			<div className="profile_news">
				{news.map(item => (
					<NewsCard2 data={item} key={item.id} authorOff />
				))}
			</div>
			<QueryResult loading={loading} error={error} data={data} />
		</Page>
	)
}

export default Profile
