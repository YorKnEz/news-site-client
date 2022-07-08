import React from "react"
import { Link } from "react-router-dom"
import AuthorInfo from "./AuthorInfo"

import "./NewsCard.scss"

function NewsCard({ data }) {
	return (
		<div className="news_card">
			<Link to={`/news/${data.id}`}>
				<div
					className="news_card_thumbnail"
					style={{ backgroundImage: `url("${data.thumbnail}")` }}
				>
					{/* Thumbnail */}
				</div>
				{/* <img
					className="news_card_thumbnail"
					src={data.thumbnail}
					alt="thumbnail"
				/> */}
			</Link>
			<div className="news_card_info">
				<span className="news_card_info_title">{data.title}</span>

				<AuthorInfo
					fullName={data.author.fullName}
					profilePicture={data.author.profilePicture}
					type={data.type}
					subreddit={data.subreddit}
				/>
			</div>
		</div>
	)
}
export default NewsCard
