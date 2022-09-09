/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { format, fromUnixTime } from "date-fns"

import "./index.scss"
import { Page, QueryResult } from "../../components"
import { UserContext } from "../../context"
import { FOLLOW_AUTHOR, USER } from "../../utils/apollo-queries"
import { useDocumentTitle } from "../../utils/utils"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function Profile() {
	const { id } = useParams()
	const { user } = useContext(UserContext)
	const [profile, setProfile] = useState({})

	const client = useApolloClient()
	const { loading, error, data } = useQuery(USER, {
		variables: { id },
	})
	const [follow] = useMutation(FOLLOW_AUTHOR)

	// eslint-disable-next-line no-unused-vars
	const [documentTitle, setDocumentTitle] =
		useDocumentTitle("Profile | YorkNews")

	const items = [
		{ title: "Written News", info: profile.writtenNews },
		{ title: "Followers", info: profile.followers },
		{ title: "Joined", info: profile.createdAt },
	]

	// update the state after each apollo request
	useEffect(() => {
		if (data) {
			const createdAt = fromUnixTime(data.user.createdAt / 1000)

			setProfile({
				...data.user,
				createdAt: format(createdAt, "MMMM d',' yyyy"),
			})
		}
	}, [data])

	const handleFollow = async action => {
		try {
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
		<Page>
			{profile && (
				<div className="profile">
					<div className="profile_container">
						<div className="profile_row">
							<div className="profile_info">
								{profile.profilePicture && (
									<img
										src={`${ip}:${port}/public/${profile.profilePicture}`}
										alt="avatar of user"
									/>
								)}
								<div className="profile_info_text">
									<div className="profile_info_text2">
										<h3>{profile.fullName}</h3>
										<h4>{profile.type}</h4>
									</div>
									<p>{profile.email}</p>
								</div>
							</div>
							{profile.type === "author" &&
								profile.id !== user.id &&
								(profile.following ? (
									<button
										onClick={() => handleFollow("unfollow")}
										className="button button_secondary profile_button"
									>
										Unfollow
									</button>
								) : (
									<button
										onClick={() => handleFollow("follow")}
										className="button button_primary profile_button"
									>
										Follow
									</button>
								))}
						</div>
						<QueryResult loading={loading} error={error} data={data} />
						{profile.type === "author" && (
							<div className="info">
								{items.map(({ title, info }) => (
									<div key={title} className="info_box">
										<span className="info_box_title">{title}</span>
										<span className="info_box_data">{info}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</Page>
	)
}

export default Profile
