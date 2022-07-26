import React, { useEffect } from "react"
import { AiOutlineSave, AiOutlineShareAlt } from "react-icons/ai"
import { BsChatSquare } from "react-icons/bs"
import { Link } from "react-router-dom"

import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard.scss"
import { CardVotes } from "../components"

function NewsCard({ data, matches }) {
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

	const handleShare = e => {}

	const handleSave = e => {}

	return (
		<div className="newscard">
			<CardVotes data={data} />
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
				<div className="newscard_options">
					<Link to={`/news/${data.id}`} className="newscard_options_item">
						<BsChatSquare className="newscard_options_item_icon" />
						{data.comments}
					</Link>
					<button onClick={handleShare} className="newscard_options_item">
						<AiOutlineShareAlt className="newscard_options_item_icon" />
						Share
					</button>
					<button onClick={handleSave} className="newscard_options_item">
						<AiOutlineSave className="newscard_options_item_icon" />
						Save
					</button>
				</div>
			</div>
		</div>
	)
}

export default NewsCard
