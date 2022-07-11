import React from "react"
import { Link } from "react-router-dom"
import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard.scss"
import AuthorInfo from "./AuthorInfo"

function NewsCard({ data, authorOff }) {
	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	return (
		<Link to={`/news/${data.id}`} className="news_card">
			<div className="news_card_overlay" />
			<div
				className="news_card_thumbnail"
				style={{ backgroundImage: `url("${data.thumbnail}")` }}
			/>
			<div className="news_card_info">
				<span className="news_card_info_title">{data.title}</span>

				<div className="news_card_info_wrapper">
					{!authorOff && (
						<AuthorInfo
							fullName={data.author.fullName}
							profilePicture={data.author.profilePicture}
							type={data.type}
							subreddit={data.subreddit}
						/>
					)}
					<p className="news_card_info_date">{showDate()}</p>
				</div>
			</div>
		</Link>
	)
}
export default NewsCard
