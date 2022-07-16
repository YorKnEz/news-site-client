import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard.scss"
import { AuthorInfo } from "../components"

function NewsCard({ data, matches }) {
	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

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

	return (
		<Link to={`/news/${data.id}`} className="news_card">
			<div className="news_card_overlay">
				{matches && (
					<span
						id={data.id + "span"}
						className="news_card_matches"
					>{`Matches ${matches}%`}</span>
				)}
			</div>
			<div
				className="news_card_thumbnail"
				style={{ backgroundImage: `url("${data.thumbnail}")` }}
			/>
			<div className="news_card_info">
				<span className="news_card_info_title">{data.title}</span>

				<div className="news_card_info_wrapper">
					<AuthorInfo
						data={data.author}
						type={data.type}
						subreddit={data.subreddit}
					/>
					<p className="news_card_info_date">{showDate()}</p>
				</div>
			</div>
		</Link>
	)
}
export default NewsCard
