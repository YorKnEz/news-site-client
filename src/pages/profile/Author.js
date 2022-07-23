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
		</Page>
	)
}

export default Author
