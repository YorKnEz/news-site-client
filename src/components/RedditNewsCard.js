import React, { useEffect, useState } from "react"
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./RedditNewsCard.scss"
import { AuthorInfo } from "../components"
import { LIKE_NEWS } from "../utils/apollo-queries"
import { compressNumber } from "../utils/utils"
import { Link } from "react-router-dom"

function RedditNewsCard({ data, matches }) {
	const client = useApolloClient()
	const [likeNews] = useMutation(LIKE_NEWS)
	const [likes, setLikes] = useState({
		likeState: data.likeState,
		likes: data.likes,
		dislikes: data.dislikes,
	})

	useEffect(() => {
		if (matches) {
			const span = document.getElementById(data.id + "span")

			if (matches > 70) {
				span.style.backgroundColor = "#73ff7e"
				span.style.color = "green"

				return
			}

			if (matches > 33) {
				span.style.backgroundColor = "#f7d37e"
				span.style.color = "#c78d00"

				return
			}

			span.style.backgroundColor = "#fc6d6d"
			span.style.color = "red"
		}
	}, [matches, data.id])

	const handleLike = (e, action) => {
		e.preventDefault()

		likeNews({
			variables: {
				action,
				id: data.id,
			},
			onCompleted: ({ likeNews }) => {
				console.log(likeNews)

				setLikes({
					likeState: action === likes.likeState ? "none" : action,
					likes: likeNews.likes,
					dislikes: likeNews.dislikes,
				})

				client.clearStore()
			},
		})
	}
	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	return (
		<div className="redditnewscard">
			{matches && (
				<span
					id={data.id + "span"}
					className="redditnewscard_matches"
				>{`Matches ${matches}%`}</span>
			)}
			<div className="newscard_likes">
				<button onClick={e => handleLike(e, "like")}>
					{likes.likeState === "like" ? (
						<AiFillLike style={{ color: "var(--button-color)" }} />
					) : (
						<AiOutlineLike />
					)}
				</button>
				<span
					style={{
						color:
							likes.likeState === "like"
								? "var(--button-color)"
								: likes.likeState === "dislike"
								? "red"
								: "var(--text-color)",
					}}
				>
					{compressNumber(likes.likes - likes.dislikes)}
				</span>
				<button onClick={e => handleLike(e, "dislike")}>
					{likes.likeState === "dislike" ? (
						<AiFillDislike style={{ color: "red" }} />
					) : (
						<AiOutlineDislike />
					)}
				</button>
			</div>
			<a
				href={data.sources}
				target="_blank"
				rel="noreferrer"
				className="redditnewscard_container"
			>
				<span className="newscard_posted">{showDate()} by </span>
				<span className="redditnewscard_title">{data.title}</span>

				<AuthorInfo
					data={data.author}
					type={data.type}
					subreddit={data.subreddit}
				/>
			</a>
		</div>
	)
}
export default RedditNewsCard
