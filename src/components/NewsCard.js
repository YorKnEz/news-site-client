import React, { useEffect, useState } from "react"
import { AiFillSave, AiOutlineSave, AiOutlineShareAlt } from "react-icons/ai"
import { BsChatSquare } from "react-icons/bs"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard.scss"
import { CardVotes } from "../components"
import { SAVE_ITEM } from "../utils/apollo-queries"

function NewsCard({ data, matches }) {
	const [saved, setSaved] = useState(false)

	const client = useApolloClient()
	const [save] = useMutation(SAVE_ITEM)

	// set the save state
	useEffect(() => {
		if (data.saveState === "save") {
			setSaved(true)
		}
	}, [data])

	// set the body if there is no thumbnail
	useEffect(() => {
		if (!data.thumbnail) {
			const div = document.getElementById(`news-body-${data.id}`)

			let body = data.body

			// replace all html tags from Draft-js to get raw text body
			body = body.replaceAll(/<\/?[\s\S]*?>/g, "")

			// get first 400 chars of that
			body = body.slice(0, 396) + "..."

			// render it
			div.innerHTML = body
		}
	})

	// set the matches (for searches only)
	useEffect(() => {
		if (matches) {
			const span = document.getElementById(`${data.id}span`)

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

	const handleShare = () => {}

	const handleSave = () => {
		save({
			variables: {
				action: saved ? "unsave" : "save",
				parentId: data.id,
				parentType: "news",
			},
			onCompleted: ({ save }) => {
				if (!save.success) {
					console.log(save.message)

					return
				}

				client.clearStore()

				setSaved(value => !value)
			},
			onError: error => console.log({ ...error }),
		})
	}

	return (
		<div className="newscard">
			<CardVotes data={data} />
			<div className="newscard_container">
				{matches && (
					<span
						id={`${data.id}span`}
						className="newscard_matches"
					>{`Matches ${matches}%`}</span>
				)}
				<span className="newscard_posted">
					{showDate()} by{" "}
					<Link
						to={`/profile/${data.author.id}/overview`}
						className="newscard_authorlink"
					>
						{data.author.fullName}
					</Link>
				</span>
				<Link to={`/news/${data.link}-${data.id}`} className="newscard_link">
					<span className="newscard_title">{data.title}</span>
					{data.thumbnail ? (
						<div
							className="newscard_thumbnail"
							style={{ backgroundImage: `url("${data.thumbnail}")` }}
						></div>
					) : (
						<div className="newscard_body" id={`news-body-${data.id}`}></div>
					)}
				</Link>
				<div className="tags newscard_tags">{showTags()}</div>
				<div className="newscard_options">
					<Link
						to={`/news/${data.link}-${data.id}`}
						className="newscard_options_item"
					>
						<BsChatSquare className="newscard_options_item_icon" />
						{data.comments}
					</Link>
					<button onClick={handleShare} className="newscard_options_item">
						<AiOutlineShareAlt className="newscard_options_item_icon" />
						Share
					</button>
					<button onClick={handleSave} className="newscard_options_item">
						{saved ? (
							<>
								<AiFillSave className="newscard_options_item_icon" />
								Unsave
							</>
						) : (
							<>
								<AiOutlineSave className="newscard_options_item_icon" />
								Save
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default NewsCard
