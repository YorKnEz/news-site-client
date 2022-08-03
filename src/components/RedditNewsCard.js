import React, { useEffect } from "react"

import { formatDistance, fromUnixTime } from "date-fns"

import "./RedditNewsCard.scss"
import { AuthorInfo, CardVotes } from "../components"

function RedditNewsCard({ data, matches }) {
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

	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
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
			<CardVotes data={data} />
			<a
				href={data.sources}
				target="_blank"
				rel="noreferrer"
				className="redditnewscard_container"
			>
				<span className="newscard_posted">{showDate()}</span>
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
