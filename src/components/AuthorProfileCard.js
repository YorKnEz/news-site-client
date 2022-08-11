/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { useApolloClient } from "@apollo/client"
import axios from "axios"
import { format, fromUnixTime } from "date-fns"

import "./AuthorProfileCard.scss"
import { UserContext } from "../context"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function AuthorProfileCard({ data }) {
	const { id } = useParams()
	const client = useApolloClient()
	const { user, token } = useContext(UserContext)
	const [profile, setProfile] = useState({})

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

	const handleFollow = async e => {
		try {
			e.preventDefault()

			await axios({
				method: "patch",
				url: `${ip}/users/follow/${id}`,
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
				url: `${ip}/users/unfollow/${id}`,
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
		</Link>
	)
}

export default AuthorProfileCard
