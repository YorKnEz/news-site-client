/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"

import { useApolloClient, useQuery } from "@apollo/client"
import axios from "axios"
import { format, fromUnixTime } from "date-fns"

import "./index.scss"
import { Page, QueryResult } from "../../components"
import { UserContext } from "../../context"
import { FollowedAuthors, LikedNews, News } from "../profile"
import { AUTHOR } from "../../utils/apollo-queries"
import { useDocumentTitle } from "../../utils/utils"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function Author() {
	const client = useApolloClient()
	const { authorId } = useParams()
	const [page, setPage] = useState("news")
	const [profile, setProfile] = useState({})
	const { user, token } = useContext(UserContext)
	const { loading, error, data } = useQuery(AUTHOR, {
		variables: {
			id: authorId ? authorId : user.id,
		},
	})
	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	// highlight the current page
	useEffect(() => {
		const button1 = document.getElementById("news")

		button1.classList.add("profile_pages_button_active")

		return () => {
			button1.classList.remove("profile_pages_button_active")
		}
	}, [])

	// update the state after each apollo request
	useEffect(() => {
		if (data) {
			const createdAt = fromUnixTime(data.author.createdAt / 1000)

			setProfile({
				...data.author,
				createdAt: format(createdAt, "MMMM d',' yyyy"),
			})
		}
	}, [data])

	const handlePage = (e, name) => {
		e.preventDefault()

		const button1 = document.getElementById("news")
		const button2 = document.getElementById("followedAuthors")
		const button3 = document.getElementById("likedNews")

		if (name === "news") {
			button1.classList.add("profile_pages_button_active")
			button2.classList.remove("profile_pages_button_active")
			button3.classList.remove("profile_pages_button_active")
		} else if (name === "followedAuthors") {
			button1.classList.remove("profile_pages_button_active")
			button2.classList.add("profile_pages_button_active")
			button3.classList.remove("profile_pages_button_active")
		} else {
			button1.classList.remove("profile_pages_button_active")
			button2.classList.remove("profile_pages_button_active")
			button3.classList.add("profile_pages_button_active")
		}

		setPage(name)
	}

	const handleFollow = async e => {
		try {
			e.preventDefault()

			await axios({
				method: "patch",
				url: `${ip}/users/follow/${authorId}`,
				headers: {
					authorization: token,
				},
			})

			setProfile({
				...profile,
				followers: profile.followers + 1,
				following: true,
			})

			client.clearStore()
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
	}

	const handleUnfollow = async e => {
		try {
			e.preventDefault()

			await axios({
				method: "patch",
				url: `${ip}/users/unfollow/${authorId}`,
				headers: {
					authorization: token,
				},
			})

			setProfile({
				...profile,
				followers: profile.followers - 1,
				following: false,
			})

			client.clearStore()
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
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
									className="button button_secondary profile_button"
								>
									Unfollow
								</button>
							) : (
								<button
									onClick={handleFollow}
									className="button button_primary profile_button"
								>
									Follow
								</button>
							))}
					</div>
					<QueryResult loading={loading} error={error} data={data} />
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
					<div
						className="profile_pages"
						style={{ gridTemplateColumns: "33.3% 33.4% 33.3%" }}
					>
						<button
							onClick={e => handlePage(e, "news")}
							id="news"
							className="button profile_pages_button"
						>
							<h3 className="profile_pages_title">Your news</h3>
						</button>
						<button
							onClick={e => handlePage(e, "followedAuthors")}
							id="followedAuthors"
							className="button profile_pages_button"
						>
							<h3 className="profile_pages_title">Followed authors</h3>
						</button>
						<button
							onClick={e => handlePage(e, "likedNews")}
							id="likedNews"
							className="button profile_pages_button"
						>
							<h3 className="profile_pages_title">Liked news</h3>
						</button>
					</div>
					{page === "news" ? (
						<News />
					) : page === "followedAuthors" ? (
						<FollowedAuthors />
					) : (
						<LikedNews />
					)}
				</div>
			)}
		</Page>
	)
}

export default Author
