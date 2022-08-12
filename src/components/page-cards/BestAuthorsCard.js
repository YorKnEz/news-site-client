import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useApolloClient, useQuery } from "@apollo/client"
import axios from "axios"

import "./index.scss"
import "./BestAuthorsCard.scss"
import { QueryResult } from "../../components"
import { UserContext } from "../../context"
import { BEST_AUTHORS } from "../../utils/apollo-queries"

const ip = process.env.REACT_APP_EXPRESS_API_IP

function BestAuthorsCard() {
	const { token } = useContext(UserContext)
	const [authors, setAuthors] = useState([])

	const client = useApolloClient()
	const { loading, error, data } = useQuery(BEST_AUTHORS)

	useEffect(() => {
		if (data) {
			setAuthors([...data.bestAuthors])
		}
	}, [data])

	const handleFollow = async (e, id) => {
		try {
			e.preventDefault()

			await axios({
				method: "patch",
				url: `${ip}/users/follow/${id}`,
				headers: {
					authorization: token,
				},
			})

			setAuthors(arr =>
				arr.map(author => {
					if (author.id === id)
						return {
							...author,
							following: true,
						}

					return author
				})
			)

			client.clearStore()
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
	}

	const handleUnfollow = async (e, id) => {
		try {
			e.preventDefault()

			await axios({
				method: "patch",
				url: `${ip}/users/unfollow/${id}`,
				headers: {
					authorization: token,
				},
			})

			setAuthors(arr =>
				arr.map(author => {
					if (author.id === id)
						return {
							...author,
							following: false,
						}

					return author
				})
			)

			client.clearStore()
		} catch (error) {
			console.error(error?.response?.data?.message || error.message)
		}
	}

	return (
		<div className="card">
			<div
				className="card_thumbnail"
				style={{ backgroundImage: "url(/card_thumbnail2.jpg)" }}
			>
				<div className="card_thumbnail_overlay"></div>
				<span className="card_thumbnail_title">Top Authors</span>
			</div>
			<div className="card_conatiner">
				{authors.map((author, index) => (
					<Link
						to={`/profile/${author.id}/overview`}
						key={author.id}
						className="author"
					>
						<span className="author_index">{index + 1}</span>
						<div className="author_info">
							<img
								className="author_avatar"
								src={
									author.profilePicture === "default"
										? "/default_avatar.png"
										: author.profilePicture
								}
								alt="avatar of user"
							/>
							<span>{author.fullName}</span>
						</div>
						{author.following ? (
							<button
								onClick={e => handleUnfollow(e, author.id)}
								className="author_button"
							>
								Unfollow
							</button>
						) : (
							<button
								onClick={e => handleFollow(e, author.id)}
								className="author_button"
							>
								Follow
							</button>
						)}
					</Link>
				))}
				<QueryResult loading={loading} error={error} data={data} />
			</div>
		</div>
	)
}

export default BestAuthorsCard
