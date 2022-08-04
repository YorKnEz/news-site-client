/* eslint-disable eqeqeq */
import React, { useContext, useEffect, useState } from "react"
import {
	AiFillSave,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineSave,
	AiOutlineShareAlt,
} from "react-icons/ai"
import { BsReply } from "react-icons/bs"
import { Link } from "react-router-dom"

import { useApolloClient, useMutation } from "@apollo/client"
import { formatDistance, fromUnixTime } from "date-fns"

import "./CommentCard.scss"
import { CommentVotes } from "../components"
import { REMOVE_COMMENT, SAVE_ITEM } from "../utils/apollo-queries"
import { UserContext } from "../context"

function CommentCard({ data }) {
	const { user } = useContext(UserContext)
	const [saved, setSaved] = useState(false)

	const client = useApolloClient()
	const [save] = useMutation(SAVE_ITEM)
	const [removeComment] = useMutation(REMOVE_COMMENT)

	// set the save state
	useEffect(() => {
		if (data.saveState === "save") {
			setSaved(true)
		}
	}, [data])

	useEffect(() => {
		if (data) {
			// get the body
			const div = document.getElementById(`body${data.id}`)

			// inject the html
			if (div) div.innerHTML = data.body
		}
	}, [data])

	const showDate = () => {
		const createdAt = fromUnixTime(data.createdAt / 1000)
		const currentDate = fromUnixTime(Date.now() / 1000)
		const distance = formatDistance(createdAt, currentDate)

		return `Posted ${distance} ago`
	}

	const handleDelete = e => {
		e.preventDefault()

		client.clearStore()

		removeComment({
			variables: {
				id: parseInt(data.id),
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

	const handleShare = e => {}

	const handleSave = e => {
		e.preventDefault()

		save({
			variables: {
				action: saved ? "unsave" : "save",
				parentId: data.id,
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
				<span className="commentcard_posted">
					{showDate()} by{" "}
					<Link
						to={`/profile/${data.author.id}`}
						className="commentcard_authorlink"
					>
						{data.author.fullName}
					</Link>
				</span>
				{/* <Link to={`/news/${data.id}`} className="commentcard_link"> */}
				<div className="commentcard_body" id={`body${data.id}`}></div>
				{/* </Link> */}
				<div className="commentcard_options">
					<CommentVotes data={data} />
					<button onClick={handleShare} className="commentcard_options_item">
						<AiOutlineShareAlt className="commentcard_options_item_icon" />
						Share
					</button>
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
					{user.id == data.author.id && (
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
	)
}

export default CommentCard
