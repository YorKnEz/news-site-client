import React from "react"

import "./RedditNewsCard.scss"
import { AuthorInfo } from "../components"

function RedditNewsCard({ data }) {
	return (
		<a
			href={data.sources}
			target="_blank"
			className="reddit_news_card"
			rel="noreferrer"
		>
			<span className="reddit_news_card_title">{data.title}</span>

			<AuthorInfo
				data={data.author}
				type={data.type}
				subreddit={data.subreddit}
			/>
		</a>
	)
}
export default RedditNewsCard
