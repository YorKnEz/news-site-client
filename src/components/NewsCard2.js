import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard2.scss"

function NewsCard2({ data }) {
	useEffect(() => {
		const div = document.getElementById(data.id)

		let body = data.body

		// replace all html tags from Draft-js to get raw text body
		body = body.replaceAll(/<\/?[\s\S]*?>/g, "")

		// get first 400 chars of that
		body = body.slice(0, 396) + "..."

		// render it
		div.innerHTML = body
	}, [data])

	const showTags = () => {
		let tags = []

		// split the data.tags into an array of tags only if there is at least one element
		if (data.tags.length > 0) tags = data.tags.split(",")

		// map the tags
		return tags.map(s => (
			<span className="tags_item" key={s}>
				{s}
			</span>
		))
	}

	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	return (
		<Link to={`/news/${data.id}`} className="news_card2">
			<div
				className="news_card2_thumbnail"
				style={{ backgroundImage: `url("${data.thumbnail}")` }}
			/>
			<div className="news_card2_info">
				<span className="news_card2_info_title">{data.title}</span>

				<div className="news_card2_info_body" id={data.id}></div>

				<div className="news_card2_info_wrapper">
					<div className="news_card2_info_tags">{showTags()}</div>
					<p className="news_card2_info_date">{showDate()}</p>
				</div>
			</div>
		</Link>
	)
}
export default NewsCard2
