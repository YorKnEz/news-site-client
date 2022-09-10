import React, { useEffect, useState } from "react"
import { AiFillSave, AiOutlineSave, AiOutlineShareAlt } from "react-icons/ai"
import { BsChatSquare } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./NewsCard.scss"
import { Button, CardVotes, DropdownList, Modal } from "../components"
import { SAVE_ITEM } from "../utils/apollo-queries"

const ip = process.env.REACT_APP_API_IP
const port = process.env.REACT_APP_EXPRESS_API_PORT

function NewsCard({ data, matches }) {
	const history = useNavigate()

	const [saved, setSaved] = useState(false)
	const [showShareModal, setShowShareModal] = useState(false)

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

	const goToNews = () => {
		history(`/news/${data.link}-${data.id}`)
	}

	const onShareModalSubmit = async () => setShowShareModal(false)

	const handleShare = () => setShowShareModal(true)

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
			{showShareModal && (
				<Modal onSubmit={onShareModalSubmit}>
					<h3 style={{ margin: 0 }}>Share this with your friends</h3>
					<hr />
					<input
						className="formItem_input"
						type="text"
						value={`${window.location.origin}/news/${data.link}-${data.id}`}
						readOnly
					/>
				</Modal>
			)}
			<CardVotes data={data} type="news" />
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
							style={{
								backgroundImage: `url("${ip}:${port}/public/${data.thumbnail}")`,
							}}
						/>
					) : (
						<div className="newscard_body" id={`news-body-${data.id}`}></div>
					)}
				</Link>
				<div className="tags newscard_tags">{showTags()}</div>
				<div className="newscard_options">
					<CardVotes data={data} type="news2" />
					<Button
						onClick={goToNews}
						text={`${data.replies}`}
						Icon={BsChatSquare}
					/>
					<DropdownList buttonClass="newscard_options_item">
						<Button
							onClick={handleShare}
							text="Share"
							Icon={AiOutlineShareAlt}
						/>
						{saved ? (
							<Button onClick={handleSave} text="Unsave" Icon={AiFillSave} />
						) : (
							<Button onClick={handleSave} text="Save" Icon={AiOutlineSave} />
						)}
					</DropdownList>
				</div>
			</div>
		</div>
	)
}

export default NewsCard
