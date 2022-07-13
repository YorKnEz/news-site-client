/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { useQuery, gql } from "@apollo/client"
import { format, fromUnixTime } from "date-fns"
import axios from "axios"

import "./index.scss"
import { NewsCard2, Page, QueryResult } from "../../components"
import { UserContext } from "../../context"
import { useDocumentTitle } from "../../utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

const QUERY = gql`
	query Query($offsetIndex: Int, $id: ID!, $reqId: ID!) {
		newsForProfile(offsetIndex: $offsetIndex, id: $id) {
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
		}
		author(id: $id, reqId: $reqId) {
			id
			fullName
			email
			profilePicture
			writtenNews
			followers
			createdAt
			following
		}
	}
`

function Author() {
	const { authorId } = useParams()
	const [reachedBottomOfPage, setReachedBottomOfPage] = useState(0)
	const [offsetIndex, setOffsetIndex] = useState(0)
	const [news, setNews] = useState([])
	const [profile, setProfile] = useState({})
	const { user, token } = useContext(UserContext)
	const { loading, error, data } = useQuery(QUERY, {
		variables: {
			offsetIndex,
			id: authorId ? authorId : user.id,
			reqId: user.id,
		},
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	// update the state after each apollo request
	useEffect(() => {
		if (data) {
			console.log(data)

			const createdAt = fromUnixTime(data.author.createdAt / 1000)

			setProfile({
				...data.author,
				createdAt: format(createdAt, "MMMM d',' yyyy"),
			})

			setNews(news => [...news, ...data.newsForProfile])
		}
	}, [data])

	// check if user has reached bottom of the page
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

	const handleFollow = async e => {
		await axios({
			method: "put",
			url: `${ip}/users/follow/${authorId}`,
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				console.log(res)

				setProfile({
					...profile,
					followers: profile.followers + 1,
					following: true,
				})
			})
			.catch(e => console.log(e?.response?.data?.error || e.message))
	}

	const handleUnfollow = async e => {
		await axios({
			method: "put",
			url: `${ip}/users/unfollow/${authorId}`,
			headers: {
				authorization: token,
			},
		})
			.then(res => {
				console.log(res)

				setProfile({
					...profile,
					followers: profile.followers - 1,
					following: false,
				})
			})
			.catch(e => console.log(e?.response?.data?.error || e.message))
	}

	return (
		<Page>
			{profile && (
				<div className="profile">
					<div className="profile_row">
						<div className="profile_info">
							{profile.profilePicture === "default" ? (
								<img src="/default_avatar.png" alt="avatar of user" />
							) : (
								<img src={profile.profilePicture} alt="avatar of user" />
							)}
							<div className="profile_info_text">
								<div className="profile_info_text2">
									<h3>{profile.fullName}</h3>
									<h4>{profile.type}</h4>
								</div>
								<p>{profile.email}</p>
							</div>
						</div>
						{authorId &&
							authorId != user.id &&
							(profile.following ? (
								<button
									onClick={handleUnfollow}
									className="profile_button profile_button_unfollow"
								>
									Unfollow
								</button>
							) : (
								<button
									onClick={handleFollow}
									className="profile_button profile_button_follow"
								>
									Follow
								</button>
							))}
					</div>
					<hr style={{ width: "100%" }} />
					<div className="info">
						<div className="info_box">
							<span className="info_box_title">Written News</span>
							<span className="info_box_data">{profile.writtenNews}</span>
						</div>
						<div className="info_box">
							<span className="info_box_title">Followers</span>
							<span className="info_box_data">{profile.followers}</span>
						</div>
						<div className="info_box">
							<span className="info_box_title">Joined</span>
							<span className="info_box_data">{profile.createdAt}</span>
						</div>
					</div>
					<hr style={{ width: "100%" }} />
				</div>
			)}
			<div className="profile_news">
				{news.map(item => (
					<NewsCard2 data={item} key={item.id} authorOff />
				))}
			</div>
			<QueryResult loading={loading} error={error} data={data} />
		</Page>
	)
}

export default Author