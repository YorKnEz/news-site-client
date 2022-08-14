/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import { AiFillSave, AiOutlineDelete, AiOutlineSave } from "react-icons/ai"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./CommentCard.scss"
import { CommentVotes } from "../components"
import { REMOVE_COMMENT, SAVE_ITEM } from "../utils/apollo-queries"
import { UserContext } from "../context"

function CommentCard({ data }) {
	const { news, comment } = data
	const { user } = useContext(UserContext)
	const [saved, setSaved] = useState(false)

	const client = useApolloClient()
	const [save] = useMutation(SAVE_ITEM)
	const [removeComment] = useMutation(REMOVE_COMMENT)

	// set the save state
	useEffect(() => {
		if (comment.saveState === "save") {
			setSaved(true)
		}
	}, [comment])

	useEffect(() => {
		if (comment) {
			// get the body
			const div = document.getElementById(`comm-body-${comment.id}`)

			// inject the html
			if (div) div.innerHTML = comment.body
		}
	}, [comment])

	const showDate = () => {
		const createdAt = fromUnixTime(comment.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	const handleDelete = e => {
		e.preventDefault()

		client.clearStore()

		removeComment({
			variables: {
				id: parseInt(comment.id),
			},
			onCompleted: ({ removeComment }) => {
				if (!removeComment.success) {
					console.log(removeComment.message)

					return
				}

				client.clearStore()
			},
			onError: error => console.log({ ...error }),
		})
	}

	const handleSave = e => {
		e.preventDefault()

		save({
			variables: {
				action: saved ? "unsave" : "save",
				parentId: comment.id,
				parentType: "comment",
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
		<div className="commentcard">
			<div className="commentcard_container">
				<div className="commentcard_news">
					<span className="commentcard_posted">
						<Link
							to={`/profile/${comment.author.id}/overview`}
							className="commentcard_link commentcard_link_light"
						>
							{comment.author.fullName}
						</Link>{" "}
						comment on{" "}
						<Link
							to={`/news/${news.link}-${news.id}`}
							className="commentcard_link commentcard_link_light"
						>
							{news.title}
						</Link>{" "}
						· {showDate()} by{" "}
						<Link
							to={`/profile/${news.author.id}/overview`}
							className="commentcard_link"
						>
							{news.author.fullName}
						</Link>
					</span>
				</div>
				<hr className="commentcard_separator" />
				<div className="commentcard_comment">
					<span className="commentcard_posted">
						{showDate()} by{" "}
						<Link
							to={`/profile/${comment.author.id}/overview`}
							className="commentcard_link"
						>
							{comment.author.fullName}
						</Link>
					</span>
					{/* <Link to={`/news/${comment.id}`} className="commentcard_link"> */}
					<div
						className="commentcard_body"
						id={`comm-body-${comment.id}`}
					></div>
					{/* </Link> */}
					<div className="commentcard_options">
						<CommentVotes data={comment} />
						<button onClick={handleSave} className="commentcard_options_item">
							{saved ? (
								<>
									<AiFillSave className="commentcard_options_item_icon" />
									Unsave
								</>
							) : (
								<>
									<AiOutlineSave className="commentcard_options_item_icon" />
									Save
								</>
							)}
						</button>
						{user.id == comment.author.id && (
							<>
								<button
									onClick={handleDelete}
									className="commentcard_options_item"
								>
									<AiOutlineDelete className="commentcard_options_item_icon" />
									Delete
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CommentCard
