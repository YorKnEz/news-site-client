/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation, useQuery } from "@apollo/client"

import "./index.scss"
import "./BestAuthorsCard.scss"
import { BaseCard } from "."
import { QueryResult } from "../../components"
import { UserContext } from "../../context"
import { BEST_AUTHORS, FOLLOW_AUTHOR } from "../../utils/apollo-queries"

function BestAuthorsCard() {
	const { user } = useContext(UserContext)
	const [authors, setAuthors] = useState([])

	const client = useApolloClient()
	const { loading, error, data } = useQuery(BEST_AUTHORS)
	const [follow] = useMutation(FOLLOW_AUTHOR)

	useEffect(() => {
		if (data) {
			setAuthors([...data.bestAuthors])
		}
	}, [data])

	const handleFollow = async (e, action, id) => {
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

					setAuthors(arr =>
						arr.map(author => {
							if (author.id === id)
								return {
									...author,
									following: action === "follow" ? true : false,
								}

							return author
						})
					)
				},
				onError: error => console.log({ ...error }),
			})
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
	}

	return (
		<BaseCard thumbnailIndex={2} title="Top Authors" list>
			{authors.map((author, index) => (
				<Link
					to={`/profile/${author.id}/overview`}
					key={author.id}
					className="authortop"
				>
					<span className="authortop_index">{index + 1}</span>
					<div className="authortop_info">
						<img
							className="authortop_avatar"
							src={
								author.profilePicture === "default"
									? "/default_avatar.png"
									: author.profilePicture
							}
							alt="avatar of user"
						/>
						<span>{author.fullName}</span>
					</div>
					{author.id != user.id &&
						(author.following ? (
							<button
								onClick={e => handleFollow(e, "unfollow", author.id)}
								className="button button_secondary authortop_button"
							>
								Unfollow
							</button>
						) : (
							<button
								onClick={e => handleFollow(e, "follow", author.id)}
								className="button button_primary authortop_button"
							>
								Follow
							</button>
						))}
				</Link>
			))}
			<QueryResult loading={loading} error={error} data={data} />
		</BaseCard>
	)
}

export default BestAuthorsCard
