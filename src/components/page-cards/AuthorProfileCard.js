/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { format, fromUnixTime } from "date-fns"

import "./AuthorProfileCard.scss"
import { UserContext } from "../../context"
import { FOLLOW_AUTHOR } from "../../utils/apollo-queries"

function AuthorProfileCard({ data }) {
	const { id } = useParams()
	const { user } = useContext(UserContext)
	const [profile, setProfile] = useState({})

	const client = useApolloClient()
	const [follow] = useMutation(FOLLOW_AUTHOR)

	// update the state after each apollo request
	useEffect(() => {
		if (data) {
			const createdAt = fromUnixTime(data.createdAt / 1000)

			setProfile({
				...data,
				createdAt: format(createdAt, "MMMM d',' yyyy"),
			})
		}
	}, [data])

	const handleFollow = async (e, action) => {
		try {
			e.preventDefault()

			follow({
				variables: {
					action,
					id,
				},
				onCompleted: ({ follow }) => {
					if (!follow.success) {
						console.log(follow.message)

						return
					}

					client.clearStore()

					setProfile({
						...profile,
						followers: profile.followers + (action === "follow" ? 1 : -1),
						following: action === "follow" ? true : false,
					})
				},
				onError: error => console.log({ ...error }),
			})
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
	}

	return (
		<Link to={`/profile/${profile.id}/overview`} className="authorprofilecard">
			<div className="authorprofilecard_info">
				<img
					src={
						profile.profilePicture === "default"
							? "/default_avatar.png"
							: profile.profilePicture
					}
					alt="avatar of user"
				/>
				<div className="authorprofilecard_info_text">
					<h3>{profile.fullName}</h3>
					<p>{profile.email}</p>
				</div>
			</div>
			<div className="authorprofilecard_stats">
				{profile.type === "author" && (
					<>
						<div className="authorprofilecard_stats_item">
							<b>Written News:</b> {profile.writtenNews}
						</div>
						<div className="authorprofilecard_stats_item">
							<b>Followers:</b> {profile.followers}
						</div>
					</>
				)}
				<div className="authorprofilecard_stats_item">
					<b>Joined:</b> {profile.createdAt}
				</div>
			</div>
			{id &&
				id != user.id &&
				profile.type === "author" &&
				(profile.following ? (
					<button
						onClick={e => handleFollow(e, "unfollow")}
						className="button button_secondary card_button"
					>
						Unfollow
					</button>
				) : (
					<button
						onClick={e => handleFollow(e, "follow")}
						className="button button_primary card_button"
					>
						Follow
					</button>
				))}
		</Link>
	)
}

export default AuthorProfileCard
