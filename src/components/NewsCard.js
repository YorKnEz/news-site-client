import React, { useEffect, useState } from "react"
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard.scss"
import { LIKE_NEWS } from "../utils/apollo-queries"
import { compressNumber } from "../utils/utils"

function NewsCard({ data, matches }) {
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

	const showTags = () => {
		let tags = []

		// split the data.tags into an array of tags only if there is at least one element
		if (data.tags.length > 0) tags = data.tags.split(",")

		// map the tags
		return tags.map(s => (
			<Link
				className="tags_item"
				key={s}
				to={`/search?search=${s}&filter=tags`}
			>
				{s}
			</Link>
		))
	}

	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	return (
		<div className="newscard">
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
			<div className="newscard_container">
				<span className="newscard_posted">
					{showDate()} by{" "}
					<Link
						to={`/profile/${data.author.id}`}
						className="newscard_authorlink"
					>
						{data.author.fullName}
					</Link>
				</span>
				<Link to={`/news/${data.id}`} className="newscard_link">
					<span className="newscard_title">{data.title}</span>
					<div
						className="newscard_thumbnail"
						style={{ backgroundImage: `url("${data.thumbnail}")` }}
					>
						{matches && (
							<span
								id={data.id + "span"}
								className="newscard_matches"
							>{`Matches ${matches}%`}</span>
						)}
					</div>
				</Link>
				<div className="newscard_tags">{showTags()}</div>
			</div>
		</div>
	)
}

export default NewsCard
