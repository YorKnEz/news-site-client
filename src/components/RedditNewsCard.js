import React, { useEffect } from "react"

import { formatDistance, fromUnixTime } from "date-fns"

import "./RedditNewsCard.scss"
import { CardVotes } from "../components"

function RedditNewsCard({ data, matches }) {
	const { author, body, createdAt, id, sources, subreddit, title } = data

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

	useEffect(() => {
		const div = document.getElementById(`reddit-${id}`)

		// replace all html tags from Draft-js to get raw text body
		let shortBody = body.replaceAll(/<\/?[\s\S]*?>/g, "")

		// get first 400 chars of that
		shortBody = shortBody.slice(0, 396) + "..."

		// render it
		if (shortBody.length > 3) div.innerHTML = shortBody
	})

	const showDate = () => {
		const createdDate = fromUnixTime(createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdDate, currentDate)

		return distance
	}

	return (
		<div className="redditnewscard">
			{matches && (
				<span
					id={id + "span"}
					className="redditnewscard_matches"
				>{`Matches ${matches}%`}</span>
			)}
			<CardVotes data={data} type="news" />
			<a
				href={sources}
				target="_blank"
				rel="noreferrer"
				className="redditnewscard_container"
			>
				<span className="redditnewscard_posted">{`${subreddit} · Posted by u/${
					author.fullName
				} ${showDate()} ago `}</span>
				<span className="redditnewscard_title">{title}</span>
				<div id={`reddit-${id}`} className="redditnewscard_body">
					{body}
				</div>
			</a>
		</div>
	)
}
export default RedditNewsCard
